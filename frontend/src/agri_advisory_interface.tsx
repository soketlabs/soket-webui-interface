// clause code /////



// // <reference types="vite/client" />
// import { AlertCircle, Brain, Calendar, ChevronDown, ChevronRight, Cloud, Layers, Leaf, Loader2, MapPin, RefreshCw, Send, Settings, Sparkles, Sprout, Volume2, VolumeX, Zap } from 'lucide-react';
// import React, { useEffect, useRef, useState } from 'react';
// import ReactMarkdown from 'react-markdown';
// import companyLogo from './Soket-Logo.svg';

// // API Configuration
// const API_CONFIG = {
//   // Saarthi Agri-Model (In-house OpenWebUI)
//   saarthiApiKey: import.meta.env.VITE_SAARTHI_API_KEY || 'sk-9d09b7df9cbd5daebca67cbbb45e9f0c',
//   saarthiBaseUrl: import.meta.env.VITE_SAARTHI_BASE_URL || 'http://localhost:8000/v1/chat/completions',
//   saarthiModel: 'soketlabs/saarthi-agri-v1',
  
//   // ElevenLabs API
//   elevenlabsApiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_ca696bb73eac6ab599a26604e8b4f9946f2e49dc2d30361f',
//   elevenlabsVoiceId: 'pNInz6obpgDQGcFmaJgB', // Adam voice - you can change this
// };

// // Default thinking token markers
// const DEFAULT_THINKING_START = '<unused0>';
// const DEFAULT_THINKING_END = '<unused1>';

// // API providers - only Saarthi
// const apiProviders = [
//   { value: 'saarthi', label: 'Saarthi Agri-Model' },
// ];

// // API Provider type - only Saarthi
// type ApiProvider = 'saarthi';

// // Dropdown options for each field
// const DROPDOWN_OPTIONS = {
//   month: [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ],
//   growthStage: [
//     'फूल आना',
//     'बाल निकलना',
//     'पुष्पन',
//     'पकना',
//     'दूधिया अवस्था',
//     'कटाई तैयार'
//   ],
//   weather: [
//     'गरम और आर्द्र मौसम',
//     'ठंडी रात और हल्की नमी',
//     'सुबह ठंड और धूप',
//     'तेज धूप और गर्मी',
//     'बादल छाए रहना',
//     'ठंड और सूखा'
//   ],
//   soilType: [
//     'काली मिट्टी',
//     'दोमट मिट्टी',
//     'बलुई दोमट मिट्टी',
//     'लाल मिट्टी',
//     'कंकरीली मिट्टी',
//     'पथरीली मिट्टी'
//   ],
//   farmingPractice: [
//     'सामान्य खेती',
//     'जैविक खेती',
//     'समेकित कृषि',
//     'बारानी खेती',
//     'संरक्षण खेती'
//   ],
//   region: [
//     'महाराष्ट्र',
//     'उत्तर प्रदेश',
//     'मध्य प्रदेश',
//     'छत्तीसगढ़',
//     'हिमाचल प्रदेश'
//   ],
//   language: [
//     'Hindi',
//   ],
//   crop: [
//     'कपास',
//     'गेहूं',
//     'चना',
//     'धान (नर्सरी)',
//     'सोयाबीन'
//   ],
//   stress: [
//     'सफेद मक्खी',
//     'पीला रतुआ रोग',
//     'कीट संक्रमण',
//     'खैरा रोग',
//     'पीला मोज़ेक वायरस',
//     'पाउडरी मिल्ड्यू'
//   ]
// };

// const CollapsibleSection = ({ title, icon: Icon, isOpen, onToggle, children }: { title: string; icon: any; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) => (
//   <div className="border border-gray-700/50 rounded-lg overflow-hidden bg-gray-800/30 backdrop-blur-sm">
//     <button
//       onClick={onToggle}
//       className="w-full flex items-center justify-between p-3 hover:bg-gray-700/30 transition-colors"
//     >
//       <div className="flex items-center gap-2 text-gray-200">
//         <Icon size={18} className="text-emerald-400" />
//         <span className="font-medium text-sm">{title}</span>
//       </div>
//       {isOpen ? (
//         <ChevronDown size={18} className="text-gray-400" />
//       ) : (
//         <ChevronRight size={18} className="text-gray-400" />
//       )}
//     </button>
//     <div
//       className={`transition-all duration-300 ease-in-out overflow-hidden ${
//         isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
//       }`}
//     >
//       <div className="p-3 pt-0 space-y-3">{children}</div>
//     </div>
//   </div>
// );

// const DropdownField = ({ 
//   label, 
//   value, 
//   onChange, 
//   placeholder, 
//   icon: Icon, 
//   options 
// }: { 
//   label: string; 
//   value: string; 
//   onChange: (v: string) => void; 
//   placeholder: string; 
//   icon?: any; 
//   options: string[];
// }) => (
//   <div className="space-y-1.5">
//     <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
//       {Icon && <Icon size={12} />}
//       {label}
//     </label>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer"
//     >
//       <option value="" className="bg-gray-900 text-gray-500">
//         {placeholder}
//       </option>
//       {options.map((option, index) => (
//         <option key={index} value={option} className="bg-gray-900">
//           {option}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; icon?: any; type?: string }) => (
//   <div className="space-y-1.5">
//     <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
//       {Icon && <Icon size={12} />}
//       {label}
//     </label>
//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
//     />
//   </div>
// );

// const SelectField = ({ label, value, onChange, options, icon: Icon }: { label: string; value: string; onChange: (v: string) => void; options: any[]; icon?: any }) => (
//   <div className="space-y-1.5">
//     <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
//       {Icon && <Icon size={12} />}
//       {label}
//     </label>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer"
//     >
//       {options.map((opt) => (
//         <option key={opt.value ?? opt} value={opt.value ?? opt} className="bg-gray-900">
//           {opt.label ?? opt}
//         </option>
//       ))}
//     </select>
//   </div>
// );

// const AgriAdvisoryInterface = () => {
//   // Collapsible section states
//   const [sections, setSections] = useState({
//     basic: true,
//     weather: false,
//     soil: false,
//     advanced: false,
//     thinking: false,
//   });

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [response, setResponse] = useState('');
//   const [displayedResponse, setDisplayedResponse] = useState('');
//   const [thinkingContent, setThinkingContent] = useState('');
//   const [displayedThinking, setDisplayedThinking] = useState('');
//   const [isThinking, setIsThinking] = useState(false);
//   const [error, setError] = useState('');
//   const [apiProvider, setApiProvider] = useState<ApiProvider>('saarthi');
//   const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
//   const responseRef = useRef<HTMLDivElement>(null);
//   const thinkingRef = useRef<HTMLDivElement>(null);
//   const abortControllerRef = useRef<AbortController | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
//   // Refs for smooth streaming animation
//   const responseBufferRef = useRef('');
//   const thinkingBufferRef = useRef('');
//   const animationFrameRef = useRef<number | null>(null);

//   const [settings, setSettings] = useState({
//     month: '',
//     growthStage: '',
//     weather: '',  
//     soilType: '',
//     farmingPractice: '',
//     region: '',
//     language: '',
//     crop: '',
//     stress: '',
//     thinkingStartToken: DEFAULT_THINKING_START,
//     thinkingEndToken: DEFAULT_THINKING_END,
//   });

//   // Initialize audio context
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
//       // Cleanup on unmount
//       return () => {
//         if (audioContextRef.current) {
//           audioContextRef.current.close();
//         }
//       };
//     }
//   }, []);

//   // ElevenLabs TTS streaming function
//   const playElevenLabsAudio = async (text: string) => {
//     if (!audioContextRef.current) return;

//     try {
//       // Clean the text for speech
//       const cleanText = text
//         .replace(/#+\s*/g, '')
//         .replace(/\*\*/g, '')
//         .replace(/\*/g, '')
//         .replace(/`/g, '')
//         .replace(/\[.*?\]\(.*?\)/g, '')
//         .replace(/\n{3,}/g, '\n\n')
//         .trim();

//       if (!cleanText) return;

//       setIsPlayingAudio(true);

//       // Call ElevenLabs streaming API
//       const response = await fetch(
//         `https://api.elevenlabs.io/v1/text-to-speech/${API_CONFIG.elevenlabsVoiceId}/stream`,
//         {
//           method: 'POST',
//           headers: {
//             'Accept': 'audio/mpeg',
//             'Content-Type': 'application/json',
//             'xi-api-key': API_CONFIG.elevenlabsApiKey,
//           },
//           body: JSON.stringify({
//             text: cleanText,
//             model_id: 'eleven_multilingual_v2',
//             voice_settings: {
//               stability: 0.5,
//               similarity_boost: 0.75,
//               style: 0.0,
//               use_speaker_boost: true
//             }
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`ElevenLabs API error: ${response.status}`);
//       }

//       // Get the audio data
//       const arrayBuffer = await response.arrayBuffer();
      
