import React, { useEffect, useState } from "react";
import api from "../../infrastructure/apiClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Comparison {
  routeId: string;
  baselineIntensity: number;
  comparisonIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

const CompareTab: React.FC = () => {
  const [data, setData] = useState<Comparison[]>([]);
  const [baseline, setBaseline] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchComparison = async () => {
    try {
        console.log("Fetching /routes/comparison...");
      const res = await api.get("/routes/comparison");
       console.log("Response:", res.data);
      setData(res.data.comparisons);
      setBaseline(res.data.baseline);
    } catch (err) {
      console.error("Error fetching comparison:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
  }, []);

  if (loading) return <p>Loading comparison data...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Baseline vs Comparison</h2>
      <p className="mb-2 text-gray-700">
        Baseline Route: <span className="font-bold">{baseline}</span>
      </p>

      <table className="w-full border mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th>Route ID</th>
            <th>Baseline Intensity</th>
            <th>Comparison Intensity</th>
            <th>% Difference</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.routeId} className="text-center border-b">
              <td>{d.routeId}</td>
              <td>{d.baselineIntensity.toFixed(2)}</td>
              <td>{d.comparisonIntensity.toFixed(2)}</td>
              <td
                className={
                  d.percentDiff > 0 ? "text-red-500" : "text-green-600"
                }
              >
                {d.percentDiff.toFixed(2)}%
              </td>
              <td>
                {d.compliant ? (
                  <span className="text-green-600 font-semibold">✅</span>
                ) : (
                  <span className="text-red-600 font-semibold">❌</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-semibold mb-3">GHG Intensity Comparison</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="routeId" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="baselineIntensity" fill="#2563eb" name="Baseline" />
          <Bar dataKey="comparisonIntensity" fill="#16a34a" name="Comparison" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompareTab;
