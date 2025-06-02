import { Router } from "express";
const router = Router();
import * as Schedule from "./schedule.controller.js";
import { isAuth } from "../../middelwares/auth.js";

router.post("/",isAuth(),checkAdmin(),  Schedule.addSchedule);
router.get("/",isAuth(),checkAdmin(), Schedule.getschedules);

export default router;