//       // Decode and play the audio
//       const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
//       // Stop any currently playing audio
//       if (audioSourceRef.current) {
//         audioSourceRef.current.stop();
//       }

//       // Create and play new audio source
//       const source = audioContextRef.current.createBufferSource();
//       source.buffer = audioBuffer;
//       source.connect(audioContextRef.current.destination);
      
//       source.onended = () => {
//         setIsPlayingAudio(false);
//         audioSourceRef.current = null;
//       };
      
//       audioSourceRef.current = source;
//       source.start(0);

//     } catch (error) {
//       console.error('ElevenLabs TTS Error:', error);
//       setError('Failed to play audio. Please try again.');
//       setIsPlayingAudio(false);
//     }
//   };

//   // Stop audio playback
//   const stopAudioPlayback = () => {
//     if (audioSourceRef.current) {
//       audioSourceRef.current.stop();
//       audioSourceRef.current = null;
//     }
//     setIsPlayingAudio(false);
//   };

//   // Toggle audio playback
//   const toggleAudioPlayback = () => {
//     if (isPlayingAudio) {
//       stopAudioPlayback();
//     } else if (response) {
//       playElevenLabsAudio(response);
//     }
//   };

//   const toggleSection = (section: string) => {
//     setSections((prev) => ({ ...prev, [section]: !prev[section] }));
//   };

  // const handleInputChange = (field: string, value: string) => {
  //   setSettings((prev) => ({ ...prev, [field]: value }));
  // };

//   const SYSTEM_PROMPT = `You are a helpful District Agricultural Officer providing crop advisory to farmers based on location and various climatic conditions given as input.

// Output Order (Mandatory and Strict):
// 1. The very first output token must be exactly <unused0>
// 2. Immediately after <unused0>, produce a structured analytical reasoning section in English covering:
// - Crop suitability for the given Month and Region, considering the Crop type and Growth Stage
// - Climate assessment using Weather description
// - Soil behavior, soil moisture retention, and irrigation needs based on Soil Type 
// - Growth-stage-specific agronomic requirements and timing considerations
// - Risk analysis including Stress factors (pests/diseases) and weather-related stress
// - Impact of Farming Practice on productivity and risk mitigation
// - Integrated recommendation logic combining all above parameters coherently
// 3. After the reasoning is complete, output exactly <unused1>
// 4. Only after <unused1>, produce the final advisory response intended for the user.

// Output Restrictions:
// - Do not output anything before <unused0>.
// - Do not output anything between <unused0> and <unused1> except the analytical reasoning section.
// - Do not repeat <unused0> or <unused1>.
// - Do not include meta commentary or explanations about the protocol.
// - The final advisory must be written strictly in the language requested by the user.
// `;

//   // Build the prompt from settings
// const buildPrompt = () => {
//   const parts: string[] = [];

//   if (settings.month) parts.push(`Month: ${settings.month}`);
//   if (settings.growthStage) parts.push(`Growth Stage: ${settings.growthStage}`);
//   if (settings.weather) parts.push(`Weather: ${settings.weather}`);
//   if (settings.soilType) parts.push(`Soil Type: ${settings.soilType}`);
//   if (settings.farmingPractice) parts.push(`Farming Practice: ${settings.farmingPractice}`);
//   if (settings.region) parts.push(`Region: ${settings.region}`);
//   if (settings.language) parts.push(`Language: ${settings.language}`);
//   if (settings.crop) parts.push(`Crop: ${settings.crop}`);
//   if (settings.stress) parts.push(`Stress: ${settings.stress}`);

//   const userMessage = {
//     role: "user",
//     content: SYSTEM_PROMPT + "\n\n" + parts.join("\n"),
//   };

//   console.log("Final payload messages:", [userMessage]);

//   return [userMessage];
// };

//   // Parse streaming response with thinking token handling
//   const processStreamChunk = (
//     text: string, 
//     currentState: {
//       displayText: string;
//       thinking: string;
//       inThinkingMode: boolean;
//       thinkingBuffer: string;
//       fullResponse: string;
//     },
//     thinkingStartToken: string,
//     thinkingEndToken: string
//   ) => {
//     let { displayText, inThinkingMode, thinkingBuffer, fullResponse } = currentState;
//     let remaining = text;
    
//     fullResponse += text;

//     if (!fullResponse.includes(thinkingStartToken) && fullResponse.includes(thinkingEndToken)) {
//       remaining = thinkingStartToken + remaining;
//       fullResponse = thinkingStartToken + fullResponse;
//     }

//     while (remaining.length > 0) {
//       if (inThinkingMode) {
//         const endIndex = remaining.indexOf(thinkingEndToken);
//         if (endIndex !== -1) {
//           thinkingBuffer += remaining.slice(0, endIndex);
//           remaining = remaining.slice(endIndex + thinkingEndToken.length);
//           inThinkingMode = false;
//         } else {
//           thinkingBuffer += remaining;
//           remaining = '';
//         }
//       } else {
//         if (thinkingStartToken) {
//           const startIndex = remaining.indexOf(thinkingStartToken);
//           if (startIndex !== -1) {
//             displayText += remaining.slice(0, startIndex);
//             remaining = remaining.slice(startIndex + thinkingStartToken.length);
//             inThinkingMode = true;
//           } else {
//             displayText += remaining;
//             remaining = '';
//           }
//         } else {
//           displayText += remaining;
//           remaining = '';
//         }
//       }
//     }

//     return { 
//       displayText, 
//       thinking: thinkingBuffer, 
//       inThinkingMode, 
//       thinkingBuffer,
//       fullResponse
//     };
//   };

//   // Clean the thinking content before setting it
//   const cleanThinkingContent = (text: string, startToken: string, endToken: string) => {
//     if (!text) return text;
    
//     return text
//       .replace(new RegExp(startToken, 'g'), '')
//       .replace(new RegExp(endToken, 'g'), '')
//       .replace(/\*\*/g, '')
//       .replace(/__/g, '')
//       .replace(/\*/g, '')
//       .replace(/_/g, '')
//       .replace(/\\n/g, '\n')
//       .replace(/^[\s\n]+|[\s\n]+$/g, '')
//       .split('\n')
//       .map(line => line.trim())
//       .filter(line => line.length > 0)
//       .join('\n');
//   };

//   // Clean the final response content
//   const cleanResponseContent = (text: string) => {
//     if (!text) return text;
    
//     let cleaned = text
//       .replace(/\\n/g, '\n')
//       .replace(/\\t/g, '\t')
//       .replace(/\\r/g, '\r')
//       .replace(/\\\\/g, '\\');
    
//     cleaned = cleaned
//       .replace(/\\\*/g, '*')
//       .replace(/\\_/g, '_')
//       .replace(/\\#/g, '#');
    
//     cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
//     cleaned = cleaned.replace(/^---+\s*$/gm, '');
    
//     return cleaned;
//   };

//   type ChatMessage = { role: string; content: string };

//   // Generate using Saarthi Agri-Model
//   const generateWithSaarthi = async (messages: ChatMessage[], signal: AbortSignal) => {
//     const response = await fetch(API_CONFIG.saarthiBaseUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: API_CONFIG.saarthiModel,
//         messages,
//         stream: true,
//         temperature: 0.8,
//         max_tokens: 5000,
//       }),
//       signal,
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`API error: ${response.status} - ${errorText}`);
//     }

//     return response;
//   };

// const generateAdvisory = async () => {
//   if (!settings.crop || !settings.region) {
//     setError('Please enter at least Crop and Region to generate advisory');
//     return;
//   }

//   // Stop any playing audio
//   stopAudioPlayback();

//   setIsGenerating(true);
//   setError('');
//   setResponse('');
//   setDisplayedResponse('');
//   setThinkingContent('');
//   setDisplayedThinking('');
//   setIsThinking(true);

//   const prompt = buildPrompt();
//   console.log("prompt", prompt);
  
//   if (abortControllerRef.current) {
//     abortControllerRef.current.abort();
//   }
//   abortControllerRef.current = new AbortController();

//   let state = {
//     displayText: '',
//     thinking: '',
//     inThinkingMode: true,
//     thinkingBuffer: '',
//     fullResponse: '',
//   };

//   try {
//     const res = await generateWithSaarthi(prompt, abortControllerRef.current.signal);

//     const reader = res.body?.getReader();
//     if (!reader) {
//       throw new Error('No response body');
//     }

//     const decoder = new TextDecoder();
//     let fullResponseText = '';
//     let allChunks = '';

//     while (true) {
//       const { value, done } = await reader.read();
//       if (done) break;

//       const chunk = decoder.decode(value);
//       allChunks += chunk;
      
//       const lines = chunk.split('\n').filter((line) => line.trim() !== '');

//       for (const line of lines) {
//         if (line.startsWith('data: ')) {
//           const data = line.slice(6);
//           if (data === '[DONE]') continue;

//           try {
//             const sanitizedData = data
//               .replace(/'/g, '"')
//               .replace(/None/g, 'null')
//               .replace(/True/g, 'true')
//               .replace(/False/g, 'false');

//             const parsed = JSON.parse(sanitizedData);
//             let content = '';

//             content = parsed.choices?.[0]?.delta?.content || '';
            
//             if (!content && parsed.choices?.[0]?.message?.content) {
//               content = parsed.choices[0].message.content;
//             }

//             if (content) {
//               fullResponseText += content;
//               console.log("Processing content:", content);
              
//               state = processStreamChunk(
//                 content, 
//                 state, 
//                 settings.thinkingStartToken, 
//                 settings.thinkingEndToken
//               );
              
//               const cleanedResponse = cleanResponseContent(state.displayText);
//               setResponse(cleanedResponse);
              
//               setThinkingContent(cleanThinkingContent(state.thinking, settings.thinkingStartToken, settings.thinkingEndToken));
//               setIsThinking(state.inThinkingMode);
//             }
//           } 
//           catch (jsonError) {
//             console.error("JSON parse error even after sanitization:", jsonError);
//             console.log("Original data:", data);
            
//             const contentMatch = data.match(/'content':\s*'([^']*)'/);
//             if (contentMatch && contentMatch[1]) {
//               const content = contentMatch[1];
//               console.log("Manually extracted content:", content);
//               fullResponseText += content;
              
//               state = processStreamChunk(
//                 content, 
//                 state, 
//                 settings.thinkingStartToken, 
//                 settings.thinkingEndToken
//               );
              
//               const cleanedResponse = cleanResponseContent(state.displayText);
//               setResponse(cleanedResponse);
              
//               setThinkingContent(cleanThinkingContent(state.thinking, settings.thinkingStartToken, settings.thinkingEndToken));
//               setIsThinking(state.inThinkingMode);
//             }
//           }
//         }
//       }
//     }

//     console.log("=== DEBUG: ALL RAW CHUNKS ===");
//     console.log(allChunks);
//     console.log("=== DEBUG: FULL RESPONSE TEXT ===");
//     console.log(fullResponseText);
//     console.log("=== DEBUG: FINAL STATE ===");
//     console.log("State fullResponse:", state.fullResponse);
//     console.log("State thinking:", state.thinking);
//     console.log("State displayText:", state.displayText);
//     console.log("Is thinking mode:", state.inThinkingMode);

//   } catch (err: unknown) {
//     const error = err as Error;
//     if (error.name === 'AbortError') {
//       setResponse((prev) => prev + '\n\n[Generation stopped]');
//     } else {
//       setError(`Error: ${error.message}`);
//     }
//   } finally {
//     setIsGenerating(false);
//     setIsThinking(false);
//   }
// };

//   const stopGeneration = () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
//     setIsGenerating(false);
//     setIsThinking(false);
//   };

//   const clearConversation = () => {
//     stopAudioPlayback();
    
//     setResponse('');
//     setDisplayedResponse('');
//     setThinkingContent('');
//     setDisplayedThinking('');
//     setError('');
//   };

//   // Smooth streaming animation
//   useEffect(() => {
//     responseBufferRef.current = response;
//     thinkingBufferRef.current = thinkingContent;
    
//     const animateText = () => {
//       let updated = false;
      
//       if (displayedResponse.length < responseBufferRef.current.length) {
//         const charsToAdd = Math.min(3, responseBufferRef.current.length - displayedResponse.length);
//         setDisplayedResponse(responseBufferRef.current.slice(0, displayedResponse.length + charsToAdd));
//         updated = true;
//       }
      
//       if (displayedThinking.length < thinkingBufferRef.current.length) {
//         const charsToAdd = Math.min(3, thinkingBufferRef.current.length - displayedThinking.length);
//         setDisplayedThinking(thinkingBufferRef.current.slice(0, displayedThinking.length + charsToAdd));
//         updated = true;
//       }
      
//       if (updated) {
//         animationFrameRef.current = requestAnimationFrame(animateText);
//       }
//     };
    
//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//     }
//     animationFrameRef.current = requestAnimationFrame(animateText);
    
//     return () => {
//       if (animationFrameRef.current) {
//         cancelAnimationFrame(animationFrameRef.current);
//       }
//     };
//   }, [response, thinkingContent, displayedResponse, displayedThinking]);

//   // Auto-scroll thinking content
//   useEffect(() => {
//     if (thinkingRef.current && displayedThinking) {
//       const { scrollTop, scrollHeight, clientHeight } = thinkingRef.current;
//       const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      
//       if (isNearBottom) {
//         thinkingRef.current.scrollTop = scrollHeight;
//       }
//     }
//   }, [displayedThinking]);

//   // Auto-scroll response
//   useEffect(() => {
//     if (responseRef.current && displayedResponse) {
//       const { scrollTop, scrollHeight, clientHeight } = responseRef.current;
//       const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
//       if (isNearBottom) {
//         responseRef.current.scrollTop = scrollHeight;
//       }
//     }
//   }, [displayedResponse, isThinking]);

//   const languages = ['', 'English', 'Hindi'];
//   const seasons = ['', 'Kharif', 'Rabi', 'Zaid', 'Year-round'];
//   const soilTypes = ['', 'Alluvial', 'Black/Regur', 'Red'];
//   const irrigationTypes = ['', 'Drip', 'Sprinkler', 'Flood/Surface'];
//   const growthStages = ['', 'Pre-sowing', 'Germination'];

//   const getModelName = () => {
//     return API_CONFIG.saarthiModel;
//   };

//   const getProviderIcon = () => {
//     return '🌾';
//   };

//   const getProviderColor = () => {
//     return 'bg-orange-500';
//   };

//   const getProviderLabel = () => {
//     return 'Saarthi Agri-Model';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
//       {/* Subtle grid pattern overlay */}
//       <div 
//         className="fixed inset-0 opacity-[0.02]" 
//         style={{
//           backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
//           backgroundSize: '32px 32px'
//         }}
//       />
      
//       <div className="relative flex h-screen">
//         {/* Sidebar */}
//         <div className="w-80 bg-gray-900/50 border-r border-gray-800 flex flex-col backdrop-blur-xl">
//           {/* Logo Header */}
//           <div className="px-10 py-10 border-b border-gray-800">
//             <div className="flex items-center gap-4">
//               <div className="w-20 h-20 rounded-3xl bg-gray-50 shadow-lg flex items-center justify-center">
//                 <img
//                   src={companyLogo}
//                   alt="Company Logo"
//                   className="w-full h-full object-contain p-0.5"
//                 />
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-white tracking-tight ">Agri-Reasoning</h1>
//                 <p className="text-lg font-bold text-white tracking-tight"> Advisor</p>
//               </div>
//             </div>
//           </div>

//           {/* API Provider Selection - Hidden since only one option */}
//           <div className="p-3 border-b border-gray-800">
//             <div className="space-y-1.5">
//               <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
//                 <Zap size={12} />
//                 API Provider
//               </label>
//               <div className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 text-sm">
//                 Saarthi Agri-Model
//               </div>
//             </div>
//           </div>

//           {/* Input Parameters */}
//           <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/30">
//             {/* Basic Info */}
//             <CollapsibleSection
//               title="Basic Information"
//               icon={Sprout}
//               isOpen={sections.basic}
//               onToggle={() => toggleSection('basic')}
//             >
//               <DropdownField
//                 label="Month"
//                 value={settings.month}
//                 onChange={(v) => handleInputChange('month', v)}
//                 placeholder="Select month"
//                 icon={Calendar}
//                 options={DROPDOWN_OPTIONS.month}
//               />
//               <DropdownField
//                 label="Growth Stage"
//                 value={settings.growthStage}
//                 onChange={(v) => handleInputChange('growthStage', v)}
//                 placeholder="Select growth stage"
//                 icon={Sprout}
//                 options={DROPDOWN_OPTIONS.growthStage}
//               />
//               <DropdownField
//                 label="Weather"
//                 value={settings.weather}
//                 onChange={(v) => handleInputChange('weather', v)}
//                 placeholder="Select weather condition"
//                 icon={Cloud}
//                 options={DROPDOWN_OPTIONS.weather}
//               />
//               <DropdownField
//                 label="Soil Type"
//                 value={settings.soilType}
//                 onChange={(v) => handleInputChange('soilType', v)}
//                 placeholder="Select soil type"
//                 icon={Layers}
//                 options={DROPDOWN_OPTIONS.soilType}
//               />
//               <DropdownField
//                 label="Farming Practice"
//                 value={settings.farmingPractice}
//                 onChange={(v) => handleInputChange('farmingPractice', v)}
//                 placeholder="Select farming practice"
//                 icon={Settings}
//                 options={DROPDOWN_OPTIONS.farmingPractice}
//               />
//             </CollapsibleSection>
            
