
// import { userModel } from "../../../connections/models/user.model.js";

// const availableSlots = ['Sunday 3 pm', 'Tuesday 3 pm', 'Friday 3 pm'];


// //================= show schedule ================//

// export const showSchedule = async (req, res,next) => {
//   try {

//   const { _id } = req.authuser

//     const student = await userModel.findById(_id);

//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     if (student.schedule_time) {
//       return res.json({
//         message: 'You already selected a schedule',
//         schedule: student.schedule_time
//       });
//     }

//     return res.json({
//       message: 'Please select a schedule',
//       available: availableSlots
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Server error',error });
//     console.log(error);
    
//   }
// };

// //=================== add schdule ================//
// export const addSchedule = async (req, res) => {
//   try {
//     const { _id } = req.authuser

//     const { selectedSchedule } = req.body;

//     if (!availableSlots.includes(selectedSchedule)) {
//       return res.status(400).json({ message: 'Invalid schedule option' });
//     }

//     const student = await userModel.findById(_id);

//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }

//     if (student.schedule_time) {
//       return res.status(400).json({ message: 'Schedule already set' });
//     }

//     student.schedule_time = selectedSchedule;
//     await student.save();

//     return res.json({
//       message: 'Schedule saved successfully',
//       schedule: student.schedule_time
//     });
//   } catch (error) {
//     return res.status(500).json({ message: 'Server error' });
//   }
// };


// import { scheduleModel } from "../../../connections/models/schedule.model.js";
// import { asyncHandler } from "../../utils/errorHandeling.js";




// =============== add schedule =================//


// export const addSchedule = asyncHandler (async(req,res,next)=>{
//     const { schedule} = req.body;

//     if (!schedule) {
//       res.status(400).json({message:"schedule is required "})
//     }
  
//     const crateschedule = await scheduleModel.create({
//       schedule
//     });
  
//     res.status(201).json({message:"added done ", crateschedule});
//   });


// =============== show courses =================//



// export const getschedules = asyncHandler(async (req, res) => {
//     const schdules = await scheduleModel.find({});
//     res.json(courses);
//   });


import { scheduleModel } from "../../../connections/models/schedule.model.js";
import { asyncHandler } from "../../utils/errorHandeling.js";

// =============== add schedule =================//

export const addSchedule = asyncHandler(async (req, res, next) => {
  const { schedule } = req.body;

  if (!schedule) {
    return res.status(400).json({ message: "Schedule is required" });
  }

  const newSchedule = await scheduleModel.create({ schedule });

  res.status(201).json({ message: "Schedule added successfully", newSchedule });
});




// =============== show schedules =================//

export const getschedules = asyncHandler(async (req, res) => {
    const schdules = await scheduleModel.find({});
    res.json(schdules);
  });
