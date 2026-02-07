
// new version with pause working

/// <reference types="vite/client" />
import { AlertCircle, Brain, Calendar, ChevronDown, ChevronRight, Cloud, Layers, Leaf, Loader2, MapPin, RefreshCw, Send, Settings, Sparkles, Sprout, Volume2, VolumeX, Zap } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import companyLogo from './Soket-Logo.svg';

// API Configuration
const API_CONFIG = {
  // Saarthi Agri-Model (In-house OpenWebUI)
  saarthiApiKey: import.meta.env.VITE_SAARTHI_API_KEY || 'sk-9d09b7df9cbd5daebca67cbbb45e9f0c',
  saarthiBaseUrl: import.meta.env.VITE_SAARTHI_BASE_URL || 'http://localhost:8000/v1/chat/completions',
  saarthiModel: 'soketlabs/saarthi-agri-v1',
  
  // ElevenLabs API
  elevenlabsApiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || 'sk_ca696bb73eac6ab599a26604e8b4f9946f2e49dc2d30361f',
  elevenlabsVoiceId: 'XrExE9yKIg1WjnnlVkGX', // Adam voice - you can change this
};

// Default thinking token markers
const DEFAULT_THINKING_START = '<unused0>';
const DEFAULT_THINKING_END = '<unused1>';

// API providers - only Saarthi
const apiProviders = [
  { value: 'saarthi', label: 'Saarthi Agri-Model' },
];

// API Provider type - only Saarthi
type ApiProvider = 'saarthi';

// Hindi to English mapping for UI display
const HINDI_TO_ENGLISH_MAP = {
  // Months
  'January': 'January',
  'February': 'February', 
  'March': 'March',
  'April': 'April',
  'May': 'May',
  'June': 'June',
  'July': 'July',
  'August': 'August',
  'September': 'September',
  'October': 'October',
  'November': 'November',
  'December': 'December',
  
  // Growth Stages
  'फूल आना': 'Flowering',
  'बाल निकलना': 'Tillering',
  'पुष्पन': 'Bloom',
  'पकना': 'Ripening',
  'दूधिया अवस्था': 'Milky Stage',
  'कटाई तैयार': 'Harvest Ready',
  
  // Weather
  'गरम और आर्द्र मौसम': 'Hot and Humid Weather',
  'ठंडी रात और हल्की नमी': 'Cool Nights with Light Moisture',
  'सुबह ठंड और धूप': 'Cool Mornings with Sunshine',
  'तेज धूप और गर्मी': 'Intense Sun and Heat',
  'बादल छाए रहना': 'Cloudy Conditions',
  'ठंड और सूखा': 'Cold and Dry',
  
  // Soil Types
  'काली मिट्टी': 'Black Soil',
  'दोमट मिट्टी': 'Loamy Soil',
  'बलुई दोमट मिट्टी': 'Sandy Loam Soil',
  'लाल मिट्टी': 'Red Soil',
  'कंकरीली मिट्टी': 'Gravelly Soil',
  'पथरीली मिट्टी': 'Rocky Soil',
  
  // Farming Practices
  'सामान्य खेती': 'Conventional Farming',
  'जैविक खेती': 'Organic Farming',
  'समेकित कृषि': 'Integrated Farming',
  'बारानी खेती': 'Rainfed Farming',
  'संरक्षण कृषि': 'Conservation Agriculture',
  
  // Regions
  'महाराष्ट्र': 'Maharashtra',
  'उत्तर प्रदेश': 'Uttar Pradesh',
  'मध्य प्रदेश': 'Madhya Pradesh',
  'छत्तीसगढ़': 'Chhattisgarh',
  'हिमाचल प्रदेश': 'Himachal Pradesh',
  
  // Crops
  'कपास': 'Cotton',
  'गेहूं': 'Wheat',
  'चना': 'Chickpea',
  'धान (नर्सरी)': 'Paddy (Nursery)',
  'सोयाबीन': 'Soybean',
  
  // Stress Factors
  'सफेद मक्खी': 'Whitefly',
  'पीला रतुआ रोग': 'Yellow Rust Disease',
  'कीट संक्रमण': 'Insect Infestation',
  'खैरा रोग': 'Khaira Disease',
  'पीला मोज़ेक वायरस': 'Yellow Mosaic Virus',
  'पाउडरी मिल्ड्यू': 'Powdery Mildew'
};

// Reverse mapping for lookup
const ENGLISH_TO_HINDI_MAP = Object.entries(HINDI_TO_ENGLISH_MAP).reduce((acc, [hindi, english]) => {
  acc[english as string] = hindi;
  return acc;
}, {} as Record<string, string>);

