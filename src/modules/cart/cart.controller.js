import { cartModel } from "../../../connections/models/cart.model.js";
import { courseModel } from "../../../connections/models/course.model.js";
import { scheduleModel } from "../../../connections/models/schedule.model.js";

// cart.controller.js
export const getCart = async (req, res, next) => {
  try {
    const { _id } = req.authuser;

    const cart = await cartModel.findOne({ userId: _id })
      .populate('courses.courseId')
      .populate('schedule');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart fetched successfully', cart });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// ======================= Add to cart ==================

export const addToCart = async (req, res, next) => {
  try {
    const { _id } = req.authuser;
    const userId = _id;
    const { courseId, scheduleId } = req.body;

    console.log("Auth User:", req.authuser);
    console.log("Request Body:", req.body);
    // ===== التحقق من المدخلات =====
    if (!courseId || !scheduleId) {
      return res
        .status(400)
        .json({ message: "courseId and scheduleId are required" });
    }

    // ===== التحقق من وجود الكورس =====
    const courseCheck = await courseModel.findById(courseId);
    if (!courseCheck) {
      return next(new Error("Invalid course ID", { cause: 400 }));
    }

    // ===== التحقق من وجود الجدول =====
    const scheduleCheck = await scheduleModel.findById(scheduleId);
    if (!scheduleCheck) {
      return next(new Error("Invalid schedule ID", { cause: 400 }));
    }

    // ===== التحقق من وجود السلة =====
    let userCart = await cartModel.findOne({ userId });

    if (userCart) {
      // === التحقق من أن الكورس غير مكرر في السلة ===
      const courseExists = userCart.courses.some(
        (item) => item.courseId.toString() === courseId
      );

      if (courseExists) {
        return res.status(400).json({ message: "Course already in cart" });
      }

      // === تحديث السلة ===
      userCart.courses.push({ courseId });
      userCart.total += courseCheck.price;
      userCart.schedule = scheduleId;

      await userCart.save();

      return res
        .status(200)
        .json({ message: "Course added to cart", cart: userCart });
    } else {
      // ===== إنشاء سلة جديدة =====
      const cartObject = {
        userId,
        courses: [{ courseId }],
        total: courseCheck.price,
        schedule: scheduleId,
      };

      const cartDB = await cartModel.create(cartObject);
      return res.status(201).json({ message: "Cart created", cart: cartDB });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

// // ======================= delete scehule from cart ==================
export const deleteCourseFromCart = async (req, res, next) => {
  const { _id } = req.authuser;
  const userId = _id;

  const { courseId } = req.body;

  //   // ================== course check ==============
  const courseCheck = await courseModel.findOne({
    _id: courseId,
  });
  if (!courseCheck) {
    return next(new Error("inavlid course id", { cause: 400 }));
  }

  const userCart = await cartModel.findOne({
    userId,
    "courses.courseId": courseId,
  });
  if (!userCart) {
    return next(new Error("no course id in cart "));
  }
  userCart.courses.forEach((ele) => {
    if (ele.courseId == courseId) {
      userCart.courses.splice(userCart.courses.indexOf(ele), 1);
    }
  });
  await userCart.save();
  res.status(200).json({ message: "Done", userCart });
};

// ======================= Delete schedule from cart ==================

export const deleteScheduleFromCart = async (req, res, next) => {
  try {
    const { _id } = req.authuser;
    const userId = _id;
    const { scheduleId } = req.body;

    // ==== التحقق من أن الـ scheduleId موجود في قاعدة البيانات ====
    const scheduleCheck = await scheduleModel.findById(scheduleId);
    if (!scheduleCheck) {
      return next(new Error("Invalid schedule ID", { cause: 400 }));
    }

    // ==== البحث عن السلة الخاصة بالمستخدم ====
    const userCart = await cartModel.findOne({ userId });

    if (!userCart || !userCart.schedule) {
      return next(new Error("No schedule found in cart", { cause: 404 }));
    }

    // ==== التأكد من أن الـ schedule في السلة يطابق الـ schedule المطلوب حذفه ====
    if (userCart.schedule.toString() !== scheduleId) {
      return next(
        new Error("Schedule ID does not match the one in cart", { cause: 400 })
      );
    }

    // ==== إزالة الـ schedule ====
    userCart.schedule = undefined; // أو null إذا كنت تفضل ذلك

    await userCart.save();

    return res
      .status(200)
      .json({ message: "Schedule removed from cart", cart: userCart });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
