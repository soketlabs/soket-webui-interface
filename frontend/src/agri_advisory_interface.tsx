import { AlertCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useState } from 'react';

const AgriAdvisoryInterface = () => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  
  const [settings, setSettings] = useState({
    crop: '',
    region: '',
    humidity: '',
    temperature: '',
    rainfall: '',
    soilType: '',
    language: 'English',
    growthStage: ''
  });

const handleInputChange = (field, value) => {

    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const generateAdvisory = async () => {
    setIsGenerating(true);
    setError('');
    setResponse('');
    setTimeout(() => {
    setResponse("🚜 Backend not connected yet. UI is running successfully.");
    setIsGenerating(false);
  }, 800);

  //   try {
  //     // Replace this URL with your actual backend endpoint
  //     const apiEndpoint = 'YOUR_API_ENDPOINT_HERE';
      
  //     const requestBody = {
  //       crop: settings.crop,
  //       region: settings.region,
  //       weather: {
  //         humidity: settings.humidity,
  //         temperature: settings.temperature,
  //         rainfall: settings.rainfall
  //       },
  //       soilType: settings.soilType,
  //       language: settings.language,
  //       growthStage: settings.growthStage
  //     };

  //     const res = await fetch(apiEndpoint, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(requestBody)
  //     });

  //     if (!res.ok) {
  //       throw new Error(`HTTP error! status: ${res.status}`);
  //     }

  //     const reader = res.body.getReader();
  //     const decoder = new TextDecoder();

  //     while (true) {
  //       const { value, done } = await reader.read();
  //       if (done) break;
        
  //       const chunk = decoder.decode(value);
  //       setResponse(prev => prev + chunk);
  //     }
  //   } catch (err) {
  //     setError(`Error: ${err.message}. Please check your API endpoint configuration.`);
  //   } finally {
  //     setIsGenerating(false);
  //   }
  
};

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              🌾
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Agricultural Advisory System</h1>
          </div>
          <p className="text-gray-600 ml-13">AI-powered farming recommendations based on your conditions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Input Parameters</h2>
              
              {/* Basic Settings */}
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop *
                  </label>
                  <input
                    type="text"
                    value={settings.crop}
                    onChange={(e) => handleInputChange('crop', e.target.value)}
                    placeholder="e.g., Cotton, Wheat, Rice"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Region *
                  </label>
                  <input
                    type="text"
                    value={settings.region}
                    onChange={(e) => handleInputChange('region', e.target.value)}
                    placeholder="e.g., Punjab, Maharashtra"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Advanced Settings Collapsible */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span>Advanced Settings</span>
                  {isAdvancedOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isAdvancedOpen && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Humidity (%)
                      </label>
                      <input
                        type="text"
                        value={settings.humidity}
                        onChange={(e) => handleInputChange('humidity', e.target.value)}
                        placeholder="e.g., 65"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Temperature (°C)
                      </label>
                      <input
                        type="text"
                        value={settings.temperature}
                        onChange={(e) => handleInputChange('temperature', e.target.value)}
                        placeholder="e.g., 28"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rainfall (mm)
                      </label>
                      <input
                        type="text"
                        value={settings.rainfall}
                        onChange={(e) => handleInputChange('rainfall', e.target.value)}
                        placeholder="e.g., 150"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Soil Type
                      </label>
                      <input
                        type="text"
                        value={settings.soilType}
                        onChange={(e) => handleInputChange('soilType', e.target.value)}
                        placeholder="e.g., Loamy, Clay, Sandy"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Growth Stage
                      </label>
                      <input
                        type="text"
                        value={settings.growthStage}
                        onChange={(e) => handleInputChange('growthStage', e.target.value)}
                        placeholder="e.g., Sowing, Flowering"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Punjabi</option>
                        <option>Marathi</option>
                        <option>Tamil</option>
                        <option>Telugu</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                onClick={generateAdvisory}
                disabled={isGenerating || !settings.crop || !settings.region}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Generating...
                  </>
                ) : (
                  <>
                    🌱 Generate Advisory
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Response */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 min-h-[600px]">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Advisory Response</h2>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-start gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              {!response && !isGenerating && !error && (
                <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                  <div className="text-6xl mb-4">🌾</div>
                  <p className="text-lg">Enter your parameters and click "Generate Advisory"</p>
                  <p className="text-sm mt-2">to receive AI-powered farming recommendations</p>
                </div>
              )}

              {(response || isGenerating) && (
                <div className="prose max-w-none">
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {response}
                    {isGenerating && (
                      <span className="inline-block w-2 h-5 bg-green-600 animate-pulse ml-1"></span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Info Note */}
            {!response && !isGenerating && !error && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Make sure to configure your backend API endpoint in the code. 
                  The system supports streaming responses for real-time advisory generation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriAdvisoryInterface;