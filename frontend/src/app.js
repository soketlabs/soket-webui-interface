// // App.jsx
// import { useState } from 'react';
// import './app.css';

// function App() {
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [advisory, setAdvisory] = useState('');
//   const [advancedSettings, setAdvancedSettings] = useState({
//     crop: '',
//     region: '',
//     humidity: '',
//     temperature: '',
//     rainfall: '',
//     soilType: '',
//     language: '',
//     growthStage: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setAdvancedSettings(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const mockLLMAPI = async () => {
//     // Simulate API call delay
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     // Mock response based on input
//     const { crop, region, temperature, soilType, growthStage } = advancedSettings;
    
//     return `Based on your inputs:
// Crop: ${crop || 'Not specified'}
// Region: ${region || 'Not specified'}
// Weather Conditions: Temperature ${temperature || 'N/A'}°C
// Soil Type: ${soilType || 'Not specified'}
// Growth Stage: ${growthStage || 'Not specified'}

// **Advisory Recommendations:**
// 1. Monitor soil moisture regularly and irrigate when the top 2-3 inches become dry.
// 2. Apply balanced fertilizer with NPK ratio suitable for current growth stage.
// 3. Watch for common pests and diseases in your region.
// 4. Maintain optimal temperature range for ${crop || 'your crop'} growth.
// 5. Consider soil testing for precise nutrient recommendations.

// **Next Steps:**
// - Schedule irrigation based on weather forecast
// - Prepare for upcoming growth phase requirements
// - Document observations for future reference`;
//   };

//   const handleGenerateAdvisory = async () => {
//     setIsLoading(true);
//     setAdvisory('');
    
//     try {
//       // Simulate streaming response
//       const fullResponse = await mockLLMAPI();
      
//       // Simulate streaming effect
//       let displayedText = '';
//       const words = fullResponse.split(' ');
      
//       for (let i = 0; i < words.length; i++) {
//         displayedText += words[i] + ' ';
//         setAdvisory(displayedText);
//         await new Promise(resolve => setTimeout(resolve, 30));
//       }
//     } catch (error) {
//       setAdvisory('Error generating advisory. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="app">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div className="sidebar-section">
//           <h3>Select a model</h3>
//           <button className="default-btn">Set as default</button>
//         </div>

//         <div className="sidebar-section">
//           <h3>Models</h3>
//           <ul>
//             <li className="active">EKA-Defence</li>
//           </ul>
//         </div>

//         <div className="sidebar-section">
//           <h3>Folders</h3>
//           <ul>
//             <li>Chats</li>
//             <li>Yesterday</li>
//           </ul>
//         </div>

//         <div className="sidebar-section">
//           <h4>Yield Insight Summary</h4>
//           <p className="new-chat">New Chat</p>
//           <p className="agronomy-text">You are a helpful agronomy exp...</p>
//         </div>

//         <div className="sidebar-section">
//           <h4>Previous 7 days</h4>
//           <ul className="chat-history">
//             <li><span className="publisher">언론사</span> - 쿠키 서열해</li>
//             <li>You are a helpful agronomy exp...</li>
//             <li>Chatbot Summary Generator: R...</li>
//             <li className="code"><code>python "I want crop advisor...</code></li>
//             <li>i am a farmer i need to grow. m...</li>
//           </ul>
//         </div>

//         <div className="sidebar-section">
//           <h4>General Chat & Assistance</h4>
//           <ul>
//             <li>Invalid Crop Advice Request</li>
//             <li>Photosynthesis: Life's Engin...</li>
//           </ul>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         <header className="main-header">
//           <h1>Hello, SAYANTAN RAY</h1>
//           <p>How can I help you today?</p>
//         </header>

//         <div className="content-area">
//           {/* Advanced Settings Collapsible Section */}
//           <div className="settings-section">
//             <button 
//               className="settings-toggle"
//               onClick={() => setIsSettingsOpen(!isSettingsOpen)}
//             >
//               {isSettingsOpen ? '▼' : '▶'} Advanced Input Settings
//             </button>
            
//             {isSettingsOpen && (
//               <div className="settings-grid">
//                 <div className="setting-group">
//                   <label>Crop</label>
//                   <input
//                     type="text"
//                     name="crop"
//                     value={advancedSettings.crop}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Wheat, Rice, Corn"
//                   />
//                 </div>
                
//                 <div className="setting-group">
//                   <label>Region</label>
//                   <input
//                     type="text"
//                     name="region"
//                     value={advancedSettings.region}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Midwest, Punjab, Yangtze"
//                   />
//                 </div>
                
//                 <div className="setting-group">
//                   <label>Humidity (%)</label>
//                   <input
//                     type="number"
//                     name="humidity"
//                     value={advancedSettings.humidity}
//                     onChange={handleInputChange}
//                     placeholder="40"
//                   />
//                 </div>
                
//                 <div className="setting-group">
//                   <label>Temperature (°C)</label>
//                   <input
//                     type="number"
//                     name="temperature"
//                     value={advancedSettings.temperature}
//                     onChange={handleInputChange}
//                     placeholder="25"
//                   />
//                 </div>
                
//                 <div className="setting-group">
//                   <label>Rainfall (mm)</label>
//                   <input
//                     type="number"
//                     name="rainfall"
//                     value={advancedSettings.rainfall}
//                     onChange={handleInputChange}
//                     placeholder="50"
//                   />
//                 </div>
                
//                 <div className="setting-group">
//                   <label>Soil Type</label>
//                   <input
//                     type="text"
//                     name="soilType"
//                     value={advancedSettings.soilType}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Loamy, Clay, Sandy"
//                   />
//                 </div>
                
//                 <div className="setting-group">
//                   <label>Language</label>
//                   <select
//                     name="language"
//                     value={advancedSettings.language}
//                     onChange={handleInputChange}
//                   >
//                     <option value="English">English</option>
//                     <option value="Spanish">Spanish</option>
//                     <option value="French">French</option>
//                     <option value="Hindi">Hindi</option>
//                     <option value="Chinese">Chinese</option>
//                   </select>
//                 </div>
                
//                 <div className="setting-group">
//                   <label>Growth Stage</label>
//                   <input
//                     type="text"
//                     name="growthStage"
//                     value={advancedSettings.growthStage}
//                     onChange={handleInputChange}
//                     placeholder="e.g., Germination, Vegetative, Flowering"
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Generate Advisory Button */}
//           <div className="generate-section">
//             <button 
//               className="generate-btn"
//               onClick={handleGenerateAdvisory}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="spinner"></span>
//                   Generating...
//                 </>
//               ) : (
//                 'Generate Advisory'
//               )}
//             </button>
//           </div>

//           {/* Advisory Response Display */}
//           {advisory && (
//             <div className="advisory-response">
//               <h3>Agronomy Advisory</h3>
//               <div className="response-content">
//                 <pre>{advisory}</pre>
//               </div>
//               <div className="response-meta">
//                 <span>Model: EKA-Defence</span>
//                 <span>Language: {advancedSettings.language}</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;