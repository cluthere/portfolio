import { Router} from "express";
import {registerUser, userLogin, userLogout, changePassword, deleteuser} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(userLogin);

// secured routes
router.route("/logout").post(verifyJWT, userLogout);

router.route("/changePassword").post(verifyJWT, changePassword);

router.route("/deleteuser").post(verifyJWT, deleteuser);

export default router;