// Dropdown options for UI (English display)
const DROPDOWN_OPTIONS_UI = {
  month: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  growthStage: [
    'Flowering',
    'Tillering', 
    'Bloom',
    'Ripening',
    'Milky Stage',
    'Harvest Ready'
  ],
  weather: [
    'Hot and Humid Weather',
    'Cool Nights with Light Moisture',
    'Cool Mornings with Sunshine',
    'Intense Sun and Heat',
    'Cloudy Conditions',
    'Cold and Dry'
  ],
  soilType: [
    'Black Soil',
    'Loamy Soil',
    'Sandy Loam Soil',
    'Red Soil',
    'Gravelly Soil',
    'Rocky Soil'
  ],
  farmingPractice: [
    'Conventional Farming',
    'Organic Farming',
    'Integrated Farming',
    'Rainfed Farming',
    'Conservation Agriculture'
  ],
  region: [
    'Maharashtra',
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Chhattisgarh',
    'Himachal Pradesh'
  ],
  language: [
    'Hindi',
  ],
  crop: [
    'Cotton',
    'Wheat',
    'Chickpea',
    'Paddy (Nursery)',
    'Soybean'
  ],
  stress: [
    'Whitefly',
    'Yellow Rust Disease',
    'Insect Infestation',
    'Khaira Disease',
    'Yellow Mosaic Virus',
    'Powdery Mildew'
  ]
};

