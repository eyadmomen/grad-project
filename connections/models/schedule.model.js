// schedule.model.js
import mongoose, { Schema } from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  schedule: { type: String, required: true }
});

export const scheduleModel = mongoose.model('Schedule', scheduleSchema); // ✅ الاسم هو "Schedule"
