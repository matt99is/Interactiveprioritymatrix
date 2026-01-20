import { useState, useRef, useEffect } from 'react';
import svgPaths from "../imports/svg-0wmr23ctf7";
import svgPathsModal from "../imports/svg-3ic5blb7dx";

interface DataPoint {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  color: string;
  title: string;
  description: string;
  figmaSlideUrl?: string;
  highlightReelUrl?: string;
  resourceLinkA?: string;
  resourceLinkB?: string;
}

interface FormData {
  title: string;
  summary: string;
  severity: number; // 1-4
  prevalence: number; // 0-100
  figmaSlideUrl: string;
  highlightReelUrl: string;
  resourceLinkA: string;
  resourceLinkB: string;
}

interface LinkPreview {
  title?: string;
  thumbnail?: string;
  domain?: string;
  isValid: boolean;
  isLoading?: boolean;
  type?: 'figma' | 'youtube' | 'vimeo' | 'generic';
}

interface MusicTrack {
  id: string;
  label: string;
  keywords: string[];
  bpm: number;
  pattern: number[];
  oscType: OscillatorType;
  filterFreq?: number;
  bars: number;
}

interface WebAudioSynth {
  context: AudioContext | null;
  masterGain: GainNode | null;
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  intervalId: NodeJS.Timeout | null;
  currentStep: number;
  noiseBuffer: AudioBuffer | null;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  shape: 'square' | 'circle';
  delay: number;
}

interface TooltipProps {
  text: string;
  position: { x: number; y: number };
  isVisible: boolean;
}

const initialDataPoints: DataPoint[] = [
  {
    id: "1",
    x: 75,
    y: 25,
    color: "#E02440",
    title: "Critical Issue #1",
    description: "High severity, high prevalence issue requiring immediate attention and comprehensive solution strategy."
  },
  {
    id: "2",
    x: 85,
    y: 40,
    color: "#E02440",
    title: "Critical Issue #2",
    description: "Urgent problem affecting multiple users with significant impact on system performance."
  },
  {
    id: "3",
    x: 78,
    y: 50,
    color: "#E02440",
    title: "Critical Issue #3",
    description: "Major functionality breakdown requiring developer intervention and user communication."
  },
  {
    id: "4",
    x: 80,
    y: 60,
    color: "#E02440",
    title: "Critical Issue #4",
    description: "Security vulnerability with potential data exposure risks that needs immediate patching."
  },
  {
    id: "5",
    x: 55,
    y: 30,
    color: "#E02440",
    title: "Critical Issue #5",
    description: "Performance degradation causing user experience issues across multiple platform areas."
  },
  {
    id: "6",
    x: 45,
    y: 50,
    color: "#E02440",
    title: "Critical Issue #6",
    description: "Integration failure affecting third-party services and automated workflow processes."
  },
  {
    id: "7",
    x: 35,
    y: 75,
    color: "#FFB900",
    title: "Medium Priority Issue #1",
    description: "Moderate impact issue that affects some users but has workaround solutions available."
  },
  {
    id: "8",
    x: 55,
    y: 80,
    color: "#FFB900",
    title: "Medium Priority Issue #2",
    description: "Feature enhancement request that would improve user experience but not critical."
  },
  {
    id: "9",
    x: 40,
    y: 90,
    color: "#FFB900",
    title: "Medium Priority Issue #3",
    description: "UI inconsistency that creates confusion but doesn't prevent task completion."
  },
  {
    id: "10",
    x: 80,
    y: 95,
    color: "#E02440",
    title: "Critical Issue #7",
    description: "Database connectivity issue causing intermittent service disruptions and data sync problems."
  }
];

// Musical patterns - frequencies in Hz
const musicTracks: MusicTrack[] = [
  {
    id: 'hardcore',
    label: 'Hardcore Punk',
    keywords: ['angry', 'frustrated', 'mad', 'rage', 'furious'],
    bpm: 170,
    // E minor power chord riff: E4, B3, E4, D4, C4, B3, E4
    pattern: [329.63, 246.94, 329.63, 293.66, 261.63, 246.94, 329.63],
    oscType: 'sawtooth',
    filterFreq: 3000,
    bars: 2
  },
  {
    id: 'happy',
    label: 'Animal Crossing vibes',
    keywords: ['happy', 'joy', 'excited', 'cheerful', 'upbeat', 'energetic'],
    bpm: 100,
    // C major pentatonic: C5, D5, E5, G5, A5, G5, E5, D5
    pattern: [523.25, 587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33],
    oscType: 'triangle',
    bars: 2
  },
  {
    id: 'lofi',
    label: 'Focus/Lo-fi',
    keywords: [],
    bpm: 80,
    // Lo-fi chord progression: Cmaj7, Am7, Dm7, G7
    pattern: [523.25, 440.00, 587.33, 392.00], // Root notes of chords
    oscType: 'sine',
    filterFreq: 1200,
    bars: 4
  }
];

const confettiColors = [
  '#E02440', // Red
  '#FFB900', // Yellow
  '#0059AB', // Blue
  '#00AA28', // Green
  '#9C5FE4', // Purple
  '#FF6B6B', // Light red
  '#4ECDC4', // Teal
  '#45B7D1', // Light blue
  '#F9CA24', // Golden
  '#F0932B'  // Orange
];

function detectMoodFromInput(input: string): MusicTrack {
  const lowerInput = input.toLowerCase();
  
  for (const track of musicTracks) {
    if (track.keywords.some(keyword => lowerInput.includes(keyword))) {
      return track;
    }
  }
  
  // Return lo-fi as default
  return musicTracks.find(track => track.id === 'lofi') || musicTracks[2];
}

// Dark mode utilities
function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

function toggleDarkMode(): void {
  if (typeof window === 'undefined') return;
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', document.documentElement.classList.contains('dark').toString());
}

// Initialize dark mode from localStorage
function initializeDarkMode(): void {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('darkMode');
  if (saved === 'true') {
    document.documentElement.classList.add('dark');
  }
}