// Dropdown options for backend (Hindi)
const DROPDOWN_OPTIONS_BACKEND = {
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
    'संरक्षण कृषि'
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

  // State for reasoning section expandability
  const [reasoningExpanded, setReasoningExpanded] = useState(false);

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
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  
  const responseContainerRef = useRef<HTMLDivElement>(null);
  const responseContentRef = useRef<HTMLDivElement>(null);
  const thinkingRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Enhanced audio playback system for continuous streaming with pause/resume support
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const isPlayingRef = useRef(false);
  const audioQueueRef = useRef<Array<{ text: string; buffer?: AudioBuffer }>>([]);
  const isProcessingAudioRef = useRef(false);
  const isFetchingAudioRef = useRef(false);
  const currentTextChunkRef = useRef('');
  const wordCountRef = useRef(0);
  const MIN_WORDS_FOR_AUDIO = 30;
  const hasAudioStartedRef = useRef(false);
  const scheduledSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  
  // FIXED: Better pause/resume tracking with proper state management
  const pausedAtTimeRef = useRef<number>(0);
  const currentChunkIndexRef = useRef<number>(-1);
  const allProcessedChunksRef = useRef<Array<{ text: string; buffer?: AudioBuffer }>>([]);
  const chunkStartTimeRef = useRef<number>(0); // Track when current chunk started playing
  
  // Refs for smooth streaming animation
  const responseBufferRef = useRef('');
  const thinkingBufferRef = useRef('');
  const animationFrameRef = useRef<number | null>(null);

  // Store both UI (English) and backend (Hindi) values
  const [uiSettings, setUiSettings] = useState({
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

  // Convert UI English value to Hindi for backend
  const convertToHindiForBackend = (englishValue: string, field: string): string => {
    if (!englishValue) return '';
    
    if (field === 'month') {
      return englishValue;
    }
    
    const hindiValue = ENGLISH_TO_HINDI_MAP[englishValue];
    return hindiValue || englishValue;
  };

  // Get backend settings (Hindi values)
  const getBackendSettings = () => {
    return {
      month: uiSettings.month,
      growthStage: convertToHindiForBackend(uiSettings.growthStage, 'growthStage'),
      weather: convertToHindiForBackend(uiSettings.weather, 'weather'),
      soilType: convertToHindiForBackend(uiSettings.soilType, 'soilType'),
      farmingPractice: convertToHindiForBackend(uiSettings.farmingPractice, 'farmingPractice'),
      region: convertToHindiForBackend(uiSettings.region, 'region'),
      language: uiSettings.language,
      crop: convertToHindiForBackend(uiSettings.crop, 'crop'),
      stress: convertToHindiForBackend(uiSettings.stress, 'stress'),
      thinkingStartToken: uiSettings.thinkingStartToken,
      thinkingEndToken: uiSettings.thinkingEndToken,
    };
  };

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      return () => {
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
    }
  }, []);

  // Clean text for speech - enhanced for better sentence detection
  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/#+\s*/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/\n{3,}/g, ' ')
      .replace(/\n/g, ' ')
      .trim();
  };

  // Split text into sentences for more natural chunking
  const splitIntoSentences = (text: string): string[] => {
    const cleaned = cleanTextForSpeech(text);
    // Split by sentence endings, keeping the punctuation
    const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
  };

  // Fetch audio from ElevenLabs with retry logic
  const fetchAudio = async (text: string, retries = 2): Promise<AudioBuffer | null> => {
    if (!audioContextRef.current || !text.trim()) return null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${API_CONFIG.elevenlabsVoiceId}`,
          {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': API_CONFIG.elevenlabsApiKey,
            },
            body: JSON.stringify({
              text: text,
              model_id: 'eleven_turbo_v2_5',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.0,
                use_speaker_boost: true
              },
              optimize_streaming_latency: 4,
            }),
          }
        );

        if (!response.ok) {
          if (attempt < retries) {
            console.warn(`Audio fetch attempt ${attempt + 1} failed, retrying...`);
            await new Promise(resolve => setTimeout(resolve, 500));
            continue;
          }
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        
        console.log(`✓ Audio fetched successfully (${text.substring(0, 50)}...)`);
        return audioBuffer;
      } catch (error) {
        if (attempt === retries) {
          console.error('Error fetching audio after retries:', error);
          return null;
        }
      }
    }
    return null;
  };

  // Pre-fetch next audio chunk while current is playing
  const preFetchNextChunk = async () => {
    if (isFetchingAudioRef.current || !isPlayingRef.current) return;
    
    // Find next chunk without audio buffer
    const nextChunk = audioQueueRef.current.find(chunk => !chunk.buffer);
    if (!nextChunk) return;

    isFetchingAudioRef.current = true;
    console.log('🔄 Pre-fetching next audio chunk...');
    
    const buffer = await fetchAudio(nextChunk.text);
    if (buffer && isPlayingRef.current) {
      nextChunk.buffer = buffer;
      console.log('✓ Next chunk pre-fetched and ready');
    }
    
    isFetchingAudioRef.current = false;
  };

  // FIXED: Play audio chunk with proper offset support and better tracking
  const playAudioChunk = async (chunk: { text: string; buffer?: AudioBuffer }, resumeOffset: number = 0) => {
    if (!audioContextRef.current || !isPlayingRef.current) return;

    try {
      // Ensure audio context is running
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      let audioBuffer = chunk.buffer;
      
      // Fetch buffer if not already available
      if (!audioBuffer) {
        console.log('⏳ Fetching audio on-demand...');
        audioBuffer = await fetchAudio(chunk.text);
        if (!audioBuffer) {
          console.error('Failed to fetch audio buffer');
          processNextAudioChunk();
          return;
        }
        chunk.buffer = audioBuffer; // Cache it
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      // Calculate start time
      const currentTime = audioContextRef.current.currentTime;
      const startTime = Math.max(currentTime, nextPlayTimeRef.current);
      
      // Store when this chunk starts for accurate pause tracking
      chunkStartTimeRef.current = startTime;
      
      const remainingDuration = audioBuffer.duration - resumeOffset;
      
      console.log(`▶️ Playing chunk ${currentChunkIndexRef.current} (duration: ${audioBuffer.duration.toFixed(2)}s, offset: ${resumeOffset.toFixed(2)}s, remaining: ${remainingDuration.toFixed(2)}s)`);
      
      // Start playback from the offset
      source.start(startTime, resumeOffset);
      nextPlayTimeRef.current = startTime + remainingDuration;
      
      currentSourceRef.current = source;
      
      // Set up callback for when this chunk ends
      source.onended = () => {
        console.log('✓ Chunk ended naturally, moving to next');
        currentSourceRef.current = null;
        pausedAtTimeRef.current = 0; // Reset offset for next chunk
        currentChunkIndexRef.current++; // Move to next chunk
        processNextAudioChunk();
      };

      // Pre-fetch next chunk while current is playing
      preFetchNextChunk();

    } catch (error) {
      console.error('Error playing audio chunk:', error);
      processNextAudioChunk();
    }
  };

  // Process next audio chunk from queue
  const processNextAudioChunk = async () => {
    if (!isPlayingRef.current || isProcessingAudioRef.current) {
      console.log('⏸️ Not processing: playing=' + isPlayingRef.current + ', processing=' + isProcessingAudioRef.current);
      return;
    }

    if (audioQueueRef.current.length > 0) {
      isProcessingAudioRef.current = true;
      const chunk = audioQueueRef.current.shift();
      
      if (chunk && chunk.text.trim()) {
        console.log(`📤 Processing chunk from queue (${audioQueueRef.current.length} remaining)`);
        
        // Store this chunk in processed list
        allProcessedChunksRef.current.push(chunk);
        currentChunkIndexRef.current = allProcessedChunksRef.current.length - 1;
        
        // IMPORTANT: Always use pausedAtTimeRef for resume offset, then reset it
        const offset = pausedAtTimeRef.current;
        pausedAtTimeRef.current = 0; // Reset after using
        
        await playAudioChunk(chunk, offset);
      }
      
      isProcessingAudioRef.current = false;
    } else {
      // Queue is empty, check for pending text
      if (currentTextChunkRef.current.trim()) {
        console.log('📝 Processing pending text chunk');
        const sentences = splitIntoSentences(currentTextChunkRef.current);
        currentTextChunkRef.current = '';
        
        for (const sentence of sentences) {
          if (sentence.trim()) {
            audioQueueRef.current.push({ text: sentence });
          }
        }
        
        if (audioQueueRef.current.length > 0) {
          processNextAudioChunk();
        }
      } else if (!isGenerating) {
        // No more audio to play and generation is complete
        console.log('🏁 Audio playback complete');
        setIsPlayingAudio(false);
        isPlayingRef.current = false;
        hasAudioStartedRef.current = false;
        nextPlayTimeRef.current = 0;
      }
    }
  };

  // Start audio playback automatically
  const startAudioPlayback = async () => {
    if (!autoPlayAudio || hasAudioStartedRef.current || !audioContextRef.current) {
      console.log('⏭️ Skipping audio start: autoPlay=' + autoPlayAudio + ', started=' + hasAudioStartedRef.current);
      return;
    }

    console.log('🎬 Starting audio playback...');
    
    // Reset audio state
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      currentSourceRef.current = null;
    }

    isPlayingRef.current = true;
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
    hasAudioStartedRef.current = true;
    nextPlayTimeRef.current = audioContextRef.current.currentTime;
    pausedAtTimeRef.current = 0;
    currentChunkIndexRef.current = -1;

    // Process accumulated text into sentences
    if (currentTextChunkRef.current.trim()) {
      const sentences = splitIntoSentences(currentTextChunkRef.current);
      currentTextChunkRef.current = '';
      
      console.log(`📚 Queuing ${sentences.length} sentences for playback`);
      
      for (const sentence of sentences) {
        if (sentence.trim()) {
          audioQueueRef.current.push({ text: sentence });
        }
      }
    }

    // Start processing queue
    if (audioQueueRef.current.length > 0) {
      console.log(`🚀 Starting playback with ${audioQueueRef.current.length} chunks in queue`);
      processNextAudioChunk();
    }
  };

  // Process incoming text for audio - enhanced for continuous streaming
  const processTextForAudio = (text: string) => {
    if (!autoPlayAudio || !text.trim()) return;

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    // Count words
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    wordCountRef.current += words.length;

    // Accumulate text
    currentTextChunkRef.current += ' ' + cleanText;

    // Start audio when we have enough words
    if (wordCountRef.current >= MIN_WORDS_FOR_AUDIO && !hasAudioStartedRef.current) {
      console.log(`✨ Reached ${wordCountRef.current} words, starting autoplay...`);
      startAudioPlayback();
    }
    // If audio already playing, check if we have complete sentences to queue
    else if (hasAudioStartedRef.current && isPlayingRef.current) {
      // Look for sentence endings in accumulated text
      const sentencePattern = /[.!?]+/;
      if (sentencePattern.test(currentTextChunkRef.current)) {
        const sentences = splitIntoSentences(currentTextChunkRef.current);
        
        // Keep the last incomplete sentence in the buffer
        const lastSentence = sentences[sentences.length - 1];
        const endsWithPunctuation = /[.!?]$/.test(lastSentence);
        
        if (sentences.length > 1 || endsWithPunctuation) {
          const sentencesToQueue = endsWithPunctuation ? sentences : sentences.slice(0, -1);
          const remaining = endsWithPunctuation ? '' : lastSentence;
          
          console.log(`➕ Adding ${sentencesToQueue.length} complete sentences to queue`);
          
          for (const sentence of sentencesToQueue) {
            if (sentence.trim()) {
              audioQueueRef.current.push({ text: sentence });
            }
          }
          
          currentTextChunkRef.current = remaining;
          
          // Trigger processing if not already processing
          if (!isProcessingAudioRef.current && audioQueueRef.current.length > 0) {
            processNextAudioChunk();
          }
        }
      }
    }
  };

  // FIXED: Pause audio playback with better state tracking
  const pauseAudioPlayback = () => {
    if (!audioContextRef.current || !currentSourceRef.current) {
      console.log('⚠️ Nothing to pause');
      return;
    }

    console.log('⏸️ Pausing audio playback');
    
    try {
      const currentTime = audioContextRef.current.currentTime;
      
      // Calculate how much of the current chunk has been played
      const elapsedInChunk = currentTime - chunkStartTimeRef.current;
      
      // Save the pause position within the current chunk
      pausedAtTimeRef.current = Math.max(0, elapsedInChunk);
      
      console.log(`💾 Paused at ${pausedAtTimeRef.current.toFixed(2)}s into chunk ${currentChunkIndexRef.current}`);
      console.log(`   Chunk started at: ${chunkStartTimeRef.current.toFixed(2)}s, Current time: ${currentTime.toFixed(2)}s`);
      
      // Stop the current source
      currentSourceRef.current.stop();
      currentSourceRef.current = null;
      
    } catch (e) {
      console.warn('Error stopping audio source:', e);
      pausedAtTimeRef.current = 0;
    }
    
    // Update state
    isPlayingRef.current = false;
    setIsPlayingAudio(false);
    setIsPausedAudio(true);
    
    // Clear scheduled next play time
    nextPlayTimeRef.current = 0;

    // Suspend audio context to stop all audio processing
    if (audioContextRef.current && audioContextRef.current.state !== 'suspended') {
      audioContextRef.current.suspend().then(() => {
        console.log('✅ Audio context suspended');
      }).catch(err => {
        console.error('Error suspending audio context:', err);
      });
    }
  };

  // FIXED: Resume audio playback with proper state restoration
  const resumeAudioPlayback = async () => {
    if (!audioContextRef.current) return;

    console.log(`▶️ Resuming from chunk ${currentChunkIndexRef.current} at ${pausedAtTimeRef.current.toFixed(2)}s`);
    
    // Resume audio context first
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
      console.log('✅ Audio context resumed');
    }
    
    // Get the current chunk to resume from
    const currentChunk = allProcessedChunksRef.current[currentChunkIndexRef.current];
    
    if (currentChunk && pausedAtTimeRef.current > 0) {
      // We have a valid pause position - resume from there
      console.log(`🎯 Resuming chunk "${currentChunk.text.substring(0, 30)}..." from ${pausedAtTimeRef.current.toFixed(2)}s`);
      
      // Re-add remaining chunks to the front of queue (if any were left)
      const remainingChunks = allProcessedChunksRef.current.slice(currentChunkIndexRef.current + 1);
      audioQueueRef.current = [...remainingChunks, ...audioQueueRef.current];
      
      // Remove the current chunk from processed list since we'll re-add it when playing
      allProcessedChunksRef.current = allProcessedChunksRef.current.slice(0, currentChunkIndexRef.current);
      
      // Add current chunk back to the front of the queue with its buffer
      audioQueueRef.current.unshift(currentChunk);
      
      // Reset state for playback
      isPlayingRef.current = true;
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      
      if (audioContextRef.current) {
        nextPlayTimeRef.current = audioContextRef.current.currentTime;
      }
      
      // Decrease chunk index since we removed it from processed
      currentChunkIndexRef.current--;
      
      // Start processing - pausedAtTimeRef will be used as offset
      isProcessingAudioRef.current = false;
      processNextAudioChunk();
      
    } else {
      // No valid pause position or chunk - restart from beginning
      console.log('🔄 No valid pause position, restarting from beginning');
      stopAudioPlayback();
      
      const sentences = splitIntoSentences(response);
      console.log(`📚 Queuing ${sentences.length} sentences for restart`);
      
      for (const sentence of sentences) {
        if (sentence.trim()) {
          audioQueueRef.current.push({ text: sentence });
        }
      }
      
      if (audioContextRef.current) {
        nextPlayTimeRef.current = audioContextRef.current.currentTime;
      }
      
      hasAudioStartedRef.current = true;
      isPlayingRef.current = true;
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      currentChunkIndexRef.current = -1;
      pausedAtTimeRef.current = 0;
      
      processNextAudioChunk();
    }
  };

  // Stop audio playback completely
  const stopAudioPlayback = () => {
    console.log('⏹️ Stopping audio playback');
    
    isPlayingRef.current = false;
    hasAudioStartedRef.current = false;
    wordCountRef.current = 0;
    nextPlayTimeRef.current = 0;
    pausedAtTimeRef.current = 0;
    currentChunkIndexRef.current = -1;
    chunkStartTimeRef.current = 0;
    
    // Stop and clear current audio source
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop();
      } catch (e) {
        // Ignore error if already stopped
      }
      currentSourceRef.current = null;
    }

    // Clear all queues
    audioQueueRef.current = [];
    allProcessedChunksRef.current = [];
    currentTextChunkRef.current = '';
    isProcessingAudioRef.current = false;
    isFetchingAudioRef.current = false;
    
    // Update UI state
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
    
    // Suspend audio context to save resources
    if (audioContextRef.current && audioContextRef.current.state !== 'suspended') {
      audioContextRef.current.suspend().catch(err => {
        console.error('Error suspending audio context:', err);
      });
    }
  };

  // Toggle audio playback (for manual control)
  const toggleAudioPlayback = () => {
    if (isPlayingAudio) {
      // Pause if playing
      pauseAudioPlayback();
    } else if (isPausedAudio) {
      // Resume if paused
      resumeAudioPlayback();
    } else if (response) {
      // Start new playback from beginning
      console.log('🔄 Starting fresh playback');
      stopAudioPlayback();
      
      hasAudioStartedRef.current = true;
      isPlayingRef.current = true;
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      pausedAtTimeRef.current = 0;
      currentChunkIndexRef.current = -1;
      
      const sentences = splitIntoSentences(response);
      console.log(`📚 Queuing ${sentences.length} sentences for playback`);
      
      for (const sentence of sentences) {
        if (sentence.trim()) {
          audioQueueRef.current.push({ text: sentence });
        }
      }
      
      if (audioContextRef.current) {
        // Ensure audio context is running
        if (audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume();
        }
        nextPlayTimeRef.current = audioContextRef.current.currentTime;
      }
      
      processNextAudioChunk();
    }
  };

  const toggleSection = (section: string) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: string, value: string) => {
    setUiSettings((prev) => ({ ...prev, [field]: value }));
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
- The final advisory should be striclty very concise, actionable, and single paragraph focused on practical steps for the farmer.
`;

  // Build the prompt from backend settings (Hindi values)
  const buildPrompt = () => {
    const backendSettings = getBackendSettings();
    const parts: string[] = [];

    if (backendSettings.month) parts.push(`Month: ${backendSettings.month}`);
    if (backendSettings.growthStage) parts.push(`Growth Stage: ${backendSettings.growthStage}`);
    if (backendSettings.weather) parts.push(`Weather: ${backendSettings.weather}`);
    if (backendSettings.soilType) parts.push(`Soil Type: ${backendSettings.soilType}`);
    if (backendSettings.farmingPractice) parts.push(`Farming Practice: ${backendSettings.farmingPractice}`);
    if (backendSettings.region) parts.push(`Region: ${backendSettings.region}`);
    if (backendSettings.language) parts.push(`Language: ${backendSettings.language}`);
    if (backendSettings.crop) parts.push(`Crop: ${backendSettings.crop}`);
    if (backendSettings.stress) parts.push(`Stress: ${backendSettings.stress}`);

    const userMessage = {
      role: "user",
      content: SYSTEM_PROMPT + "\n\n" + parts.join("\n"),
    };

    console.log("Final payload messages (Hindi values):", [userMessage]);

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
    if (!uiSettings.crop || !uiSettings.region) {
      setError('Please enter at least Crop and Region to generate advisory');
      return;
    }

    // Reset audio state for new generation
    stopAudioPlayback();

    setIsGenerating(true);
    setError('');
    setResponse('');
    setDisplayedResponse('');
    setThinkingContent('');
    setDisplayedThinking('');
    setIsThinking(true);
    setReasoningExpanded(false);

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
                
                state = processStreamChunk(
                  content, 
                  state, 
                  uiSettings.thinkingStartToken, 
                  uiSettings.thinkingEndToken
                );
                
                const cleanedResponse = cleanResponseContent(state.displayText);
                setResponse(cleanedResponse);
                
                setThinkingContent(cleanThinkingContent(state.thinking, uiSettings.thinkingStartToken, uiSettings.thinkingEndToken));
                setIsThinking(state.inThinkingMode);
                
                // Process text for continuous audio streaming when out of thinking mode
                if (!state.inThinkingMode && cleanedResponse && cleanedResponse.trim()) {
                  processTextForAudio(content);
                }
              }
            } 
            catch (jsonError) {
              console.error("JSON parse error even after sanitization:", jsonError);
              
              const contentMatch = data.match(/'content':\s*'([^']*)'/);
              if (contentMatch && contentMatch[1]) {
                const content = contentMatch[1];
                fullResponseText += content;
                
                state = processStreamChunk(
                  content, 
                  state, 
                  uiSettings.thinkingStartToken, 
                  uiSettings.thinkingEndToken
                );
                
                const cleanedResponse = cleanResponseContent(state.displayText);
                setResponse(cleanedResponse);
                
                setThinkingContent(cleanThinkingContent(state.thinking, uiSettings.thinkingStartToken, uiSettings.thinkingEndToken));
                setIsThinking(state.inThinkingMode);
                
                if (!state.inThinkingMode && cleanedResponse && cleanedResponse.trim()) {
                  processTextForAudio(content);
                }
              }
            }
          }
        }
      }

      console.log("=== STREAMING COMPLETE ===");
      console.log("Total response length:", fullResponseText.length);
      console.log("Audio queue length:", audioQueueRef.current.length);
      console.log("Pending text:", currentTextChunkRef.current);

      // Process any remaining text after streaming completes
      if (currentTextChunkRef.current.trim()) {
        console.log('📝 Processing final remaining text');
        const sentences = splitIntoSentences(currentTextChunkRef.current);
        currentTextChunkRef.current = '';
        
        for (const sentence of sentences) {
          if (sentence.trim()) {
            audioQueueRef.current.push({ text: sentence });
          }
        }
        
        // Start audio if not started yet
        if (!hasAudioStartedRef.current && audioQueueRef.current.length > 0) {
          console.log('🎬 Starting audio with final chunks');
          hasAudioStartedRef.current = true;
          isPlayingRef.current = true;
          setIsPlayingAudio(true);
          if (audioContextRef.current) {
            nextPlayTimeRef.current = audioContextRef.current.currentTime;
          }
          processNextAudioChunk();
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
    setReasoningExpanded(false);
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

  // Auto-scroll thinking content when expanded
  useEffect(() => {
    if (thinkingRef.current && displayedThinking && reasoningExpanded) {
      thinkingRef.current.scrollTop = thinkingRef.current.scrollHeight;
    }
  }, [displayedThinking, reasoningExpanded]);

  // Auto-scroll response - FIXED version
  useEffect(() => {
    if (responseContentRef.current && displayedResponse) {
      const container = responseContainerRef.current;
      const content = responseContentRef.current;
      
      if (!container || !content) return;
      
      // Calculate if user is near bottom of container
      const containerScrollBottom = container.scrollTop + container.clientHeight;
      const contentBottom = content.scrollHeight;
      const isNearBottom = contentBottom - containerScrollBottom < 100;
      
      // Auto-scroll only if user is near bottom
      if (isNearBottom) {
        container.scrollTop = content.scrollHeight;
      }
    }
  }, [displayedResponse, isThinking]);

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

  const getDisplayValue = (value: string): string => {
    return HINDI_TO_ENGLISH_MAP[value] || value;
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
                value={uiSettings.month}
                onChange={(v) => handleInputChange('month', v)}
                placeholder="Select month"
                icon={Calendar}
                options={DROPDOWN_OPTIONS_UI.month}
              />
              <DropdownField
                label="Growth Stage"
                value={uiSettings.growthStage}
                onChange={(v) => handleInputChange('growthStage', v)}
                placeholder="Select growth stage"
                icon={Sprout}
                options={DROPDOWN_OPTIONS_UI.growthStage}
              />
              <DropdownField
                label="Weather"
                value={uiSettings.weather}
                onChange={(v) => handleInputChange('weather', v)}
                placeholder="Select weather condition"
                icon={Cloud}
                options={DROPDOWN_OPTIONS_UI.weather}
              />
              <DropdownField
                label="Soil Type"
                value={uiSettings.soilType}
                onChange={(v) => handleInputChange('soilType', v)}
                placeholder="Select soil type"
                icon={Layers}
                options={DROPDOWN_OPTIONS_UI.soilType}
              />
              <DropdownField
                label="Farming Practice"
                value={uiSettings.farmingPractice}
                onChange={(v) => handleInputChange('farmingPractice', v)}
                placeholder="Select farming practice"
                icon={Settings}
                options={DROPDOWN_OPTIONS_UI.farmingPractice}
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
                value={uiSettings.region}
                onChange={(v) => handleInputChange('region', v)}
                placeholder="Select region"
                icon={MapPin}
                options={DROPDOWN_OPTIONS_UI.region}
              />
              <DropdownField
                label="Language"
                value={uiSettings.language}
                onChange={(v) => handleInputChange('language', v)}
                placeholder="Select language"
                options={DROPDOWN_OPTIONS_UI.language}
              />
              <DropdownField
                label="Crop *"
                value={uiSettings.crop}
                onChange={(v) => handleInputChange('crop', v)}
                placeholder="Select crop"
                icon={Leaf}
                options={DROPDOWN_OPTIONS_UI.crop}
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
                value={uiSettings.stress}
                onChange={(v) => handleInputChange('stress', v)}
                placeholder="Select stress factor"
                icon={AlertCircle}
                options={DROPDOWN_OPTIONS_UI.stress}
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
                value={uiSettings.thinkingStartToken}
                onChange={(v) => handleInputChange('thinkingStartToken', v)}
                placeholder="e.g., <think>"
                icon={Brain}
              />
              <InputField
                label="Thinking End Token"
                value={uiSettings.thinkingEndToken}
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
                disabled={!uiSettings.crop || !uiSettings.region}
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

          {/* Response Area - FIXED SCROLLING */}
          <div 
            ref={responseContainerRef}
            className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/30"
          >
            <div className="max-w-6xl mx-auto">
              {error && (
                <div className="mb-4">
                  <div className={`bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3`}>
                    <AlertCircle className={`text-red-400 flex-shrink-0 mt-0.5`} size={20} />
                    <div className={`text-sm text-red-300`}>{error}</div>
                  </div>
                </div>
              )}

              {!response && !isGenerating && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center min-h-[calc(100vh-14rem)]">
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
                </div>
              )}

              {(response || isGenerating) && (
                <>
                  {/* User Query Summary */}
                  <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
                      <Send size={14} />
                      Query Parameters
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {uiSettings.month && (
                        <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                          📅 {uiSettings.month}
                        </span>
                      )}
                      {uiSettings.growthStage && (
                        <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                          🌱 {uiSettings.growthStage}
                        </span>
                      )}
                      {uiSettings.weather && (
                        <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                          🌤️ {uiSettings.weather}
                        </span>
                      )}
                      {uiSettings.soilType && (
                        <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                          🏔️ {uiSettings.soilType}
                        </span>
                      )}
                      {uiSettings.farmingPractice && (
                        <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                          🚜 {uiSettings.farmingPractice}
                        </span>
                      )}
                      {uiSettings.region && (
                        <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                          📍 {uiSettings.region}
                        </span>
                      )}
                      {uiSettings.language && (
                        <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                          🌐 {uiSettings.language}
                        </span>
                      )}
                      {uiSettings.crop && (
                        <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                          🌾 {uiSettings.crop}
                        </span>
                      )}
                      {uiSettings.stress && (
                        <span className="px-2 py-1 bg-gray-800/50 rounded-md text-xs text-gray-300">
                          ⚠️ {uiSettings.stress}
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
                          
                          <button
                            onClick={() => setReasoningExpanded(!reasoningExpanded)}
                            className="ml-auto flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                          >
                            {reasoningExpanded ? (
                              <>
                                <ChevronDown size={14} />
                                <span>Collapse</span>
                              </>
                            ) : (
                              <>
                                <ChevronRight size={14} />
                                <span>Expand</span>
                              </>
                            )}
                          </button>
                          
                          {isThinking && (
                            <div className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                          )}
                        </div>
                        <div 
                          ref={thinkingRef}
                          className={`overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-gray-800/20 ${
                            reasoningExpanded ? 'max-h-96' : 'max-h-32'
                          }`}
                        >
                          <pre className={`text-xs whitespace-pre-wrap font-mono leading-relaxed p-3 ${isThinking ? 'text-amber-200/80' : 'text-gray-400'}`}>
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
                    {/* Audio Playback Controls */}
                    {response && (
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {/* <span className={`text-xs font-medium ${isPlayingAudio ? 'text-emerald-400' : isPausedAudio ? 'text-blue-400' : 'text-gray-500'}`}>
                            🎵 Audio: {isPlayingAudio ? 'Playing' : isPausedAudio ? 'Paused' : 'Ready'}
                          </span> */}
                          {isPausedAudio && pausedAtTimeRef.current > 0 && (
                            <span className="text-xs text-blue-400/70">
                              (Paused at {pausedAtTimeRef.current.toFixed(1)}s in chunk {currentChunkIndexRef.current})
                            </span>
                          )}
                          {hasAudioStartedRef.current && !isGenerating && (
                            <span className="text-xs text-gray-500">
                              ✓ Auto-started after {MIN_WORDS_FOR_AUDIO} words
                            </span>
                          )}
                        </div>
                        <button
                          onClick={toggleAudioPlayback}
                          disabled={!response || isGenerating}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                            isPlayingAudio 
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30' 
                              : isPausedAudio
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30'
                              : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
                          } ${(!response || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {isPlayingAudio ? (
                            <>
                              <VolumeX size={16} />
                              <span className="text-sm font-medium">Pause Audio</span>
                            </>
                          ) : isPausedAudio ? (
                            <>
                              <Volume2 size={16} />
                              <span className="text-sm font-medium">Resume Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 size={16} />
                              <span className="text-sm font-medium">Play Audio</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                    
                    <div 
                      ref={responseContentRef}
                      className="prose prose-invert prose-emerald max-w-none prose-headings:text-gray-100 prose-p:text-gray-300 prose-strong:text-emerald-400 prose-li:text-gray-300 prose-a:text-emerald-400 prose-code:text-amber-300 prose-code:bg-gray-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800/70 prose-pre:border prose-pre:border-gray-700"
                    >
                      <ReactMarkdown>{displayedResponse}</ReactMarkdown>
                      {isGenerating && !isThinking && displayedResponse.length < response.length && (
                        <span className="inline-block w-2 h-5 bg-emerald-500 animate-pulse ml-1 rounded-sm"></span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="h-12 border-t border-gray-800 flex items-center justify-center bg-gray-900/30 backdrop-blur-xl">
            <p className="text-xs text-gray-600">
              Powered by Soket AI Labs : Part of IndiaAI intiative
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriAdvisoryInterface;
















