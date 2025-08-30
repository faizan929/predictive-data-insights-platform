import React, { useState } from "react";

const ModelTraining = ({ sessionId, dataset, onModelTrained }) => {
  const [selectedTarget, setSelectedTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Get available columns for target selection
  const columns = dataset?.summary?.summary?.columns || [];

  // Filter out non-target suitable columns (e.g., ID columns)
  const targetCandidates = columns.filter(
    (col) =>
      !col.name.toLowerCase().includes("id") &&
      !col.name.toLowerCase().includes("session")
  );

  // Train the model
  const handleTrain = async () => {
    if (!selectedTarget) {
      setError("Please select a target column");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call your backend training endpoint
      const response = await fetch(
        `http://localhost:8000/prediction/train/${sessionId}/${selectedTarget}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Training failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data);

      // Notify parent component that model is trained
      onModelTrained({
        target: selectedTarget,
        type: data.task,
        metrics: data.metrics,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Training Setup */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Train ML Model
        </h2>

        {/* Target Column Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Target Column (what you want to predict):
          </label>
          <select
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose target column...</option>
            {targetCandidates.map((col) => (
              <option key={col.name} value={col.name}>
                {col.name} ({col.dtype}) - {col.nulls} nulls
              </option>
            ))}
          </select>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • The system will automatically detect if this is classification
              or regression
            </li>
            <li>• Only numeric columns will be used as features</li>
            <li>• A Random Forest model will be trained on 80% of your data</li>
            <li>• Performance will be tested on the remaining 20%</li>
          </ul>
        </div>

        {/* Train Button */}
        <button
          onClick={handleTrain}
          disabled={!selectedTarget || loading}
          className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium
                   hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Training Model..." : "Train Model"}
        </button>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Training Results */}
      {results && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🎉 Model Training Complete!
          </h3>

          {/* Model Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900">Task Type</h4>
              <p className="text-lg font-bold text-green-700 capitalize">
                {results.task}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900">Target Column</h4>
              <p className="text-lg font-bold text-blue-700">
                {selectedTarget}
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Performance Metrics
            </h4>
            <div className="bg-gray-50 p-4 rounded-md">
              {Object.entries(results.metrics).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
                >
                  <span className="font-medium text-gray-700 capitalize">
                    {key.replace("_", " ")}
                  </span>
                  <span className="text-gray-900">
                    {typeof value === "number" ? value.toFixed(4) : value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sample Predictions */}
          {results.predictions && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Sample Predictions (Test Set)
              </h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600 mb-2">
                  First 10 predictions from test data:
                </p>
                <div className="flex flex-wrap gap-2">
                  {results.predictions.slice(0, 10).map((pred, idx) => (
                    <span
                      key={idx}
                      className="bg-white px-2 py-1 rounded text-sm border"
                    >
                      {typeof pred === "number" ? pred.toFixed(2) : pred}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelTraining;
