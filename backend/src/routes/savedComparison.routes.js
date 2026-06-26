import {Router} from "express";
import {SavedComparison} from "../models/savedComparison.model.js";
import {
    saveComparison,
    getSavedComparisons,
    deleteSavedComparison
} from "../controllers/savedComparison.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(saveComparison)
    .get(getSavedComparisons);

router.route("/:comparisonId")
    .delete(deleteSavedComparison);

export default router;