// Confetti utilities
function createConfettiPiece(id: number): ConfettiPiece {
  // Create random angle and distance for burst effect
  const angle = (Math.PI * 2 * id) / 50 + (Math.random() - 0.5) * 0.5;
  const distance = 150 + Math.random() * 200; // Random distance between 150-350px
  
  return {
    id,
    x: Math.cos(angle) * distance, // X displacement from center
    y: Math.sin(angle) * distance * 0.6, // Y displacement (less vertical initially)
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    shape: Math.random() > 0.5 ? 'square' : 'circle',
    delay: Math.random() * 200 // Slight stagger for more natural effect
  };
}

function triggerConfetti(): void {
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'fixed inset-0 pointer-events-none z-[9999]';
  document.body.appendChild(confettiContainer);

  // Create 50 confetti pieces
  for (let i = 0; i < 50; i++) {
    const piece = createConfettiPiece(i);
    const element = document.createElement('div');
    
    element.className = 'confetti-piece';
    element.style.backgroundColor = piece.color;
    element.style.animationDelay = `${piece.delay}ms`;
    element.style.borderRadius = piece.shape === 'circle' ? '50%' : '0';
    // Set CSS custom properties for animation trajectory
    element.style.setProperty('--tx', `${piece.x}px`);
    element.style.setProperty('--ty', `${piece.y}px`);
    
    confettiContainer.appendChild(element);
  }

  // Clean up after animation completes
  setTimeout(() => {
    if (confettiContainer.parentNode) {
      confettiContainer.parentNode.removeChild(confettiContainer);
    }
  }, 3000);
}

// Web Audio API Synth Functions
function createAudioContext(): AudioContext | null {
  try {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    return context;
  } catch (e) {
    console.warn('Web Audio API not supported');
    return null;
  }
}

function createNoiseBuffer(context: AudioContext): AudioBuffer {
  const bufferSize = context.sampleRate * 0.1; // 100ms of noise
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const output = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  
  return buffer;
}

function createWaveShaper(context: AudioContext): WaveShaperNode {
  const shaper = context.createWaveShaper();
  const samples = 44100;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;
  
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((3 + 20) * x * 20 * deg) / (Math.PI + 20 * Math.abs(x));
  }
  
  shaper.curve = curve;
  shaper.oversample = '4x';
  return shaper;
}

function playNote(
  synth: WebAudioSynth,
  frequency: number,
  duration: number,
  track: MusicTrack,
  startTime: number
) {
  if (!synth.context || !synth.masterGain) return;

  const context = synth.context;
  const osc = context.createOscillator();
  const gainNode = context.createGain();
  
  osc.type = track.oscType;
  osc.frequency.setValueAtTime(frequency, startTime);
  
  // ADSR Envelope
  const attack = 0.02;
  const decay = 0.1;
  const sustain = 0.6;
  const release = 0.15;
  
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.3 * sustain, startTime + attack + decay);
  gainNode.gain.setValueAtTime(0.3 * sustain, startTime + duration - release);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  // Create audio chain
  let audioChain = osc;
  
  // Add distortion for hardcore
  if (track.id === 'hardcore') {
    const distortion = createWaveShaper(context);
    osc.connect(distortion);
    audioChain = distortion as any;
  }
  
  // Add filter if specified
  if (track.filterFreq) {
    const filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(track.filterFreq, startTime);
    (audioChain as any).connect(filter);
    audioChain = filter as any;
  }
  
  // Add delay for happy track (reverb-ish tail)
  if (track.id === 'happy') {
    const delay = context.createDelay(0.3);
    const delayGain = context.createGain();
    const feedback = context.createGain();
    
    delay.delayTime.setValueAtTime(0.12, startTime);
    delayGain.gain.setValueAtTime(0.3, startTime);
    feedback.gain.setValueAtTime(0.3, startTime);
    
    (audioChain as any).connect(delay);
    delay.connect(delayGain);
    delayGain.connect(feedback);
    feedback.connect(delay);
    delayGain.connect(gainNode);
  }
  
  // Add subtle noise for lofi
  if (track.id === 'lofi' && synth.noiseBuffer) {
    const noiseSource = context.createBufferSource();
    const noiseGain = context.createGain();
    noiseSource.buffer = synth.noiseBuffer;
    noiseSource.loop = true;
    noiseGain.gain.setValueAtTime(0.02, startTime);
    
    noiseSource.connect(noiseGain);
    noiseGain.connect(gainNode);
    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);
  }
  
  (audioChain as any).connect(gainNode);
  gainNode.connect(synth.masterGain);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function startPlayback(synth: WebAudioSynth, track: MusicTrack) {
  if (!synth.context || synth.isPlaying) return;

  synth.currentTrack = track;
  synth.isPlaying = true;
  synth.currentStep = 0;
  
  const stepDuration = (60 / track.bpm) / 2; // 8th notes
  const barDuration = stepDuration * 8; // 8 eighth notes per bar
  const loopDuration = barDuration * track.bars;
  
  function scheduleNextStep() {
    if (!synth.context || !synth.isPlaying || !synth.currentTrack) return;
    
    const now = synth.context.currentTime;
    const stepTime = now + 0.1; // Schedule slightly ahead
    
    const patternIndex = synth.currentStep % track.pattern.length;
    const frequency = track.pattern[patternIndex];
    
    let noteDuration = stepDuration;
    
    // For lofi, play longer chord notes
    if (track.id === 'lofi') {
      noteDuration = stepDuration * 4; // Half note duration
    }
    
    playNote(synth, frequency, noteDuration, track, stepTime);
    
    synth.currentStep++;
    
    // Loop back after completing the pattern
    if (synth.currentStep >= track.pattern.length * track.bars) {
      synth.currentStep = 0;
    }
    
    // Schedule next step
    synth.intervalId = setTimeout(scheduleNextStep, stepDuration * 1000);
  }
  
  scheduleNextStep();
}

