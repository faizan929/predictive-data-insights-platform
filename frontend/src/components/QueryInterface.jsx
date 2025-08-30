import React, { useState } from "react";

const QueryInterface = ({ sessionId }) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  ///QUERY TO BACKEND
  const handleQuery = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);

    try {
      /// BACKEND ENDPOINT
      const res = await fetch(`http://localhost:8000/query/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!res.ok) {
        throw new Error(`Query Failed: ${res.status}`);
      }

      const data = await res.json();

      ///ADDING NEW RESULT TO HISTORY
      setResults((prev) => [
        {
          id: Date.now(),
          question: data.question,
          result: data.result,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);

      //// CLEAR INPUT
      setQuestion("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  ////RENDER THE RESULTS
  const renderResult = (result) => {
    if (typeof result === "string") {
      return <p className="text-gray-800">{result}</p>;
    }

    if (Array.isArray(result)) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(result[0] || {}).map((key) => (
                  <th key={key} className="px-3 py-2 text-left font-medium">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {result.slice(0, 10).map((row, index) => (
                <tr key={index} className="border-t">
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="px-3 py-2">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return (
      <pre className="text-gray-800 whitespace-pre-wrap">
        {JSON.stringify(result, null, 2)}
      </pre>
    );
  };

  return (
    <div className="space-y-6">
      {/* QUERY INPUT */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ask Questions About Your Data
        </h2>

        {/* EXAMPLE QUESTIONS  */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "What is the average age?",
              "How many rows are there?",
              "What is the maximum salary?",
              "Count unique values in category column",
            ].map((example) => (
              <button
                key={example}
                onClick={() => setQuestion(example)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* QUERY INPUT   */}
        <div className="flex gap-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your data"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => e.key === "Enter" && handleQuery()}
          />
          <button
            onClick={handleQuery}
            disabled={!question.trim() || loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover: bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Processing" : "Ask"}
          </button>
        </div>

        {/* ERROR DISPLAY  */}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* DISPLAYING THE RESULT */}

      <div className="space-y-4">
        {results.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
            {/*QUESTION */}
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">
                  ? {item.question}{" "}
                </h3>
                <span className="text-xs text-gray-500">{item.timestamp}</span>
              </div>
            </div>

            {/* ANSWER */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                📊 Result:
              </h4>
              {item.result.error ? (
                <p className="text-red-600 text-sm">{item.result.error}</p>
              ) : (
                renderResult(item.result)
              )}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {results.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">
              No queries yet. Ask a question above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueryInterface;
