import React, { useState } from "react";
import RoutesTab from "./tabs/RoutesTab";
import CompareTab from "./tabs/CompareTab";
import BankingTab from "./tabs/BankingTab";
// import PoolingTab from "./tabs/PoolingTab";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("routes");

  const tabs = [
    { id: "routes", label: "Routes" },
    { id: "compare", label: "Compare" },
    { id: "banking", label: "Banking" },
    { id: "pooling", label: "Pooling" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ⚓ FuelEU Maritime Compliance Dashboard
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        {activeTab === "routes" && <RoutesTab />}
         {activeTab === "compare" && <CompareTab />}
        {activeTab === "banking" && <BankingTab />}
        {/* {activeTab === "pooling" && <PoolingTab />}  */}
      </div>
    </div>
  );
};

export default Dashboard;
