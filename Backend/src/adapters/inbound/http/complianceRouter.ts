import express from "express";
import { computeComplianceBalance } from "./complianceController";
import {
  bankSurplus,
  applyBanked,
  getBankingRecords,
} from "./bankingController";

const router = express.Router();

router.get("/cb", computeComplianceBalance);
router.post("/banking/bank", bankSurplus);
router.post("/banking/apply", applyBanked);
router.get("/banking/records", getBankingRecords);

export default router;
