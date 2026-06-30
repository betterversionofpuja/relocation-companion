import { Router } from "express";

import {
    saveComparison,
    toggleSavedComparison,
    getSavedComparisons,
    deleteSavedComparison
} from "../controllers/savedComparison.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
    .post(saveComparison)
    .get(getSavedComparisons);

router.route("/toggle")
    .post(toggleSavedComparison);

router.route("/:comparisonId")
    .delete(deleteSavedComparison);

export default router;