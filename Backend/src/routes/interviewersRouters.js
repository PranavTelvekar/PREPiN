import { Router } from "express";
const router=Router();
import upload from "../middlewares/upload.js";
import { registerInterviewer ,profileBuild,createSlot,getReviews,getUpcomingInterviews,getCompletedInterview,getResult, submitResult, seeResult, getStudentProfile, getMyProfile, loginInterviewer} from "../controllers/interviewersControllers.js";

router.route("/login").post(loginInterviewer);
// router.route("/register").post(register);
// router.route("/add_to_activity").post(addToHistory);
// router.route("/get_all_activity").get(getUserHistory);


router.route("/:email/:id/profile").get(getStudentProfile)
router.route("/register").post(registerInterviewer)
//router.route("/:id/profile").post(profileBuild)
router.route("/:id/slot").post(createSlot)
router.route("/:email/reviews").get(getReviews)
router.route("/:email/upcoming").get(getUpcomingInterviews)
router.route("/:email/completed").get(getCompletedInterview)
router.route("/:iid/result").get(getResult);
router.route("/:email/:iid/submit-result").post(submitResult)
router.route("/:iid/see-result").get(seeResult)

router.route("/:email/profile").get(getMyProfile)
router.route("/:email/profile-edit").post(upload.fields([
    { name: 'photo', maxCount: 1 },
]),profileBuild)


export default router;