import React, { useEffect, useState } from "react";
import api from "../../infrastructure/apiClient";

interface RouteData {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
}

const RoutesTab: React.FC = () => {
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = async () => {
    try {
      const res = await api.get("/routes");
      setRoutes(res.data);
    } catch (err) {
      console.error("Error fetching routes:", err);
    } finally {
      setLoading(false);
    }
  };

  const setBaseline = async (id: number) => {
    await api.post(`/routes/${id}/baseline`);
    fetchRoutes();
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Routes</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Vessel Type</th>
            <th>Fuel Type</th>
            <th>Year</th>
            <th>GHG Intensity</th>
            <th>Fuel (t)</th>
            <th>Distance (km)</th>
            <th>Emissions (t)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r.id} className="text-center border-b">
              <td>{r.routeId}</td>
              <td>{r.vesselType}</td>
              <td>{r.fuelType}</td>
              <td>{r.year}</td>
              <td>{r.ghgIntensity.toFixed(2)}</td>
              <td>{r.fuelConsumption}</td>
              <td>{r.distance}</td>
              <td>{r.totalEmissions}</td>
              <td>
                <button
                  onClick={() => setBaseline(r.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Set Baseline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoutesTab;
