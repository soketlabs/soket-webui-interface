
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
  <div className="border border-slate-200/80 rounded-lg overflow-hidden bg-white/70">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-2 text-slate-800">
        <Icon size={18} className="text-emerald-600" />
        <span className="font-medium text-sm">{title}</span>
      </div>
      {isOpen ? (
        <ChevronDown size={18} className="text-slate-400" />
      ) : (
        <ChevronRight size={18} className="text-slate-400" />
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
    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
      {Icon && <Icon size={12} />}
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-white/80 border border-slate-200/80 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all cursor-pointer"
    >
      <option value="" className="text-slate-400">
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; icon?: any; type?: string }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
      {Icon && <Icon size={12} />}
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-white/80 border border-slate-200/80 rounded-lg text-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, icon: Icon }: { label: string; value: string; onChange: (v: string) => void; options: any[]; icon?: any }) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
      {Icon && <Icon size={12} />}
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-white/80 border border-slate-200/80 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all cursor-pointer"
    >
      {options.map((opt) => (
        <option key={opt.value ?? opt} value={opt.value ?? opt}>
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

  // Token stats tracking
  const [tokenStats, setTokenStats] = useState<{
    totalTokens: number;
    reasoningTokens: number;
    responseTokens: number;
    tokensPerSec: number;
  } | null>(null);
  const streamStartTimeRef = useRef<number>(0);
  const totalTokenCountRef = useRef(0);
  const reasoningTokenCountRef = useRef(0);
  const responseTokenCountRef = useRef(0);
  
  const responseContainerRef = useRef<HTMLDivElement>(null);
  const responseContentRef = useRef<HTMLDivElement>(null);
  const thinkingRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamReaderRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // --- WebSocket-based ElevenLabs TTS streaming ---
  const wsRef = useRef<WebSocket | null>(null);
  const wsReadyRef = useRef(false);
  const wsEndedRef = useRef(false);
  const pendingTextRef = useRef('');

  // Audio playback system with gapless pre-scheduling
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextSourceRef = useRef<AudioBufferSourceNode | null>(null); // pre-scheduled next chunk for gapless playback
  const nextStartTimeRef = useRef(0); // AudioContext time when pre-scheduled chunk starts
  const isPlayingRef = useRef(false);
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isProcessingAudioRef = useRef(false);
  const hasAudioStartedRef = useRef(false);
  const playbackVersionRef = useRef(0);
  const isGeneratingRef = useRef(false);
  const wsOpeningRef = useRef(false);
  const requestIdRef = useRef<string | null>(null);

  // Pause/resume tracking
  const pausedAtTimeRef = useRef<number>(0);
  const currentChunkIndexRef = useRef<number>(-1);
  const allProcessedChunksRef = useRef<AudioBuffer[]>([]);
  const chunkStartTimeRef = useRef<number>(0);
  
  // Refs for smooth streaming animation
  const responseBufferRef = useRef('');
  const thinkingBufferRef = useRef('');
  const animationFrameRef = useRef<number | null>(null);
  const userScrolledAwayRef = useRef(false);

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

  // Clean text for speech
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

  // --- ElevenLabs WebSocket TTS (PCM format for zero-gap playback) ---

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  };

  // Synchronously convert raw 16-bit signed LE PCM into an AudioBuffer.
  // Unlike decodeAudioData (MP3), this has zero codec delay/padding at boundaries.
  const pcmToAudioBuffer = (pcmData: ArrayBuffer): AudioBuffer | null => {
    if (!audioContextRef.current) return null;
    const int16 = new Int16Array(pcmData);
    if (int16.length === 0) return null;
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768;
    }
    const buffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);
    return buffer;
  };

  const openTTSWebSocket = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      closeTTSWebSocket();

      const voiceId = API_CONFIG.elevenlabsVoiceId;
      // Use PCM 24 kHz — raw samples with zero codec artifacts at chunk boundaries
      const url = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=eleven_turbo_v2_5&output_format=pcm_24000&inactivity_timeout=180`;

      console.log('🔌 Opening ElevenLabs WebSocket (PCM 24 kHz)...');
      const ws = new WebSocket(url);
      wsRef.current = ws;
      wsReadyRef.current = false;
      wsEndedRef.current = false;

      ws.onopen = () => {
        console.log('✅ WebSocket connected');
        ws.send(JSON.stringify({
          text: ' ',
          voice_settings: {
            stability: 0.8,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
          },
          generation_config: { chunk_length_schedule: [50, 120, 160, 250] },
          'xi-api-key': API_CONFIG.elevenlabsApiKey,
        }));
        wsReadyRef.current = true;

        if (pendingTextRef.current) {
          sendTextToTTS(pendingTextRef.current);
          pendingTextRef.current = '';
        }
        resolve();
      };

      // Synchronous onmessage — PCM conversion is instant, so no async/await needed.
      // Chunks arrive in order and are queued in order (no out-of-order decoding).
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data as string);
          if (data.audio) {
            const pcm = base64ToArrayBuffer(data.audio);
            const buf = pcmToAudioBuffer(pcm);
            if (buf) onAudioBufferReceived(buf);
          }
          if (data.isFinal) {
            console.log('🏁 WebSocket: all audio received');
            wsEndedRef.current = true;
            if (!currentSourceRef.current && !nextSourceRef.current &&
                audioQueueRef.current.length === 0 && isPlayingRef.current) {
              isPlayingRef.current = false;
              hasAudioStartedRef.current = false;
              setIsPlayingAudio(false);
            }
          }
        } catch { /* ignore */ }
      };

      ws.onerror = (err) => { console.error('WebSocket error', err); reject(err); };
      ws.onclose = () => { console.log('🔌 WebSocket closed'); wsReadyRef.current = false; };
    });
  };

  const sendTextToTTS = (text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      pendingTextRef.current += text;
      return;
    }
    wsRef.current.send(JSON.stringify({ text: text + ' ', try_trigger_generation: true }));
  };

  const closeTTSWebSocket = () => {
    if (wsRef.current) {
      const oldWs = wsRef.current;
      // Null ALL handlers FIRST — prevents stale events (like isFinal from the old
      // generation) from firing after close and corrupting state for a new generation.
      // Including onopen prevents a connecting WS from resolving an old promise.
      oldWs.onopen = null;
      oldWs.onmessage = null;
      oldWs.onclose = null;
      oldWs.onerror = null;

      if (oldWs.readyState === WebSocket.OPEN) {
        try { oldWs.send(JSON.stringify({ text: '' })); } catch { /* */ }
      }
      oldWs.close();
      wsRef.current = null;
      wsReadyRef.current = false;
    }
    wsOpeningRef.current = false;
    pendingTextRef.current = '';
  };

  // Called synchronously when a PCM AudioBuffer is decoded from the WebSocket.
  // Playing state is already set up by generateAdvisory (or startFreshPlayback),
  // so chunks go straight to playback/pre-scheduling.
  const onAudioBufferReceived = (audioBuffer: AudioBuffer) => {
    audioQueueRef.current.push(audioBuffer);
    console.log(`🔊 Audio chunk (${audioBuffer.duration.toFixed(2)}s), queue: ${audioQueueRef.current.length}`);

    if (!isPlayingRef.current) {
      // Fallback auto-start (e.g. if playing state wasn't pre-set)
      hasAudioStartedRef.current = true;
      isPlayingRef.current = true;
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().then(() => processNextAudioChunk());
      } else {
        processNextAudioChunk();
      }
    } else if (currentSourceRef.current && !nextSourceRef.current) {
      // A chunk is playing but nothing is pre-scheduled — schedule for gapless transition
      scheduleNextChunk();
    } else if (!currentSourceRef.current && !isProcessingAudioRef.current) {
      // Playing but idle (previous chunk ended while queue was empty) — kick off
      processNextAudioChunk();
    }
  };

  // --- Gapless audio playback chain ---
  //
  // Core idea: after starting a chunk, immediately pre-schedule the NEXT chunk
  // to start at the exact sample-accurate end time of the current one. The Web
  // Audio API handles the seamless transition internally — zero JS processing gap.

  const playAudioChunk = async (audioBuffer: AudioBuffer, resumeOffset = 0) => {
    if (!audioContextRef.current || !isPlayingRef.current) return;
    const myVersion = playbackVersionRef.current;

    try {
      if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
      if (playbackVersionRef.current !== myVersion) return;

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      const startAt = audioContextRef.current.currentTime;
      chunkStartTimeRef.current = startAt - resumeOffset;

      console.log(`▶️ Chunk ${currentChunkIndexRef.current} (${audioBuffer.duration.toFixed(2)}s, offset ${resumeOffset.toFixed(2)}s)`);
      source.start(startAt, resumeOffset);
      currentSourceRef.current = source;

      // Calculate exactly when this chunk ends (for pre-scheduling the next one)
      const endTime = startAt + (audioBuffer.duration - resumeOffset);

      source.onended = () => {
        // Version check: if pause/stop incremented the version, this callback is stale
        if (playbackVersionRef.current !== myVersion) {
          if (currentSourceRef.current === source) currentSourceRef.current = null;
          return;
        }

        // Gapless promotion: the pre-scheduled next source is already playing
        if (nextSourceRef.current) {
          currentSourceRef.current = nextSourceRef.current;
          nextSourceRef.current = null;
          currentChunkIndexRef.current++;
          chunkStartTimeRef.current = nextStartTimeRef.current;
          pausedAtTimeRef.current = 0;
          // Try to pre-schedule yet another chunk
          scheduleNextChunk();
        } else {
          currentSourceRef.current = null;
          pausedAtTimeRef.current = 0;
          currentChunkIndexRef.current++;
          processNextAudioChunk();
        }
      };

      // Pre-schedule next chunk for gapless playback
      scheduleNextChunkAt(endTime, myVersion);

    } catch (error) {
      console.error('Error playing audio chunk:', error);
      processNextAudioChunk();
    }
  };

  // Pre-schedule the next chunk at exactly the end time of the current chunk
  const scheduleNextChunk = () => {
    if (!audioContextRef.current || !isPlayingRef.current || nextSourceRef.current) return;

    const currentBuf = allProcessedChunksRef.current[currentChunkIndexRef.current];
    if (!currentBuf) return;

    const endTime = chunkStartTimeRef.current + currentBuf.duration;
    scheduleNextChunkAt(endTime, playbackVersionRef.current);
  };

  const scheduleNextChunkAt = (startTime: number, version: number) => {
    if (!audioContextRef.current || nextSourceRef.current) return;
    if (audioQueueRef.current.length === 0) return;
    if (playbackVersionRef.current !== version) return;

    const buf = audioQueueRef.current.shift()!;
    allProcessedChunksRef.current.push(buf);

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buf;
    source.connect(audioContextRef.current.destination);
    source.start(startTime);

    nextSourceRef.current = source;
    nextStartTimeRef.current = startTime;

    console.log(`⏭️ Pre-scheduled next chunk (${buf.duration.toFixed(2)}s) at ${startTime.toFixed(3)}s`);

    source.onended = () => {
      if (playbackVersionRef.current !== version) {
        if (currentSourceRef.current === source) currentSourceRef.current = null;
        if (nextSourceRef.current === source) nextSourceRef.current = null;
        return;
      }

      // This pre-scheduled chunk (now current) just finished
      if (nextSourceRef.current && nextSourceRef.current !== source) {
        // Another chunk was pre-scheduled after this one — promote it
        currentSourceRef.current = nextSourceRef.current;
        nextSourceRef.current = null;
        currentChunkIndexRef.current++;
        chunkStartTimeRef.current = nextStartTimeRef.current;
        pausedAtTimeRef.current = 0;
        scheduleNextChunk();
      } else {
        currentSourceRef.current = null;
        nextSourceRef.current = null;
        pausedAtTimeRef.current = 0;
        currentChunkIndexRef.current++;
        processNextAudioChunk();
      }
    };
  };

  const processNextAudioChunk = async () => {
    if (!isPlayingRef.current || isProcessingAudioRef.current || currentSourceRef.current) return;

    // Safety: ensure AudioContext is running before playing any chunk
    if (audioContextRef.current?.state === 'suspended') {
      try { await audioContextRef.current.resume(); } catch { /* */ }
    }

    const myVersion = playbackVersionRef.current;

    if (audioQueueRef.current.length > 0) {
      isProcessingAudioRef.current = true;
      const buf = audioQueueRef.current.shift()!;

      allProcessedChunksRef.current.push(buf);
      currentChunkIndexRef.current = allProcessedChunksRef.current.length - 1;

      const offset = pausedAtTimeRef.current;
      pausedAtTimeRef.current = 0;
      await playAudioChunk(buf, offset);
      // Only reset if still in the same playback generation — prevents a stale
      // async callback from corrupting state for a newer generation.
      if (playbackVersionRef.current === myVersion) {
        isProcessingAudioRef.current = false;
      }
    } else if (wsEndedRef.current && !isGeneratingRef.current) {
      // Use ref (not state) so this always sees the current value, even when
      // called from an onended closure that captured a stale render.
      console.log('🏁 Audio playback complete');
      setIsPlayingAudio(false);
      isPlayingRef.current = false;
      hasAudioStartedRef.current = false;
    }
  };

  // Process incoming LLM text for audio.
  // The WS is pre-opened eagerly in generateAdvisory; this function sends
  // text directly if the WS is ready, or queues it for when it opens.
  const processTextForAudio = (text: string) => {
    if (!text.trim()) return;
    const clean = cleanTextForSpeech(text);
    if (!clean) return;

    // Prime audio playback state on very first non-thinking text so the UI
    // shows "Playing" immediately and the first audio chunk auto-starts.
    if (!hasAudioStartedRef.current && isGeneratingRef.current) {
      hasAudioStartedRef.current = true;
      isPlayingRef.current = true;
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      // Ensure AudioContext is running (may have been suspended by browser policy)
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
    }

    // If WebSocket is already open, send directly (fastest path)
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendTextToTTS(clean);
      return;
    }

    // Queue text — flushed automatically when WS opens (onopen handler)
    pendingTextRef.current += clean + ' ';

    // Open WebSocket if not already opening/open
    if (!wsOpeningRef.current) {
      wsOpeningRef.current = true;
      openTTSWebSocket()
        .then(() => { wsOpeningRef.current = false; })
        .catch((e) => {
          wsOpeningRef.current = false;
          console.error('Failed to open TTS WebSocket, audio unavailable:', e);
        });
    }
  };

  // --- Pause / Resume / Stop / Toggle ---

  const pauseAudioPlayback = () => {
    if (!audioContextRef.current) return;
    console.log('⏸️ Pausing');
    playbackVersionRef.current++;

    // Stop and re-queue the pre-scheduled next source (it hasn't been heard yet)
    if (nextSourceRef.current) {
      try { nextSourceRef.current.stop(); } catch { /* */ }
      nextSourceRef.current = null;
      // Its buffer is the last entry in allProcessedChunksRef — pop it back to queue
      const buf = allProcessedChunksRef.current.pop();
      if (buf) audioQueueRef.current.unshift(buf);
    }

    if (currentSourceRef.current) {
      try {
        const elapsed = audioContextRef.current.currentTime - chunkStartTimeRef.current;
        pausedAtTimeRef.current = Math.max(0, elapsed);
        currentSourceRef.current.stop();
        currentSourceRef.current = null;
      } catch { pausedAtTimeRef.current = 0; }
    } else {
      pausedAtTimeRef.current = 0;
    }

    isPlayingRef.current = false;
    isProcessingAudioRef.current = false;
    setIsPlayingAudio(false);
    setIsPausedAudio(true);

    if (audioContextRef.current.state !== 'suspended') {
      audioContextRef.current.suspend().catch(() => {});
    }
  };

  const resumeAudioPlayback = async () => {
    if (!audioContextRef.current) return;
    await audioContextRef.current.resume();

    const currentChunk = allProcessedChunksRef.current[currentChunkIndexRef.current];

    if (currentChunk && pausedAtTimeRef.current > 0) {
      // Mid-chunk resume
      const remaining = allProcessedChunksRef.current.slice(currentChunkIndexRef.current + 1);
      audioQueueRef.current = [...remaining, ...audioQueueRef.current];
      allProcessedChunksRef.current = allProcessedChunksRef.current.slice(0, currentChunkIndexRef.current);
      audioQueueRef.current.unshift(currentChunk);
      currentChunkIndexRef.current--;
      isPlayingRef.current = true;
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      isProcessingAudioRef.current = false;
      processNextAudioChunk();
    } else if (audioQueueRef.current.length > 0) {
      // Between chunks — continue
      const idx = currentChunkIndexRef.current;
      if (idx >= 0 && idx < allProcessedChunksRef.current.length) {
        const toRequeue = allProcessedChunksRef.current.slice(idx);
        allProcessedChunksRef.current = allProcessedChunksRef.current.slice(0, idx);
        audioQueueRef.current = [...toRequeue, ...audioQueueRef.current];
        currentChunkIndexRef.current = idx > 0 ? idx - 1 : -1;
      }
      pausedAtTimeRef.current = 0;
      isPlayingRef.current = true;
      setIsPlayingAudio(true);
      setIsPausedAudio(false);
      isProcessingAudioRef.current = false;
      processNextAudioChunk();
    } else if (response) {
      await startFreshPlayback();
    }
  };

  const stopAudioPlayback = () => {
    playbackVersionRef.current++;
    isPlayingRef.current = false;
    hasAudioStartedRef.current = false;
    pausedAtTimeRef.current = 0;
    currentChunkIndexRef.current = -1;
    chunkStartTimeRef.current = 0;

    // Stop both current and pre-scheduled sources
    if (nextSourceRef.current) {
      try { nextSourceRef.current.stop(); } catch { /* */ }
      nextSourceRef.current = null;
    }
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch { /* */ }
      currentSourceRef.current = null;
    }

    audioQueueRef.current = [];
    allProcessedChunksRef.current = [];
    isProcessingAudioRef.current = false;
    closeTTSWebSocket();
    setIsPlayingAudio(false);
    setIsPausedAudio(false);
  };

  const startFreshPlayback = async () => {
    stopAudioPlayback();
    if (audioContextRef.current) await audioContextRef.current.resume();

    hasAudioStartedRef.current = true;
    isPlayingRef.current = true;
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
    pausedAtTimeRef.current = 0;
    currentChunkIndexRef.current = -1;
    wsEndedRef.current = false;

    try {
      await openTTSWebSocket();
      const clean = cleanTextForSpeech(response);
      if (clean) sendTextToTTS(clean);
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ text: '' }));
      }
    } catch (e) {
      console.error('Failed to start fresh playback:', e);
      stopAudioPlayback();
    }
  };

  const toggleAudioPlayback = async () => {
    if (isPlayingAudio) {
      pauseAudioPlayback();
    } else if (isPausedAudio) {
      await resumeAudioPlayback();
    } else if (response) {
      await startFreshPlayback();
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
    wsEndedRef.current = false;

    // Ensure AudioContext is valid — recreate if it was closed from a previous error
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume AudioContext on user gesture — browsers require a user interaction.
    // Always call resume() regardless of current state to be safe.
    await audioContextRef.current.resume();

    // Reset request ID for the new generation
    requestIdRef.current = null;

    setIsGenerating(true);
    isGeneratingRef.current = true;
    userScrolledAwayRef.current = false; // Reset scroll tracking for new generation
    setError('');
    setResponse('');
    setDisplayedResponse('');
    setThinkingContent('');
    setDisplayedThinking('');
    setIsThinking(true);
    setReasoningExpanded(false);

    // Reset token stats
    setTokenStats(null);
    streamStartTimeRef.current = 0;
    totalTokenCountRef.current = 0;
    reasoningTokenCountRef.current = 0;
    responseTokenCountRef.current = 0;

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
      streamReaderRef.current = reader;

      // Pre-open TTS WebSocket eagerly so audio starts with zero connection delay.
      // The 180s inactivity_timeout in the WS URL covers long thinking phases.
      wsOpeningRef.current = true;
      openTTSWebSocket()
        .then(() => { wsOpeningRef.current = false; })
        .catch((e) => {
          wsOpeningRef.current = false;
          console.error('Failed to pre-open TTS WebSocket:', e);
        });

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

              // Capture the request_id from the first chunk for explicit cancellation
              if (!requestIdRef.current && parsed.id) {
                requestIdRef.current = parsed.id;
                console.log('📋 Captured request_id:', parsed.id);
              }

              let content = '';

              content = parsed.choices?.[0]?.delta?.content || '';
              
              if (!content && parsed.choices?.[0]?.message?.content) {
                content = parsed.choices[0].message.content;
              }

              if (content) {
                fullResponseText += content;

                // Start timing from the very first content token
                if (streamStartTimeRef.current === 0) {
                  streamStartTimeRef.current = performance.now();
                }

                // Count token (each SSE delta ≈ 1 token)
                totalTokenCountRef.current++;
                
                // Track display text length BEFORE parsing so we can extract
                // only the newly-added response text for TTS (not thinking text).
                const prevDisplayLen = state.displayText.length;
                const wasInThinking = state.inThinkingMode;
                state = processStreamChunk(
                  content, 
                  state, 
                  uiSettings.thinkingStartToken, 
                  uiSettings.thinkingEndToken
                );

                // Categorize token as reasoning or response
                if (wasInThinking && state.inThinkingMode) {
                  reasoningTokenCountRef.current++;
                } else if (!wasInThinking && !state.inThinkingMode) {
                  responseTokenCountRef.current++;
                } else {
                  // Transition token — count towards the mode it ended in
                  if (state.inThinkingMode) {
                    reasoningTokenCountRef.current++;
                  } else {
                    responseTokenCountRef.current++;
                  }
                }

                // Live stats update (throttled via React batching)
                const elapsedSec = (performance.now() - streamStartTimeRef.current) / 1000;
                setTokenStats({
                  totalTokens: totalTokenCountRef.current,
                  reasoningTokens: reasoningTokenCountRef.current,
                  responseTokens: responseTokenCountRef.current,
                  tokensPerSec: elapsedSec > 0 ? totalTokenCountRef.current / elapsedSec : 0,
                });
                
                const cleanedResponse = cleanResponseContent(state.displayText);
                setResponse(cleanedResponse);
                
                setThinkingContent(cleanThinkingContent(state.thinking, uiSettings.thinkingStartToken, uiSettings.thinkingEndToken));
                setIsThinking(state.inThinkingMode);
                
                // Only send the NEW display text to TTS — never raw content delta,
                // which may include thinking text before the end token.
                const newDisplayText = state.displayText.slice(prevDisplayLen);
                if (!state.inThinkingMode && newDisplayText && newDisplayText.trim()) {
                  processTextForAudio(newDisplayText);
                }
              }
            } 
            catch (jsonError) {
              console.error("JSON parse error even after sanitization:", jsonError);
              
              const contentMatch = data.match(/'content':\s*'([^']*)'/);
              if (contentMatch && contentMatch[1]) {
                const content = contentMatch[1];
                fullResponseText += content;

                if (streamStartTimeRef.current === 0) {
                  streamStartTimeRef.current = performance.now();
                }
                totalTokenCountRef.current++;
                if (state.inThinkingMode) {
                  reasoningTokenCountRef.current++;
                } else {
                  responseTokenCountRef.current++;
                }
                const elapsedSec = (performance.now() - streamStartTimeRef.current) / 1000;
                setTokenStats({
                  totalTokens: totalTokenCountRef.current,
                  reasoningTokens: reasoningTokenCountRef.current,
                  responseTokens: responseTokenCountRef.current,
                  tokensPerSec: elapsedSec > 0 ? totalTokenCountRef.current / elapsedSec : 0,
                });
                
                const prevDisplayLen = state.displayText.length;
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
                
                const newDisplayText = state.displayText.slice(prevDisplayLen);
                if (!state.inThinkingMode && newDisplayText && newDisplayText.trim()) {
                  processTextForAudio(newDisplayText);
                }
              }
            }
          }
        }
      }

      console.log("=== STREAMING COMPLETE ===");
      console.log("Total response length:", fullResponseText.length);
      console.log("Audio queue length:", audioQueueRef.current.length);

      // Send EOS to WebSocket to flush remaining buffered text and close
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          // Send any pending text first
          if (pendingTextRef.current) {
            sendTextToTTS(pendingTextRef.current);
            pendingTextRef.current = '';
          }
          // Signal end of stream — server will send remaining audio + isFinal
          wsRef.current.send(JSON.stringify({ text: '' }));
          console.log('📤 Sent EOS to TTS WebSocket');
        } catch { /* socket may already be closed */ }
      }

    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        setResponse((prev) => prev + '\n\n[Generation stopped]');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      streamReaderRef.current = null;
      setIsGenerating(false);
      isGeneratingRef.current = false;
      setIsThinking(false);
    }
  };

  const stopGeneration = () => {
    // 1. Explicitly cancel the model generation on the backend via the cancel endpoint
    if (requestIdRef.current) {
      const cancelUrl = API_CONFIG.saarthiBaseUrl + '/cancel';
      fetch(cancelUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestIdRef.current }),
      })
        .then(() => console.log('✅ Backend generation cancelled for request:', requestIdRef.current))
        .catch((e) => console.error('Failed to cancel backend generation:', e));
      requestIdRef.current = null;
    }

    // 2. Cancel the stream reader so the read loop exits immediately
    if (streamReaderRef.current) {
      streamReaderRef.current.cancel().catch(() => {});
      streamReaderRef.current = null;
    }
    // 3. Abort the fetch so the request is cancelled on the client side
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    // 4. Stop any auto-playing audio and close TTS WebSocket
    stopAudioPlayback();
    // 5. Reset UI to "not generating" immediately
    setIsGenerating(false);
    isGeneratingRef.current = false;
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
    setTokenStats(null);
  };

  // Response: update directly — the SSE stream already provides a natural typing
  // effect.  The old character-by-character animation caused ~60 ReactMarkdown
  // re-renders/second which produced visible layout jitter ("shaking").
  useEffect(() => {
    setDisplayedResponse(response);
  }, [response]);

  // Thinking: also update directly from stream
  useEffect(() => {
    setDisplayedThinking(thinkingContent);
  }, [thinkingContent]);

  // Auto-scroll thinking content when expanded
  useEffect(() => {
    if (thinkingRef.current && displayedThinking && reasoningExpanded) {
      thinkingRef.current.scrollTo({
        top: thinkingRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [displayedThinking, reasoningExpanded]);

  // Detect user scroll — when the user scrolls away from the bottom, stop
  // auto-scrolling so they can read earlier content.  Resume auto-scroll
  // once they scroll back near the bottom.
  const handleResponseScroll = () => {
    const container = responseContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    userScrolledAwayRef.current = distanceFromBottom > 150;
  };

  // Auto-scroll response section — batched with paint via RAF to prevent jitter
  useEffect(() => {
    if (!displayedResponse) return;
    if (userScrolledAwayRef.current) return;

    requestAnimationFrame(() => {
      const container = responseContainerRef.current;
      if (!container || userScrolledAwayRef.current) return;
      container.scrollTop = container.scrollHeight;
    });
  }, [displayedResponse]);

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
    return 'Sarthi Agri-Model';
  };

  const getDisplayValue = (value: string): string => {
    return HINDI_TO_ENGLISH_MAP[value] || value;
  };

  return (
    <div className="min-h-screen bg-[#eef2f6]">
      <div className="relative flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-[#f6f8fa] border-r border-slate-200/80 flex flex-col">
          {/* Logo Header */}
          <div className="px-10 py-10 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-3xl bg-white/80 shadow-sm border border-slate-200/60 flex items-center justify-center">
                <img
                  src={companyLogo}
                  alt="Company Logo"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight ">Agri-Reasoning</h1>
                <p className="text-lg font-bold text-slate-900 tracking-tight"> Advisor</p>
              </div>
            </div>
          </div>

          {/* API Provider Selection */}
          <div className="p-3 border-b border-slate-200">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Zap size={12} />
                API Provider
              </label>
              <div className="w-full px-3 py-2 bg-white/60 border border-slate-200/80 rounded-lg text-slate-900 text-sm">
                Sarthi Agri-Model
              </div>
            </div>
          </div>

          {/* Input Parameters */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
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
              <div className="text-xs text-slate-500 mb-2">
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
              <div className="text-xs text-slate-500 mt-2 p-2 bg-white/40 rounded-lg border border-slate-200/60">
                Text between these tokens will be shown in a separate "thinking" window, 
                and the final response will display clean text without the reasoning.
              </div>
            </CollapsibleSection>
          </div>

          {/* Generate Button */}
          <div className="p-3 border-t border-slate-200 space-y-2">
            <button
              onClick={clearConversation}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all"
            >
              <RefreshCw size={16} />
              Clear Response
            </button>
            
            {isGenerating ? (
              <button
                onClick={stopGeneration}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Loader2 className="animate-spin" size={20} />
                Stop Generation
              </button>
            ) : (
              <button
                onClick={() => generateAdvisory()}
                disabled={!uiSettings.crop || !uiSettings.region}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:shadow-none"
              >
                <Sparkles size={20} />
                Generate Advisory
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header Bar */}
          <div className="h-14 border-b border-slate-200/80 flex items-center justify-between px-6 bg-[#f6f8fa]">
            <div className="flex items-center gap-2">
              <Brain size={18} className="text-emerald-800" />
              <span className="text-sm font-medium text-emerald-800">Agricultural Advisory Response</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full animate-pulse ${getProviderColor()}`}></span>
              <span className="text-slate-500">
                {getProviderLabel()}
              </span>
            </div>
          </div>

          {/* Response Area */}
          <>
          <div 
            ref={responseContainerRef}
            onScroll={handleResponseScroll}
            className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 scrollbar-thin bg-[#eef2f6]"
          >
            <div className="max-w-6xl mx-auto">
              {error && (
                <div className="mb-4">
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-red-600">{error}</div>
                  </div>
                </div>
              )}

              {!response && !isGenerating && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center min-h-[calc(100vh-14rem)]">
                  <h2 className="text-4xl font-bold text-slate-800 mb-1">Sarthi 🌿</h2>
                  <p className="text-slate-500 max-w-md mb-8">
                    Enter your farming parameters in the sidebar and click "Generate Advisory" 
                    to receive AI-powered agricultural recommendations.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mb-6">
                    {['Crop Management', 'Pest Control', 'Fertilizer Advice', 'Irrigation Schedule'].map((tag) => (
                      <span key={tag} className="px-3 py-1.5 bg-white/60 border border-slate-200/80 rounded-full text-xs text-slate-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(response || isGenerating) && (
                <>
                  {/* User Query Summary */}
                  <div className="mb-6 p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium mb-2">
                      <Send size={14} />
                      Query Parameters
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {uiSettings.month && (
                        <span className="px-2 py-1 bg-white/60 rounded-md text-xs text-slate-600 border border-slate-200/60">
                          📅 {uiSettings.month}
                        </span>
                      )}
                      {uiSettings.growthStage && (
                        <span className="px-2 py-1 bg-white/60 rounded-md text-xs text-slate-600 border border-slate-200/60">
                          🌱 {uiSettings.growthStage}
                        </span>
                      )}
                      {uiSettings.weather && (
                        <span className="px-2 py-1 bg-white/60 rounded-md text-xs text-slate-600 border border-slate-200/60">
                          🌤️ {uiSettings.weather}
                        </span>
                      )}
                      {uiSettings.soilType && (
                        <span className="px-2 py-1 bg-white/60 rounded-md text-xs text-slate-600 border border-slate-200/60">
                          🏔️ {uiSettings.soilType}
                        </span>
                      )}
                      {uiSettings.farmingPractice && (
                        <span className="px-2 py-1 bg-white/60 rounded-md text-xs text-slate-600 border border-slate-200/60">
                          🚜 {uiSettings.farmingPractice}
                        </span>
                      )}
                      {uiSettings.region && (
                        <span className="px-2 py-1 bg-white/60 rounded-md text-xs text-slate-600 border border-slate-200/60">
                          📍 {uiSettings.region}
                        </span>
                      )}
                      {uiSettings.language && (
                        <span className="px-2 py-1 bg-white/60 rounded-md text-xs text-slate-600 border border-slate-200/60">
                          🌐 {uiSettings.language}
                        </span>
                      )}
                      {uiSettings.crop && (
                        <span className="px-2 py-1 bg-white/60 rounded-md text-xs text-slate-600 border border-slate-200/60">
                          🌾 {uiSettings.crop}
                        </span>
                      )}
                      {uiSettings.stress && (
                        <span className="px-2 py-1 bg-white/60 rounded-md text-xs text-slate-600 border border-slate-200/60">
                          ⚠️ {uiSettings.stress}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thinking Content */}
                  {(thinkingContent || displayedThinking) && (
                    <div className="mb-4">
                      <div className={`border rounded-xl overflow-hidden ${isThinking ? 'bg-amber-50/50 border-amber-200/80' : 'bg-white/50 border-slate-200/80'}`}>
                        <div className={`flex items-center gap-2 px-3 py-2 border-b ${isThinking ? 'border-amber-100 bg-amber-50/30' : 'border-slate-200/60 bg-[#f6f8fa]'}`}>
                          <Brain size={16} className={isThinking ? 'text-amber-600 animate-pulse' : 'text-slate-500'} />
                          <span className={`font-medium text-sm ${isThinking ? 'text-amber-700' : 'text-slate-600'}`}>
                            {isThinking ? 'Model is thinking...' : 'Reasoning Process'}
                          </span>
                          
                          <button
                            onClick={() => setReasoningExpanded(!reasoningExpanded)}
                            className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
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
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                          )}
                        </div>
                        <div 
                          ref={thinkingRef}
                          className={`overflow-y-auto scrollbar-thin ${
                            reasoningExpanded ? 'max-h-96' : 'max-h-32'
                          }`}
                        >
                          <pre className={`text-xs whitespace-pre-wrap font-mono leading-relaxed p-3 ${isThinking ? 'text-amber-800' : 'text-slate-600'}`}>
                            {displayedThinking}
                            {isThinking && displayedThinking.length < thinkingContent.length && (
                              <span className="inline-block w-1.5 h-3 bg-amber-500 animate-pulse ml-0.5 rounded-sm"></span>
                            )}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stats bar during reasoning (before response arrives) */}
                  {tokenStats && !response && (
                    <div className="mb-4 px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span>Total: <span className="font-semibold text-slate-700">{tokenStats.totalTokens}</span></span>
                        <span>Reasoning: <span className="font-semibold text-amber-600">{tokenStats.reasoningTokens}</span></span>
                        <span>Response: <span className="font-semibold text-emerald-600">{tokenStats.responseTokens}</span></span>
                        <span><span className="font-semibold text-blue-600">{tokenStats.tokensPerSec.toFixed(1)}</span> tok/s</span>
                      </div>
                    </div>
                  )}

                  {/* Response Content */}
                  <div className="relative">
                    {/* Audio Controls + Token Stats Bar (once response is present) */}
                    {response && (
                      <div className="flex items-center justify-between mb-4">
                        {/* Token Stats (left side) */}
                        <div className="flex items-center gap-3">
                          {tokenStats && (
                            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span>Total: <span className="font-semibold text-slate-700">{tokenStats.totalTokens}</span></span>
                              <span>Reasoning: <span className="font-semibold text-amber-600">{tokenStats.reasoningTokens}</span></span>
                              <span>Response: <span className="font-semibold text-emerald-600">{tokenStats.responseTokens}</span></span>
                              <span><span className="font-semibold text-blue-600">{tokenStats.tokensPerSec.toFixed(1)}</span> tok/s</span>
                            </div>
                          )}
                        </div>
                        {/* Audio button (right side) */}
                        <button
                          onClick={toggleAudioPlayback}
                          disabled={!response}
                          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isPlayingAudio 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100' 
                              : isPausedAudio
                              ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          } ${!response ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      className="prose prose-emerald max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-emerald-700 prose-li:text-slate-700 prose-a:text-emerald-600 prose-code:text-slate-800 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-100 prose-pre:border prose-pre:border-slate-200"
                    >
                      <ReactMarkdown>{displayedResponse}</ReactMarkdown>
                      {isGenerating && !isThinking && displayedResponse.length < response.length && (
                        <span className="inline-block w-2 h-5 bg-emerald-600 animate-pulse ml-1 rounded-sm"></span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="h-12 border-t border-slate-200/80 flex items-center justify-center bg-[#f6f8fa]">
            <p className="text-xs text-slate-400">
              Powered by Soket AI Labs : Part of IndiaAI initiative 🇮🇳
            </p>
          </div>
          </>
        </div>
      </div>
    </div>
  );
};

export default AgriAdvisoryInterface;
















