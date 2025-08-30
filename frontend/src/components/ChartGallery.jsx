import React from "react";

const ChartGallery = ({ charts }) => {
  if (!charts || charts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Chart Suggestions.
        </h2>
        <p className="text-gray-500">No Chart Suggestions Available.</p>
      </div>
    );
  }

  const ChartsByType = charts.reduce((acc, chart) => {
    if (!acc[chart.type]) acc[chart.type] = [];
    acc[chart.type].push(chart);
    return acc;
  }, {});

  ////CHART  TYPE ICONS AND COLORS
  const chartConfig = {
    histogram: {
      icon: "📊",
      color: "bg-blue-50 border-blue-200",
      title: "Distributions",
    },
    bar: {
      icon: "📈",
      color: "bg-green-50 border-green-200",
      title: "Comparisons",
    },
    scatter: {
      icon: "🔵",
      color: "bg-purple-50 border-purple-200",
      title: "Relationships",
    },
    box: {
      icon: "📦",
      color: "bg-orange-50 border-orange-200",
      title: "Distributions by Category",
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Suggested Charts
      </h2>

      {/* CHART CATEGORIES  */}
      {Object.entries(ChartsByType).map(([type, typeCharts]) => {
        <div key={type} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex-items-center">
            <span className="mr-2">{chartConfig[type]?.icon || "📊"}</span>
            {chartConfig[type]?.title ||
              type.charAt(0).toUpperCase() + type.slice(1)}
            <span className="ml-2 text-sm text-gray-500">
              ({typeCharts.length})
            </span>
          </h3>

          {/* CHART GRID  */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typeCharts.map((chart, index) => (
              <ChartCard key={index} chart={chart} config={chartConfig[type]} />
            ))}
          </div>
        </div>;
      })}
    </div>
  );
};

// INDIVIDUAL CHART SUGGESTIONS

const ChardCard = ({ chart, config }) => {
  return (
    <div
      className={`border-2 rounded-lg p-4 ${
        config?.color || "bg-gray-50 border-gray-200"
      } hover:shadow-md transition-shadow cursor-pointer`}
    >
      {/* CHART PREVIEW PLACEHOLDER */}
      <div className="bg-white h-32 rounded-md mb-3 flex items-center justify-center border">
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-1">{config?.icon || "📊"}</div>
          <div className="text-xs">Chart Preview</div>
        </div>
      </div>
      {/* CHART INFO */}
      <div>
        <h4 className="font-medium text-gray-900 mb-1">{chart.title}</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <p>
            <strong>Type:</strong> {chart.type}
          </p>
          {chart.x && (
            <p>
              <strong>X-axis:</strong> {chart.x}
            </p>
          )}
          {chart.y && (
            <p>
              <strong>Y-axis:</strong> {chart.y}
            </p>
          )}
        </div>
      </div>
      {/* GENERATE BUTTON  */}
      <button className="w-full mt-3 border border-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-50">
        Generate Chart
      </button>
      "
    </div>
  );
};

export default ChartGallery;
