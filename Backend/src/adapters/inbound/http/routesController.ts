import { Request, Response } from "express";
import prisma from "../../../infra/db/client";

export const getAllRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await prisma.route.findMany();
    return res.status(200).json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    return res.status(500).json({ message: "Failed to fetch routes" });
  }
};

// 👇 New function
export const setBaselineRoute = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Ensure route exists
    const route = await prisma.route.findUnique({
      where: { id: Number(id) },
    });

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Unset all baselines first
    await prisma.route.updateMany({
      data: { isBaseline: false },
    });

    // Set new baseline
    await prisma.route.update({
      where: { id: Number(id) },
      data: { isBaseline: true },
    });

    return res
      .status(200)
      .json({ message: `Route ${route.routeId} set as baseline.` });
  } catch (error) {
    console.error("Error setting baseline:", error);
    return res.status(500).json({ message: "Failed to set baseline" });
  }
};
export const compareRoutes = async (req: Request, res: Response) => {
  try {
    const baseline = await prisma.route.findFirst({
      where: { isBaseline: true },
    });

    if (!baseline) {
      return res.status(404).json({ message: "No baseline route found" });
    }

    const otherRoutes = await prisma.route.findMany({
      where: { id: { not: baseline.id } },
    });

    const comparisons = otherRoutes.map((route) => {
      const percentDiff =
        (route.ghgIntensity / baseline.ghgIntensity - 1) * 100;
      const compliant = route.ghgIntensity <= baseline.ghgIntensity;
      return {
        routeId: route.routeId,
        baselineIntensity: baseline.ghgIntensity,
        comparisonIntensity: route.ghgIntensity,
        percentDiff: Number(percentDiff.toFixed(2)),
        compliant,
      };
    });

    return res.status(200).json({
      baseline: baseline.routeId,
      baselineIntensity: baseline.ghgIntensity,
      comparisons,
    });
  } catch (error) {
    console.error("Error comparing routes:", error);
    return res.status(500).json({ message: "Failed to compare routes" });
  }
};

