import { Router } from "express";
import { SurveyControllers } from "./controllers/SurveyControllers";
import { UserController } from "./controllers/UserControllers";
const router = Router();

const userController = new UserController();
const surveyController = new SurveyControllers();

router.post("/users", userController.create);
router.get("/users", userController.show);
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

export { router };
