
import React, { useState } from "react";
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import QueryInterface from './components/QueryInterface';
import ModelTraining from './components/ModelTraining';
import PredictionInterface from './components/PredictionInterface';
import './App.css'


function App(){
  const [sessionId, setSessionId] = useState(null);
  const [dataset, setDataset] = useState(null)
  const [activeTab, setActiveTab] = useState('upload')
  const [trainedModel, setTrainedModel] = useState(null)


  //reset application state 
  const resetApp = () => {
    setSessionId(null);
    setDataset(null);
    setTrainedModel(null);
    setActiveTab(null);

  };


  return (
    <div className = "min-h-screen bg-gray-50">
      {/* header */}
      <header className = "bg-white shadow-sm border-b">
        <div className = "max-w-7xl mx-auto px-4 py-6">
          <h1 className = "text-3xl font-bold text-gray-900">
            Predictive Data Insights Platform
          </h1>

          <p className = "text-gray-600 mt-2">
            Upload data, explore insights
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}

      {sessionId && (
        <nav className = "bg-white border-b">
          <div className = "max-w 7xl mx-auto px-4">
            <div className = "flex space-x-8">
              {['dashboard', 'query', 'train', 'predict'].map((tab) => (
                <button
                  key = {tab}
                  onClick = {() => setActiveTab(tab)}
                  className = {`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'}
                    `}
                >
                  {tab}
                </button>
              ))}

              <button 
                onClick = {resetApp}
                className = "py-4 px-2 text-red-500 hover: text-red-700 text-sm"
              >
                Upload New File
                </button>                
            </div>
          </div>
        </nav>
      )}


      {/* Main Content */}

      <main className = "max-w-7xl mx-auto px-4 py-8">
        {/* FILE WILL BE SHOWN IF THERE IS NO SESSION */}

        {!sessionId && (
          <FileUpload onUploadSuccess = {(data) => {
            setSessionId(data.sessionId);
            setDataset(data);
            setActiveTab('dashboard');
          }} />  
        )}

        {/* MAIN INTERFACE */}
        {sessionId && (
          <div>
            {activeTab === 'dashboard' && <Dashboard dataset = {dataset} /> }
            {activeTab === 'query' && <QueryInterface sessionId = {sessionId} />}
            {activeTab === 'train' && (
              <ModelTraining 
                sessionId = {sessionId}
                dataset = {dataset}
                onModelTrained = {(modelInfo) => setTrainedModel(modelInfo)}
              />
            )}
            {activeTab === 'predict' && (
              <PredictionInterface 
                sessionId = {sessionId}
                trainedModel = {trainedModel}
                dataset = {dataset}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App;