function stopPlayback(synth: WebAudioSynth) {
  synth.isPlaying = false;
  synth.currentTrack = null;
  synth.currentStep = 0;
  
  if (synth.intervalId) {
    clearTimeout(synth.intervalId);
    synth.intervalId = null;
  }
}

function setMasterVolume(synth: WebAudioSynth, volume: number) {
  if (synth.masterGain) {
    synth.masterGain.gain.setValueAtTime(volume, synth.context?.currentTime || 0);
  }
}

function isValidUrl(string: string): boolean {
  if (!string) return true; // Empty strings are valid for optional fields
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function extractVideoThumbnail(url: string): string | null {
  if (!url) return null;
  
  // YouTube thumbnail extraction
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (youtubeMatch) {
    return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`;
  }
  
  return null;
}

async function getFigmaThumbnail(url: string): Promise<string | null> {
  // In a real implementation, you would:
  // 1. Extract the file ID from the URL
  // 2. Make a request to Figma's API or oEmbed endpoint
  // 3. Return the thumbnail URL
  // For now, we'll simulate this and return null to show fallback
  return null;
}

function getFigmaPreview(url: string): LinkPreview {
  if (!url || !isValidUrl(url)) {
    return { isValid: false };
  }
  
  if (url.includes('figma.com')) {
    // Extract file ID from Figma URL for better preview handling
    const fileMatch = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
    return {
      title: 'Figma Slide',
      thumbnail: null,
      domain: 'figma.com',
      isValid: true,
      type: 'figma'
    };
  }
  
  return { isValid: false };
}

function getVideoPreview(url: string): LinkPreview {
  if (!url || !isValidUrl(url)) {
    return { isValid: false };
  }
  
  const thumbnail = extractVideoThumbnail(url);
  const domain = new URL(url).hostname;
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return {
      title: 'YouTube Video',
      thumbnail,
      domain: 'youtube.com',
      isValid: true,
      type: 'youtube'
    };
  }
  
  if (url.includes('vimeo.com')) {
    return {
      title: 'Vimeo Video',
      thumbnail: null,
      domain: 'vimeo.com',
      isValid: true,
      type: 'vimeo'
    };
  }
  
  return {
    title: 'Video Preview',
    thumbnail: null,
    domain,
    isValid: true,
    type: 'generic'
  };
}

function Tooltip({ text, position, isVisible }: TooltipProps) {
  if (!isVisible || typeof window === 'undefined') return null;

  // Calculate tooltip positioning to avoid edges
  const tooltipStyle = {
    left: `${Math.min(Math.max(position.x - 75, 10), window.innerWidth - 160)}px`,
    top: `${Math.max(position.y - 35, 10)}px`,
  };

  return (
    <div
      className="fixed z-[60] px-3 py-1.5 bg-popover text-popover-foreground rounded-md shadow-lg border border-border pointer-events-none whitespace-nowrap max-w-xs"
      style={tooltipStyle}
    >
      <span className="font-normal text-sm">{text}</span>
      {/* Arrow pointing down */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-popover"></div>
    </div>
  );
}

function DarkModeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-8 right-8 w-12 h-12 bg-card border border-border text-foreground rounded-lg hover:bg-secondary transition-colors shadow-lg hover:shadow-xl flex items-center justify-center z-50"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

function LinkPreviewComponent({ 
  url, 
  type, 
  className = "" 
}: { 
  url: string; 
  type: 'figma' | 'video'; 
  className?: string; 
}) {
  const [thumbnailState, setThumbnailState] = useState<{
    loading: boolean;
    thumbnail: string | null;
    error: boolean;
  }>({
    loading: false,
    thumbnail: null,
    error: false
  });

  const preview = type === 'figma' ? getFigmaPreview(url) : getVideoPreview(url);

  useEffect(() => {
    if (!url || !preview.isValid) return;

    if (type === 'figma') {
      setThumbnailState({ loading: true, thumbnail: null, error: false });
      // Simulate attempting to fetch Figma thumbnail
      getFigmaThumbnail(url).then(thumbnail => {
        setThumbnailState({ loading: false, thumbnail, error: !thumbnail });
      }).catch(() => {
        setThumbnailState({ loading: false, thumbnail: null, error: true });
      });
    } else if (preview.thumbnail) {
      // For videos with thumbnails, test if the thumbnail loads
      setThumbnailState({ loading: true, thumbnail: null, error: false });
      const img = new Image();
      img.onload = () => {
        setThumbnailState({ loading: false, thumbnail: preview.thumbnail, error: false });
      };
      img.onerror = () => {
        setThumbnailState({ loading: false, thumbnail: null, error: true });
      };
      img.src = preview.thumbnail;
    } else {
      setThumbnailState({ loading: false, thumbnail: null, error: false });
    }
  }, [url, type, preview.isValid, preview.thumbnail]);
  
  if (!url || !preview.isValid) {
    return (
      <div className={`bg-muted rounded-lg h-24 flex items-center justify-center border border-border ${className}`}>
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-2 bg-secondary rounded flex items-center justify-center">
            <span className="text-muted-foreground text-lg">📄</span>
          </div>
          <span className="text-xs text-muted-foreground font-normal">
            {type === 'figma' ? 'Figma slide preview' : 'Video preview'}
          </span>
        </div>
      </div>
    );
  }

  // Show loading state
  if (thumbnailState.loading) {
    return (
      <div className={`bg-muted rounded-lg h-24 flex items-center justify-center border border-border ${className}`}>
        <div className="text-center">
          <div className="w-6 h-6 mx-auto mb-2 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-muted-foreground font-normal">Loading preview...</span>
        </div>
      </div>
    );
  }

  // Show thumbnail if available
  if (thumbnailState.thumbnail) {
    return (
      <div className={`bg-muted rounded-lg h-24 border border-border overflow-hidden ${className}`}>
        <div className="relative h-full">
          <img 
            src={thumbnailState.thumbnail} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
            <p className="text-xs font-medium truncate">{preview.title}</p>
            <p className="text-xs opacity-75 font-normal">{preview.domain}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show elegant fallback cards
  if (type === 'figma') {
    return (
      <div className={`bg-secondary rounded-lg h-24 border border-border flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center justify-center text-center p-3">
          {/* Clean official Figma logo */}
          <div className="w-8 h-8 mb-2 flex items-center justify-center">
            <svg className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.242 24c-2.478 0-4.49-2.014-4.49-4.49s2.012-4.49 4.49-4.49h4.588v4.49c0 2.476-2.012 4.49-4.588 4.49z"/>
              <path d="M8.242 15.02c-2.478 0-4.49-2.014-4.49-4.49s2.012-4.49 4.49-4.49 4.49 2.014 4.49 4.49-2.012 4.49-4.49 4.49z"/>
              <path d="M8.242 6.04c-2.478 0-4.49-2.014-4.49-4.49S5.764-2.44 8.242-2.44h4.588v8.98h-4.588z"/>
              <path d="M12.83 6.04V-2.44h4.588c2.478 0 4.49 2.014 4.49 4.49s-2.012 4.49-4.49 4.49H12.83z"/>
              <path d="M21.908 10.53c0 2.476-2.012 4.49-4.49 4.49s-4.49-2.014-4.49-4.49 2.012-4.49 4.49-4.49 4.49 2.014 4.49 4.49z"/>
            </svg>
          </div>
          <span className="text-sm text-foreground font-normal">Figma Slide</span>
        </div>
      </div>
    );
  } else {
    // Video fallback
    return (
      <div className={`bg-secondary rounded-lg h-24 border border-border flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center justify-center text-center p-3">
          <div className="w-8 h-8 mb-2 flex items-center justify-center">
            {preview.type === 'youtube' ? (
              <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            ) : preview.type === 'vimeo' ? (
              <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 2.63-2.332c1.2-1.058 2.106-1.614 2.708-1.614 1.409 0 2.27 1.214 2.577 3.642.33 2.62.558 4.25.558 4.25.33 1.498.806 2.246 1.396 2.246.459 0 1.148-.728 2.064-2.184.917-1.456 1.406-2.567 1.467-3.331.119-1.268-.326-1.902-1.338-1.902-.476 0-.967.108-1.467.324.974-3.187 2.836-4.743 5.587-4.66 2.036.061 2.994 1.388 2.795 3.98z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
          <span className="text-sm text-foreground font-normal">
            {preview.type === 'youtube' ? 'YouTube Video' : 
             preview.type === 'vimeo' ? 'Vimeo Video' : 
             'Video Preview'}
          </span>
        </div>
      </div>
    );
  }
}

function MoodModal({ 
  isOpen, 
  onClose, 
  onPlay 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onPlay: (mood: string) => void;
}) {
  const [mood, setMood] = useState('');
  const moodInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && moodInputRef.current) {
      moodInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handlePlay = () => {
    if (mood.trim()) {
      onPlay(mood.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setMood('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePlay();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-sm bg-black/20' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-popover border border-[#0059AB]/20 rounded-lg shadow-[var(--elevation-sm)] p-8 max-w-sm w-full mx-4 transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors group"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h3 className="text-popover-foreground mb-6 font-bold">What's your mood?</h3>
          </div>

          <div className="space-y-2">
            <input
              ref={moodInputRef}
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground font-normal"
              placeholder="e.g., happy, angry, calm…"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handlePlay}
              disabled={!mood.trim()}
              className="flex-1 py-2 px-4 bg-[#0059AB] text-white rounded-md hover:bg-[#0059AB]/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed font-bold"
            >
              Play
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-2 px-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MusicControlDock({
  isVisible,
  isPlaying,
  volume,
  currentTrack,
  onPlayPause,
  onVolumeChange,
  onStop
}: {
  isVisible: boolean;
  isPlaying: boolean;
  volume: number;
  currentTrack: string;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onStop: () => void;
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-8 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-4 z-40">
      <button
        onClick={onPlayPause}
        className="w-8 h-8 flex items-center justify-center bg-muted text-muted-foreground rounded-full hover:bg-secondary transition-colors"
        aria-label="Play or pause music"
      >
        {isPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        )}
      </button>
      
      <div className="flex items-center gap-2 min-w-[120px]">
        <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3z"/>
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => onVolumeChange(parseInt(e.target.value))}
          className="flex-1 h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider:bg-muted"
          aria-label="Music volume"
        />
        <span className="text-xs text-muted-foreground w-8 font-normal">{volume}%</span>
      </div>

      <button
        onClick={onStop}
        className="text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Stop music"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 0 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
        </svg>
      </button>
    </div>
  );
}

function Toast({ 
  isVisible, 
  message 
}: { 
  isVisible: boolean; 
  message: string; 
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-32 left-8 bg-popover text-popover-foreground px-4 py-2 rounded-lg shadow-lg z-50 border border-border">
      <span className="text-sm font-normal">{message}</span>
    </div>
  );
}

function AudioErrorMessage({ 
  isVisible, 
  onRetry 
}: { 
  isVisible: boolean; 
  onRetry: () => void;
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-8 bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-3 z-40">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-normal text-foreground">Audio blocked—click Play again to enable sound</span>
        <button
          onClick={onRetry}
          className="text-primary hover:text-primary/80 transition-colors underline text-sm font-normal"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function getDataPointColor(severity: number, prevalence: number): string {
  // High severity (3-4) and high prevalence (>50%) = Critical (red)
  if (severity >= 3 && prevalence > 50) {
    return "#E02440";
  }
  // Otherwise medium priority (yellow)
  return "#FFB900";
}

function convertSeverityToX(severity: number): number {
  // Severity 1-4 maps to X axis: 1 = 25%, 2 = 50%, 3 = 75%, 4 = 100%
  return (severity / 4) * 100;
}

function convertPrevalenceToY(prevalence: number): number {
  // Prevalence 0-100% maps to Y axis: 100% = 0% (top), 0% = 100% (bottom)
  return 100 - prevalence;
}

function PasswordModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSubmit = () => {
    if (password === 'Password') {
      onSuccess();
      handleClose();
    } else {
      setError('Incorrect password');
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPassword('');
      setError('');
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-sm bg-black/20' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-popover border border-[#0059AB]/20 rounded-lg shadow-[var(--elevation-sm)] p-8 max-w-sm w-full mx-4 transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors group"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h3 className="text-popover-foreground mb-6 font-bold">Admin Access</h3>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-popover-foreground font-normal">
              Password
            </label>
            <input
              ref={passwordInputRef}
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
              placeholder="Enter admin password"
            />
            {error && (
              <p className="caption-small text-destructive font-normal">{error}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 py-2 px-4 bg-[#0059AB] text-white rounded-md hover:bg-[#0059AB]/90 transition-colors font-bold"
            >
              Enter
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-2 px-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  dataPointTitle 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  dataPointTitle: string;
}) {
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-sm bg-black/20' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-popover border border-[#0059AB]/20 rounded-lg shadow-[var(--elevation-sm)] p-8 max-w-sm w-full mx-4 transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-popover-foreground mb-4 font-bold">Delete Data Point</h3>
            <p className="text-muted-foreground leading-relaxed font-normal">
              Are you sure you want to delete "{dataPointTitle}"? This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onConfirm}
              className="flex-1 py-2 px-4 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-bold"
            >
              Yes
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddDataModal({ 
  isOpen, 
  onClose, 
  onSave,
  editingDataPoint = null,
  isEdit = false
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (data: FormData) => void;
  editingDataPoint?: DataPoint | null;
  isEdit?: boolean;
}) {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    summary: '',
    severity: 2,
    prevalence: 50,
    figmaSlideUrl: '',
    highlightReelUrl: '',
    resourceLinkA: '',
    resourceLinkB: ''
  });

  const [urlErrors, setUrlErrors] = useState({
    figmaSlideUrl: false,
    highlightReelUrl: false,
    resourceLinkA: false,
    resourceLinkB: false
  });

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && editingDataPoint && isEdit) {
      // Convert back from position to severity/prevalence
      const severity = Math.round((editingDataPoint.x / 100) * 4) || 1;
      const prevalence = 100 - editingDataPoint.y;
      
      setFormData({
        title: editingDataPoint.title,
        summary: editingDataPoint.description,
        severity: severity,
        prevalence: prevalence,
        figmaSlideUrl: editingDataPoint.figmaSlideUrl || '',
        highlightReelUrl: editingDataPoint.highlightReelUrl || '',
        resourceLinkA: editingDataPoint.resourceLinkA || '',
        resourceLinkB: editingDataPoint.resourceLinkB || ''
      });
    }
  }, [isOpen, editingDataPoint, isEdit]);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const validateUrl = (url: string, field: keyof typeof urlErrors) => {
    if (!isValidUrl(url)) {
      setUrlErrors(prev => ({ ...prev, [field]: true }));
    } else {
      setUrlErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (['figmaSlideUrl', 'highlightReelUrl', 'resourceLinkA', 'resourceLinkB'].includes(field as string)) {
      validateUrl(value as string, field as keyof typeof urlErrors);
    }
  };

  const handleSave = () => {
    if (formData.title.trim() && !Object.values(urlErrors).some(error => error)) {
      onSave(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form after animation completes
    setTimeout(() => {
      setFormData({
        title: '',
        summary: '',
        severity: 2,
        prevalence: 50,
        figmaSlideUrl: '',
        highlightReelUrl: '',
        resourceLinkA: '',
        resourceLinkB: ''
      });
      setUrlErrors({
        figmaSlideUrl: false,
        highlightReelUrl: false,
        resourceLinkA: false,
        resourceLinkB: false
      });
    }, 300);
  };

  const isFormValid = formData.title.trim() !== '' && !Object.values(urlErrors).some(error => error);

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-sm bg-black/20' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-popover border border-[#0059AB]/20 rounded-lg shadow-[var(--elevation-sm)] p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors group"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Form Content */}
        <div className="space-y-6">
          <div>
            <h3 className="text-popover-foreground mb-6 font-bold">{isEdit ? 'Edit Data Point' : 'Add New Data Point'}</h3>
          </div>

          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-popover-foreground font-normal">
              Title *
            </label>
            <input
              ref={firstInputRef}
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground"
              placeholder="Enter issue title"
              required
            />
          </div>

          {/* Summary Field */}
          <div className="space-y-2">
            <label htmlFor="summary" className="block text-popover-foreground font-normal">
              Summary
            </label>
            <textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => handleInputChange('summary', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-input-background resize-none text-foreground"
              placeholder="Describe the issue in detail"
            />
          </div>

          {/* Figma Slide URL */}
          <div className="space-y-3">
            <label htmlFor="figmaSlideUrl" className="block text-popover-foreground font-normal">
              Figma Slide URL
            </label>
            <input
              id="figmaSlideUrl"
              type="url"
              value={formData.figmaSlideUrl}
              onChange={(e) => handleInputChange('figmaSlideUrl', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground ${
                urlErrors.figmaSlideUrl ? 'border-destructive' : 'border-border'
              }`}
              placeholder="https://figma.com/..."
            />
            {urlErrors.figmaSlideUrl && (
              <p className="caption-small text-destructive font-normal">Please enter a valid URL</p>
            )}
            <LinkPreviewComponent url={formData.figmaSlideUrl} type="figma" />
          </div>

          {/* User Testing Highlight Reel URL */}
          <div className="space-y-3">
            <label htmlFor="highlightReelUrl" className="block text-popover-foreground font-normal">
              User Testing Highlight Reel URL
            </label>
            <input
              id="highlightReelUrl"
              type="url"
              value={formData.highlightReelUrl}
              onChange={(e) => handleInputChange('highlightReelUrl', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground ${
                urlErrors.highlightReelUrl ? 'border-destructive' : 'border-border'
              }`}
              placeholder="https://youtube.com/... or https://vimeo.com/..."
            />
            {urlErrors.highlightReelUrl && (
              <p className="caption-small text-destructive font-normal">Please enter a valid URL</p>
            )}
            <LinkPreviewComponent url={formData.highlightReelUrl} type="video" />
          </div>

          {/* Severity Slider */}
          <div className="space-y-3">
            <label htmlFor="severity" className="block text-popover-foreground font-normal">
              Severity (1 = Low, 4 = High)
            </label>
            <div className="space-y-2">
              <input
                id="severity"
                type="range"
                min="1"
                max="4"
                step="1"
                value={formData.severity}
                onChange={(e) => handleInputChange('severity', parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider:bg-[#0059AB]"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
              </div>
              <div className="text-center">
                <span className="text-sm font-normal text-foreground">Selected: {formData.severity}</span>
              </div>
            </div>
          </div>

          {/* Prevalence Slider */}
          <div className="space-y-3">
            <label htmlFor="prevalence" className="block text-popover-foreground font-normal">
              Prevalence (%)
            </label>
            <div className="space-y-2">
              <input
                id="prevalence"
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.prevalence}
                onChange={(e) => handleInputChange('prevalence', parseInt(e.target.value))}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider:bg-[#0059AB]"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
              <div className="text-center">
                <span className="text-sm font-normal text-foreground">Selected: {formData.prevalence}%</span>
              </div>
            </div>
          </div>

          {/* Resource Links */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="resourceLinkA" className="block text-popover-foreground font-normal">
                Resource Link A (optional)
              </label>
              <input
                id="resourceLinkA"
                type="url"
                value={formData.resourceLinkA}
                onChange={(e) => handleInputChange('resourceLinkA', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground ${
                  urlErrors.resourceLinkA ? 'border-destructive' : 'border-border'
                }`}
                placeholder="https://..."
              />
              {urlErrors.resourceLinkA && (
                <p className="caption-small text-destructive font-normal">Please enter a valid URL</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="resourceLinkB" className="block text-popover-foreground font-normal">
                Resource Link B (optional)
              </label>
              <input
                id="resourceLinkB"
                type="url"
                value={formData.resourceLinkB}
                onChange={(e) => handleInputChange('resourceLinkB', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-input-background text-foreground ${
                  urlErrors.resourceLinkB ? 'border-destructive' : 'border-border'
                }`}
                placeholder="https://..."
              />
              {urlErrors.resourceLinkB && (
                <p className="caption-small text-destructive font-normal">Please enter a valid URL</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={!isFormValid}
              className="flex-1 py-2 px-4 bg-[#0059AB] text-white rounded-md hover:bg-[#0059AB]/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed font-bold"
            >
              {isEdit ? 'Update Data Point' : 'Add to Matrix'}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 py-2 px-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ 
  dataPoint, 
  isOpen, 
  onClose,
  isAuthenticated,
  onEdit,
  onDelete 
}: { 
  dataPoint: DataPoint; 
  isOpen: boolean; 
  onClose: () => void; 
  isAuthenticated: boolean;
  onEdit: (dataPoint: DataPoint) => void;
  onDelete: (dataPoint: DataPoint) => void;
}) {
  const handleViewSlide = () => {
    if (dataPoint.figmaSlideUrl) {
      window.open(dataPoint.figmaSlideUrl, '_blank');
    } else {
      window.open('https://example.com/slide', '_blank');
    }
  };

  const handlePlayHighlight = () => {
    if (dataPoint.highlightReelUrl) {
      window.open(dataPoint.highlightReelUrl, '_blank');
    } else {
      window.open('https://example.com/highlight-reel', '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100 backdrop-blur-sm bg-black/20' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-card rounded-lg shadow-lg p-8 max-w-md w-full mx-4 transition-all duration-300 relative ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: dataPoint.color }}
              />
              <h3 className="text-card-foreground break-words max-w-[300px] font-bold">{dataPoint.title}</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed break-words max-w-full font-normal">{dataPoint.description}</p>
          </div>

          {/* Preview Sections */}
          <div className="grid grid-cols-2 gap-4">
            {/* Figma Preview */}
            <LinkPreviewComponent 
              url={dataPoint.figmaSlideUrl || ''} 
              type="figma" 
            />
            {/* Video Preview */}
            <LinkPreviewComponent 
              url={dataPoint.highlightReelUrl || ''} 
              type="video" 
            />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleViewSlide}
              className="py-3 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-bold"
            >
              View Full Slide
            </button>
            <button
              onClick={handlePlayHighlight}
              className="py-3 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-bold"
            >
              Play Highlight Reel
            </button>
          </div>

          {/* Resource Links */}
          {(dataPoint.resourceLinkA || dataPoint.resourceLinkB) && (
            <div className="pt-2 space-y-2">
              {dataPoint.resourceLinkA && (
                <div>
                  <a
                    href={dataPoint.resourceLinkA}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors underline block break-all font-normal"
                  >
                    Resource Link A
                  </a>
                </div>
              )}
              {dataPoint.resourceLinkB && (
                <div>
                  <a
                    href={dataPoint.resourceLinkB}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors underline block break-all font-normal"
                  >
                    Resource Link B
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Admin Controls */}
          {isAuthenticated && (
            <div className="border-t border-border pt-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => onEdit(dataPoint)}
                  className="py-2 px-4 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(dataPoint)}
                  className="py-2 px-4 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function InteractivePriorityMatrix() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(initialDataPoints);
  const [selectedDataPoint, setSelectedDataPoint] = useState<DataPoint | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingDataPoint, setEditingDataPoint] = useState<DataPoint | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataPointToDelete, setDataPointToDelete] = useState<DataPoint | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  
  // Tooltip state
  const [tooltip, setTooltip] = useState<{
    text: string;
    position: { x: number; y: number };
    isVisible: boolean;
  }>({
    text: '',
    position: { x: 0, y: 0 },
    isVisible: false
  });
  
  // Music-related state
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(25); // Start at 25% volume
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [audioError, setAudioError] = useState(false);

  const addButtonRef = useRef<HTMLButtonElement>(null);
  const musicButtonRef = useRef<HTMLButtonElement>(null);
  const synthRef = useRef<WebAudioSynth>({
    context: null,
    masterGain: null,
    isPlaying: false,
    currentTrack: null,
    intervalId: null,
    currentStep: 0,
    noiseBuffer: null
  });

  // Initialize dark mode on mount
  useEffect(() => {
    initializeDarkMode();
    setDarkMode(isDarkMode());
  }, []);

  // Initialize Web Audio on first user interaction
  const initializeAudio = async () => {
    try {
      if (!synthRef.current.context) {
        const context = createAudioContext();
        if (!context) {
          throw new Error('AudioContext not supported');
        }
        
        // Resume context if suspended
        if (context.state === 'suspended') {
          await context.resume();
        }
        
        const masterGain = context.createGain();
        masterGain.connect(context.destination);
        masterGain.gain.setValueAtTime(volume / 100, context.currentTime);
        
        const noiseBuffer = createNoiseBuffer(context);
        
        synthRef.current.context = context;
        synthRef.current.masterGain = masterGain;
        synthRef.current.noiseBuffer = noiseBuffer;
        
        setAudioError(false);
        return true;
      }
      return true;
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
      setAudioError(true);
      return false;
    }
  };

  // Update master volume when volume state changes
  useEffect(() => {
    setMasterVolume(synthRef.current, volume / 100);
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPlayback(synthRef.current);
      if (synthRef.current.context) {
        synthRef.current.context.close();
      }
    };
  }, []);

  const handleDataPointClick = (dataPoint: DataPoint) => {
    setSelectedDataPoint(dataPoint);
    setIsModalOpen(true);
  };

  const handleDataPointMouseEnter = (dataPoint: DataPoint, event: React.MouseEvent) => {
    setTooltip({
      text: dataPoint.title,
      position: { x: event.clientX, y: event.clientY },
      isVisible: true
    });
  };

  const handleDataPointMouseLeave = () => {
    setTooltip(prev => ({ ...prev, isVisible: false }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDataPoint(null), 300);
  };

  const handleOpenAddModal = () => {
    if (isAuthenticated) {
      setIsEditMode(false);
      setEditingDataPoint(null);
      setIsAddModalOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setEditingDataPoint(null);
    // Return focus to add button after modal closes
    setTimeout(() => {
      if (addButtonRef.current) {
        addButtonRef.current.focus();
      }
    }, 300);
  };

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
    setIsEditMode(false);
    setEditingDataPoint(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (dataPoint: DataPoint) => {
    setEditingDataPoint(dataPoint);
    setIsEditMode(true);
    setIsModalOpen(false);
    setIsAddModalOpen(true);
  };

  const handleDelete = (dataPoint: DataPoint) => {
    setDataPointToDelete(dataPoint);
    setIsModalOpen(false);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (dataPointToDelete) {
      setDataPoints(prev => prev.filter(dp => dp.id !== dataPointToDelete.id));
      setDataPointToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveFormData = (formData: FormData) => {
    if (isEditMode && editingDataPoint) {
      // Update existing data point
      const updatedDataPoint: DataPoint = {
        ...editingDataPoint,
        x: convertSeverityToX(formData.severity),
        y: convertPrevalenceToY(formData.prevalence),
        color: getDataPointColor(formData.severity, formData.prevalence),
        title: formData.title,
        description: formData.summary,
        figmaSlideUrl: formData.figmaSlideUrl || undefined,
        highlightReelUrl: formData.highlightReelUrl || undefined,
        resourceLinkA: formData.resourceLinkA || undefined,
        resourceLinkB: formData.resourceLinkB || undefined
      };

      setDataPoints(prev => prev.map(dp => dp.id === editingDataPoint.id ? updatedDataPoint : dp));
    } else {
      // Create new data point
      const newDataPoint: DataPoint = {
        id: `user-${Date.now()}`, // Simple unique ID
        x: convertSeverityToX(formData.severity),
        y: convertPrevalenceToY(formData.prevalence),
        color: getDataPointColor(formData.severity, formData.prevalence),
        title: formData.title,
        description: formData.summary,
        figmaSlideUrl: formData.figmaSlideUrl || undefined,
        highlightReelUrl: formData.highlightReelUrl || undefined,
        resourceLinkA: formData.resourceLinkA || undefined,
        resourceLinkB: formData.resourceLinkB || undefined
      };

      setDataPoints(prev => [...prev, newDataPoint]);
      
      // Trigger confetti for new data point
      if (!isEditMode) {
        setTimeout(() => {
          triggerConfetti();
        }, 100);
      }
    }
  };

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    setDarkMode(isDarkMode());
  };

  const handleOpenMoodModal = () => {
    setIsMoodModalOpen(true);
  };

  const handleCloseMoodModal = () => {
    setIsMoodModalOpen(false);
    // Return focus to music button after modal closes
    setTimeout(() => {
      if (musicButtonRef.current) {
        musicButtonRef.current.focus();
      }
    }, 300);
  };

  const handlePlayMusic = async (mood: string) => {
    const detectedTrack = detectMoodFromInput(mood);
    
    // Try to initialize audio first
    const audioReady = await initializeAudio();
    if (!audioReady) {
      setAudioError(true);
      return;
    }
    
    // Stop any currently playing music
    stopPlayback(synthRef.current);
    
    setCurrentTrack(detectedTrack);
    startPlayback(synthRef.current, detectedTrack);
    setIsPlaying(true);

    // Show toast
    setToastMessage(`Playing: ${detectedTrack.label}`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePlayPause = async () => {
    if (!currentTrack) return;

    if (isPlaying) {
      stopPlayback(synthRef.current);
      setIsPlaying(false);
    } else {
      const audioReady = await initializeAudio();
      if (!audioReady) {
        setAudioError(true);
        return;
      }
      
      startPlayback(synthRef.current, currentTrack);
      setIsPlaying(true);
    }
  };

  const handleStopMusic = () => {
    stopPlayback(synthRef.current);
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const handleRetryAudio = async () => {
    setAudioError(false);
    if (currentTrack) {
      await handlePlayMusic(currentTrack.keywords[0] || 'calm');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary flex items-center justify-center p-8 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 89, 171, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 89, 171, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Tooltip */}
      <Tooltip 
        text={tooltip.text} 
        position={tooltip.position} 
        isVisible={tooltip.isVisible} 
      />

      {/* Dark Mode Toggle - Top right */}
      <DarkModeToggle isDark={darkMode} onToggle={handleToggleDarkMode} />

      {/* Add Data FAB Button - Bottom right outside matrix card */}
      <button
        ref={addButtonRef}
        onClick={handleOpenAddModal}
        className="fixed bottom-8 right-8 w-12 h-12 bg-muted text-muted-foreground rounded-lg hover:bg-secondary transition-colors shadow-lg hover:shadow-xl flex items-center justify-center z-50"
        aria-label="Add new data point"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Music Button - Bottom left outside matrix card, mirroring the + button */}
      <button
        ref={musicButtonRef}
        onClick={handleOpenMoodModal}
        className="fixed bottom-8 left-8 w-12 h-12 bg-muted text-muted-foreground rounded-lg hover:bg-secondary transition-colors shadow-lg hover:shadow-xl flex items-center justify-center z-50"
        aria-label="Set mood"
        title="Set mood"
      >
        <span className="text-lg">♪</span>
      </button>

      <div className="relative bg-card/80 backdrop-blur-sm border border-[#0059AB]/10 rounded-2xl shadow-lg px-[94px] py-[64px]">
        {/* Matrix Container with Labels */}
        <div className="relative">
          {/* Top Label */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 mx-[0px] my-[-10px]">
            <span className="text-foreground font-medium text-sm p-[0px] m-[0px]">High Prevalence</span>
          </div>
          
          {/* Left Label */}
          <div className="absolute top-1/2 transform -translate-y-1/2 -left-16 -rotate-90">
            <span className="text-foreground font-medium text-sm whitespace-nowrap mx-[-20px] my-[0px]">Low Severity</span>
          </div>
          
          {/* Right Label */}
          <div className="absolute top-1/2 transform -translate-y-1/2 -right-16 rotate-90">
            <span className="text-foreground font-medium text-sm whitespace-nowrap p-[0px] mx-[-20px] my-[0px]">High Severity</span>
          </div>
          
          {/* Bottom Label */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-8 mx-[0px] my-[-10px]">
            <span className="text-foreground font-medium text-sm">Low Prevalence</span>
          </div>

          {/* Matrix */}
          <div className="relative w-96 h-96">
            {/* Axes */}
            <div className="absolute inset-0">
              {/* Y Axis */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#0059AB]/60 transform -translate-x-px" />
              {/* X Axis */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#0059AB]/60 transform -translate-y-px" />
            </div>

            {/* Data Points */}
            {dataPoints.map((dataPoint) => (
              <button
                key={dataPoint.id}
                className="absolute w-3 h-3 rounded-full border-2 border-card shadow-sm hover:scale-150 hover:shadow-md transition-all duration-200 cursor-pointer z-10"
                style={{ 
                  left: `${dataPoint.x}%`, 
                  top: `${dataPoint.y}%`,
                  backgroundColor: dataPoint.color,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleDataPointClick(dataPoint)}
                onMouseEnter={(e) => handleDataPointMouseEnter(dataPoint, e)}
                onMouseLeave={handleDataPointMouseLeave}
                aria-label={`Open details for ${dataPoint.title}`}
              />
            ))}

            {/* Axis Arrows */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-[#0059AB]/60" />
            </div>
            <div className="absolute right-0 top-1/2 transform translate-x-2 -translate-y-1/2">
              <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-t-transparent border-b-transparent border-l-[#0059AB]/60" />
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-[80px] flex items-center justify-center gap-6 p-[0px] mt-[90px] mr-[0px] mb-[0px] ml-[0px]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#E02440]" />
            <span className="caption-small text-muted-foreground">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFB900]" />
            <span className="caption-small text-muted-foreground">Medium Priority</span>
          </div>
        </div>
      </div>

      {/* Music Control Dock - positioned near mood button */}
      {!audioError && currentTrack && (
        <MusicControlDock
          isVisible={currentTrack !== null}
          isPlaying={isPlaying}
          volume={volume}
          currentTrack={currentTrack?.label || ''}
          onPlayPause={handlePlayPause}
          onVolumeChange={handleVolumeChange}
          onStop={handleStopMusic}
        />
      )}

      {/* Audio Error Message */}
      <AudioErrorMessage 
        isVisible={audioError && currentTrack !== null}
        onRetry={handleRetryAudio}
      />

      {/* Toast */}
      <Toast isVisible={showToast} message={toastMessage} />

      {/* Data Point Modal */}
      {selectedDataPoint && (
        <Modal 
          dataPoint={selectedDataPoint} 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          isAuthenticated={isAuthenticated}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Mood Modal */}
      <MoodModal 
        isOpen={isMoodModalOpen} 
        onClose={handleCloseMoodModal} 
        onPlay={handlePlayMusic} 
      />

      {/* Password Modal */}
      <PasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        onSuccess={handlePasswordSuccess} 
      />

      {/* Add/Edit Data Modal */}
      <AddDataModal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseAddModal} 
        onSave={handleSaveFormData}
        editingDataPoint={editingDataPoint}
        isEdit={isEditMode}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDataPointToDelete(null);
        }} 
        onConfirm={handleConfirmDelete}
        dataPointTitle={dataPointToDelete?.title || ''}
      />
    </div>
  );
}