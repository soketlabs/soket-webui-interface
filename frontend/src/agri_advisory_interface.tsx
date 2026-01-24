/// <reference types="vite/client" />
import { AlertCircle, Brain, Calendar, ChevronDown, ChevronRight, Cloud, Layers, Leaf, Loader2, MapPin, RefreshCw, Send, Settings, Sparkles, Sprout, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { system_instructions } from './sample_input';
import companyLogo from './Soket-Logo.svg';


// API Configuration - reads from environment variables
const API_CONFIG = {
  // Saarthi Agri-Model (In-house OpenWebUI)
  saarthiApiKey: import.meta.env.VITE_SAARTHI_API_KEY || 'sk-9d09b7df9cbd5daebca67cbbb45e9f0c',
  saarthiBaseUrl: import.meta.env.VITE_SAARTHI_BASE_URL || 'https://chat.soket.ai/api/chat/completions',
  saarthiModel: 'soketlabs/saarthi-agri-v1',
  
  // Gemini API
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  geminiModel: '',
  geminiBaseUrl: '',
  
  // Lit-GPT / OpenAI-compatible API (fallback)
  litgptBaseUrl: import.meta.env.VITE_LITGPT_BASE_URL || 'http://localhost:8000',
  litgptModel: 'agri-reasoning',
};

// Default thinking token markers
const DEFAULT_THINKING_START = '<unused0>';
const DEFAULT_THINKING_END = '<unused1>';

// API providers
const apiProviders = [
  { value: 'saarthi', label: 'Saarthi Agri-Model' },
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'litgpt', label: 'Local Lit-GPT' },
];

