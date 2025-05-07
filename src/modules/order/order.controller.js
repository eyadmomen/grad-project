

import { cartModel } from "../../../connections/models/cart.model.js";
import { orderModel } from "../../../connections/models/order.model.js";
import { courseModel } from "../../../connections/models/course.model.js";
import { scheduleModel } from "../../../connections/models/schedule.model.js"; 
import { paymentFunction } from "../../utils/payment.js";
import { userModel } from "../../../connections/models/user.model.js";
import { generateToken } from "../../utils/tokenFunction.js";
import { asyncHandler } from "../../utils/errorHandeling.js";
import { enrolledCoursesModel } from "../../../connections/models/enrolledcoureces.model.js";





// =============== convert cart to order =======================//



export const createOrderFromCart = async (req, res, next) => {
  try {
    const { _id } = req.authuser;
    const userId = _id;
    const { cartId, paymentMethod } = req.body;

    if (!cartId) {
      return res.status(400).json({ message: "Cart ID is required" });
    }

    const cart = await cartModel.findById(cartId);
    if (!cart || cart.courses.length === 0) {
      return res.status(400).json({ message: "Cart is empty or not found" });
    }

    if (!cart.schedule) {
      return res.status(400).json({ message: "No schedule found in cart" });
    }

    // تجهيز بيانات الكورسات
    const orderCourses = await Promise.all(
      cart.courses.map(async (item) => {
        const course = await courseModel.findById(item.courseId);
        if (!course) return null;

        return {
          productId: course._id,
          title: course.title,
          price: course.price,
        };
      })
    );

    const filteredCourses = orderCourses.filter(Boolean);
    if (filteredCourses.length === 0) {
      return res.status(400).json({ message: "No valid courses found in cart" });
    }

    // إنشاء الطلب
    const newOrder = await orderModel.create({
      userId: cart.userId,
      courses: filteredCourses,
      schedule: cart.schedule,
      total: cart.total,
      paymentMethod: paymentMethod || "cash",
    });
    //********************payment */
    const {email} = await userModel.findById(_id)
    let orederSession
    if(newOrder.paymentMethod=='card'){
      const token = generateToken({payload:{orderId:newOrder._id},signature:process.env.ORDER_TOKEN,expiresIn:'1h'})
      orederSession = await paymentFunction({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: email,
        metadata: { orderId: newOrder._id.toString() },
        success_url: `${req.protocol}://${req.headers.host}/order/successOrder?token=${token}`,
        cancel_url: `${req.protocol}://${req.headers.host}/order/cancelOrder?token=${token}`,
        line_items: newOrder.courses.map((ele) => ({
          price_data: {
            currency: 'EGP',
            product_data: {
              name: ele.title,
            },
            unit_amount: ele.price * 100,
          },
          quantity: ele.quantity || 1
        }))
      });
    }
    // جلب بيانات الجدول بعد إنشاء الأوردر
    const scheduleData = await scheduleModel.findById(cart.schedule);

    // حذف السلة
    // await cartModel.findByIdAndDelete(cartId);

    return res.status(201).json({
      message: "Order created",
      order: {
        ...newOrder.toObject(),
        scheduleName: scheduleData?.schedule || "Unknown",
      },
     checkOutUrl: orederSession.url
    });

  } catch (error) {
    console.error(error);
    return next(error);
  }
};
export const putInDataBase = asyncHandler(async(req,res,next)=>{
  const {_id}=req.authuser
  const {cartId}=req.body
  if (!cartId) {
    return res.status(400).json({ message: "Cart ID is required" });
  }

  const cart = await cartModel.findById(cartId);
  if (!cart || cart.courses.length === 0) {
    return res.status(400).json({ message: "Cart is empty or not found" });
  }

  if (!cart.schedule) {
    return res.status(400).json({ message: "No schedule found in cart" });
  }

  // تجهيز بيانات الكورسات
  const orderCourses = await Promise.all(
    cart.courses.map(async (item) => {
      const course = await courseModel.findById(item.courseId);
      if (!course) return null;

      return {
        productId: course._id,
      };
    }));
    const filteredCourses = orderCourses.filter(Boolean);
    if (filteredCourses.length === 0) {
      return res.status(400).json({ message: "No valid courses found in cart" });
    }

    const newOrder = await enrolledCoursesModel.create({
      userid: cart.userId,
      courses: filteredCourses,
      schedule: cart.schedule,
    });
})


























// فكك من دول يا اياد متمسحهمش كنت بجرب حاجة


// export const createOrderFromCart = async (req, res, next) => {
//   try {
//     const { _id } = req.authuser;
//     const userId = _id;
//     const { cartId, scheduleId, paymentMethod } = req.body;

