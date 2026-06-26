import {Router} from "express";
import { getAllCities, compareCities } from "../controllers/city.controller.js";

const router = Router();

router.route("/").get(getAllCities);
router.route("/compare").get(compareCities);

export default router;