//             {/* Soil Information */}
//             <CollapsibleSection
//               title="Soil Information"
//               icon={Layers}
//               isOpen={sections.soil}
//               onToggle={() => toggleSection('soil')}
//             >
//               <DropdownField
//                 label="Region *"
//                 value={settings.region}
//                 onChange={(v) => handleInputChange('region', v)}
//                 placeholder="Select region"
//                 icon={MapPin}
//                 options={DROPDOWN_OPTIONS.region}
//               />
//               <DropdownField
//                 label="Language"
//                 value={settings.language}
//                 onChange={(v) => handleInputChange('language', v)}
//                 placeholder="Select language"
//                 options={DROPDOWN_OPTIONS.language}
//               />
//               <DropdownField
//                 label="Crop *"
//                 value={settings.crop}
//                 onChange={(v) => handleInputChange('crop', v)}
//                 placeholder="Select crop"
//                 icon={Leaf}
//                 options={DROPDOWN_OPTIONS.crop}
//               />
//             </CollapsibleSection>

//             {/* Advanced Settings */}
//             <CollapsibleSection
//               title="Advanced Settings"
//               icon={Settings}
//               isOpen={sections.advanced}
//               onToggle={() => toggleSection('advanced')}
//             >
//               <DropdownField
//                 label="Stress"
//                 value={settings.stress}
//                 onChange={(v) => handleInputChange('stress', v)}
//                 placeholder="Select stress factor"
//                 icon={AlertCircle}
//                 options={DROPDOWN_OPTIONS.stress}
//               />
//             </CollapsibleSection>

//             {/* Thinking Tokens Configuration */}
//             <CollapsibleSection
//               title="Thinking Tokens"
//               icon={Brain}
//               isOpen={sections.thinking}
//               onToggle={() => toggleSection('thinking')}
//             >
//               <div className="text-xs text-gray-500 mb-2">
//                 Configure the tokens that mark model's reasoning/thinking process
//               </div>
//               <InputField
//                 label="Thinking Start Token"
//                 value={settings.thinkingStartToken}
//                 onChange={(v) => handleInputChange('thinkingStartToken', v)}
//                 placeholder="e.g., <think>"
//                 icon={Brain}
//               />
//               <InputField
//                 label="Thinking End Token"
//                 value={settings.thinkingEndToken}
//                 onChange={(v) => handleInputChange('thinkingEndToken', v)}
//                 placeholder="e.g., </think>"
//                 icon={Brain}
//               />
//               <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-800/50 rounded-lg">
//                 Text between these tokens will be shown in a separate "thinking" window, 
//                 and the final response will display clean text without the reasoning.
//               </div>
//             </CollapsibleSection>
//           </div>

//           {/* Generate Button */}
//           <div className="p-3 border-t border-gray-800 space-y-2">
//             <button
//               onClick={clearConversation}
//               className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-all"
//             >
//               <RefreshCw size={16} />
//               Clear Response
//             </button>
            
//             {isGenerating ? (
//               <button
//                 onClick={stopGeneration}
//                 className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
//               >
//                 <Loader2 className="animate-spin" size={20} />
//                 Stop Generation
//               </button>
//             ) : (
//               <button
//                 onClick={() => generateAdvisory()}
//                 disabled={!settings.crop || !settings.region}
//                 className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:shadow-none"
//               >
//                 <Sparkles size={20} />
//                 Generate Advisory
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 flex flex-col">
//           {/* Header */}
//           <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/30 backdrop-blur-xl">
//             <div className="flex items-center gap-2">
//               <Brain size={20} className="text-emerald-400" />
//               <span className="text-gray-200 font-medium">Agricultural Advisory Response</span>
//             </div>
//             <div className="flex items-center gap-2 text-xs text-gray-500">
//               <span className={`w-2 h-2 rounded-full animate-pulse ${getProviderColor()}`}></span>
//               <span className="text-gray-400">
//                 {getProviderLabel()}
//               </span>
//             </div>
//           </div>

//           {/* Response Area */}
//           <div 
//             ref={responseRef}
//             className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/30"
//           >
//             {error && (
//               <div className="max-w-3xl mx-auto mb-4">
//                 <div className={`bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3`}>
//                   <AlertCircle className={`text-red-400 flex-shrink-0 mt-0.5`} size={20} />
//                   <div className={`text-sm text-red-300`}>{error}</div>
//                 </div>
//               </div>
//             )}

//             {!response && !isGenerating && !error && (
//               <div className="h-full flex flex-col items-center justify-center text-center">
//                 <h2 className="text-4xl font-bold text-gray-200 mb-1">Saarthi 🌿</h2>
//                 <p className="text-gray-500 max-w-md mb-8">
//                   Enter your farming parameters in the sidebar and click "Generate Advisory" 
//                   to receive AI-powered agricultural recommendations.
//                 </p>
//                 <div className="flex flex-wrap justify-center gap-3 mb-6">
//                   {['Crop Management', 'Pest Control', 'Fertilizer Advice', 'Irrigation Schedule'].map((tag) => (
//                     <span key={tag} className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-full text-xs text-gray-400">
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//                 <div className="text-xs text-gray-600">
//                   <span className="flex items-center gap-1">
//                     Tokens: <code className="px-1.5 py-0.5 bg-gray-800/70 rounded text-gray-400">{settings.thinkingStartToken}</code> 
//                     to <code className="px-1.5 py-0.5 bg-gray-800/70 rounded text-gray-400">{settings.thinkingEndToken}</code>
//                   </span>
//                 </div>
//               </div>
//             )}

//             {(response || isGenerating) && (
//               <div className="max-w-3xl mx-auto">
//                 {/* User Query Summary */}
//                 <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
//                   <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
//                     <Send size={14} />
//                     Query Parameters
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {settings.month && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         📅 {settings.month}
//                       </span>
//                     )}
//                     {settings.growthStage && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         🌱 {settings.growthStage}
//                       </span>
//                     )}
//                     {settings.weather && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         🌤️ {settings.weather}
//                       </span>
//                     )}
//                     {settings.soilType && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         🏔️ {settings.soilType}
//                       </span>
//                     )}
//                     {settings.farmingPractice && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         🚜 {settings.farmingPractice}
//                       </span>
//                     )}
//                     {settings.region && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         📍 {settings.region}
//                       </span>
//                     )}
//                     {settings.language && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         🌐 {settings.language}
//                       </span>
//                     )}
//                     {settings.crop && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         🌾 {settings.crop}
//                       </span>
//                     )}
//                     {settings.stress && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         ⚠️ {settings.stress}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Thinking Content */}
//                 {(thinkingContent || displayedThinking) && (
//                   <div className="mb-4">
//                     <div className={`border rounded-xl overflow-hidden ${isThinking ? 'bg-amber-500/10 border-amber-500/30' : 'bg-gray-800/30 border-gray-700/50'}`}>
//                       <div className={`flex items-center gap-2 px-3 py-2 border-b ${isThinking ? 'border-amber-500/20 bg-amber-500/5' : 'border-gray-700/30 bg-gray-800/20'}`}>
//                         <Brain size={16} className={isThinking ? 'text-amber-400 animate-pulse' : 'text-gray-400'} />
//                         <span className={`font-medium text-sm ${isThinking ? 'text-amber-400' : 'text-gray-400'}`}>
//                           {isThinking ? 'Model is thinking...' : 'Reasoning Process'}
//                         </span>
//                         {isThinking && (
//                           <div className="flex gap-1 ml-auto">
//                             <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
//                             <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
//                             <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
//                           </div>
//                         )}
//                       </div>
//                       <div 
//                         ref={thinkingRef}
//                         className="max-h-32 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-gray-800/20"
//                       >
//                         <pre className={`text-xs whitespace-pre-wrap font-mono leading-relaxed ${isThinking ? 'text-amber-200/80' : 'text-gray-400'}`}>
//                           {displayedThinking}
//                           {isThinking && displayedThinking.length < thinkingContent.length && (
//                             <span className="inline-block w-1.5 h-3 bg-amber-400 animate-pulse ml-0.5 rounded-sm"></span>
//                           )}
//                         </pre>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Response Content */}
//                 <div className="relative">
//                   {/* Audio Playback Button with ElevenLabs */}
//                   {response && (
//                     <div className="flex items-center justify-end mb-4">
//                       <button
//                         onClick={toggleAudioPlayback}
//                         disabled={!response || isGenerating}
//                         className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
//                           isPlayingAudio 
//                             ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
//                             : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
//                         } ${(!response || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
//                       >
//                         {isPlayingAudio ? (
//                           <>
//                             <VolumeX size={16} />
//                             <span className="text-sm">Stop Audio</span>
//                           </>
//                         ) : (
//                           <>
//                             <Volume2 size={16} />
//                             <span className="text-sm">Play with ElevenLabs</span>
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   )}
                  
