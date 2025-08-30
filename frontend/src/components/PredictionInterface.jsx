import React, { useState } from "react";

const PredictionInterface = ({ sessionId, trainedModel, dataset }) => {
  const [inputData, setInputData] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get numeric columns from dataset for input form
  const numericColumns =
    dataset?.summary?.summary?.columns?.filter(
      (col) => col.dtype.includes("int") || col.dtype.includes("float")
    ) || [];

  // Handle input changes
  const handleInputChange = (columnName, value) => {
    setInputData((prev) => ({
      ...prev,
      [columnName]: parseFloat(value) || 0,
    }));
  };

  // Make prediction
  const handlePredict = async () => {
    if (Object.keys(inputData).length === 0) {
      setError("Please enter some values");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Call your backend prediction endpoint
      const response = await fetch(
        `http://localhost:8000/prediction/predict/${sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(inputData),
        }
      );

      if (!response.ok) {
        throw new Error(`Prediction failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setPrediction(data.predictions[0]); // Get first prediction
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fill form with sample data
  const fillSampleData = () => {
    const sampleData = {};
    numericColumns.forEach((col) => {
      // Generate random sample values based on column name
      if (col.name.toLowerCase().includes("age")) {
        sampleData[col.name] = Math.floor(Math.random() * 50) + 20;
      } else if (col.name.toLowerCase().includes("salary")) {
        sampleData[col.name] = Math.floor(Math.random() * 100000) + 30000;
      } else {
        sampleData[col.name] = Math.floor(Math.random() * 100);
      }
    });
    setInputData(sampleData);
  };

  // Show message if no model is trained
  if (!trainedModel) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No Model Trained
        </h2>
        <p className="text-gray-600 mb-6">
          You need to train a model first before making predictions.
        </p>
        <p className="text-sm text-gray-500">
          Go to the "Train" tab to train a machine learning model on your data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Model Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Make Predictions
        </h2>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Trained Model Info</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>
              <strong>Target:</strong> {trainedModel.target}
            </p>
            <p>
              <strong>Type:</strong> {trainedModel.type}
            </p>
            <p>
              <strong>Performance:</strong>{" "}
              {Object.entries(trainedModel.metrics)
                .map(
                  ([key, value]) =>
                    `${key}: ${
                      typeof value === "number" ? value.toFixed(3) : value
                    }`
                )
                .join(", ")}
            </p>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {numericColumns.map((col) => (
            <div key={col.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {col.name}
              </label>
              <input
                type="number"
                step="any"
                value={inputData[col.name] || ""}
                onChange={(e) => handleInputChange(col.name, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${col.name}...`}
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePredict}
            disabled={loading || Object.keys(inputData).length === 0}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium
                     hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Predicting..." : "Make Prediction"}
          </button>

          <button
            onClick={fillSampleData}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700"
          >
            Fill Sample Data
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Prediction Results */}
      {prediction !== null && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🔮 Prediction Result
          </h3>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-sm text-green-700 mb-2">
              Predicted {trainedModel.target}:
            </p>
            <p className="text-3xl font-bold text-green-800">
              {typeof prediction === "number"
                ? prediction.toFixed(2)
                : prediction}
            </p>
          </div>

          {/* Input Summary */}
          <div className="mt-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Based on these inputs:
            </h4>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {Object.entries(inputData).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionInterface;