// API Provider type
type ApiProvider = 'saarthi' | 'gemini' | 'litgpt';

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState(''); // For smooth streaming
  const [thinkingContent, setThinkingContent] = useState('');
  const [displayedThinking, setDisplayedThinking] = useState(''); // For smooth streaming
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState('');
  const [apiProvider, setApiProvider] = useState<ApiProvider>('saarthi'); // Default to Saarthi
  const responseRef = useRef(null);
  const thinkingRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Refs for smooth streaming animation
  const responseBufferRef = useRef('');
  const thinkingBufferRef = useRef('');
  const animationFrameRef = useRef<number | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

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

  const toggleSection = (section: string) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  // Build the prompt from settings
  const buildPrompt = () => {
    const parts: string[] = [];

    if (settings.month) parts.push(`Month: ${settings.month}`);
    if (settings.growthStage) parts.push(`Growth Stage: ${settings.growthStage}`);
    if (settings.weather) parts.push(`Weather: ${settings.weather}`);
    if (settings.soilType) parts.push(`Soil Type: ${settings.soilType}`);
    if (settings.farmingPractice) parts.push(`Farming Practice: ${settings.farmingPractice}`);
    if (settings.region) parts.push(`Region: ${settings.region}`);
    if (settings.language !== 'English') parts.push(`Please respond in ${settings.language}`);
    if (settings.crop) parts.push(`Crop: ${settings.crop}`);
    if (settings.stress) parts.push(`Stress: ${settings.stress}`);

    const message_content = {
        role: "user",
        content: `Please generate crop advisory using the following structured input:\n\n\t\t${parts.join('\n\t\t')}\n\nThink carefully and follow the output protocol strictly.`
    };

    console.log("message_content", message_content);
    // Spread system_instructions (which is an array) and add the user message
    return [...system_instructions, message_content];
  };

  // Validate thinking tokens in response
  const validateThinkingTokens = (fullResponse: string): { isValid: boolean; needsRetry: boolean } => {
    const hasStartToken = fullResponse.includes(settings.thinkingStartToken);
    const hasEndToken = fullResponse.includes(settings.thinkingEndToken);
    
    if (!hasStartToken && !hasEndToken) {
      // Both tokens missing - need retry
      return { isValid: false, needsRetry: true };
    }
    
    if (hasStartToken && hasEndToken) {
      // Both tokens present - valid
      return { isValid: true, needsRetry: false };
    }
    
    // Only end token present - we'll handle by adding start token at beginning
    if (!hasStartToken && hasEndToken) {
      return { isValid: false, needsRetry: false };
    }
    
    // Only start token present - treat everything after as thinking
    if (hasStartToken && !hasEndToken) {
      return { isValid: false, needsRetry: false };
    }
    
    return { isValid: true, needsRetry: false };
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
    
    // Add to full response for validation
    fullResponse += text;

    // Handle case where only end token is present (add start token at beginning)
    if (!fullResponse.includes(thinkingStartToken) && fullResponse.includes(thinkingEndToken)) {
      remaining = thinkingStartToken + remaining;
      fullResponse = thinkingStartToken + fullResponse;
    }

    while (remaining.length > 0) {
      if (inThinkingMode) {
        // In thinking mode: collect everything until end token is found
        const endIndex = remaining.indexOf(thinkingEndToken);
        if (endIndex !== -1) {
          // Found end token - add content before it to thinking buffer, then switch to display mode
          thinkingBuffer += remaining.slice(0, endIndex);
          remaining = remaining.slice(endIndex + thinkingEndToken.length);
          inThinkingMode = false;
        } else {
          // No end token yet - add all remaining content to thinking buffer
          thinkingBuffer += remaining;
          remaining = '';
        }
      } else {
        // After end token: add everything to display text
        // Check for start token if multiple thinking sections are needed
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
          // No start token - just add everything to display
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

  // Message type for API calls
  type ChatMessage = { role: string; content: string };

  // Generate using Saarthi Agri-Model (In-house OpenWebUI)
  const generateWithSaarthi = async (messages: ChatMessage[], signal: AbortSignal) => {
    const response = await fetch(API_CONFIG.saarthiBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.saarthiApiKey}`,
      },
      body: JSON.stringify({
        model: API_CONFIG.saarthiModel,
        messages: messages,
        stream: true,
        temperature: 0.8,
        top_p: 0.9,
        repetition_penalty: 1.1,
        max_tokens: 5000,
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Saarthi API error: ${response.status} - ${errorText}`);
    }

    return response;
  };

  // Generate using Gemini API with streaming
  const generateWithGemini = async (messages: ChatMessage[], signal: AbortSignal) => {
    const apiKey = API_CONFIG.geminiApiKey;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
    }

    // Convert messages to Gemini format
    const fullPrompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');

    const url = `${API_CONFIG.geminiBaseUrl}/${API_CONFIG.geminiModel}:streamGenerateContent?key=${apiKey}&alt=sse`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        }
      }),
      signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    return response;
  };

  // Generate using Lit-GPT / OpenAI-compatible API
  const generateWithLitGPT = async (messages: ChatMessage[], signal: AbortSignal) => {
    const response = await fetch(`${API_CONFIG.litgptBaseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: API_CONFIG.litgptModel,
        messages: messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  };

  // Retry generation with incremented attempt count
  const retryGeneration = async (attempt: number) => {
    if (attempt >= MAX_RETRIES) {
      setError(`Failed after ${MAX_RETRIES} attempts. Please try again with different parameters.`);
      setIsGenerating(false);
      return;
    }

    setRetryCount(attempt);
    setError(`Attempt ${attempt + 1}/${MAX_RETRIES}: Retrying with stricter thinking token enforcement...`);
    
    // Add a small delay before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Call generateAdvisory again with updated state
    await generateAdvisory(true, attempt + 1);
  };

  const generateAdvisory = async (isRetry = false, currentRetryCount = 0) => {
    if (!isRetry) {
      if (!settings.crop || !settings.region) {
        setError('Please enter at least Crop and Region to generate advisory');
        return;
      }

      setIsGenerating(true);
      setError('');
      setResponse('');
      setDisplayedResponse('');
      setThinkingContent('');
      setDisplayedThinking('');
      setIsThinking(true); // Start in thinking mode until end token is found
      setRetryCount(0);
    }

    const prompt = buildPrompt();
    console.log("prompt", prompt);
    
    // Abort any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    let state = {
      displayText: '',
      thinking: '',
      inThinkingMode: true, // Start in thinking mode until end token is found
      thinkingBuffer: '',
      fullResponse: '',
    };

    // Add token enforcement instructions for retries
    let enhancedPrompt = [...prompt];
    if (currentRetryCount > 0) {
      const tokenEnforcementMessage = {
        role: "system",
        content: `IMPORTANT: You MUST wrap your reasoning/thinking process between ${settings.thinkingStartToken} and ${settings.thinkingEndToken} tokens. The final response should come after ${settings.thinkingEndToken}.`
      };
      enhancedPrompt = [tokenEnforcementMessage, ...enhancedPrompt.slice(1)];
    }

    try {
      let res: Response;

      if (apiProvider === 'saarthi') {
        res = await generateWithSaarthi(enhancedPrompt, abortControllerRef.current.signal);
      } else if (apiProvider === 'gemini') {
        res = await generateWithGemini(enhancedPrompt, abortControllerRef.current.signal);
      } else {
        res = await generateWithLitGPT(enhancedPrompt, abortControllerRef.current.signal);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // Stream complete - validate tokens
          const validation = validateThinkingTokens(state.fullResponse);
          if (!validation.isValid && validation.needsRetry && currentRetryCount < MAX_RETRIES) {
            await retryGeneration(currentRetryCount);
            return;
          }
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              let content = '';

              if (apiProvider === 'gemini') {
                // Gemini streaming response format
                content = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
              } else {
                // OpenAI-compatible format (Saarthi & Lit-GPT)
                content = parsed.choices?.[0]?.delta?.content || '';
              }

              if (content) {
                state = processStreamChunk(
                  content, 
                  state, 
                  settings.thinkingStartToken, 
                  settings.thinkingEndToken
                );
                setResponse(state.displayText);
                setThinkingContent(state.thinking);
                setIsThinking(state.inThinkingMode);
              }
            } catch {
              // Non-JSON chunk, treat as raw text for non-SSE streams
              if (apiProvider === 'litgpt') {
                state = processStreamChunk(
                  data, 
                  state, 
                  settings.thinkingStartToken, 
                  settings.thinkingEndToken
                );
                setResponse(state.displayText);
                setThinkingContent(state.thinking);
                setIsThinking(state.inThinkingMode);
              }
            }
          }
        }
      }

      // Final validation after stream completes
      if (state.fullResponse) {
        const validation = validateThinkingTokens(state.fullResponse);
        if (!validation.isValid && validation.needsRetry && currentRetryCount < MAX_RETRIES) {
          await retryGeneration(currentRetryCount);
          return;
        }
      }

    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        setResponse((prev) => prev + '\n\n[Generation stopped]');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      if (!isRetry) {
        setIsGenerating(false);
        setIsThinking(false);
      }
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
    setResponse('');
    setDisplayedResponse('');
    setThinkingContent('');
    setDisplayedThinking('');
    setError('');
    setRetryCount(0);
  };

  // Smooth streaming animation - gradually display tokens
  useEffect(() => {
    responseBufferRef.current = response;
    thinkingBufferRef.current = thinkingContent;
    
    const animateText = () => {
      let updated = false;
      
      // Animate response text (2-3 characters at a time for smoothness)
      if (displayedResponse.length < responseBufferRef.current.length) {
        const charsToAdd = Math.min(3, responseBufferRef.current.length - displayedResponse.length);
        setDisplayedResponse(responseBufferRef.current.slice(0, displayedResponse.length + charsToAdd));
        updated = true;
      }
      
      // Animate thinking text (2-3 characters at a time)
      if (displayedThinking.length < thinkingBufferRef.current.length) {
        const charsToAdd = Math.min(3, thinkingBufferRef.current.length - displayedThinking.length);
        setDisplayedThinking(thinkingBufferRef.current.slice(0, displayedThinking.length + charsToAdd));
        updated = true;
      }
      
      if (updated) {
        animationFrameRef.current = requestAnimationFrame(animateText);
      }
    };
    
    // Start animation
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
    if (thinkingRef.current) {
      thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight;
    }
  }, [displayedThinking]);

  // Auto-scroll response
  useEffect(() => {
    if (responseRef.current) {
      (responseRef.current as HTMLElement).scrollTop = (responseRef.current as HTMLElement).scrollHeight;
    }
  }, [displayedResponse, isThinking]);

  const languages = ['', 'English', 'Hindi'];
  const seasons = ['', 'Kharif', 'Rabi', 'Zaid', 'Year-round'];
  const soilTypes = ['', 'Alluvial', 'Black/Regur', 'Red'];
  const irrigationTypes = ['', 'Drip', 'Sprinkler', 'Flood/Surface'];
  const growthStages = ['', 'Pre-sowing', 'Germination'];

  const getModelName = () => {
    switch (apiProvider) {
      case 'saarthi': return API_CONFIG.saarthiModel;
      case 'gemini': return API_CONFIG.geminiModel;
      case 'litgpt': return API_CONFIG.litgptModel;
      default: return 'Unknown';
    }
  };

  const getProviderIcon = () => {
    switch (apiProvider) {
      case 'saarthi': return '🌾';
      case 'gemini': return '✨';
      case 'litgpt': return '🔧';
      default: return '🤖';
    }
  };

  const getProviderColor = () => {
    switch (apiProvider) {
      case 'saarthi': return 'bg-orange-500';
      case 'gemini': return 'bg-blue-500';
      case 'litgpt': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getProviderLabel = () => {
    switch (apiProvider) {
      case 'saarthi': return 'Saarthi Agri-Model (chat.soket.ai)';
      case 'gemini': return 'Google Gemini 2.0 Flash';
      case 'litgpt': return 'Local Lit-GPT API';
      default: return 'Unknown Provider';
    }
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

          {/* API Provider Selection */}
          <div className="p-3 border-b border-gray-800">
            <SelectField
              label="API Provider"
              value={apiProvider}
              onChange={(v) => setApiProvider(v as ApiProvider)}
              options={apiProviders}
              icon={Zap}
            />
          </div>

          {/* Input Parameters */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
            {/* Basic Info */}
            <CollapsibleSection
              title="Basic Information"
              icon={Sprout}
              isOpen={sections.basic}
              onToggle={() => toggleSection('basic')}
            >
            <InputField
                label="Month"
                value={settings.month}
                onChange={(v) => handleInputChange('month', v)}
                placeholder="e.g.,January,February"
                icon={Calendar}
            />
            <InputField
              label="Growth Stage"
              value={settings.growthStage}
              onChange={(v) => handleInputChange('growthStage', v)}
              placeholder="e.g., Flowering, Vegetative, Fruiting"
              icon={Sprout}
            />
            <InputField
                label="Weather"
                value={settings.weather}
                onChange={(v) => handleInputChange('weather', v)}
                placeholder="e.g., Hot and dry, Cloudy with light rain"
                icon={Cloud}
              />
             <InputField
              label="Soil Type"
              value={settings.soilType}
              onChange={(v) => handleInputChange('soilType', v)}
              placeholder="e.g., Black soil, Sandy loam, Red laterite"
              icon={Layers}
            />
              <InputField
            label="Farming Practice"
            value={settings.farmingPractice}
            onChange={(v) => handleInputChange('farmingPractice', v)}
            placeholder="e.g., Drip irrigation, Organic farming"
            icon={Settings}
            />
            </CollapsibleSection>
            {/* Soil Information */}
            <CollapsibleSection
              title="Soil Information"
              icon={Layers}
              isOpen={sections.soil}
              onToggle={() => toggleSection('soil')}
            >
            <InputField
                label="Region *"
                value={settings.region}
                onChange={(v) => handleInputChange('region', v)}
                placeholder="e.g., Punjab, Maharashtra"
                icon={MapPin}
              />
            <SelectField
                label="Language"
                value={settings.language}
                onChange={(v) => handleInputChange('language', v)}
                options={['', ...languages]}
              />

            <InputField
                label="Crop *"
                value={settings.crop}
                onChange={(v) => handleInputChange('crop', v)}
                placeholder="e.g., Cotton, Wheat, Rice"
                icon={Leaf}
              />
            </CollapsibleSection>

            {/* Advanced Settings */}
            <CollapsibleSection
              title="Advanced Settings"
              icon={Settings}
              isOpen={sections.advanced}
              onToggle={() => toggleSection('advanced')}
            >
              <InputField
                label="Stress"
                value={settings.stress}
                onChange={(v) => handleInputChange('stress', v)}
                placeholder="e.g., Pests, Diseases, Weather"
                icon={AlertCircle}
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
                {retryCount > 0 && <span className="text-amber-400"> (Attempt {retryCount + 1}/{MAX_RETRIES})</span>}
              </span>
            </div>
          </div>

          {/* Response Area */}
          <div 
            ref={responseRef}
            className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700"
          >
            {error && (
              <div className="max-w-3xl mx-auto mb-4">
                <div className={`bg-${error.includes('Attempt') ? 'amber' : 'red'}-500/10 border border-${error.includes('Attempt') ? 'amber' : 'red'}-500/30 rounded-xl p-4 flex items-start gap-3`}>
                  <AlertCircle className={`text-${error.includes('Attempt') ? 'amber' : 'red'}-400 flex-shrink-0 mt-0.5`} size={20} />
                  <div className={`text-sm text-${error.includes('Attempt') ? 'amber' : 'red'}-300`}>{error}</div>
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
                    {settings.crop && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        🌾 {settings.crop}
                      </span>
                    )}
                    {settings.region && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        📍 {settings.region}
                      </span>
                    )}
                    {settings.weather && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        🌤️ {settings.weather}
                      </span>
                    )}

                    {settings.month && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        📅 {settings.month}
                      </span>
                    )}
                    {settings.soilType && (
                      <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                        🏔️ {settings.soilType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Thinking Content - Always visible in small scrollable window */}
                {(thinkingContent || displayedThinking) && (
                  <div className="mb-4">
                    <div className={`border rounded-xl overflow-hidden ${isThinking ? 'bg-amber-500/10 border-amber-500/30' : 'bg-gray-800/30 border-gray-700/50'}`}>
                      {/* Header */}
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
                      {/* Thinking Content - Small scrollable window with auto-scroll */}
                      <div 
                        ref={thinkingRef}
                        className="max-h-32 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent"
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

                {/* Response Content - Rendered as Markdown */}
                <div className="prose prose-invert prose-emerald max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-emerald-400 prose-li:text-gray-300 prose-a:text-emerald-400 prose-code:text-amber-300 prose-code:bg-gray-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800/70 prose-pre:border prose-pre:border-gray-700">
                  <ReactMarkdown>{displayedResponse}</ReactMarkdown>
                  {isGenerating && !isThinking && displayedResponse.length < response.length && (
                    <span className="inline-block w-2 h-5 bg-emerald-500 animate-pulse ml-1 rounded-sm"></span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="h-12 border-t border-gray-800 flex items-center justify-center bg-gray-900/30 backdrop-blur-xl">
            <p className="text-xs text-gray-600">
              Powered by Soket AI Labs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriAdvisoryInterface;













// /// <reference types="vite/client" />
// import { AlertCircle, Brain, Calendar, ChevronDown, ChevronRight, Cloud, Layers, Leaf, Loader2, MapPin, RefreshCw, Send, Settings, Sparkles, Sprout, Zap } from 'lucide-react';
// import React, { useEffect, useRef, useState } from 'react';
// import ReactMarkdown from 'react-markdown';
// import { system_instructions } from './sample_input';
// import companyLogo from './Soket-Logo.svg';

// // API Configuration - reads from environment variables
// const API_CONFIG = {
//   // Saarthi Agri-Model (In-house OpenWebUI)
//   saarthiApiKey: import.meta.env.VITE_SAARTHI_API_KEY || 'sk-9d09b7df9cbd5daebca67cbbb45e9f0c',
//   saarthiBaseUrl: import.meta.env.VITE_SAARTHI_BASE_URL || 'https://chat.soket.ai/api/chat/completions',
//   saarthiModel: 'soketlabs/saarthi-agri-v1',
  
//   // Gemini API
//   geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
//   geminiModel: 'gemini-2.0-flash',
//   geminiBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
  
//   // Lit-GPT / OpenAI-compatible API (fallback)
//   litgptBaseUrl: import.meta.env.VITE_LITGPT_BASE_URL || 'http://localhost:8000',
//   litgptModel: 'agri-reasoning',
// };

// // Default thinking token markers
// const DEFAULT_THINKING_START = '<unused0>';
// const DEFAULT_THINKING_END = '<unused1>';

// // API providers
// const apiProviders = [
//   { value: 'saarthi', label: 'Saarthi Agri-Model' },
//   { value: 'gemini', label: 'Google Gemini' },
//   { value: 'litgpt', label: 'Local Lit-GPT' },
// ];

// // API Provider type
// type ApiProvider = 'saarthi' | 'gemini' | 'litgpt';

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
//   const [displayedResponse, setDisplayedResponse] = useState(''); // For smooth streaming
//   const [thinkingContent, setThinkingContent] = useState('');
//   const [displayedThinking, setDisplayedThinking] = useState(''); // For smooth streaming
//   const [isThinking, setIsThinking] = useState(false);
//   const [error, setError] = useState('');
//   const [apiProvider, setApiProvider] = useState<ApiProvider>('saarthi'); // Default to Saarthi
//   const responseRef = useRef(null);
//   const thinkingRef = useRef<HTMLDivElement>(null);
//   const abortControllerRef = useRef<AbortController | null>(null);
  
//   // Refs for smooth streaming animation
//   const responseBufferRef = useRef('');
//   const thinkingBufferRef = useRef('');
//   const animationFrameRef = useRef<number | null>(null);
//   const [retryCount, setRetryCount] = useState(0);
//   const MAX_RETRIES = 3;

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

//   const toggleSection = (section: string) => {
//     setSections((prev) => ({ ...prev, [section]: !prev[section] }));
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setSettings((prev) => ({ ...prev, [field]: value }));
//   };

//   // Build the prompt from settings
//   const buildPrompt = () => {
//     const parts: string[] = [];

//     if (settings.month) parts.push(`Month: ${settings.month}`);
//     if (settings.growthStage) parts.push(`Growth Stage: ${settings.growthStage}`);
//     if (settings.weather) parts.push(`Weather: ${settings.weather}`);
//     if (settings.soilType) parts.push(`Soil Type: ${settings.soilType}`);
//     if (settings.farmingPractice) parts.push(`Farming Practice: ${settings.farmingPractice}`);
//     if (settings.region) parts.push(`Region: ${settings.region}`);
//     if (settings.language !== 'English') parts.push(`Please respond in ${settings.language}`);
//     if (settings.crop) parts.push(`Crop: ${settings.crop}`);
//     if (settings.stress) parts.push(`Stress: ${settings.stress}`);

//     const message_content = {
//         role: "user",
//         content: `Please generate crop advisory using the following structured input:\n\n\t\t${parts.join('\n\t\t')}\n\nThink carefully and follow the output protocol strictly.`
//     };

//     console.log("message_content", message_content);
//     // Spread system_instructions (which is an array) and add the user message
//     return [...system_instructions, message_content];
//   };

//   // Validate thinking tokens in response
//   const validateThinkingTokens = (fullResponse: string): { isValid: boolean; needsRetry: boolean } => {
//     const hasStartToken = fullResponse.includes(settings.thinkingStartToken);
//     const hasEndToken = fullResponse.includes(settings.thinkingEndToken);
    
//     if (!hasStartToken && !hasEndToken) {
//       // Both tokens missing - need retry
//       return { isValid: false, needsRetry: true };
//     }
    
//     if (hasStartToken && hasEndToken) {
//       // Both tokens present - valid
//       return { isValid: true, needsRetry: false };
//     }
    
//     // Only end token present - we'll handle by adding start token at beginning
//     if (!hasStartToken && hasEndToken) {
//       return { isValid: false, needsRetry: false };
//     }
    
//     // Only start token present - treat everything after as thinking
//     if (hasStartToken && !hasEndToken) {
//       return { isValid: false, needsRetry: false };
//     }
    
//     return { isValid: true, needsRetry: false };
//   };

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
    
//     // Add to full response for validation
//     fullResponse += text;

//     // Handle case where only end token is present (add start token at beginning)
//     if (!fullResponse.includes(thinkingStartToken) && fullResponse.includes(thinkingEndToken)) {
//       remaining = thinkingStartToken + remaining;
//       fullResponse = thinkingStartToken + fullResponse;
//     }

//     while (remaining.length > 0) {
//       if (inThinkingMode) {
//         // In thinking mode: collect everything until end token is found
//         const endIndex = remaining.indexOf(thinkingEndToken);
//         if (endIndex !== -1) {
//           // Found end token - add content before it to thinking buffer, then switch to display mode
//           thinkingBuffer += remaining.slice(0, endIndex);
//           remaining = remaining.slice(endIndex + thinkingEndToken.length);
//           inThinkingMode = false;
//         } else {
//           // No end token yet - add all remaining content to thinking buffer
//           thinkingBuffer += remaining;
//           remaining = '';
//         }
//       } else {
//         // After end token: add everything to display text
//         // Check for start token if multiple thinking sections are needed
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
//           // No start token - just add everything to display
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

//   // Message type for API calls
//   type ChatMessage = { role: string; content: string };

//   // Generate using Saarthi Agri-Model (In-house OpenWebUI)
//   const generateWithSaarthi = async (messages: ChatMessage[], signal: AbortSignal) => {
//     const response = await fetch(API_CONFIG.saarthiBaseUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${API_CONFIG.saarthiApiKey}`,
//       },
//       body: JSON.stringify({
//         model: API_CONFIG.saarthiModel,
//         messages: messages,
//         stream: true,
//         temperature: 0.8,
//         top_p: 0.9,
//         repetition_penalty: 1.1,
//         max_tokens: 5000,
//       }),
//       signal,
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Saarthi API error: ${response.status} - ${errorText}`);
//     }

//     return response;
//   };

//   // Generate using Gemini API with streaming
//   const generateWithGemini = async (messages: ChatMessage[], signal: AbortSignal) => {
//     const apiKey = API_CONFIG.geminiApiKey;
    
//     if (!apiKey) {
//       throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
//     }

//     // Convert messages to Gemini format
//     const fullPrompt = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');

//     const url = `${API_CONFIG.geminiBaseUrl}/${API_CONFIG.geminiModel}:streamGenerateContent?key=${apiKey}&alt=sse`;

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [{ text: fullPrompt }]
//           }
//         ],
//         generationConfig: {
//           temperature: 0.7,
//           maxOutputTokens: 4096,
//         }
//       }),
//       signal,
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
//     }

//     return response;
//   };

//   // Generate using Lit-GPT / OpenAI-compatible API
//   const generateWithLitGPT = async (messages: ChatMessage[], signal: AbortSignal) => {
//     const response = await fetch(`${API_CONFIG.litgptBaseUrl}/v1/chat/completions`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         model: API_CONFIG.litgptModel,
//         messages: messages,
//         stream: true,
//         temperature: 0.7,
//         max_tokens: 2048,
//       }),
//       signal,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return response;
//   };

//   // Initialize retry state properly
//   const initializeRetryState = () => {
//     // Reset response content
//     setResponse('');
//     setDisplayedResponse('');
//     setThinkingContent('');
//     setDisplayedThinking('');
//     setIsThinking(true); // Start in thinking mode
    
//     // Clear buffers
//     responseBufferRef.current = '';
//     thinkingBufferRef.current = '';
//   };

//   // Retry generation with incremented attempt count
//   const retryGeneration = async (attempt: number) => {
//     if (attempt >= MAX_RETRIES) {
//       setError(`Failed after ${MAX_RETRIES} attempts. Please try again with different parameters.`);
//       setIsGenerating(false);
//       setIsThinking(false);
//       return;
//     }

//     setRetryCount(attempt);
//     setError(`Attempt ${attempt + 1}/${MAX_RETRIES}: Retrying with stricter thinking token enforcement...`);
    
//     // Reset thinking content properly
//     initializeRetryState();
    
//     // Add a small delay before retrying
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     // Call generateAdvisory again with updated state
//     await generateAdvisory(true, attempt + 1);
//   };

//   const generateAdvisory = async (isRetry = false, currentRetryCount = 0) => {
//     if (!isRetry) {
//       if (!settings.crop || !settings.region) {
//         setError('Please enter at least Crop and Region to generate advisory');
//         return;
//       }

//       setIsGenerating(true);
//       setError('');
//       setResponse('');
//       setDisplayedResponse('');
//       setThinkingContent('');
//       setDisplayedThinking('');
//       setIsThinking(true); // Start in thinking mode until end token is found
//       setRetryCount(0);
      
//       // Initialize buffers
//       responseBufferRef.current = '';
//       thinkingBufferRef.current = '';
//     } else {
//       // For retry, ensure states are properly reset
//       setIsThinking(true);
//     }

//     const prompt = buildPrompt();
//     console.log("prompt", prompt);
    
//     // Abort any previous request
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
//     abortControllerRef.current = new AbortController();

//     let state = {
//       displayText: '',
//       thinking: '',
//       inThinkingMode: true, // Start in thinking mode until end token is found
//       thinkingBuffer: '',
//       fullResponse: '',
//     };

//     // Add token enforcement instructions for retries
//     let enhancedPrompt = [...prompt];
//     if (currentRetryCount > 0) {
//       const tokenEnforcementMessage = {
//         role: "system",
//         content: `IMPORTANT: You MUST wrap your reasoning/thinking process between ${settings.thinkingStartToken} and ${settings.thinkingEndToken} tokens. The final response should come after ${settings.thinkingEndToken}. DO NOT include these tokens in your final response text.`
//       };
//       enhancedPrompt = [tokenEnforcementMessage, ...enhancedPrompt.slice(1)];
//     }

//     try {
//       let res: Response;

//       if (apiProvider === 'saarthi') {
//         res = await generateWithSaarthi(enhancedPrompt, abortControllerRef.current.signal);
//       } else if (apiProvider === 'gemini') {
//         res = await generateWithGemini(enhancedPrompt, abortControllerRef.current.signal);
//       } else {
//         res = await generateWithLitGPT(enhancedPrompt, abortControllerRef.current.signal);
//       }

//       const reader = res.body?.getReader();
//       if (!reader) {
//         throw new Error('No response body');
//       }

//       const decoder = new TextDecoder();

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) {
//           // Stream complete - validate tokens
//           const validation = validateThinkingTokens(state.fullResponse);
//           if (!validation.isValid && validation.needsRetry && currentRetryCount < MAX_RETRIES) {
//             await retryGeneration(currentRetryCount);
//             return;
//           }
//           break;
//         }

//         const chunk = decoder.decode(value);
//         const lines = chunk.split('\n').filter((line) => line.trim() !== '');

//         for (const line of lines) {
//           if (line.startsWith('data: ')) {
//             const data = line.slice(6);
//             if (data === '[DONE]') continue;

//             try {
//               const parsed = JSON.parse(data);
//               let content = '';

//               if (apiProvider === 'gemini') {
//                 // Gemini streaming response format
//                 content = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
//               } else {
//                 // OpenAI-compatible format (Saarthi & Lit-GPT)
//                 content = parsed.choices?.[0]?.delta?.content || '';
//               }

//               if (content) {
//                 state = processStreamChunk(
//                   content, 
//                   state, 
//                   settings.thinkingStartToken, 
//                   settings.thinkingEndToken
//                 );
                
//                 // Update states - IMPORTANT: For retries, we need to update these
//                 setResponse(prev => prev + state.displayText);
//                 setThinkingContent(state.thinking);
//                 setIsThinking(state.inThinkingMode);
                
//                 // Update buffers for smooth animation
//                 responseBufferRef.current += state.displayText;
//                 thinkingBufferRef.current = state.thinking;
//               }
//             } catch {
//               // Non-JSON chunk, treat as raw text for non-SSE streams
//               if (apiProvider === 'litgpt') {
//                 state = processStreamChunk(
//                   data, 
//                   state, 
//                   settings.thinkingStartToken, 
//                   settings.thinkingEndToken
//                 );
//                 setResponse(prev => prev + state.displayText);
//                 setThinkingContent(state.thinking);
//                 setIsThinking(state.inThinkingMode);
                
//                 // Update buffers for smooth animation
//                 responseBufferRef.current += state.displayText;
//                 thinkingBufferRef.current = state.thinking;
//               }
//             }
//           }
//         }
//       }

//       // Final validation after stream completes
//       if (state.fullResponse) {
//         const validation = validateThinkingTokens(state.fullResponse);
//         if (!validation.isValid && validation.needsRetry && currentRetryCount < MAX_RETRIES) {
//           await retryGeneration(currentRetryCount);
//           return;
//         }
//       }

//     } catch (err: unknown) {
//       const error = err as Error;
//       if (error.name === 'AbortError') {
//         setResponse((prev) => prev + '\n\n[Generation stopped]');
//       } else {
//         setError(`Error: ${error.message}`);
//       }
//     } finally {
//       if (!isRetry) {
//         setIsGenerating(false);
//         setIsThinking(false);
//       }
//     }
//   };

//   const stopGeneration = () => {
//     if (abortControllerRef.current) {
//       abortControllerRef.current.abort();
//     }
//     setIsGenerating(false);
//     setIsThinking(false);
//   };

//   const clearConversation = () => {
//     setResponse('');
//     setDisplayedResponse('');
//     setThinkingContent('');
//     setDisplayedThinking('');
//     setError('');
//     setRetryCount(0);
//   };

//   // Smooth streaming animation - gradually display tokens
//   useEffect(() => {
//     responseBufferRef.current = response;
//     thinkingBufferRef.current = thinkingContent;
    
//     const animateText = () => {
//       let updated = false;
      
//       // Animate response text (2-3 characters at a time for smoothness)
//       if (displayedResponse.length < responseBufferRef.current.length) {
//         const charsToAdd = Math.min(3, responseBufferRef.current.length - displayedResponse.length);
//         setDisplayedResponse(responseBufferRef.current.slice(0, displayedResponse.length + charsToAdd));
//         updated = true;
//       }
      
//       // Animate thinking text (2-3 characters at a time)
//       if (displayedThinking.length < thinkingBufferRef.current.length) {
//         const charsToAdd = Math.min(3, thinkingBufferRef.current.length - displayedThinking.length);
//         setDisplayedThinking(thinkingBufferRef.current.slice(0, displayedThinking.length + charsToAdd));
//         updated = true;
//       }
      
//       if (updated) {
//         animationFrameRef.current = requestAnimationFrame(animateText);
//       }
//     };
    
//     // Start animation
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
//     if (thinkingRef.current) {
//       thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight;
//     }
//   }, [displayedThinking]);

//   // Auto-scroll response
//   useEffect(() => {
//     if (responseRef.current) {
//       (responseRef.current as HTMLElement).scrollTop = (responseRef.current as HTMLElement).scrollHeight;
//     }
//   }, [displayedResponse, isThinking]);

//   const languages = ['', 'English', 'Hindi'];
//   const seasons = ['', 'Kharif', 'Rabi', 'Zaid', 'Year-round'];
//   const soilTypes = ['', 'Alluvial', 'Black/Regur', 'Red'];
//   const irrigationTypes = ['', 'Drip', 'Sprinkler', 'Flood/Surface'];
//   const growthStages = ['', 'Pre-sowing', 'Germination'];

//   const getModelName = () => {
//     switch (apiProvider) {
//       case 'saarthi': return API_CONFIG.saarthiModel;
//       case 'gemini': return API_CONFIG.geminiModel;
//       case 'litgpt': return API_CONFIG.litgptModel;
//       default: return 'Unknown';
//     }
//   };

//   const getProviderIcon = () => {
//     switch (apiProvider) {
//       case 'saarthi': return '🌾';
//       case 'gemini': return '✨';
//       case 'litgpt': return '🔧';
//       default: return '🤖';
//     }
//   };

//   const getProviderColor = () => {
//     switch (apiProvider) {
//       case 'saarthi': return 'bg-orange-500';
//       case 'gemini': return 'bg-blue-500';
//       case 'litgpt': return 'bg-emerald-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   const getProviderLabel = () => {
//     switch (apiProvider) {
//       case 'saarthi': return 'Saarthi Agri-Model (chat.soket.ai)';
//       case 'gemini': return 'Google Gemini 2.0 Flash';
//       case 'litgpt': return 'Local Lit-GPT API';
//       default: return 'Unknown Provider';
//     }
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

//           {/* API Provider Selection */}
//           <div className="p-3 border-b border-gray-800">
//             <SelectField
//               label="API Provider"
//               value={apiProvider}
//               onChange={(v) => setApiProvider(v as ApiProvider)}
//               options={apiProviders}
//               icon={Zap}
//             />
//           </div>

//           {/* Input Parameters */}
//           <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
//             {/* Basic Info */}
//             <CollapsibleSection
//               title="Basic Information"
//               icon={Sprout}
//               isOpen={sections.basic}
//               onToggle={() => toggleSection('basic')}
//             >
//             <InputField
//                 label="Month"
//                 value={settings.month}
//                 onChange={(v) => handleInputChange('month', v)}
//                 placeholder="e.g.,January,February"
//                 icon={Calendar}
//             />
//             <InputField
//               label="Growth Stage"
//               value={settings.growthStage}
//               onChange={(v) => handleInputChange('growthStage', v)}
//               placeholder="e.g., Flowering, Vegetative, Fruiting"
//               icon={Sprout}
//             />
//             <InputField
//                 label="Weather"
//                 value={settings.weather}
//                 onChange={(v) => handleInputChange('weather', v)}
//                 placeholder="e.g., Hot and dry, Cloudy with light rain"
//                 icon={Cloud}
//               />
//              <InputField
//               label="Soil Type"
//               value={settings.soilType}
//               onChange={(v) => handleInputChange('soilType', v)}
//               placeholder="e.g., Black soil, Sandy loam, Red laterite"
//               icon={Layers}
//             />
//               <InputField
//             label="Farming Practice"
//             value={settings.farmingPractice}
//             onChange={(v) => handleInputChange('farmingPractice', v)}
//             placeholder="e.g., Drip irrigation, Organic farming"
//             icon={Settings}
//             />
//             </CollapsibleSection>
//             {/* Soil Information */}
//             <CollapsibleSection
//               title="Soil Information"
//               icon={Layers}
//               isOpen={sections.soil}
//               onToggle={() => toggleSection('soil')}
//             >
//             <InputField
//                 label="Region *"
//                 value={settings.region}
//                 onChange={(v) => handleInputChange('region', v)}
//                 placeholder="e.g., Punjab, Maharashtra"
//                 icon={MapPin}
//               />
//             <SelectField
//                 label="Language"
//                 value={settings.language}
//                 onChange={(v) => handleInputChange('language', v)}
//                 options={['', ...languages]}
//               />

//             <InputField
//                 label="Crop *"
//                 value={settings.crop}
//                 onChange={(v) => handleInputChange('crop', v)}
//                 placeholder="e.g., Cotton, Wheat, Rice"
//                 icon={Leaf}
//               />
//             </CollapsibleSection>

//             {/* Advanced Settings */}
//             <CollapsibleSection
//               title="Advanced Settings"
//               icon={Settings}
//               isOpen={sections.advanced}
//               onToggle={() => toggleSection('advanced')}
//             >
//               <InputField
//                 label="Stress"
//                 value={settings.stress}
//                 onChange={(v) => handleInputChange('stress', v)}
//                 placeholder="e.g., Pests, Diseases, Weather"
//                 icon={AlertCircle}
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
//                 {retryCount > 0 && <span className="text-amber-400"> (Attempt {retryCount + 1}/{MAX_RETRIES})</span>}
//               </span>
//             </div>
//           </div>

//           {/* Response Area */}
//           <div 
//             ref={responseRef}
//             className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700"
//           >
//             {error && (
//               <div className="max-w-3xl mx-auto mb-4">
//                 <div className={`bg-${error.includes('Attempt') ? 'amber' : 'red'}-500/10 border border-${error.includes('Attempt') ? 'amber' : 'red'}-500/30 rounded-xl p-4 flex items-start gap-3`}>
//                   <AlertCircle className={`text-${error.includes('Attempt') ? 'amber' : 'red'}-400 flex-shrink-0 mt-0.5`} size={20} />
//                   <div className={`text-sm text-${error.includes('Attempt') ? 'amber' : 'red'}-300`}>{error}</div>
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
//                     {settings.crop && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         🌾 {settings.crop}
//                       </span>
//                     )}
//                     {settings.region && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         📍 {settings.region}
//                       </span>
//                     )}
//                     {settings.weather && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         🌤️ {settings.weather}
//                       </span>
//                     )}

//                     {settings.month && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         📅 {settings.month}
//                       </span>
//                     )}
//                     {settings.soilType && (
//                       <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
//                         🏔️ {settings.soilType}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Thinking Content - Always visible in small scrollable window */}
//                 {(thinkingContent || displayedThinking || isGenerating) && (
//                   <div className="mb-4">
//                     <div className={`border rounded-xl overflow-hidden ${isThinking ? 'bg-amber-500/10 border-amber-500/30' : 'bg-gray-800/30 border-gray-700/50'}`}>
//                       {/* Header */}
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
//                       {/* Thinking Content - Small scrollable window with auto-scroll */}
//                       <div 
//                         ref={thinkingRef}
//                         className="max-h-32 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent"
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

//                 {/* Response Content - Rendered as Markdown */}
//                 <div className="prose prose-invert prose-emerald max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-emerald-400 prose-li:text-gray-300 prose-a:text-emerald-400 prose-code:text-amber-300 prose-code:bg-gray-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800/70 prose-pre:border prose-pre:border-gray-700">
//                   <ReactMarkdown>{displayedResponse}</ReactMarkdown>
//                   {isGenerating && !isThinking && displayedResponse.length < response.length && (
//                     <span className="inline-block w-2 h-5 bg-emerald-500 animate-pulse ml-1 rounded-sm"></span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="h-12 border-t border-gray-800 flex items-center justify-center bg-gray-900/30 backdrop-blur-xl">
//             <p className="text-xs text-gray-600">
//               Powered by Soket AI Labs
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AgriAdvisoryInterface;

