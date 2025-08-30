import React from "react";
import ChartGallery from "./ChartGallery";

const Dashboard = ({ dataset }) => {
  //EXTRACTING DATA FROM THE DATASET PROP

  const summary = dataset?.summary?.summary;

  if (!summary) {
    return <div>Loading Dashboard</div>;
  }

  return (
    <div className="space-y-8">
      {/* DATASET OVERVIEW  */}

      <div className="bg-white rounder-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Dataset Overview{" "}
        </h2>

        {/* BASIC STATS  */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900">Rows</h3>
            <p className="text-2xl font-bold text-blue-700">
              {summary.shape.rows}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounder-lg">
            <h3 className="font-semibold text-green-900">Columns</h3>
            <p className="text-2xl font-green-700">{summary.shape.columns}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900">Data Points</h3>
            <p className="text-2xl font-bold text-purple-700">
              {(summary.shape.rows * summary.shape.columns).toLocalStorage()}
            </p>
          </div>
        </div>

        {/* COLUMN INFORMATION  */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Column Information</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Column
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Null Values
                  </th>
                </tr>
              </thead>

              <tbody>
                {summary.columns.map((col, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 font-medium">{col.name}</td>
                    <td className="px-4 py-2 text-gray-600">{col.dtype}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          col.nulls > 0
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {col.nulls}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SAMPLE DATA */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Sample Data (First 5 rows)
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {summary.columns.map((col) => (
                    <th
                      key={col.name}
                      className="px-3 py-2 text-left font-medium text-gray-700"
                    >
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {summary.sample.map((row, index) => (
                  <tr key={index} className="border-t">
                    {summary.columns.map((col) => (
                      <td key={col.name} className="px-3 py-2 text-gray-600">
                        {row[col.name]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CHART SUGGESTION */}
      <ChartGallery charts={dataset.charts} />
    </div>
  );
};

export default Dashboard;
