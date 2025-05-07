import { Router } from "express";
const router = Router();
import * as Schedule from "./schedule.controller.js";
import { isAuth } from "../../middelwares/auth.js";

router.post("/",  Schedule.addSchedule);
router.get("/", Schedule.getschedules);

export default router;
