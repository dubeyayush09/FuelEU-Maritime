import { Request, Response } from "express";
import prisma from "../../../infra/db/client";

const TARGET_INTENSITY = 89.3368; // gCO₂e/MJ
const ENERGY_PER_TONNE = 41000; // MJ/t

export const computeComplianceBalance = async (req: Request, res: Response) => {
  try {
    const { shipId, year } = req.query;

    if (!shipId || !year) {
      return res.status(400).json({ message: "Missing shipId or year" });
    }

    // Find route data for this ship/year (using routeId as proxy for ship)
    const route = await prisma.route.findFirst({
      where: { routeId: String(shipId), year: Number(year) },
    });

    if (!route) {
      return res
        .status(404)
        .json({ message: "No route found for given ship/year" });
    }

    const energy = route.fuelConsumption * ENERGY_PER_TONNE;
    const cb = (TARGET_INTENSITY - route.ghgIntensity) * energy;

    // Save CB record
    const cbRecord = await prisma.shipCompliance.create({
      data: {
        shipId: route.routeId,
        year: route.year,
        cbGco2eq: cb,
      },
    });

    res.status(200).json({
      message: "Compliance Balance computed successfully",
      data: cbRecord,
    });
  } catch (error) {
    console.error("Error computing CB:", error);
    res.status(500).json({ message: "Failed to compute compliance balance" });
  }
};
