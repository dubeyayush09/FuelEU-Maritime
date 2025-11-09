import React, { useState } from "react";
import api from "../../infrastructure/apiClient";

interface CBRecord {
  shipId: string;
  year: number;
  cbGco2eq: number;
}

const BankingTab: React.FC = () => {
  const [shipId, setShipId] = useState("R001");
  const [year, setYear] = useState(2024);
  const [cb, setCb] = useState<CBRecord | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const fetchCB = async () => {
    try {
      const res = await api.get(`/compliance/cb?shipId=${shipId}&year=${year}`);
      setCb(res.data.data);
      setMessage("Fetched current CB successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch CB");
    }
  };

  const bankSurplus = async () => {
    try {
      const res = await api.post("/compliance/banking/bank", {
        shipId,
        year,
        amount: parseFloat(amount),
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Failed to bank surplus");
    }
  };

  const applyBanked = async () => {
    try {
      const res = await api.post("/compliance/banking/apply", {
        shipId,
        year,
        amount: parseFloat(amount),
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      setMessage("Failed to apply banked balance");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Compliance Banking</h2>

      <div className="flex gap-3 mb-4">
        <input
          className="border rounded p-2 w-32"
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
          placeholder="Ship ID"
        />
        <input
          className="border rounded p-2 w-24"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          placeholder="Year"
        />
        <button
          onClick={fetchCB}
          className="bg-blue-600 text-white px-3 py-2 rounded"
        >
          Fetch CB
        </button>
      </div>

      {cb && (
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <p>
            <strong>Ship ID:</strong> {cb.shipId}
          </p>
          <p>
            <strong>Year:</strong> {cb.year}
          </p>
          <p>
            <strong>Compliance Balance (CB):</strong> {cb.cbGco2eq.toFixed(2)}{" "}
            gCO₂e
          </p>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <input
          className="border rounded p-2 w-32"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <button
          onClick={bankSurplus}
          className="bg-green-600 text-white px-3 py-2 rounded"
        >
          Bank Surplus
        </button>
        <button
          onClick={applyBanked}
          className="bg-yellow-500 text-white px-3 py-2 rounded"
        >
          Apply Banked
        </button>
      </div>

      {message && (
        <p className="text-sm text-gray-700 bg-gray-100 border p-2 rounded">
          {message}
        </p>
      )}
    </div>
  );
};

export default BankingTab;
