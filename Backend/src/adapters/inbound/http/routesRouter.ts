import express from "express";
import {
  getAllRoutes,
  setBaselineRoute,
  compareRoutes,
} from "./routesController";

const router = express.Router();

router.get("/", getAllRoutes);
router.post("/:id/baseline", setBaselineRoute);
router.get("/comparison", compareRoutes);

export default router;