//     if (!cartId || !scheduleId) {
//       return res.status(400).json({ message: "Cart ID and Schedule ID are required" });
//     }

//     const cart = await cartModel.findById(cartId);
//     if (!cart || cart.courses.length === 0) {
//       return res.status(400).json({ message: "Cart is empty or not found" });
//     }

//     // تحقق من وجود الجدول في قاعدة البيانات
//     const scheduleCheck = await scheduleModel.findById(scheduleId);
//     if (!scheduleCheck) {
//       return res.status(400).json({ message: "Invalid Schedule ID" });
//     }

//     // إعداد الكورسات
//     const orderCourses = await Promise.all(
//       cart.courses.map(async (item) => {
//         const course = await courseModel.findById(item.courseId);
//         if (!course) return null;

//         return {
//           productId: course._id,
//           title: course.title,
//           price: course.price,
//         };
//       })
//     );

//     const filteredCourses = orderCourses.filter(Boolean);

//     if (filteredCourses.length === 0) {
//       return res.status(400).json({ message: "No valid courses found in cart" });
//     }

//     // إنشاء الطلب
//     const newOrder = await orderModel.create({
//       userId: cart.userId,
//       courses: filteredCourses,
//       schedule: scheduleId,
//       total: cart.total,
//       paymentMethod: paymentMethod || "cash",
//     });

//     // حذف السلة
//     await cartModel.findByIdAndDelete(cartId);

//     return res.status(201).json({ message: "Order created", order: newOrder });

//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// };

// export const createOrderFromCart = async (req, res, next) => {
//   try {
//     const { _id } = req.authuser;
//     const userId = _id;
//     const { cartId, paymentMethod } = req.body;

//     if (!cartId) {
//       return res.status(400).json({ message: "Cart ID is required" });
//     }

//     // جلب السلة
//     const cart = await cartModel.findById(cartId);

//     if (!cart || cart.courses.length === 0) {
//       return res.status(400).json({ message: "Cart is empty or not found" });
//     }

//     // التحقق من وجود جدول داخل السلة
//     if (!cart.schedule) {
//       return res.status(400).json({ message: "No schedule found in cart" });
//     }

//     // تجهيز بيانات الكورسات
//     const orderCourses = await Promise.all(
//       cart.courses.map(async (item) => {
//         const course = await courseModel.findById(item.courseId);
//         if (!course) return null;

//         return {
//           productId: course._id,
//           title: course.title,
//           price: course.price,
//         };
//       })
//     );

//     const filteredCourses = orderCourses.filter(Boolean);
//     if (filteredCourses.length === 0) {
//       return res.status(400).json({ message: "No valid courses found in cart" });
//     }

//     // إنشاء الطلب باستخدام الجدول الموجود في cart
//     const newOrder = await orderModel.create({
//       userId: cart.userId,
//       courses: filteredCourses,
//       schedule: cart.schedule,
//       total: cart.total,
//       paymentMethod: paymentMethod || "cash",
//     });

//     // حذف السلة بعد التحويل
//     await cartModel.findByIdAndDelete(cartId);

//     return res.status(201).json({ message: "Order created", order: newOrder });

//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// };




// // =============== convert cart to order =======================//
// export const createOrderFromCart = async (req, res, next) => {
//   try {
//     const { _id } = req.authuser;
//     const userId = _id;
//     const { cartId, paymentMethod } = req.body;

//     if (!cartId) {
//       return res.status(400).json({ message: "Cart ID is required" });
//     }

//     const cart = await cartModel.findById(cartId);

//     if (!cart || cart.courses.length === 0 ) {
//       return res.status(400).json({ message: "Cart is empty or not found" });
//     }

//     // Prepare course details
//     const orderCourses = await Promise.all(
//       cart.courses.map(async (item) => {
//         const course = await courseModel.findById(item.courseId);
//         if (!course) return null;

//         return {
//           productId: course._id,
//           title: course.title,
//           price: course.price,
//         };
//       })
//     );

//     // Remove any null values (in case a course was not found)
//     const filteredCourses = orderCourses.filter(Boolean);

//     if (filteredCourses.length === 0) {
//       return res.status(400).json({ message: "No valid courses found in cart" });
//     }

//     const newOrder = await orderModel.create({
//       userId: cart.userId,
//       courses: filteredCourses,
//       total: cart.total,
//       paymentMethod: paymentMethod || "cash", // default value
//     });

//     // Optionally delete the cart
//     await cartModel.findByIdAndDelete(cartId);

//     return res.status(201).json({ message: "Order created", order: newOrder });

//   } catch (error) {
//     console.error(error);
//     return next(error);
//   }
// };