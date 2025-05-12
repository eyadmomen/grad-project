import { cartModel } from "../../../connections/models/cart.model.js";
import { courseModel } from "../../../connections/models/course.model.js";
import { scheduleModel } from "../../../connections/models/schedule.model.js";

// ======================= GET Cart ==================
export const getCart = async (req, res, next) => {
  try {
    const { _id } = req.authuser;

    const cart = await cartModel.findOne({ userId: _id })
      .populate('courses.courseId')
      .populate('courses.scheduleId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart fetched successfully', cart });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// ======================= Add to Cart ==================
export const addToCart = async (req, res, next) => {
  try {
    const { _id } = req.authuser;
    const userId = _id;
    const { courseId, scheduleId } = req.body;

    if (!courseId || !scheduleId) {
      return res.status(400).json({ message: "courseId and scheduleId are required" });
    }

    const courseCheck = await courseModel.findById(courseId);
    if (!courseCheck) {
      return next(new Error("Invalid course ID", { cause: 400 }));
    }

    const scheduleCheck = await scheduleModel.findById(scheduleId);
    if (!scheduleCheck) {
      return next(new Error("Invalid schedule ID", { cause: 400 }));
    }

    let userCart = await cartModel.findOne({ userId });

    if (userCart) {
      const courseExists = userCart.courses.some(
        (item) => item.courseId.toString() === courseId
      );

      if (courseExists) {
        return res.status(400).json({ message: "Course already in cart" });
      }

      userCart.courses.push({ courseId, scheduleId });
      userCart.total += courseCheck.price;

      await userCart.save();

      return res.status(200).json({ message: "Course added to cart", cart: userCart });
    } else {
      const cartObject = {
        userId,
        courses: [{ courseId, scheduleId }],
        total: courseCheck.price,
      };

      const cartDB = await cartModel.create(cartObject);
      return res.status(201).json({ message: "Cart created", cart: cartDB });
    }
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

// ======================= Delete Course from Cart ==================
export const deleteCourseFromCart = async (req, res, next) => {
  try {
    const { _id } = req.authuser;
    const userId = _id;
    const { courseId } = req.body;

    const courseCheck = await courseModel.findById(courseId);
    if (!courseCheck) {
      return next(new Error("Invalid course ID", { cause: 400 }));
    }

    const userCart = await cartModel.findOne({ userId, "courses.courseId": courseId });
    if (!userCart) {
      return next(new Error("Course not found in cart", { cause: 404 }));
    }

    const courseIndex = userCart.courses.findIndex(
      (item) => item.courseId.toString() === courseId
    );

    if (courseIndex === -1) {
      return next(new Error("Course not found in cart", { cause: 404 }));
    }

    userCart.courses.splice(courseIndex, 1);
    userCart.total -= courseCheck.price;

    await userCart.save();

    res.status(200).json({ message: "Course removed from cart", cart: userCart });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};

// ======================= Delete Schedule from Course in Cart ==================
export const deleteScheduleFromCart = async (req, res, next) => {
  try {
    const { _id } = req.authuser;
    const userId = _id;
    const { courseId } = req.body;

    const userCart = await cartModel.findOne({ userId });
    if (!userCart) {
      return next(new Error("Cart not found", { cause: 404 }));
    }

    const course = userCart.courses.find(
      (item) => item.courseId.toString() === courseId
    );

    if (!course) {
      return next(new Error("Course not found in cart", { cause: 404 }));
    }

    course.scheduleId = undefined; // or null

    await userCart.save();

    return res.status(200).json({ message: "Schedule removed from course in cart", cart: userCart });
  } catch (err) {
    console.error(err);
    return next(err);
  }
};
