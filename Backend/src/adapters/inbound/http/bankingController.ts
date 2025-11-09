import { Request, Response } from "express";
import prisma from "../../../infra/db/client";

export const bankSurplus = async (req: Request, res: Response) => {
  try {
    const { shipId, year, amount } = req.body;

    if (!shipId || !year || !amount) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    // Create bank record
    const record = await prisma.bankEntry.create({
      data: {
        shipId,
        year: Number(year),
        amountGco2eq: Number(amount),
      },
    });

    res.status(201).json({ message: "Surplus banked successfully", record });
  } catch (error) {
    console.error("Error banking surplus:", error);
    res.status(500).json({ message: "Failed to bank surplus" });
  }
};

export const applyBanked = async (req: Request, res: Response) => {
  try {
    const { shipId, year, amount } = req.body;

    const banked = await prisma.bankEntry.findMany({
      where: { shipId: String(shipId) },
    });

    const totalBanked = banked.reduce((sum, b) => sum + b.amountGco2eq, 0);

    if (Number(amount) > totalBanked) {
      return res.status(400).json({ message: "Insufficient banked balance" });
    }

    // Deduct from bank
    await prisma.bankEntry.create({
      data: {
        shipId: String(shipId),
        year: Number(year),
        amountGco2eq: -Math.abs(Number(amount)),
      },
    });

    res.status(200).json({
      message: "Banked balance applied successfully",
      applied: Number(amount),
      remaining: totalBanked - Number(amount),
    });
  } catch (error) {
    console.error("Error applying banked balance:", error);
    res.status(500).json({ message: "Failed to apply banked balance" });
  }
};

export const getBankingRecords = async (req: Request, res: Response) => {
  try {
    const { shipId, year } = req.query;

    const records = await prisma.bankEntry.findMany({
      where: {
        ...(shipId ? { shipId: String(shipId) } : {}),
        ...(year ? { year: Number(year) } : {}),
      },
    });

    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching banking records:", error);
    res.status(500).json({ message: "Failed to fetch records" });
  }
};