//                   <div className="prose prose-invert prose-emerald max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-emerald-400 prose-li:text-gray-300 prose-a:text-emerald-400 prose-code:text-amber-300 prose-code:bg-gray-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800/70 prose-pre:border prose-pre:border-gray-700">
//                     <ReactMarkdown>{displayedResponse}</ReactMarkdown>
//                     {isGenerating && !isThinking && displayedResponse.length < response.length && (
//                       <span className="inline-block w-2 h-5 bg-emerald-500 animate-pulse ml-1 rounded-sm"></span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="h-12 border-t border-gray-800 flex items-center justify-center bg-gray-900/30 backdrop-blur-xl">
//             <p className="text-xs text-gray-600">
//               Powered by Soket AI Labs • Audio by ElevenLabs
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AgriAdvisoryInterface;



///// claue new versio wth low latency and pasuse button   ///


// <reference types="vite/client" />
import { AlertCircle, Brain, Calendar, ChevronDown, ChevronRight, Cloud, Layers, Leaf, Loader2, MapPin, RefreshCw, Send, Settings, Sparkles, Sprout, Volume2, VolumeX, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import companyLogo from './Soket-Logo.svg';

// API Configuration
const API_CONFIG = {
  // Saarthi Agri-Model (In-house OpenWeb API)
  saarthiApiKey: import.meta.env.VITE_SAARTHI_API_KEY || 'sk-9d09b7df9cbd5daebca67cbbb45e9f0c',
  saarthiBaseUrl: import.meta.env.VITE_SAARTHI_BASE_URL || 'http://localhost:8000/v1/chat/completions',
  saarthiModel: 'soketlabs/saarthi-agri-v1',
  
  // ElevenLabs API
  // elevenlabsApiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_ca696bb73eac6ab599a26604e8b4f9946f2e49dc2d30361f',
  // elevenlabsVoiceId: 'XrExE9yKIg1WjnnlVkGX', // Adam voice - you can change this
};
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:9000";

// Default thinking token markers
const DEFAULT_THINKING_START = '<unused0>';
const DEFAULT_THINKING_END = '<unused1>';

// API providers - only Saarthi
const apiProviders = [
  { value: 'saarthi', label: 'Saarthi Agri-Model' },
];

// API Provider type - only Saarthi
type ApiProvider = 'saarthi';

// Dropdown options for each field
const DROPDOWN_OPTIONS = {
  month: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  growthStage: [
    'फूल आना',
    'बाल निकलना',
    'पुष्पन',
    'पकना',
    'दूधिया अवस्था',
    'कटाई तैयार'
  ],
  weather: [
    'गरम और आर्द्र मौसम',
    'ठंडी रात और हल्की नमी',
    'सुबह ठंड और धूप',
    'तेज धूप और गर्मी',
    'बादल छाए रहना',
    'ठंड और सूखा'
  ],
  soilType: [
    'काली मिट्टी',
    'दोमट मिट्टी',
    'बलुई दोमट मिट्टी',
    'लाल मिट्टी',
    'कंकरीली मिट्टी',
    'पथरीली मिट्टी'
  ],
  farmingPractice: [
    'सामान्य खेती',
    'जैविक खेती',
    'समेकित कृषि',
    'बारानी खेती',
    'संरक्षण खेती'
  ],
  region: [
    'महाराष्ट्र',
    'उत्तर प्रदेश',
    'मध्य प्रदेश',
    'छत्तीसगढ़',
    'हिमाचल प्रदेश'
  ],
  language: [
    'Hindi',
  ],
  crop: [
    'कपास',
    'गेहूं',
    'चना',
    'धान (नर्सरी)',
    'सोयाबीन'
  ],
  stress: [
    'सफेद मक्खी',
    'पीला रतुआ रोग',
    'कीट संक्रमण',
    'खैरा रोग',
    'पीला मोज़ेक वायरस',
    'पाउडरी मिल्ड्यू'
  ]
};

const CollapsibleSection = ({ title, icon: Icon, isOpen, onToggle, children }: { title: string; icon: any; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) => (
  <div className="border border-gray-700/50 rounded-lg overflow-hidden bg-gray-800/30 backdrop-blur-sm">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 hover:bg-gray-700/30 transition-colors"
    >
      <div className="flex items-center gap-2 text-gray-200">
        <Icon size={18} className="text-emerald-400" />
        <span className="font-medium text-sm">{title}</span>
      </div>
      {isOpen ? (
        <ChevronDown size={18} className="text-gray-400" />
      ) : (
        <ChevronRight size={18} className="text-gray-400" />
      )}
    </button>
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="p-3 pt-0 space-y-3">{children}</div>
    </div>
  </div>
);

const DropdownField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon, 
  options 
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  placeholder: string; 
  icon?: any; 
  options: string[];
}) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
      {Icon && <Icon size={12} />}
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer"
    >
      <option value="" className="bg-gray-900 text-gray-500">
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option} className="bg-gray-900">
          {option}
        </option>
      ))}
    </select>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; icon?: any; type?: string }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
      {Icon && <Icon size={12} />}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, icon: Icon }: { label: string; value: string; onChange: (v: string) => void; options: any[]; icon?: any }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
      {Icon && <Icon size={12} />}
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt} className="bg-gray-900">
          {opt.label ?? opt}
        </option>
      ))}
    </select>
  </div>
);

