import { Router } from "express";
const router=Router();
import {register,getHomePage,getInterviewer,giveRiview,deleteReview,getSlots,bookSlot,getMyInterviews, getResult, editProfile, getStudentProfile,login} from "../controllers/studentControllers.js";
import upload from "../middlewares/upload.js";



router.route("/login").post(login);
router.route("/register").post(register);
// router.route("/add_to_activity").post(addToHistory);
// router.route("/get_all_activity").get(getUserHistory);

router.route("/:email/home/:department").get(getHomePage);
router.route("/:email/home/:department/:id/explore").get(getInterviewer)
router.route("/:email/:id/review").post(giveRiview);
router.route("/:email/:id/:rid/review").delete(deleteReview);
router.route("/:id/slots").get(getSlots);
router.route("/:email/:id/:sid/book").post(bookSlot);
router.route("/:email/myinterview").get(getMyInterviews);
router.route("/:email/:iid/see-result").get(getResult)
router.route("/:email/profile-edit").post(upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), editProfile);
router.route("/:email/profile").get(getStudentProfile)

export default router;