const AgriAdvisoryInterface = () => {
  // Collapsible section states
  const [sections, setSections] = useState({
    basic: true,
    weather: false,
    soil: false,
    advanced: false,
    thinking: false,
  });

  const toggleSection = (section: string) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // ✅ ADD THIS
  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState('');
  const [thinkingContent, setThinkingContent] = useState('');
  const [displayedThinking, setDisplayedThinking] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');
  const [apiProvider, setApiProvider] = useState<ApiProvider>('saarthi');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  
  const responseRef = useRef<HTMLDivElement>(null);
  const thinkingRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // const audioContextRef = useRef<AudioContext | null>(null);
  
  // For chunked streaming audio playback
  // const audioQueueRef = useRef<AudioBuffer[]>([]);
  // const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  // const isPlayingRef = useRef(false);
  // const currentChunkIndexRef = useRef(0);
  // const audioStartTimeRef = useRef(0);
  // const pausedAtTimeRef = useRef(0);
  // const currentTextRef = useRef('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  
  // Refs for smooth streaming animation
  const responseBufferRef = useRef('');
  const thinkingBufferRef = useRef('');
  const animationFrameRef = useRef<number | null>(null);

  const [settings, setSettings] = useState({
    month: '',
    growthStage: '',
    weather: '',  
    soilType: '',
    farmingPractice: '',
    region: '',
    language: '',
    crop: '',
    stress: '',
    thinkingStartToken: DEFAULT_THINKING_START,
    thinkingEndToken: DEFAULT_THINKING_END,
  });

  // Initialize audio context
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
  //     // Cleanup on unmount
  //     return () => {
  //       if (audioContextRef.current) {
  //         audioContextRef.current.close();
  //       }
  //     };
  //   }
  // }, []);

  // Split text into smaller chunks for faster streaming
  // const splitTextIntoChunks = (text: string, maxChunkSize: number = 500): string[] => {
  //   const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  //   const chunks: string[] = [];
  //   let currentChunk = '';

  //   for (const sentence of sentences) {
  //     if ((currentChunk + sentence).length > maxChunkSize && currentChunk.length > 0) {
  //       chunks.push(currentChunk.trim());
  //       currentChunk = sentence;
  //     } else {
  //       currentChunk += ' ' + sentence;
  //     }
  //   }

  //   if (currentChunk.trim().length > 0) {
  //     chunks.push(currentChunk.trim());
  //   }

  //   return chunks;
  // };

  // Clean text for speech
  // const cleanTextForSpeech = (text: string): string => {
  //   return text
  //     .replace(/#+\s*/g, '')
  //     .replace(/\*\*/g, '')
  //     .replace(/\*/g, '')
  //     .replace(/`/g, '')
  //     .replace(/\[.*?\]\(.*?\)/g, '')
  //     .replace(/\n{3,}/g, '\n\n')
  //     .trim();
  // };

  // Fetch audio chunk from ElevenLabs
  // const fetchAudioChunk = async (text: string): Promise<AudioBuffer | null> => {
  //   if (!audioContextRef.current) return null;

  //   try {
  //     const response = await fetch(
  //       `https://api.elevenlabs.io/v1/text-to-speech/${API_CONFIG.elevenlabsVoiceId}/stream`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Accept': 'audio/mpeg',
  //           'Content-Type': 'application/json',
  //           'xi-api-key': API_CONFIG.elevenlabsApiKey,
  //         },
  //         body: JSON.stringify({
  //           text: text,
  //           model_id: 'eleven_turbo_v2_5', // Faster model for lower latency
  //           voice_settings: {
  //             stability: 0.5,
  //             similarity_boost: 0.75,
  //             style: 0.0,
  //             use_speaker_boost: true
  //           },
  //           optimize_streaming_latency: 4, // Maximum optimization for streaming
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error(`ElevenLabs API error: ${response.status}`);
  //     }

  //     const arrayBuffer = await response.arrayBuffer();
  //     const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
  //     return audioBuffer;
  //   } catch (error) {
  //     console.error('Error fetching audio chunk:', error);
  //     return null;
  //   }
  // };

  // Play audio from queue with resume capability
  // const playFromQueue = (startFromChunk: number = 0, offsetTime: number = 0) => {
  //   if (!audioContextRef.current || audioQueueRef.current.length === 0) return;

  //   if (audioContextRef.current.state === 'suspended') {
  //     audioContextRef.current.resume();
  //   }

  //   isPlayingRef.current = true;
  //   setIsPlayingAudio(true);
  //   setIsPausedAudio(false);

  //   const playChunk = (chunkIndex: number, offset: number = 0) => {
  //     if (chunkIndex >= audioQueueRef.current.length || !isPlayingRef.current) {
  //       // Playback completed
  //       isPlayingRef.current = false;
  //       setIsPlayingAudio(false);
  //       currentChunkIndexRef.current = 0;
  //       pausedAtTimeRef.current = 0;
  //       return;
  //     }

  //     const audioBuffer = audioQueueRef.current[chunkIndex];
  //     const source = audioContextRef.current!.createBufferSource();
  //     source.buffer = audioBuffer;
  //     source.connect(audioContextRef.current!.destination);

  //     currentSourceRef.current = source;
  //     currentChunkIndexRef.current = chunkIndex;
  //     audioStartTimeRef.current = audioContextRef.current!.currentTime - offset;

  //     source.onended = () => {
  //       if (isPlayingRef.current) {
  //         playChunk(chunkIndex + 1);
  //       }
  //     };

  //     // Start playback with offset for resume
  //     source.start(0, offset);
  //   };

  //   playChunk(startFromChunk, offsetTime);
  // };

  // Stream and play audio in chunks for instant playback
  // const streamAndPlayAudio = async (text: string) => {
  //   if (!audioContextRef.current) return;

  //   const cleanText = cleanTextForSpeech(text);
  //   if (!cleanText) return;

  //   // Reset audio state
  //   audioQueueRef.current = [];
  //   currentChunkIndexRef.current = 0;
  //   pausedAtTimeRef.current = 0;
  //   currentTextRef.current = cleanText;

  //   // Split into smaller chunks for faster initial playback
  //   const chunks = splitTextIntoChunks(cleanText, 300);
    
  //   console.log(`Streaming ${chunks.length} chunks for instant playback...`);

  //   setIsPlayingAudio(true);
  //   isPlayingRef.current = true;

  //   // Fetch and play chunks progressively
  //   for (let i = 0; i < chunks.length; i++) {
  //     if (!isPlayingRef.current) break;

  //     const audioBuffer = await fetchAudioChunk(chunks[i]);
      
  //     if (audioBuffer) {
  //       audioQueueRef.current.push(audioBuffer);

  //       // Start playing as soon as first chunk is ready
  //       if (i === 0) {
  //         playFromQueue(0, 0);
  //       }
  //     }
  //   }
  // };

  // Pause audio playback
  // const pauseAudioPlayback = () => {
  //   if (!audioContextRef.current || !currentSourceRef.current) return;

  //   isPlayingRef.current = false;
    
  //   // Calculate current playback position
  //   const currentTime = audioContextRef.current.currentTime;
  //   const elapsedTime = currentTime - audioStartTimeRef.current;
    
  //   // Store the position within the current chunk
  //   const currentBuffer = audioQueueRef.current[currentChunkIndexRef.current];
  //   if (currentBuffer) {
  //     pausedAtTimeRef.current = Math.min(elapsedTime, currentBuffer.duration);
  //   }

  //   // Stop current playback
  //   if (currentSourceRef.current) {
  //     currentSourceRef.current.stop();
  //     currentSourceRef.current = null;
  //   }

  //   setIsPlayingAudio(false);
  //   setIsPausedAudio(true);
  // };

  // // Resume audio playback from where it was paused
  // const resumeAudioPlayback = () => {
  //   if (!audioContextRef.current || audioQueueRef.current.length === 0) return;

  //   const currentBuffer = audioQueueRef.current[currentChunkIndexRef.current];
    
  //   if (pausedAtTimeRef.current >= currentBuffer.duration - 0.1) {
  //     // If we're at the end of current chunk, move to next
  //     playFromQueue(currentChunkIndexRef.current + 1, 0);
  //   } else {
  //     // Resume from paused position
  //     playFromQueue(currentChunkIndexRef.current, pausedAtTimeRef.current);
  //   }
  // };

  // Stop audio playback completely
  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsPlayingAudio(false);
    setIsPausedAudio(false);
  };


  // Toggle audio playback
  const toggleAudioPlayback = async () => {
    if (!response) return;

    // Pause
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      setIsPausedAudio(true);
      return;
    }

    // Resume
    if (audioRef.current && audioRef.current.paused) {
      await audioRef.current.play();
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      return;
    }

    // Fresh playback
    const advisoryId = crypto.randomUUID();

    // 🔥 Tell backend to generate FIRST
    await fetch(`${API_BASE}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        advisoryId,
        text: response
      })
    });

    // 🔥 Now stream it
    const audio = new Audio(`${API_BASE}/api/tts/${advisoryId}`);

    audioRef.current = audio;

    audio.onended = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    await audio.play();
    setIsPlayingAudio(true);
  };



  const SYSTEM_PROMPT = `You are a helpful District Agricultural Officer providing crop advisory to farmers based on location and various climatic conditions given as input.

Output Order (Mandatory and Strict):
1. The very first output token must be exactly <unused0>
2. Immediately after <unused0>, produce a structured analytical reasoning section in English covering:
- Crop suitability for the given Month and Region, considering the Crop type and Growth Stage
- Climate assessment using Weather description
- Soil behavior, soil moisture retention, and irrigation needs based on Soil Type 
- Growth-stage-specific agronomic requirements and timing considerations
- Risk analysis including Stress factors (pests/diseases) and weather-related stress
- Impact of Farming Practice on productivity and risk mitigation
- Integrated recommendation logic combining all above parameters coherently
3. After the reasoning is complete, output exactly <unused1>
4. Only after <unused1>, produce the final advisory response intended for the user.

Output Restrictions:
- Do not output anything before <unused0>.
- Do not output anything between <unused0> and <unused1> except the analytical reasoning section.
- Do not repeat <unused0> or <unused1>.
- Do not include meta commentary or explanations about the protocol.
- The final advisory must be written strictly in the language requested by the user.
`;

  // Build the prompt from settings
const buildPrompt = () => {
  const parts: string[] = [];

  if (settings.month) parts.push(`Month: ${settings.month}`);
  if (settings.growthStage) parts.push(`Growth Stage: ${settings.growthStage}`);
  if (settings.weather) parts.push(`Weather: ${settings.weather}`);
  if (settings.soilType) parts.push(`Soil Type: ${settings.soilType}`);
  if (settings.farmingPractice) parts.push(`Farming Practice: ${settings.farmingPractice}`);
  if (settings.region) parts.push(`Region: ${settings.region}`);
  if (settings.language) parts.push(`Language: ${settings.language}`);
  if (settings.crop) parts.push(`Crop: ${settings.crop}`);
  if (settings.stress) parts.push(`Stress: ${settings.stress}`);

  const userMessage = {
    role: "user",
    content: SYSTEM_PROMPT + "\n\n" + parts.join("\n"),
  };

  console.log("Final payload messages:", [userMessage]);

  return [userMessage];
};

  // Parse streaming response with thinking token handling
  const processStreamChunk = (
    text: string, 
    currentState: {
      displayText: string;
      thinking: string;
      inThinkingMode: boolean;
      thinkingBuffer: string;
      fullResponse: string;
    },
    thinkingStartToken: string,
    thinkingEndToken: string
  ) => {
    let { displayText, inThinkingMode, thinkingBuffer, fullResponse } = currentState;
    let remaining = text;
    
    fullResponse += text;

    if (!fullResponse.includes(thinkingStartToken) && fullResponse.includes(thinkingEndToken)) {
      remaining = thinkingStartToken + remaining;
      fullResponse = thinkingStartToken + fullResponse;
    }

    while (remaining.length > 0) {
      if (inThinkingMode) {
        const endIndex = remaining.indexOf(thinkingEndToken);
        if (endIndex !== -1) {
          thinkingBuffer += remaining.slice(0, endIndex);
          remaining = remaining.slice(endIndex + thinkingEndToken.length);
          inThinkingMode = false;
        } else {
          thinkingBuffer += remaining;
          remaining = '';
        }
      } else {
        if (thinkingStartToken) {
          const startIndex = remaining.indexOf(thinkingStartToken);
          if (startIndex !== -1) {
            displayText += remaining.slice(0, startIndex);
            remaining = remaining.slice(startIndex + thinkingStartToken.length);
            inThinkingMode = true;
          } else {
            displayText += remaining;
            remaining = '';
          }
        } else {
          displayText += remaining;
          remaining = '';
        }
      }
    }

    return { 
      displayText, 
      thinking: thinkingBuffer, 
      inThinkingMode, 
      thinkingBuffer,
      fullResponse
    };
  };

  // Clean the thinking content before setting it
  const cleanThinkingContent = (text: string, startToken: string, endToken: string) => {
    if (!text) return text;
    
    return text
      .replace(new RegExp(startToken, 'g'), '')
      .replace(new RegExp(endToken, 'g'), '')
      .replace(/\*\*/g, '')
      .replace(/__/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .replace(/\\n/g, '\n')
      .replace(/^[\s\n]+|[\s\n]+$/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
  };

  // Clean the final response content
  const cleanResponseContent = (text: string) => {
    if (!text) return text;
    
    let cleaned = text
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\\\/g, '\\');
    
    cleaned = cleaned
      .replace(/\\\*/g, '*')
      .replace(/\\_/g, '_')
      .replace(/\\#/g, '#');
    
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    cleaned = cleaned.replace(/^---+\s*$/gm, '');
    
    return cleaned;
  };

  type ChatMessage = { role: string; content: string };

  // Generate using Saarthi Agri-Model
  const generateWithSaarthi = async (messages: ChatMessage[], signal: AbortSignal) => {
    const response = await fetch(API_CONFIG.saarthiBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: API_CONFIG.saarthiModel,
        messages,
        stream: true,
        temperature: 0.8,
        max_tokens: 5000,
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return response;
  };

const generateAdvisory = async () => {
  if (!settings.crop || !settings.region) {
    setError('Please enter at least Crop and Region to generate advisory');
    return;
  }

  // Stop any playing audio
  stopAudioPlayback();

  setIsGenerating(true);
  setError('');
  setResponse('');
  setDisplayedResponse('');
  setThinkingContent('');
  setDisplayedThinking('');
  setIsThinking(true);

  const prompt = buildPrompt();
  console.log("prompt", prompt);
  
  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }
  abortControllerRef.current = new AbortController();

  let state = {
    displayText: '',
    thinking: '',
    inThinkingMode: true,
    thinkingBuffer: '',
    fullResponse: '',
  };

  try {
    const res = await generateWithSaarthi(prompt, abortControllerRef.current.signal);

    const reader = res.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let fullResponseText = '';
    let allChunks = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      allChunks += chunk;
      
      const lines = chunk.split('\n').filter((line) => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const sanitizedData = data
              .replace(/'/g, '"')
              .replace(/None/g, 'null')
              .replace(/True/g, 'true')
              .replace(/False/g, 'false');

            const parsed = JSON.parse(sanitizedData);
            let content = '';

            content = parsed.choices?.[0]?.delta?.content || '';
            
            if (!content && parsed.choices?.[0]?.message?.content) {
              content = parsed.choices[0].message.content;
            }

            if (content) {
              fullResponseText += content;
              console.log("Processing content:", content);
              
              state = processStreamChunk(
                content, 
                state, 
                settings.thinkingStartToken, 
                settings.thinkingEndToken
              );
              
              const cleanedResponse = cleanResponseContent(state.displayText);
              setResponse(cleanedResponse);
              
              setThinkingContent(cleanThinkingContent(state.thinking, settings.thinkingStartToken, settings.thinkingEndToken));
              setIsThinking(state.inThinkingMode);
            }
          } 
          catch (jsonError) {
            console.error("JSON parse error even after sanitization:", jsonError);
            console.log("Original data:", data);
            
            const contentMatch = data.match(/'content':\s*'([^']*)'/);
            if (contentMatch && contentMatch[1]) {
              const content = contentMatch[1];
              console.log("Manually extracted content:", content);
              fullResponseText += content;
              
              state = processStreamChunk(
                content, 
                state, 
                settings.thinkingStartToken, 
                settings.thinkingEndToken
              );
              
              const cleanedResponse = cleanResponseContent(state.displayText);
              setResponse(cleanedResponse);
              
              setThinkingContent(cleanThinkingContent(state.thinking, settings.thinkingStartToken, settings.thinkingEndToken));
              setIsThinking(state.inThinkingMode);
            }
          }
        }
      }
    }

    console.log("=== DEBUG: ALL RAW CHUNKS ===");
    console.log(allChunks);
    console.log("=== DEBUG: FULL RESPONSE TEXT ===");
    console.log(fullResponseText);
    console.log("=== DEBUG: FINAL STATE ===");
    console.log("State fullResponse:", state.fullResponse);
    console.log("State thinking:", state.thinking);
    console.log("State displayText:", state.displayText);
    console.log("Is thinking mode:", state.inThinkingMode);

  } catch (err: unknown) {
    const error = err as Error;
    if (error.name === 'AbortError') {
      setResponse((prev) => prev + '\n\n[Generation stopped]');
    } else {
      setError(`Error: ${error.message}`);
    }
  } finally {
    setIsGenerating(false);
    setIsThinking(false);
  }
};

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsGenerating(false);
    setIsThinking(false);
  };

  const clearConversation = () => {
    stopAudioPlayback();
    
    setResponse('');
    setDisplayedResponse('');
    setThinkingContent('');
    setDisplayedThinking('');
    setError('');
  };

  // Smooth streaming animation
  useEffect(() => {
    responseBufferRef.current = response;
    thinkingBufferRef.current = thinkingContent;
    
    const animateText = () => {
      let updated = false;
      
      if (displayedResponse.length < responseBufferRef.current.length) {
        const charsToAdd = Math.min(3, responseBufferRef.current.length - displayedResponse.length);
        setDisplayedResponse(responseBufferRef.current.slice(0, displayedResponse.length + charsToAdd));
        updated = true;
      }
      
      if (displayedThinking.length < thinkingBufferRef.current.length) {
        const charsToAdd = Math.min(3, thinkingBufferRef.current.length - displayedThinking.length);
        setDisplayedThinking(thinkingBufferRef.current.slice(0, displayedThinking.length + charsToAdd));
        updated = true;
      }
      
      if (updated) {
        animationFrameRef.current = requestAnimationFrame(animateText);
      }
    };
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(animateText);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [response, thinkingContent, displayedResponse, displayedThinking]);

  // Auto-scroll thinking content
  useEffect(() => {
    if (thinkingRef.current && displayedThinking) {
      const { scrollTop, scrollHeight, clientHeight } = thinkingRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      if (isNearBottom) {
        thinkingRef.current.scrollTop = scrollHeight;
      }
    }
  }, [displayedThinking]);

  // Auto-scroll response
  useEffect(() => {
    if (responseRef.current && displayedResponse) {
      const { scrollTop, scrollHeight, clientHeight } = responseRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      if (isNearBottom) {
        responseRef.current.scrollTop = scrollHeight;
      }
    }
  }, [displayedResponse, isThinking]);

  const languages = ['', 'English', 'Hindi'];
  const seasons = ['', 'Kharif', 'Rabi', 'Zaid', 'Year-round'];
  const soilTypes = ['', 'Alluvial', 'Black/Regur', 'Red'];
  const irrigationTypes = ['', 'Drip', 'Sprinkler', 'Flood/Surface'];
  const growthStages = ['', 'Pre-sowing', 'Germination'];

  const getModelName = () => {
    return API_CONFIG.saarthiModel;
  };

  const getProviderIcon = () => {
    return '🌾';
  };

  const getProviderColor = () => {
    return 'bg-orange-500';
  };

  const getProviderLabel = () => {
    return 'Saarthi Agri-Model';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Subtle grid pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      
      <div className="relative flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-gray-900/50 border-r border-gray-800 flex flex-col backdrop-blur-xl">
          {/* Logo Header */}
          <div className="px-10 py-10 border-b border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-gray-50 shadow-lg flex items-center justify-center">
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight ">Agri-Reasoning</h1>
                <p className="text-lg font-bold text-white tracking-tight"> Advisor</p>
              </div>
            </div>
          </div>

          {/* API Provider Selection - Hidden since only one option */}
          <div className="p-3 border-b border-gray-800">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                <Zap size={12} />
                API Provider
              </label>
              <div className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-gray-200 text-sm">
                Saarthi Agri-Model
              </div>
            </div>
          </div>

          {/* Input Parameters */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/30">
            {/* Basic Info */}
            <CollapsibleSection
              title="Basic Information"
              icon={Sprout}
              isOpen={sections.basic}
              onToggle={() => toggleSection('basic')}
            >
              <DropdownField
                label="Month"
                value={settings.month}
                onChange={(v) => handleInputChange('month', v)}
                placeholder="Select month"
                icon={Calendar}
                options={DROPDOWN_OPTIONS.month}
              />
              <DropdownField
                label="Growth Stage"
                value={settings.growthStage}
                onChange={(v) => handleInputChange('growthStage', v)}
                placeholder="Select growth stage"
                icon={Sprout}
                options={DROPDOWN_OPTIONS.growthStage}
              />
              <DropdownField
                label="Weather"
                value={settings.weather}
                onChange={(v) => handleInputChange('weather', v)}
                placeholder="Select weather condition"
                icon={Cloud}
                options={DROPDOWN_OPTIONS.weather}
              />
              <DropdownField
                label="Soil Type"
                value={settings.soilType}
                onChange={(v) => handleInputChange('soilType', v)}
                placeholder="Select soil type"
                icon={Layers}
                options={DROPDOWN_OPTIONS.soilType}
              />
              <DropdownField
                label="Farming Practice"
                value={settings.farmingPractice}
                onChange={(v) => handleInputChange('farmingPractice', v)}
                placeholder="Select farming practice"
                icon={Settings}
                options={DROPDOWN_OPTIONS.farmingPractice}
              />
            </CollapsibleSection>
            
            {/* Soil Information */}
            <CollapsibleSection
              title="Soil Information"
              icon={Layers}
              isOpen={sections.soil}
              onToggle={() => toggleSection('soil')}
            >
              <DropdownField
                label="Region *"
                value={settings.region}
                onChange={(v) => handleInputChange('region', v)}
                placeholder="Select region"
                icon={MapPin}
                options={DROPDOWN_OPTIONS.region}
              />
              <DropdownField
                label="Language"
                value={settings.language}
                onChange={(v) => handleInputChange('language', v)}
                placeholder="Select language"
                options={DROPDOWN_OPTIONS.language}
              />
              <DropdownField
                label="Crop *"
                value={settings.crop}
                onChange={(v) => handleInputChange('crop', v)}
                placeholder="Select crop"
                icon={Leaf}
                options={DROPDOWN_OPTIONS.crop}
              />
            </CollapsibleSection>

            {/* Advanced Settings */}
            <CollapsibleSection
              title="Advanced Settings"
              icon={Settings}
              isOpen={sections.advanced}
              onToggle={() => toggleSection('advanced')}
            >
              <DropdownField
                label="Stress"
                value={settings.stress}
                onChange={(v) => handleInputChange('stress', v)}
                placeholder="Select stress factor"
                icon={AlertCircle}
                options={DROPDOWN_OPTIONS.stress}
              />
            </CollapsibleSection>

            {/* Thinking Tokens Configuration */}
            <CollapsibleSection
              title="Thinking Tokens"
              icon={Brain}
              isOpen={sections.thinking}
              onToggle={() => toggleSection('thinking')}
            >
              <div className="text-xs text-gray-500 mb-2">
                Configure the tokens that mark model's reasoning/thinking process
              </div>
              <InputField
                label="Thinking Start Token"
                value={settings.thinkingStartToken}
                onChange={(v) => handleInputChange('thinkingStartToken', v)}
                placeholder="e.g., <think>"
                icon={Brain}
              />
              <InputField
                label="Thinking End Token"
                value={settings.thinkingEndToken}
                onChange={(v) => handleInputChange('thinkingEndToken', v)}
                placeholder="e.g., </think>"
                icon={Brain}
              />
              <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-800/50 rounded-lg">
                Text between these tokens will be shown in a separate "thinking" window, 
                and the final response will display clean text without the reasoning.
              </div>
            </CollapsibleSection>
          </div>

          {/* Generate Button */}
          <div className="p-3 border-t border-gray-800 space-y-2">
            <button
              onClick={clearConversation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-all"
            >
              <RefreshCw size={16} />
              Clear Response
            </button>
            
            {isGenerating ? (
              <button
                onClick={stopGeneration}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                <Loader2 className="animate-spin" size={20} />
                Stop Generation
              </button>
            ) : (
              <button
                onClick={() => generateAdvisory()}
                disabled={!settings.crop || !settings.region}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:shadow-none"
              >
                <Sparkles size={20} />
                Generate Advisory
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/30 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <Brain size={20} className="text-emerald-400" />
              <span className="text-gray-200 font-medium">Agricultural Advisory Response</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className={`w-2 h-2 rounded-full animate-pulse ${getProviderColor()}`}></span>
              <span className="text-gray-400">
                {getProviderLabel()}
              </span>
            </div>
          </div>

          {/* Response Area */}
          <div 
            ref={responseRef}
            className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/30"
          >
            {error && (
              <div className="max-w-3xl mx-auto mb-4">
                <div className={`bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3`}>
                  <AlertCircle className={`text-red-400 flex-shrink-0 mt-0.5`} size={20} />
                  <div className={`text-sm text-red-300`}>{error}</div>
                </div>
              </div>
            )}

            {!response && !isGenerating && !error && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <h2 className="text-4xl font-bold text-gray-200 mb-1">Saarthi 🌿</h2>
                <p className="text-gray-500 max-w-md mb-8">
                  Enter your farming parameters in the sidebar and click "Generate Advisory" 
                  to receive AI-powered agricultural recommendations.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {['Crop Management', 'Pest Control', 'Fertilizer Advice', 'Irrigation Schedule'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-full text-xs text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    Tokens: <code className="px-1.5 py-0.5 bg-gray-800/70 rounded text-gray-400">{settings.thinkingStartToken}</code> 
                    to <code className="px-1.5 py-0.5 bg-gray-800/70 rounded text-gray-400">{settings.thinkingEndToken}</code>
                  </span>
                </div>
              </div>
            )}

            {(response || isGenerating) && (
              <div className="max-w-3xl mx-auto">
                {/* User Query Summary */}
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
                    <Send size={14} />
                    Query Parameters
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {settings.month && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        📅 {settings.month}
                      </span>
                    )}
                    {settings.growthStage && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        🌱 {settings.growthStage}
                      </span>
                    )}
                    {settings.weather && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        🌤️ {settings.weather}
                      </span>
                    )}
                    {settings.soilType && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        🏔️ {settings.soilType}
                      </span>
                    )}
                    {settings.farmingPractice && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        🚜 {settings.farmingPractice}
                      </span>
                    )}
                    {settings.region && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        📍 {settings.region}
                      </span>
                    )}
                    {settings.language && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        🌐 {settings.language}
                      </span>
                    )}
                    {settings.crop && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        🌾 {settings.crop}
                      </span>
                    )}
                    {settings.stress && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        ⚠️ {settings.stress}
                      </span>
                    )}
                  </div>
                </div>

                {/* Thinking Content */}
                {(thinkingContent || displayedThinking) && (
                  <div className="mb-4">
                    <div className={`border rounded-xl overflow-hidden ${isThinking ? 'bg-amber-500/10 border-amber-500/30' : 'bg-gray-800/30 border-gray-700/50'}`}>
                      <div className={`flex items-center gap-2 px-3 py-2 border-b ${isThinking ? 'border-amber-500/20 bg-amber-500/5' : 'border-gray-700/30 bg-gray-800/20'}`}>
                        <Brain size={16} className={isThinking ? 'text-amber-400 animate-pulse' : 'text-gray-400'} />
                        <span className={`font-medium text-sm ${isThinking ? 'text-amber-400' : 'text-gray-400'}`}>
                          {isThinking ? 'Model is thinking...' : 'Reasoning Process'}
                        </span>
                        {isThinking && (
                          <div className="flex gap-1 ml-auto">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        )}
                      </div>
                      <div 
                        ref={thinkingRef}
                        className="max-h-32 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-gray-800/20"
                      >
                        <pre className={`text-xs whitespace-pre-wrap font-mono leading-relaxed ${isThinking ? 'text-amber-200/80' : 'text-gray-400'}`}>
                          {displayedThinking}
                          {isThinking && displayedThinking.length < thinkingContent.length && (
                            <span className="inline-block w-1.5 h-3 bg-amber-400 animate-pulse ml-0.5 rounded-sm"></span>
                          )}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Response Content */}
                <div className="relative">
                  {/* Audio Playback Button with ElevenLabs - Enhanced with pause/resume */}
                  {response && (
                    <div className="flex items-center justify-end mb-4">
                      <button
                        onClick={toggleAudioPlayback}
                        disabled={!response || isGenerating}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          isPlayingAudio 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                            : isPausedAudio
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
                        } ${(!response || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isPlayingAudio ? (
                          <>
                            <VolumeX size={16} />
                            <span className="text-sm">Pause Audio</span>
                          </>
                        ) : isPausedAudio ? (
                          <>
                            <Volume2 size={16} />
                            <span className="text-sm">Resume Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 size={16} />
                            <span className="text-sm">Play Audio</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                  
                  <div className="prose prose-invert prose-emerald max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-emerald-400 prose-li:text-gray-300 prose-a:text-emerald-400 prose-code:text-amber-300 prose-code:bg-gray-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800/70 prose-pre:border prose-pre:border-gray-700">
                    <ReactMarkdown>{displayedResponse}</ReactMarkdown>
                    {isGenerating && !isThinking && displayedResponse.length < response.length && (
                      <span className="inline-block w-2 h-5 bg-emerald-500 animate-pulse ml-1 rounded-sm"></span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="h-12 border-t border-gray-800 flex items-center justify-center bg-gray-900/30 backdrop-blur-xl">
            <p className="text-xs text-gray-600">
              Powered by Soket AI Labs • Audio by ElevenLabs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriAdvisoryInterface;