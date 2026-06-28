import React, { useState, useEffect, useRef } from 'react';
import { calculateLocalRoutes, getNearbyFacilities, METRO_CITIES } from './utils/localRiskEngine';

// --- STYLISH SVG VECTOR ILLUSTRATIONS (BIGGER) ---

const NariLogoSVG = ({ className = "w-24 h-24" }) => (
  <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 1. Background Shadow / Silhouette (Translucent Pinkish Flexing Hero Silhouette) */}
    {/* Head of Silhouette */}
    <circle cx="100" cy="55" r="16" fill="rgba(236, 72, 153, 0.15)" stroke="rgba(236, 72, 153, 0.25)" strokeWidth="1.5" />
    
    {/* Flexing Arms & Cape Silhouette */}
    <path d="M 100 70 
             C 85 70, 75 75, 70 80 
             C 65 85, 62 90, 55 90 
             C 45 90, 42 80, 38 68
             C 32 55, 22 55, 18 64
             C 12 72, 18 88, 30 96
             C 42 104, 58 100, 68 100
             L 68 112
             C 45 125, 20 142, 10 170
             L 190 170
             C 180 142, 155 125, 132 112
             L 132 100
             C 142 100, 158 104, 170 96
             C 182 88, 188 72, 182 64
             C 178 55, 168 55, 162 68
             C 158 80, 155 90, 145 90
             C 138 90, 135 85, 130 80
             C 125 75, 115 70, 100 70 Z" 
          fill="rgba(236, 72, 153, 0.15)" stroke="rgba(236, 72, 153, 0.25)" strokeWidth="1.5" />

    {/* 2. Foreground Confident Woman */}
    
    {/* Hair (Back layer) */}
    <path d="M 82 72 C 78 82, 82 94, 90 94 C 98 94, 100 90, 100 90 C 100 90, 102 94, 110 94 C 118 94, 122 82, 118 72 Z" fill="#252122" />

    {/* Neck */}
    <path d="M 94 85 L 94 105 L 106 105 L 106 85 Z" fill="#F3D1C1" />
    {/* Golden Chain Necklace */}
    <path d="M 94 95 C 96 100, 104 100, 106 95" stroke="#F59E0B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M 93 98 C 96 103, 104 103, 107 98" stroke="#F59E0B" strokeWidth="1" fill="none" strokeLinecap="round" />

    {/* Head / Face */}
    <path d="M 85 64 C 85 53, 115 53, 115 64 C 115 76, 108 85, 100 85 C 92 85, 85 76, 85 64 Z" fill="#FADDCF" />

    {/* Cheeks blush */}
    <circle cx="91" cy="72" r="4" fill="#F43F5E" opacity="0.25" />
    <circle cx="109" cy="72" r="4" fill="#F43F5E" opacity="0.25" />

    {/* Eyebrows */}
    <path d="M 89 62 C 91 60, 95 60, 97 62" stroke="#252122" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M 103 62 C 105 60, 109 60, 111 62" stroke="#252122" strokeWidth="1.5" fill="none" strokeLinecap="round" />

    {/* Eyes */}
    <ellipse cx="93" cy="66" rx="2" ry="1.5" fill="#252122" />
    <ellipse cx="107" cy="66" rx="2" ry="1.5" fill="#252122" />

    {/* Nose */}
    <path d="M 100 68 L 99 73 L 101 73" stroke="#D3B1A1" strokeWidth="1.5" fill="none" strokeLinecap="round" />

    {/* Mouth (Confident Smile) */}
    <path d="M 95 76 C 97 80, 103 80, 105 76" stroke="#BE123C" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 94 76 Q 100 77 106 76" stroke="#BE123C" strokeWidth="1" fill="none" strokeLinecap="round" />

    {/* Hair (Front layer/Bob/Bangs) */}
    <path d="M 85 62 C 85 46, 115 46, 115 62 C 115 70, 120 74, 121 78 C 122 82, 118 84, 115 80 C 112 76, 112 66, 112 66 C 112 66, 107 60, 100 60 C 93 60, 88 66, 88 66 C 88 66, 88 76, 85 80 C 82 84, 78 82, 79 78 C 80 74, 85 70, 85 62 Z" fill="#3D3739" />
    <path d="M 95 50 Q 100 56 105 50" stroke="#252122" strokeWidth="1.5" fill="none" />

    {/* Golden Square Earrings */}
    <rect x="80" y="74" width="5" height="5" transform="rotate(45 82.5 76.5)" fill="#F59E0B" stroke="#D97706" strokeWidth="0.5" />
    <rect x="115" y="74" width="5" height="5" transform="rotate(45 117.5 76.5)" fill="#F59E0B" stroke="#D97706" strokeWidth="0.5" />

    {/* Torso/Pants (Charcoal Pants) */}
    <path d="M 82 145 L 118 145 C 119 165, 120 185, 120 200 L 80 200 C 80 185, 81 165, 82 145 Z" fill="#374151" />

    {/* Shirt (Mustard/Golden with leaf patterns) */}
    <path d="M 80 105 L 120 105 C 123 115, 126 130, 126 145 L 74 145 C 74 130, 77 115, 80 105 Z" fill="#D98E32" />
    {/* Sleeves */}
    <path d="M 80 105 L 70 120 C 67 124, 71 128, 76 126 L 80 125 Z" fill="#D98E32" />
    <path d="M 120 105 L 130 120 C 133 124, 129 128, 124 126 L 120 125 Z" fill="#D98E32" />

    {/* Leaf patterns on Shirt */}
    <path d="M 86 112 Q 89 110 88 116 Q 85 114 86 112 Z" fill="#FEF08A" />
    <path d="M 88 116 Q 91 118 90 114 Q 87 112 88 116 Z" fill="#FEF08A" />
    <path d="M 112 112 Q 115 110 114 116 Q 111 114 112 112 Z" fill="#FEF08A" />
    <path d="M 114 116 Q 117 118 116 114 Q 113 112 114 116 Z" fill="#FEF08A" />
    <path d="M 98 120 Q 101 118 100 124 Q 97 122 98 120 Z" fill="#FEF08A" />
    <path d="M 88 136 Q 91 134 90 140 Q 87 138 88 136 Z" fill="#FEF08A" />
    <path d="M 110 136 Q 113 134 112 140 Q 109 138 110 136 Z" fill="#FEF08A" />

    {/* Crossed Arms */}
    <path d="M 76 122 Q 80 140 114 135 C 114 135, 116 130, 114 126 Q 84 128 76 122 Z" fill="#FADDCF" />
    <path d="M 124 122 Q 120 140 86 135 C 86 135, 84 130, 86 126 Q 116 128 124 122 Z" fill="#FADDCF" />
    <circle cx="86" cy="131" r="3.5" fill="#FADDCF" />
    <circle cx="114" cy="131" r="3.5" fill="#FADDCF" />
    <path d="M 76 122 Q 80 140 114 135" stroke="#E5B299" strokeWidth="1" fill="none" />
    <path d="M 124 122 Q 120 140 86 135" stroke="#E5B299" strokeWidth="1" fill="none" />
  </svg>
);

const ConfidentWomanIllustration = ({ size = "w-56 h-56" }) => (
  <svg className={`${size} drop-shadow-xl`} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Circle */}
    <circle cx="100" cy="100" r="80" fill="#FCE7F3" />
    
    {/* Flexing Arms & Cape Silhouette */}
    <path d="M 100 70 
             C 85 70, 75 75, 70 80 
             C 65 85, 62 90, 55 90 
             C 45 90, 42 80, 38 68
             C 32 55, 22 55, 18 64
             C 12 72, 18 88, 30 96
             C 42 104, 58 100, 68 100
             L 68 112
             C 45 125, 20 142, 10 170
             L 190 170
             C 180 142, 155 125, 132 112
             L 132 100
             C 142 100, 158 104, 170 96
             C 182 88, 188 72, 182 64
             C 178 55, 168 55, 162 68
             C 158 80, 155 90, 145 90
             C 138 90, 135 85, 130 80
             C 125 75, 115 70, 100 70 Z" 
          fill="rgba(219, 39, 119, 0.15)" stroke="rgba(219, 39, 119, 0.25)" strokeWidth="1.5" />

    {/* Hair (Back layer) */}
    <path d="M 82 72 C 78 82, 82 94, 90 94 C 98 94, 100 90, 100 90 C 100 90, 102 94, 110 94 C 118 94, 122 82, 118 72 Z" fill="#252122" />

    {/* Neck */}
    <path d="M 94 85 L 94 105 L 106 105 L 106 85 Z" fill="#F3D1C1" />
    <path d="M 94 95 C 96 100, 104 100, 106 95" stroke="#F59E0B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M 93 98 C 96 103, 104 103, 107 98" stroke="#F59E0B" strokeWidth="1" fill="none" strokeLinecap="round" />

    {/* Head / Face */}
    <path d="M 85 64 C 85 53, 115 53, 115 64 C 115 76, 108 85, 100 85 C 92 85, 85 76, 85 64 Z" fill="#FADDCF" />

    {/* Cheeks blush */}
    <circle cx="91" cy="72" r="4" fill="#F43F5E" opacity="0.25" />
    <circle cx="109" cy="72" r="4" fill="#F43F5E" opacity="0.25" />

    {/* Eyebrows */}
    <path d="M 89 62 C 91 60, 95 60, 97 62" stroke="#252122" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M 103 62 C 105 60, 109 60, 111 62" stroke="#252122" strokeWidth="1.5" fill="none" strokeLinecap="round" />

    {/* Eyes */}
    <ellipse cx="93" cy="66" rx="2" ry="1.5" fill="#252122" />
    <ellipse cx="107" cy="66" rx="2" ry="1.5" fill="#252122" />

    {/* Nose */}
    <path d="M 100 68 L 99 73 L 101 73" stroke="#D3B1A1" strokeWidth="1.5" fill="none" strokeLinecap="round" />

    {/* Mouth */}
    <path d="M 95 76 C 97 80, 103 80, 105 76" stroke="#BE123C" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M 94 76 Q 100 77 106 76" stroke="#BE123C" strokeWidth="1" fill="none" strokeLinecap="round" />

    {/* Hair (Front layer) */}
    <path d="M 85 62 C 85 46, 115 46, 115 62 C 115 70, 120 74, 121 78 C 122 82, 118 84, 115 80 C 112 76, 112 66, 112 66 C 112 66, 107 60, 100 60 C 93 60, 88 66, 88 66 C 88 66, 88 76, 85 80 C 82 84, 78 82, 79 78 C 80 74, 85 70, 85 62 Z" fill="#3D3739" />
    <path d="M 95 50 Q 100 56 105 50" stroke="#252122" strokeWidth="1.5" fill="none" />

    {/* Golden Square Earrings */}
    <rect x="80" y="74" width="5" height="5" transform="rotate(45 82.5 76.5)" fill="#F59E0B" stroke="#D97706" strokeWidth="0.5" />
    <rect x="115" y="74" width="5" height="5" transform="rotate(45 117.5 76.5)" fill="#F59E0B" stroke="#D97706" strokeWidth="0.5" />

    {/* Torso/Pants (Charcoal Pants) */}
    <path d="M 82 145 L 118 145 C 119 165, 120 185, 120 200 L 80 200 C 80 185, 81 165, 82 145 Z" fill="#374151" />

    {/* Shirt */}
    <path d="M 80 105 L 120 105 C 123 115, 126 130, 126 145 L 74 145 C 74 130, 77 115, 80 105 Z" fill="#D98E32" />
    <path d="M 80 105 L 70 120 C 67 124, 71 128, 76 126 L 80 125 Z" fill="#D98E32" />
    <path d="M 120 105 L 130 120 C 133 124, 129 128, 124 126 L 120 125 Z" fill="#D98E32" />

    {/* Leaf patterns */}
    <path d="M 86 112 Q 89 110 88 116 Q 85 114 86 112 Z" fill="#FEF08A" />
    <path d="M 88 116 Q 91 118 90 114 Q 87 112 88 116 Z" fill="#FEF08A" />
    <path d="M 112 112 Q 115 110 114 116 Q 111 114 112 112 Z" fill="#FEF08A" />
    <path d="M 114 116 Q 117 118 116 114 Q 113 112 114 116 Z" fill="#FEF08A" />
    <path d="M 98 120 Q 101 118 100 124 Q 97 122 98 120 Z" fill="#FEF08A" />
    <path d="M 88 136 Q 91 134 90 140 Q 87 138 88 136 Z" fill="#FEF08A" />
    <path d="M 110 136 Q 113 134 112 140 Q 109 138 110 136 Z" fill="#FEF08A" />

    {/* Crossed Arms */}
    <path d="M 76 122 Q 80 140 114 135 C 114 135, 116 130, 114 126 Q 84 128 76 122 Z" fill="#FADDCF" />
    <path d="M 124 122 Q 120 140 86 135 C 86 135, 84 130, 86 126 Q 116 128 124 122 Z" fill="#FADDCF" />
    <circle cx="86" cy="131" r="3.5" fill="#FADDCF" />
    <circle cx="114" cy="131" r="3.5" fill="#FADDCF" />
    <path d="M 76 122 Q 80 140 114 135" stroke="#E5B299" strokeWidth="1" fill="none" />
    <path d="M 124 122 Q 120 140 86 135" stroke="#E5B299" strokeWidth="1" fill="none" />
  </svg>
);

const BlossomSVG = ({ className = "w-8 h-8 text-pink-400" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C13.5 2 15 3.5 15 5C15 6.5 13.5 8 12 8C10.5 8 9 6.5 9 5C9 3.5 10.5 2 12 2Z" />
    <path d="M12 16C13.5 16 15 17.5 15 19C15 20.5 13.5 22 12 22C10.5 22 9 20.5 9 19C9 17.5 10.5 16 12 16Z" />
    <path d="M5 12C5 10.5 6.5 9 8 9C9.5 9 11 10.5 11 12C11 13.5 9.5 15 8 15C6.5 15 5 13.5 5 12Z" />
    <path d="M13 12C13 10.5 14.5 9 16 9C17.5 9 19 10.5 19 12C19 13.5 17.5 15 16 15C14.5 15 13 13.5 13 12Z" />
    <circle cx="12" cy="12" r="3.5" fill="#F59E0B" />
  </svg>
);

const SisterhoodIllustration = ({ size = "w-72 h-44" }) => (
  <svg className={`${size} mx-auto`} viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="120" cy="90" rx="80" ry="50" fill="#FFE4E6" />
    <path d="M70 140C70 120 80 95 95 95C110 95 115 120 115 140" fill="#9F1239" />
    <circle cx="95" cy="72" r="14" fill="#FBCFE8" />
    <path d="M88 55C95 50 105 55 108 65C110 75 102 85 98 92C92 92 88 85 88 75Z" fill="#EC4899" />
    <path d="M125 140C125 120 135 95 150 95C165 95 170 120 170 140" fill="#BE123C" />
    <circle cx="150" cy="72" r="14" fill="#FDA4AF" />
    <path d="M142 55C148 50 160 52 162 65C164 78 155 85 152 92C146 92 142 85 142 75Z" fill="#881337" />
    <path d="M108 95C115 90 130 90 138 95" stroke="#FBCFE8" strokeWidth="4" strokeLinecap="round" />
    <path d="M120 40C120 40 116 35 112 35C108 35 105 38 105 42C105 48 120 58 120 58C120 58 135 48 135 42C135 38 132 35 128 35C124 35 120 40 120 40Z" fill="#EF4444" />
  </svg>
);

// Shield with heart illustration for splash
const ShieldHeartIllustration = () => (
  <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10C65 10 80 18 80 18V55C80 75 50 92 50 92C50 92 20 75 20 55V18C20 18 35 10 50 10Z" fill="rgba(236,72,153,0.12)" stroke="#EC4899" strokeWidth="2.5" />
    <path d="M50 35C50 35 47 30 43 30C39 30 36 33 36 37C36 43 50 53 50 53C50 53 64 43 64 37C64 33 61 30 57 30C53 30 50 35 50 35Z" fill="#EC4899" />
  </svg>
);

// Force all underlying network and fetch operations to target Render
const LIVE_BACKEND_URL = "https://nari-suraksha-ai.onrender.com";

if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  window.fetch = async function (url, options) {
    let targetUrl = url;
    if (typeof url === 'string') {
      if (url.startsWith('/')) {
        targetUrl = LIVE_BACKEND_URL + url;
      } else if (!url.startsWith('http') && !url.startsWith('https')) {
        targetUrl = LIVE_BACKEND_URL + '/' + url;
      }
    }
    return originalFetch(targetUrl, options);
  };
}

export default function App() {
  // --- States ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('safeher_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentScreen, setCurrentScreen] = useState('splash'); // 'splash', 'login', 'about', 'permissions', 'dashboard'

  const [loginForm, setLoginForm] = useState({
    name: '',
    age: '',
    phone: '',
    occupation: '',
    address: ''
  });

  const [permissionsGranted, setPermissionsGranted] = useState(() => {
    const saved = localStorage.getItem('safeher_permissions');
    return saved ? JSON.parse(saved) : {
      location: false,
      camera: false,
      call: false,
      contacts: false
    };
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('safeher_theme');
    return saved ? saved : 'dark';
  });

  const [selectedCityId, setSelectedCityId] = useState('delhi');
  const [userLat, setUserLat] = useState(METRO_CITIES.delhi.lat);
  const [userLng, setUserLng] = useState(METRO_CITIES.delhi.lng);
  const [searchQuery, setSearchQuery] = useState('India Gate, Delhi');
  const [destLat, setDestLat] = useState(METRO_CITIES.delhi.lat - 0.015);
  const [destLng, setDestLng] = useState(METRO_CITIES.delhi.lng + 0.015);

  const [selectedRouteType, setSelectedRouteType] = useState('safest');
  const [routeData, setRouteData] = useState(null);
  const [facilities, setFacilities] = useState(null);
  
  const [hour, setHour] = useState(new Date().getHours());
  const [weather, setWeather] = useState(0);
  const [lighting, setLighting] = useState(75);
  const [crowd, setCrowd] = useState(65);
  const [crime, setCrime] = useState(25);

  const [reports, setReports] = useState([
    { id: 'r1', type: 'broken_light', description: 'Broken street lamps in dark corner alley', latitude: 28.622, longitude: 77.223, severity: 2 }
  ]);
  const [reportForm, setReportForm] = useState({ type: 'broken_light', description: '', severity: 2 });
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // AI Assistant — only speaks on click now
  const [isListening, setIsListening] = useState(false);
  const [assistantText, setAssistantText] = useState("Namaste! I'm Nari Suraksha AI, your personal predictive safety co-pilot. Click me to hear safety insights!");
  const [voiceEnabled, setVoiceEnabled] = useState(false); // OFF by default — user clicks to activate

  // Guardian & SOS
  const [guardianActive, setGuardianActive] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [locationSharingActive, setLocationSharingActive] = useState(false);

  const [visibleElements, setVisibleElements] = useState({});
  const [splashAnimDone, setSplashAnimDone] = useState(false);

  // Refs
  const leafletMapInstance = useRef(null);
  const routeLayers = useRef([]);
  const markerLayers = useRef([]);
  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const articleScrollRef = useRef(null);

  // --- Determine initial screen ---
  useEffect(() => {
    if (user) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('splash');
    }
  }, []);

  // Splash animation timer
  useEffect(() => {
    if (currentScreen === 'splash') {
      const t = setTimeout(() => setSplashAnimDone(true), 800);
      return () => clearTimeout(t);
    }
  }, [currentScreen]);

  // --- Apply Theme Class ---
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      if (theme === 'light') {
        root.classList.add('light-theme');
      } else {
        root.classList.remove('light-theme');
      }
    }
    localStorage.setItem('safeher_theme', theme);
  }, [theme]);

  // --- Camera Operations ---
  useEffect(() => {
    if (currentScreen === 'dashboard' && permissionsGranted.camera) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [currentScreen, permissionsGranted.camera]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 300, height: 200 } });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.warn("Camera streaming not active.");
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // --- Geolocation ---
  const requestLocationCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLat(lat);
          setUserLng(lng);
          setDestLat(lat - 0.012);
          setDestLng(lng + 0.012);
          setPermissionsGranted(prev => {
            const updated = { ...prev, location: true };
            localStorage.setItem('safeher_permissions', JSON.stringify(updated));
            return updated;
          });
        },
        () => {
          console.warn("Location prompt denied. Using city coordinate defaults.");
        }
      );
    }
  };

  // --- Login Flow ---
  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginForm.name || !loginForm.phone || !loginForm.address) return;
    
    const profile = { ...loginForm, timestamp: Date.now() };
    setUser(profile);
    localStorage.setItem('safeher_user', JSON.stringify(profile));
    setCurrentScreen('permissions');
  };

  // --- Logout ---
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('safeher_user');
    localStorage.removeItem('safeher_permissions');
    setPermissionsGranted({ location: false, camera: false, call: false, contacts: false });
    stopCamera();
    window.speechSynthesis && window.speechSynthesis.cancel();
    setVoiceEnabled(false);
    setCurrentScreen('splash');
    
    // Clean up map
    if (leafletMapInstance.current) {
      leafletMapInstance.current.remove();
      leafletMapInstance.current = null;
    }
    routeLayers.current = [];
    markerLayers.current = [];
  };

  const handlePermissionsDone = () => {
    localStorage.setItem('safeher_permissions', JSON.stringify(permissionsGranted));
    if (permissionsGranted.location) {
      requestLocationCoordinates();
    }
    
    const welcome = `Pranaam, ${user?.name}. Nari Suraksha AI systems are armed. Custom metropolitan crime indicators and IMD weather feeds have been compiled for your safety.`;
    setAssistantText(welcome);
    setCurrentScreen('dashboard');
  };

  const togglePermission = (key) => {
    if (key === 'location') {
      if (!permissionsGranted.location) {
        requestLocationCoordinates();
      } else {
        setPermissionsGranted(prev => ({ ...prev, location: false }));
      }
    } else if (key === 'camera') {
      if (!permissionsGranted.camera) {
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(() => {
            setPermissionsGranted(prev => ({ ...prev, camera: true }));
          })
          .catch(() => {
            alert("Camera access denied.");
          });
      } else {
        stopCamera();
        setPermissionsGranted(prev => ({ ...prev, camera: false }));
      }
    } else {
      setPermissionsGranted(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  // --- City quick-warp ---
  const warpToCity = (cityId) => {
    setSelectedCityId(cityId);
    const city = METRO_CITIES[cityId];
    if (city) {
      setUserLat(city.lat);
      setUserLng(city.lng);
      setDestLat(city.lat - 0.015);
      setDestLng(city.lng + 0.015);
      setSearchQuery(`Popular Area, ${city.name}`);
      
      setWeather(city.weather_baseline);
      setLighting(city.average_lighting);
      setCrowd(city.crowd_index);
      setCrime(city.crime_rate_index);
    }
  };

  // --- Route Calculations ---
  useEffect(() => {
    if (currentScreen !== 'dashboard') return;
    
    const calcData = calculateLocalRoutes({
      start_lat: userLat,
      start_lng: userLng,
      end_lat: destLat,
      end_lng: destLng,
      hour,
      weather,
      lighting_quality: lighting,
      crowd_density: crowd,
      crime_history_score: crime
    }, reports, selectedCityId);

    setRouteData(calcData);
    setFacilities(calcData.facilities);
  }, [currentScreen, userLat, userLng, destLat, destLng, hour, weather, lighting, crowd, crime, reports, selectedCityId]);

  // --- Leaflet Map Render ---
  useEffect(() => {
    if (currentScreen !== 'dashboard') return;

    if (!leafletMapInstance.current) {
      const mapEl = document.getElementById('leaflet-map');
      if (mapEl) {
        leafletMapInstance.current = L.map('leaflet-map', {
          zoomControl: false,
          attributionControl: true
        }).setView([userLat, userLng], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 20
        }).addTo(leafletMapInstance.current);

        L.control.zoom({ position: 'bottomright' }).addTo(leafletMapInstance.current);
      }
    } else {
      leafletMapInstance.current.setView([userLat, userLng], 13);
    }
  }, [currentScreen, userLat, userLng]);

  // --- Leaflet Markers & Route Trails Drawing ---
  useEffect(() => {
    if (leafletMapInstance.current && routeData) {
      const map = leafletMapInstance.current;

      routeLayers.current.forEach(layer => map.removeLayer(layer));
      routeLayers.current = [];

      markerLayers.current.forEach(layer => map.removeLayer(layer));
      markerLayers.current = [];

      const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin" style="background: #EC4899; box-shadow: 0 0 15px rgba(236,72,153,0.6); width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:12px;"><i class="fa-solid fa-house-user"></i></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
      const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map)
        .bindPopup(`<div class='text-xs font-bold text-pink-600'>Start Point</div>`);
      markerLayers.current.push(userMarker);

      const destIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin" style="background: #881337; box-shadow: 0 0 15px rgba(136,19,55,0.6); width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:12px;"><i class="fa-solid fa-location-dot"></i></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });
      const destMarker = L.marker([destLat, destLng], { icon: destIcon }).addTo(map)
        .bindPopup(`<div class='text-xs font-bold text-rose-800'>Destination</div>`);
      markerLayers.current.push(destMarker);

      const safestPolyline = L.polyline(routeData.safest.coordinates.map(p => [p.lat, p.lng]), {
        color: selectedRouteType === 'safest' ? '#EC4899' : '#10B981',
        weight: selectedRouteType === 'safest' ? 7 : 4,
        opacity: selectedRouteType === 'safest' ? 1.0 : 0.6,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      routeLayers.current.push(safestPolyline);

      const fastestPolyline = L.polyline(routeData.fastest.coordinates.map(p => [p.lat, p.lng]), {
        color: selectedRouteType === 'fastest' ? '#881337' : '#EF4444',
        weight: selectedRouteType === 'fastest' ? 7 : 4,
        opacity: selectedRouteType === 'fastest' ? 1.0 : 0.6,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      routeLayers.current.push(fastestPolyline);

      if (facilities) {
        facilities.police_stations.forEach(p => {
          const pIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="marker-pin" style="background: #9F1239; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:10px;"><i class="fa-solid fa-shield-halved"></i></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28]
          });
          const pMarker = L.marker([p.lat, p.lng], { icon: pIcon }).addTo(map)
            .bindPopup(`
              <div class="text-xs bg-[#2E0814] p-2.5 rounded-xl border border-pink-700 text-rose-100 min-w-[170px]">
                <div class="font-bold text-pink-400 mb-1">🚔 ${p.name}</div>
                <div class="mb-1 text-[9px] text-pink-300">${p.address}</div>
                <div class="font-semibold text-pink-400 mb-1">Call: ${p.phone}</div>
                <div class="text-[9px] bg-rose-950/40 px-1 py-0.5 rounded text-pink-200">Helpline: ${p.emergency_helpline}</div>
              </div>
            `);
          markerLayers.current.push(pMarker);
        });

        facilities.hospitals.forEach(h => {
          const hIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="marker-pin" style="background: #BE123C; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:10px;"><i class="fa-solid fa-house-medical"></i></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28]
          });
          const hMarker = L.marker([h.lat, h.lng], { icon: hIcon }).addTo(map)
            .bindPopup(`
              <div class="text-xs bg-[#2E0814] p-2.5 rounded-xl border border-rose-800 text-rose-100 min-w-[170px]">
                <div class="font-bold text-rose-400 mb-1">🏥 ${h.name}</div>
                <div class="mb-1 text-[9px] text-pink-300">${h.address}</div>
                <div class="font-semibold text-pink-400 mb-1">Ambulance: ${h.ambulance_phone}</div>
                <div class="text-[9px] text-rose-200">Beds: ${h.beds_available}</div>
              </div>
            `);
          markerLayers.current.push(hMarker);
        });

        facilities.safe_zones.forEach(sz => {
          const szIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="marker-pin" style="background: #DB2777; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:10px;"><i class="fa-solid fa-star"></i></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28]
          });
          const szMarker = L.marker([sz.lat, sz.lng], { icon: szIcon }).addTo(map)
            .bindPopup(`
              <div class="text-xs bg-[#2E0814] p-2.5 rounded-xl border border-pink-600 text-rose-100 min-w-[170px]">
                <div class="font-bold text-pink-400 mb-1">🌟 Safe Zone: ${sz.name}</div>
                <div class="text-[9px] text-pink-200 mb-0.5">Lighting: ${sz.lighting_level} | Crowd: ${sz.crowd_status}</div>
                <div class="text-[9px] text-pink-300">Amenities: ${sz.amenities.join(', ')}</div>
              </div>
            `);
          markerLayers.current.push(szMarker);
        });
      }

      reports.forEach(r => {
        const rIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="marker-pin" style="background: #EF4444; border: 1.5px solid white; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:10px;"><i class="fa-solid fa-triangle-exclamation"></i></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28]
        });
        const rMarker = L.marker([r.latitude, r.longitude], { icon: rIcon }).addTo(map)
          .bindPopup(`
            <div class="text-xs bg-[#2E0814] p-2 rounded border border-red-500 text-rose-100 min-w-[150px]">
              <div class="font-bold text-red-400 mb-1">⚠️ Danger Report</div>
              <div class="font-semibold capitalize text-pink-300 mb-1">${r.type.replace('_', ' ')}</div>
              <p class="text-[10px] text-pink-200 mb-1">${r.description}</p>
              <div class="text-[9px] bg-red-950/40 px-1 py-0.5 rounded text-red-300">Severity: ${r.severity}/3</div>
            </div>
          `);
        markerLayers.current.push(rMarker);
      });

      const bounds = L.latLngBounds([
        [userLat, userLng],
        [destLat, destLng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routeData, facilities, selectedRouteType, reports]);

  // --- Voice Synthesis (TTS) - only when voiceEnabled is true ---
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = window.speechSynthesis.getVoices().find(v => v.lang.includes('en')) || null;
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.onstart = () => setIsListening(false);
    window.speechSynthesis.speak(utterance);
  };

  // Update assistant text when route changes but DON'T auto-speak
  useEffect(() => {
    if (routeData && currentScreen === 'dashboard') {
      const selectedAnalysis = selectedRouteType === 'safest' ? routeData.safest.analysis : routeData.fastest.analysis;
      const city = METRO_CITIES[selectedCityId];
      let text = "";
      
      if (selectedRouteType === 'safest') {
        text = `Analyzing routes in ${city.name}. The safest route is secured at ${Math.round(100 - selectedAnalysis.risk_score)} percent. Lighting quality is excellent, and municipal surveillance is active. This route is fully recommended.`;
      } else {
        text = `Alert! The shortcut route through ${city.name} has a risk score of ${selectedAnalysis.risk_score} percent. Street illumination is extremely low. I highly advise switching to the pink-labeled safe path.`;
      }
      
      setAssistantText(text);
    }
  }, [routeData, selectedRouteType, selectedCityId, currentScreen]);

  // Click handler for AI Voice Assistant button - speaks current text
  const handleVoiceAssistantClick = () => {
    setVoiceEnabled(true);
    speakText(assistantText);
  };

  // --- Voice Recognition (STT) ---
  const startListening = () => {
    if (isListening) {
      stopListening();
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAssistantText("Speech recognition not supported.");
      return;
    }
    window.speechSynthesis.cancel();
    setIsListening(true);
    setAssistantText("Listening... Say 'take me home', 'warp to Varanasi', or 'SOS'");

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const cmd = event.results[0][0].transcript.toLowerCase();
      setAssistantText(`Voice command: "${cmd}"`);
      processVoiceCommand(cmd);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      setIsListening(false);
    }
  };

  const processVoiceCommand = (cmd) => {
    if (cmd.includes('home') || cmd.includes('take me home')) {
      warpToCity('delhi');
    } else if (cmd.includes('varanasi') || cmd.includes('warp to varanasi') || cmd.includes('kashi')) {
      warpToCity('varanasi');
    } else if (cmd.includes('mumbai') || cmd.includes('warp to mumbai')) {
      warpToCity('mumbai');
    } else if (cmd.includes('bengaluru') || cmd.includes('warp to bengaluru')) {
      warpToCity('bengaluru');
    } else if (cmd.includes('sos') || cmd.includes('danger') || cmd.includes('help')) {
      triggerSOS();
    } else {
      const resp = "Command not recognized. Try saying 'warp to Varanasi' or 'take me home'.";
      setAssistantText(resp);
      speakText(resp);
    }
  };

  const triggerSOS = () => {
    setSosActive(true);
    setLocationSharingActive(true);
    const msg = "Distress SOS activated. Broadcasted live location feeds to emergency hubs.";
    setAssistantText(msg);
    speakText(msg);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const offset = searchQuery.length * 0.0003;
    setDestLat(userLat + offset - 0.004);
    setDestLng(userLng + offset + 0.004);
  };

  const handleAddReport = (e) => {
    e.preventDefault();
    const newR = {
      id: `report-${Date.now()}`,
      type: reportForm.type,
      description: reportForm.description || `Reported ${reportForm.type.replace('_', ' ')} hazard.`,
      latitude: userLat + (Math.random() - 0.5) * 0.008,
      longitude: userLng + (Math.random() - 0.5) * 0.008,
      severity: parseInt(reportForm.severity)
    };
    setReports(prev => [newR, ...prev]);
    setShowReportModal(false);
    setReportForm({ type: 'broken_light', description: '', severity: 2 });
  };

  const handleArticleScroll = () => {
    if (articleScrollRef.current) {
      const scrollTop = articleScrollRef.current.scrollTop;
      const scrollHeight = articleScrollRef.current.scrollHeight - articleScrollRef.current.clientHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      
      setVisibleElements({
        intro: true,
        sec1: progress > 0.15,
        sec2: progress > 0.40,
        sec3: progress > 0.65,
        sec4: progress > 0.85
      });
    }
  };

  const currentAnalysis = routeData ? (selectedRouteType === 'safest' ? routeData.safest.analysis : routeData.fastest.analysis) : null;
  const currentSafetyPct = currentAnalysis ? Math.round(100 - currentAnalysis.risk_score) : 85;

  // ===========================
  // SCREEN 1: SPLASH LANDING
  // ===========================
  if (currentScreen === 'splash') {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #FFF5F6 0%, #FFE4E6 30%, #FBCFE8 60%, #FCE7F3 100%)' }}
      >
        {/* Animated falling petals */}
        <div className="petal-container">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`petal ${i % 3 === 0 ? 'petal-white' : i % 3 === 1 ? 'petal-gold' : ''}`}
              style={{
                left: `${(i * 8.3) % 100}%`,
                width: `${12 + (i % 4) * 4}px`,
                height: `${16 + (i % 3) * 5}px`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: `${7 + (i % 4) * 2}s`
              }}
            />
          ))}
        </div>

        {/* Floating cartoon emojis around the page */}
        <div className="absolute inset-0 pointer-events-none">
          {['🌸', '💖', '🦋', '✨', '🌺', '💕', '🌷', '⭐', '🎀', '💗', '🌹', '🦄'].map((emoji, i) => (
            <span key={i} className="absolute text-3xl float-emoji"
              style={{
                left: `${5 + (i * 7.8) % 85}%`,
                top: `${8 + (i * 11.3) % 75}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${4 + (i % 3)}s`,
                fontSize: `${24 + (i % 4) * 8}px`,
                opacity: 0.7
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Main content container */}
        <div className={`flex flex-col items-center gap-6 relative z-10 ${splashAnimDone ? 'fade-in-scale' : 'opacity-0'}`}
          style={{ animationDelay: '0.2s' }}
        >
          {/* Logo with rotating gradient border */}
          <div className="relative">
            <div className="w-36 h-36 rounded-full flex items-center justify-center bg-white/60 backdrop-blur-xl shadow-2xl border border-pink-200/50 rotating-border splash-pulse">
              <NariLogoSVG className="w-28 h-28" />
            </div>
            {/* Sparkle particles around logo */}
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="sparkle-particle"
                style={{
                  top: `${20 + Math.sin(i * 1.05) * 50}%`,
                  left: `${20 + Math.cos(i * 1.05) * 50}%`,
                  animationDelay: `${i * 0.5}s`
                }}
              />
            ))}
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black tracking-wider splash-glow"
              style={{ 
                fontFamily: "'Playfair Display', serif",
                color: '#881337',
                textShadow: '0 0 30px rgba(236,72,153,0.3)'
              }}
            >
              NARI SURAKSHA AI
            </h1>
            <p className="text-sm md:text-base font-bold uppercase tracking-[0.35em] text-pink-600 mt-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Predictive Women's Safety Platform
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-pink-400 via-rose-500 to-red-500 mx-auto mt-3 rounded-full gradient-shift" />
          </div>

          {/* Shield Heart and tagline */}
          <div className="flex items-center gap-3 soft-float" style={{ animationDelay: '1s' }}>
            <ShieldHeartIllustration />
            <p className="text-lg font-semibold text-rose-800 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              "Safety is not a privilege — it's a right."
            </p>
          </div>

          {/* Central icon buttons: LOGIN and ABOUT */}
          <div className="flex items-center gap-8 mt-4">
            <button
              onClick={() => setCurrentScreen('login')}
              className="splash-icon-btn"
              style={{ animationDelay: '0.5s' }}
            >
              <i className="fa-solid fa-user-plus text-2xl text-rose-700" />
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800">Login</span>
            </button>

            <button
              onClick={() => setShowAboutModal(true)}
              className="splash-icon-btn"
              style={{ animationDelay: '0.7s' }}
            >
              <i className="fa-solid fa-heart text-2xl text-pink-600" />
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-800">About</span>
            </button>
          </div>
        </div>

        {/* Developer credit - fancy animated */}
        <div className={`absolute bottom-6 text-center z-10 ${splashAnimDone ? 'fade-in-up' : 'opacity-0'}`}
          style={{ animationDelay: '1.2s' }}
        >
          <div className="flex items-center gap-2 justify-center mb-1">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-pink-400" />
            <BlossomSVG className="w-5 h-5 text-pink-400" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-pink-400" />
          </div>
          <p className="text-xs text-rose-700 font-semibold tracking-wide">💻 Developed Engineered by</p>
          <p className="text-2xl developer-credit font-bold mt-0.5">
            Sanjeevani Dubey and Deepali Singh
          </p>
          <div className="flex items-center gap-2 justify-center mt-1">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-pink-400" />
            <span className="text-xs text-pink-400">✨</span>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-pink-400" />
          </div>
        </div>

        {/* ABOUT MODAL (overlays splash) */}
        {showAboutModal && (
          <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
            <div className="modal-content text-[#4C0519]" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <NariLogoSVG className="w-12 h-12" />
                  <div>
                    <h2 className="text-xl font-black text-rose-900 tracking-wider">About NARI SURAKSHA AI</h2>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-pink-500">Initiative for Safety</p>
                  </div>
                </div>
                <button onClick={() => setShowAboutModal(false)} className="text-rose-400 hover:text-rose-700 text-xl cursor-pointer p-2 hover:bg-pink-50 rounded-full transition-all">
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div ref={articleScrollRef} onScroll={handleArticleScroll} className="max-h-[60vh] overflow-y-auto flex flex-col gap-5 pr-2">
                <div className="text-center">
                  <h3 className="text-2xl font-black text-rose-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    A Small Initiative, A Big Dream <span className="block text-pink-600 text-xl mt-1">— For Every Woman's Safety</span>
                  </h3>
                  <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-rose-600 mx-auto mt-3 rounded-full" />
                </div>

                <p className="text-sm leading-relaxed text-rose-950 font-medium">
                  <strong>"When a woman steps out of her home, she should carry confidence—not fear."</strong>
                </p>
                <p className="text-sm leading-relaxed text-rose-900 font-medium">
                  Every day, thousands of women across India leave their homes to study, work, travel, or simply live their lives. Yet, many of them constantly think twice before taking a route, staying out late, or travelling alone. Safety should never be a privilege—it is a fundamental right.
                </p>

                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] bg-rose-200 flex-1" />
                  <BlossomSVG className="w-6 h-6 text-pink-400" />
                  <div className="h-[1px] bg-rose-200 flex-1" />
                </div>

                <div className="my-2 flex justify-center soft-float">
                  <ConfidentWomanIllustration size="w-48 h-48" />
                </div>

                <p className="text-sm leading-relaxed text-rose-900 font-medium">
                  India is progressing rapidly in technology, education, and innovation. But <strong>our progress can never be complete if our daughters, sisters, mothers, and friends still feel unsafe.</strong> Women's safety is not just a women's issue; it is a responsibility that belongs to every citizen.
                </p>
                <p className="text-sm leading-relaxed text-rose-900 font-medium">
                  This platform was born from a simple thought: <em>"What if technology could help prevent danger before it happens?"</em>
                </p>

                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] bg-rose-200 flex-1" />
                  <BlossomSVG className="w-6 h-6 text-pink-400" />
                  <div className="h-[1px] bg-rose-200 flex-1" />
                </div>

                <p className="text-sm leading-relaxed text-rose-900 font-medium">
                  <strong>Nari Suraksha AI</strong> is more than just a website or an application. It is an attempt to use Artificial Intelligence and modern technology to provide safety insights, predict potentially risky areas, and help women make informed decisions while travelling. The goal is not to create fear, but to create awareness, preparedness, and confidence.
                </p>
                <blockquote className="border-l-4 border-pink-500 pl-4 py-2 bg-rose-50 rounded-r-lg text-rose-950 font-bold text-sm italic leading-relaxed">
                  "Mera maanna hai ki suraksha kisi bhi insaan ka adhikaar hai, aur har beti ko bina darr ke jeene aur sapne poore karne ka haq milna chahiye. If even one woman feels more secure because of this initiative, every hour spent building it will have been worthwhile."
                </blockquote>

                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] bg-rose-200 flex-1" />
                  <BlossomSVG className="w-6 h-6 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <div className="h-[1px] bg-rose-200 flex-1" />
                </div>

                <div className="my-2 text-center soft-float">
                  <SisterhoodIllustration size="w-64 h-40" />
                </div>

                <p className="text-sm leading-relaxed text-rose-900 font-medium">
                  We, <strong>Sanjeevani Dubey and Deepali Singh</strong>, are just common students who believe that meaningful change often begins with a single idea and the courage to act upon it. This project is not backed by a large organisation or a team of experts—it is driven by a sincere hope that technology can become a silent companion in protecting lives. Every feature, every design choice, and every line of code has been created with care, compassion, and a deep sense of responsibility towards the women of our nation.
                </p>

                <div className="flex items-center justify-center gap-2">
                  <div className="h-[1px] bg-rose-200 flex-1" />
                  <BlossomSVG className="w-6 h-6 text-pink-400" />
                  <div className="h-[1px] bg-rose-200 flex-1" />
                </div>

                <p className="text-sm leading-relaxed text-rose-900 font-medium">
                  This is only the beginning. I know that one application alone cannot eliminate crimes against women. But every meaningful change starts with one small step, one voice, and one initiative. If more people join this mission, if communities support it, and if technology continues to evolve with empathy, we can build a future where women feel safer, stronger, and more confident wherever they go.
                </p>
                <div className="text-sm leading-relaxed text-rose-950 font-bold bg-pink-50 border border-pink-200 p-4 rounded-2xl shadow-inner">
                  🏛️ <strong>A humble request to our Government, public authorities, law enforcement agencies, and policymakers:</strong> If this initiative reaches you, I sincerely request you to consider supporting and strengthening it. With official collaboration, verified data, advanced infrastructure, and continuous improvements, this platform has the potential to become a nationwide safety companion for millions of women across India.
                </div>
                <p className="text-base leading-relaxed text-rose-900 text-center font-bold italic">
                  "Agar ek bhi mahila is platform ki wajah se khud ko zyada surakshit mehsoos kare, toh meri mehnat safal hogi."
                </p>
                <p className="text-base leading-relaxed text-rose-950 text-center font-black">
                  Together, let us build an India where courage replaces fear, awareness prevents danger, and every woman can proudly say—
                </p>
                <div className="text-center py-3">
                  <span className="text-3xl font-black text-rose-900 splash-glow" style={{ fontFamily: "'Playfair Display', serif" }}>
                    "Main surakshit hoon."
                  </span>
                  <span className="block text-base mt-2">
                    <span className="text-pink-600">— By</span>{' '}
                    <span className="developer-credit text-xl font-bold">Sanjeevani Dubey & Deepali Singh</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===========================
  // SCREEN 2: LOGIN PAGE
  // ===========================
  if (currentScreen === 'login') {
    return (
      <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #FFF5F6 0%, #FFE4E6 30%, #FBCFE8 60%, #FCE7F3 100%)' }}
      >
        {/* Petals */}
        <div className="petal-container">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`petal ${i % 3 === 1 ? 'petal-gold' : ''}`}
              style={{
                left: `${(i * 10) % 100}%`,
                width: `${14 + (i % 3) * 4}px`,
                height: `${18 + (i % 3) * 5}px`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${8 + (i % 3) * 2}s`
              }}
            />
          ))}
        </div>

        {/* Floating emojis */}
        <div className="absolute inset-0 pointer-events-none">
          {['🌸', '💖', '🦋', '✨', '🌺', '🎀'].map((emoji, i) => (
            <span key={i} className="absolute text-2xl float-emoji"
              style={{
                left: `${5 + (i * 16) % 85}%`,
                top: `${10 + (i * 14) % 75}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + (i % 3)}s`,
                opacity: 0.5
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        {/* Back to splash */}
        <button onClick={() => setCurrentScreen('splash')}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/60 backdrop-blur-md border border-pink-200 px-4 py-2.5 rounded-full text-rose-800 font-bold text-sm hover:bg-white/80 transition-all cursor-pointer shadow-lg"
        >
          <i className="fa-solid fa-arrow-left" /> Back
        </button>

        {/* Login Form Card */}
        <form 
          onSubmit={handleLogin} 
          className="w-full max-w-lg bg-white/80 backdrop-blur-2xl border border-pink-200/50 p-8 md:p-10 rounded-[32px] flex flex-col gap-5 shadow-2xl relative z-10 fade-in-up"
        >
          {/* Logo & Title */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 mx-auto rounded-full bg-white/80 shadow-xl flex items-center justify-center border border-pink-100 rotating-border">
                <NariLogoSVG className="w-20 h-20" />
              </div>
            </div>
            <h1 className="text-3xl font-black tracking-wider text-rose-900 mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              NARI SURAKSHA AI
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-pink-500 mt-1">Secure Registration Profile</p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center -my-2 soft-float">
            <ConfidentWomanIllustration size="w-32 h-32" />
          </div>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-black text-rose-800 flex items-center gap-1.5">
                <i className="fa-solid fa-user text-pink-500" /> Full Name
              </label>
              <input 
                required type="text" placeholder="e.g., Riya"
                value={loginForm.name}
                onChange={(e) => setLoginForm(prev => ({ ...prev, name: e.target.value }))}
                className="fancy-input"
              />
            </div>

            {/* Age & Occupation */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider font-black text-rose-800 flex items-center gap-1.5">
                  <i className="fa-solid fa-cake-candles text-pink-500" /> Age
                </label>
                <input 
                  required type="number" min="12" max="100" placeholder="e.g., 22"
                  value={loginForm.age}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, age: e.target.value }))}
                  className="fancy-input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-wider font-black text-rose-800 flex items-center gap-1.5">
                  <i className="fa-solid fa-briefcase text-pink-500" /> Occupation
                </label>
                <input 
                  required type="text" placeholder="e.g., Student"
                  value={loginForm.occupation}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, occupation: e.target.value }))}
                  className="fancy-input"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-black text-rose-800 flex items-center gap-1.5">
                <i className="fa-solid fa-phone text-pink-500" /> Phone Number
              </label>
              <input 
                required type="tel" placeholder="e.g., +91 94405 12345"
                value={loginForm.phone}
                onChange={(e) => setLoginForm(prev => ({ ...prev, phone: e.target.value }))}
                className="fancy-input"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider font-black text-rose-800 flex items-center gap-1.5">
                <i className="fa-solid fa-location-dot text-pink-500" /> Home Address
              </label>
              <input 
                required type="text" placeholder="e.g., Block B-4, Saket, New Delhi"
                value={loginForm.address}
                onChange={(e) => setLoginForm(prev => ({ ...prev, address: e.target.value }))}
                className="fancy-input"
              />
            </div>
          </div>

          <button type="submit" className="fancy-submit-btn mt-2">
            Secure Login <i className="fa-solid fa-arrow-right-long ml-2" />
          </button>

          {/* Developer credit */}
          <div className="text-center pt-2">
            <div className="flex items-center gap-2 justify-center mb-1">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-pink-300" />
              <span className="text-pink-400 text-xs">✨</span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-pink-300" />
            </div>
            <p className="text-[10px] text-rose-600 font-semibold">Developed Engineered by</p>
            <p className="text-xl developer-credit font-bold">Sanjeevani Dubey & Deepali Singh</p>
          </div>
        </form>
      </div>
    );
  }

  // ===========================
  // SCREEN 3: PERMISSIONS
  // ===========================
  if (currentScreen === 'permissions') {
    return (
      <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden light-theme text-[#4C0519]"
        style={{ background: 'linear-gradient(160deg, #FFF5F6 0%, #FFE4E6 30%, #FBCFE8 60%, #FCE7F3 100%)' }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(219,39,119,0.1),transparent_70%)]" />
        
        <div className="w-full max-w-lg bg-white/90 backdrop-blur-2xl border border-pink-200 p-8 rounded-[32px] flex flex-col gap-6 shadow-2xl relative pointer-events-auto fade-in-up">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center border border-pink-200 splash-pulse">
              <NariLogoSVG className="w-14 h-14" />
            </div>
            <h2 className="text-xl font-black tracking-wide text-rose-950 uppercase mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>System Permissions Required</h2>
            <p className="text-xs text-rose-800 mt-1">Please grant authorizations to synchronize real-time safety indices</p>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Location */}
            <div className="bg-[#FFF5F6] border border-pink-200/50 p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg">
                  <i className="fa-solid fa-location-dot" />
                </div>
                <div>
                  <div className="text-sm font-bold text-rose-950">GPS Location Services</div>
                  <div className="text-[10px] text-rose-800">Centers map grids & anchors responsive nearby overlays</div>
                </div>
              </div>
              <button 
                onClick={() => togglePermission('location')}
                className={`w-12 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${permissionsGranted.location ? 'bg-pink-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${permissionsGranted.location ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Camera */}
            <div className="bg-[#FFF5F6] border border-pink-200/50 p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg">
                  <i className="fa-solid fa-video" />
                </div>
                <div>
                  <div className="text-sm font-bold text-rose-950">Camera Environmental Scan</div>
                  <div className="text-[10px] text-rose-800">Streams live feeds to evaluate local lighting parameters</div>
                </div>
              </div>
              <button 
                onClick={() => togglePermission('camera')}
                className={`w-12 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${permissionsGranted.camera ? 'bg-pink-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${permissionsGranted.camera ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Make a call */}
            <div className="bg-[#FFF5F6] border border-pink-200/50 p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg">
                  <i className="fa-solid fa-phone-volume" />
                </div>
                <div>
                  <div className="text-sm font-bold text-rose-950">Direct Response Dialing</div>
                  <div className="text-[10px] text-rose-800">Permits directly dialing patrolling police emergency hubs</div>
                </div>
              </div>
              <button 
                onClick={() => togglePermission('call')}
                className={`w-12 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${permissionsGranted.call ? 'bg-pink-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${permissionsGranted.call ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Access contacts */}
            <div className="bg-[#FFF5F6] border border-pink-200/50 p-4 rounded-2xl flex items-center justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-lg">
                  <i className="fa-solid fa-address-book" />
                </div>
                <div>
                  <div className="text-sm font-bold text-rose-950">Access Guard Contacts</div>
                  <div className="text-[10px] text-rose-800">Enables rapid selection of trusted emergency contacts</div>
                </div>
              </div>
              <button 
                onClick={() => togglePermission('contacts')}
                className={`w-12 h-6 rounded-full relative p-0.5 transition-colors cursor-pointer ${permissionsGranted.contacts ? 'bg-pink-600' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${permissionsGranted.contacts ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <button 
            onClick={handlePermissionsDone}
            className="fancy-submit-btn"
          >
            Confirm & Secure Platform <i className="fa-solid fa-shield-halved ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // ===========================
  // SCREEN 4: MAIN DASHBOARD
  // ===========================
  return (
    <div className="flex h-screen w-screen overflow-hidden relative font-sans">
      
      {/* Map Canvas */}
      <div id="leaflet-map" className="absolute inset-0 w-full h-full z-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/65 via-transparent to-black/30 z-0" />

      {/* TOP HEADER STATUS PANEL */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
        
        {/* HELLO Greeting Banner */}
        <div className="flex items-center gap-3 bg-obsidian/90 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-full pointer-events-auto shadow-neon-violet glass-panel">
          <NariLogoSVG className="w-8 h-8" />
          <span className="font-extrabold text-xs tracking-widest text-violetneon">
            HELLO, {user?.name?.toUpperCase()} 👋
          </span>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-emeraldneon/20 text-emeraldneon border border-emeraldneon/30 font-bold uppercase">
            {user?.occupation}
          </span>
        </div>

        {/* Header options */}
        <div className="flex items-center gap-3 pointer-events-auto">
          
          {/* About button */}
          <button 
            onClick={() => setShowAboutModal(true)}
            className="bg-obsidian/95 backdrop-blur-md border border-white/10 p-2.5 rounded-full text-pink-400 hover:bg-pink-900/50 hover:text-pink-300 transition-all cursor-pointer shadow-lg flex items-center justify-center glass-panel"
            title="About Nari Suraksha AI"
          >
            <i className="fa-solid fa-heart text-sm" />
          </button>

          {/* Theme toggle */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="bg-obsidian/95 backdrop-blur-md border border-white/10 p-2.5 rounded-full text-white hover:bg-[#BE123C] hover:text-white transition-all cursor-pointer shadow-lg flex items-center justify-center glass-panel"
            title="Toggle Light / Dark Theme"
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-400'} text-sm`} />
          </button>

          {/* Google Maps redirect */}
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-obsidian/95 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full text-xs font-extrabold text-white hover:bg-emeraldneon hover:border-emeraldneon transition-all shadow-lg flex items-center gap-2 glass-panel"
            title="View current route on Google Maps"
          >
            <i className="fa-solid fa-map-location-dot text-emeraldneon" />
            <span>Google Maps</span>
          </a>

          {/* SOS */}
          <button 
            onClick={triggerSOS} 
            className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs tracking-widest px-6 py-2.5 rounded-full shadow-neon-red border border-red-500/30 pulse-sos cursor-pointer transition-all duration-300"
          >
            🚨 SOS
          </button>

          {/* LOGOUT */}
          <button 
            onClick={handleLogout}
            className="bg-obsidian/95 backdrop-blur-md border border-white/10 p-2.5 rounded-full text-rose-400 hover:bg-red-900/50 hover:text-red-300 transition-all cursor-pointer shadow-lg flex items-center justify-center glass-panel"
            title="Log Out"
          >
            <i className="fa-solid fa-right-from-bracket text-sm" />
          </button>
        </div>
      </div>

      {/* LEFT SIDEBAR PANEL */}
      <div className="w-[420px] h-[calc(100vh-100px)] mt-20 ml-4 z-10 glass-panel rounded-3xl p-5 flex flex-col gap-4 overflow-y-auto shadow-2xl relative">
        
        {/* Navigation Search */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[10px] uppercase font-extrabold tracking-widest text-violetneon"><i className="fa-solid fa-compass mr-1" /> Smart Route Navigator</h2>
          <form onSubmit={handleSearchSubmit} className="flex gap-2 relative">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-500 text-sm" />
              <input 
                type="text" 
                placeholder="Enter destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-xs focus:border-violetneon focus:outline-none transition-all"
              />
            </div>
            <button type="submit" className="bg-violetneon hover:bg-violet-600 px-4 rounded-xl font-bold text-xs transition-all shadow-neon-violet">
              Go
            </button>
          </form>
        </div>

        {/* METROPOLITAN SECURITY HUBS */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-violetneon">
              <i className="fa-solid fa-city mr-1" /> Metropolitan Security Hubs
            </h3>
            <span className="text-[8px] text-gray-500 uppercase font-bold font-mono">NCRB Crime / IMD Feeds</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Object.keys(METRO_CITIES).map(cityId => (
              <button 
                key={cityId}
                onClick={() => warpToCity(cityId)}
                className={`text-[9px] font-extrabold uppercase py-2 rounded-xl border transition-all cursor-pointer ${
                  selectedCityId === cityId 
                    ? 'bg-violetneon border-violetneon text-white shadow-neon-violet' 
                    : 'bg-black/45 border-white/5 text-gray-400 hover:text-white hover:bg-black/60'
                }`}
              >
                {METRO_CITIES[cityId].name}
              </button>
            ))}
          </div>
        </div>

        {/* Route Recommendations */}
        {routeData && (
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-violetneon"><i className="fa-solid fa-route mr-1" /> Route Recommendations</h3>
            <div className="grid grid-cols-2 gap-2">
              
              <div 
                onClick={() => setSelectedRouteType('safest')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all premium-card flex flex-col gap-1 relative ${selectedRouteType === 'safest' ? 'bg-violet-950/30 border-violetneon shadow-neon-violet' : 'bg-black/40 border-white/5 opacity-85'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[8px] uppercase font-extrabold text-emeraldneon">AI Recommended</span>
                  <i className="fa-solid fa-shield text-emeraldneon text-xs" />
                </div>
                <div className="font-bold text-xs text-white">Safest Route</div>
                <div className="flex gap-2 text-[10px] text-gray-400 font-medium">
                  <span>{routeData.safest.time_mins} mins</span>
                  <span>•</span>
                  <span>{routeData.safest.distance_km} km</span>
                </div>
                <div className="mt-1 text-[10px] font-extrabold text-emeraldneon">
                  {Math.round(100 - routeData.safest.analysis.risk_score)}% Secure
                </div>
              </div>

              <div 
                onClick={() => setSelectedRouteType('fastest')}
                className={`p-3 rounded-2xl border cursor-pointer transition-all premium-card flex flex-col gap-1 relative ${selectedRouteType === 'fastest' ? 'bg-violet-950/30 border-violetneon shadow-neon-violet' : 'bg-black/40 border-white/5 opacity-85'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[8px] uppercase font-extrabold text-red-400">Shortcut Lane</span>
                  <i className="fa-solid fa-bolt text-red-400 text-xs" />
                </div>
                <div className="font-bold text-xs text-white">Fastest Route</div>
                <div className="flex gap-2 text-[10px] text-gray-400 font-medium">
                  <span>{routeData.fastest.time_mins} mins</span>
                  <span>•</span>
                  <span>{routeData.fastest.distance_km} km</span>
                </div>
                <div className="mt-1 text-[10px] font-extrabold text-red-400">
                  {Math.round(routeData.fastest.analysis.risk_score)}% Danger
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Dynamic circular safety score */}
        {currentAnalysis && (
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center gap-4 premium-card">
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="32" cy="32" r="26" 
                  stroke="rgba(255,255,255,0.05)" strokeWidth="5" 
                  fill="transparent" 
                />
                <circle 
                  cx="32" cy="32" r="26" 
                  stroke={currentAnalysis.color === 'green' ? '#10B981' : (currentAnalysis.color === 'yellow' ? '#F59E0B' : '#EF4444')} 
                  strokeWidth="5" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - currentSafetyPct / 100)}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base font-black text-white">{currentSafetyPct}%</span>
                <span className="block text-[7px] text-gray-400 uppercase font-bold tracking-wider">Score</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-extrabold tracking-widest text-gray-400">Safety Index</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase text-black ${
                  currentAnalysis.color === 'green' ? 'bg-emeraldneon' : (currentAnalysis.color === 'yellow' ? 'bg-amberneon' : 'bg-crimsonneon')
                }`}>
                  {currentAnalysis.status}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 font-medium leading-relaxed">
                {currentAnalysis.guidance}
              </p>
            </div>
          </div>
        )}

        {/* AI Explainability factors */}
        {currentAnalysis && (
          <div className="flex flex-col gap-2 flex-1 min-h-[160px]">
            <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-violetneon"><i className="fa-solid fa-brain mr-1" /> AI Explainability Factors</h3>
            <div className="flex flex-col gap-1.5 overflow-y-auto pr-1 max-h-[200px]">
              
              <div className="bg-violet-950/15 border border-violetneon/15 p-2 rounded-xl text-left">
                <span className="text-[9px] font-extrabold uppercase text-violetneon block mb-0.5">NCRB City Index</span>
                <p className="text-[10px] text-gray-300 leading-normal font-medium">
                  {METRO_CITIES[selectedCityId].crime_description} (Index: {METRO_CITIES[selectedCityId].crime_rate_index}%)
                </p>
              </div>

              {currentAnalysis.explanations.map((exp, idx) => (
                <div key={idx} className="bg-[#0B0D19]/60 border border-white/5 p-2.5 rounded-xl flex items-start gap-3 hover:border-violetneon/20 transition-all">
                  <span className="text-base mt-0.5">{exp.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white">{exp.factor}</span>
                      <span className={`text-[9px] font-black ${exp.type === 'positive' ? 'text-emeraldneon' : (exp.type === 'negative' ? 'text-red-400' : 'text-gray-400')}`}>
                        {exp.impact}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 leading-normal mt-0.5">{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom credit */}
        <div className="text-center py-2 border-t border-white/5 mt-auto">
          <p className="text-[9px] text-gray-500 font-semibold">Developed Engineered by</p>
          <p className="text-base developer-credit-dark font-bold">Sanjeevani Dubey & Deepali Singh</p>
        </div>

      </div>

      {/* RIGHT SIDE CONTROLS */}
      <div className="absolute right-4 top-20 bottom-4 flex flex-col justify-between items-end z-10 pointer-events-none w-[360px]">
        
        {/* AI VOICE ASSISTANT - Click to Activate */}
        <div className="pointer-events-auto w-full flex flex-col items-center gap-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className={`soundwave ${isListening ? 'ai-orb-listening' : ''}`} />
            <div className={`soundwave-2 ${isListening ? 'ai-orb-listening' : ''}`} />
            
            <div 
              onClick={startListening}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-violetneon via-fuchsia-600 to-rose-500 flex items-center justify-center cursor-pointer shadow-neon-violet border-2 border-white/20 ai-orb-glow relative z-10 transform active:scale-95 transition-transform"
            >
              <i className={`fa-solid ${isListening ? 'fa-microphone text-white animate-bounce' : 'fa-brain text-white'} text-2xl`} />
            </div>
          </div>

          <div className="glass-panel border border-white/10 px-4 py-2.5 rounded-2xl text-center max-w-xs shadow-2xl relative">
            <span className="block text-[8px] uppercase tracking-widest font-extrabold text-violetneon mb-1">
              {isListening ? 'Listening for command...' : 'Nari Suraksha AI Co-Pilot'}
            </span>
            <p className="text-xs text-gray-200 leading-relaxed font-medium">
              "{assistantText}"
            </p>
          </div>

          {/* AI VOICE ASSISTANT button - click to hear */}
          <button
            onClick={handleVoiceAssistantClick}
            className="flex items-center gap-2 bg-gradient-to-r from-violetneon via-fuchsia-600 to-pink-500 text-white font-black uppercase text-[10px] tracking-widest px-5 py-2.5 rounded-full shadow-neon-violet border border-white/20 cursor-pointer hover:scale-105 transition-all voice-btn-glow"
          >
            <i className="fa-solid fa-volume-high" />
            AI Voice Assistant
          </button>
        </div>

        {/* Dynamic Circumstance Simulator */}
        <div className="pointer-events-auto w-full glass-panel border border-white/10 p-4 rounded-3xl flex flex-col gap-3 shadow-2xl mt-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-violetneon"><i className="fa-solid fa-sliders mr-1" /> Circumstances Simulator</h3>
            <span className="text-[8px] bg-violetneon/20 text-violetneon px-2 py-0.5 rounded-full font-bold uppercase">Dynamic Control</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-gray-300 font-bold">
                <span>🕒 Local Time</span>
                <span className="text-violetneon">{hour.toString().padStart(2, '0')}:00</span>
              </div>
              <input 
                type="range" min="0" max="23" value={hour} 
                onChange={(e) => setHour(parseInt(e.target.value))}
                className="w-full accent-violetneon h-1 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-gray-300 font-bold">
                <span>💡 Street Light Quality</span>
                <span className={lighting < 40 ? 'text-red-400' : 'text-emeraldneon'}>{lighting}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={lighting} 
                onChange={(e) => setLighting(parseInt(e.target.value))}
                className="w-full accent-violetneon h-1 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[11px] text-gray-300 font-bold">
                <span>👥 Pedestrian Density</span>
                <span className={crowd < 25 ? 'text-red-400' : 'text-emeraldneon'}>{crowd}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={crowd} 
                onChange={(e) => setCrowd(parseInt(e.target.value))}
                className="w-full accent-violetneon h-1 bg-gray-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] text-gray-300 font-bold">🌧️ Weather Conditions</span>
              <div className="grid grid-cols-3 gap-1">
                {['Clear', 'Rainy', 'Foggy'].map((wLabel, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setWeather(idx)}
                    className={`text-[9px] font-extrabold uppercase py-1.5 rounded-lg border transition-all cursor-pointer ${
                      weather === idx ? 'bg-violetneon border-violetneon text-white shadow-neon-violet' : 'bg-black/30 border-white/5 text-gray-400'
                    }`}
                  >
                    {wLabel}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Camera HUD */}
        <div className="pointer-events-auto w-full glass-panel border border-white/10 p-3 rounded-3xl flex flex-col gap-2 shadow-2xl mt-4 max-h-[190px]">
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span className="text-[9px] font-black uppercase text-violetneon tracking-wider">
              <i className="fa-solid fa-eye-slash mr-1" /> Camera Environment HUD
            </span>
            <span className={`text-[8px] font-extrabold uppercase ${permissionsGranted.camera ? 'text-emeraldneon animate-pulse' : 'text-red-400'}`}>
              {permissionsGranted.camera ? 'Live Stream Active' : 'Camera Blocked'}
            </span>
          </div>

          <div className="relative w-full h-[120px] bg-black/60 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center">
            {permissionsGranted.camera ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover scale-x-[-1]" 
                />
                <div className="absolute inset-0 border-2 border-emerald-500/10 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-emerald-500/40 animate-pulse shadow-md" style={{
                  animation: 'scanning 2s infinite linear'
                }} />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[7px] font-mono text-emeraldneon bg-black/60 px-2 py-1 rounded">
                  <span>LIGHT: {Math.round(lighting)}%</span>
                  <span className="animate-ping">🟢 SCAN</span>
                  <span>CROWD: {Math.round(crowd)}%</span>
                </div>
              </>
            ) : (
              <div className="text-center p-3 text-[10px] text-gray-400">
                <i className="fa-solid fa-video-slash text-xl text-gray-600 block mb-1.5" />
                <span>Grant camera permission to activate live AI lighting scanner HUD.</span>
                <button 
                  onClick={() => togglePermission('camera')}
                  className="mt-2 block mx-auto bg-violetneon/20 text-violetneon border border-violetneon/30 font-bold px-3 py-1 rounded-lg hover:bg-violetneon/40 transition-all cursor-pointer"
                >
                  Enable Camera
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* DYNAMIC SOS OVERLAY */}
      {sosActive && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-[#0B0D19]/90 border-2 border-red-500/30 rounded-3xl p-8 flex flex-col gap-6 text-center shadow-neon-red relative pointer-events-auto">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-4xl pulse-sos">🚨</div>

            <div className="mt-8">
              <h1 className="text-3xl font-black uppercase text-red-500 tracking-wider">EMERGENCY DISTRESS SOS ACTIVE</h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Direct alert broadcasted to nearest responsive desk</p>
            </div>

            <div className="bg-black/60 border border-white/5 p-4 rounded-2xl flex flex-col gap-2 max-w-lg mx-auto w-full">
              <div className="flex justify-between text-xs text-gray-400 border-b border-white/5 pb-2">
                <span>📍 GPS Anchor:</span>
                <span className="font-mono text-emeraldneon">{userLat.toFixed(6)}, {userLng.toFixed(6)}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>📞 Responding Station:</span>
                <span className="text-white font-bold">{facilities?.police_stations[0]?.name || "Local Command Post"}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>💬 Location Broadcast:</span>
                <span className="text-emeraldneon font-bold animate-pulse">📡 Real-time GPS sharing online</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full">
              <a 
                href={`tel:${facilities?.police_stations[0]?.phone || "112"}`}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase text-xs tracking-wider py-4 rounded-2xl border border-blue-500 flex flex-col items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
              >
                <i className="fa-solid fa-phone-volume text-lg animate-bounce" />
                <span>Call Police Patrol</span>
                <span className="text-[9px] opacity-70 font-mono">{facilities?.police_stations[0]?.phone || "+91 112"}</span>
              </a>

              <a 
                href={`tel:${facilities?.hospitals[0]?.ambulance_phone || "102"}`}
                className="bg-red-700 hover:bg-red-800 text-white font-extrabold uppercase text-xs tracking-wider py-4 rounded-2xl border border-red-600 flex flex-col items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform"
              >
                <i className="fa-solid fa-truck-medical text-lg animate-bounce" />
                <span>Call Ambulance</span>
                <span className="text-[9px] opacity-70 font-mono">Helpline: 102 / 108</span>
              </a>
            </div>

            <div className="flex flex-col gap-2 max-w-xs mx-auto w-full mt-2">
              <button 
                onClick={() => {
                  setSosActive(false);
                  setLocationSharingActive(false);
                }}
                className="bg-white/10 hover:bg-white/20 text-gray-300 font-extrabold uppercase text-[10px] tracking-wider py-3 rounded-xl border border-white/5 transition-all cursor-pointer"
              >
                Cancel Distress Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT HAZARD MODAL */}
      {showReportModal && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-xl z-40 flex items-center justify-center p-6">
          <form onSubmit={handleAddReport} className="w-full max-w-md bg-obsidian border border-white/10 p-6 rounded-3xl flex flex-col gap-4 shadow-2xl pointer-events-auto">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h2 className="text-sm font-black uppercase text-rose-800 tracking-wider"><i className="fa-solid fa-triangle-exclamation mr-1" /> File Safety Hazard Report</h2>
              <button type="button" onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-white text-lg"><i className="fa-solid fa-xmark" /></button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Hazard Category</label>
                <select 
                  value={reportForm.type}
                  onChange={(e) => setReportForm(prev => ({ ...prev, type: e.target.value }))}
                  className="bg-black/60 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-violetneon focus:outline-none"
                >
                  <option value="broken_light">💡 Broken Streetlight</option>
                  <option value="harassment">⚠️ Harassment Hotspot</option>
                  <option value="construction">🚧 Road Block / Construction</option>
                  <option value="isolated_area">👥 Deserted Alleys</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Severity Impact</label>
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3].map(num => (
                    <button 
                      key={num}
                      type="button"
                      onClick={() => setReportForm(prev => ({ ...prev, severity: num }))}
                      className={`text-xs py-2 rounded-xl border font-bold transition-all cursor-pointer ${
                        reportForm.severity === num 
                          ? 'bg-violetneon border-violetneon text-white shadow-neon-violet' 
                          : 'bg-black/40 border-white/5 text-gray-400'
                      }`}
                    >
                      Level {num} {num === 1 ? '(Minor)' : (num === 2 ? '(Moderate)' : '(Severe)')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Description / Rationale</label>
                <textarea 
                  placeholder="Describe the hazard..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-violetneon focus:outline-none focus:ring-1 focus:ring-violetneon"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-2">
              <button 
                type="button" 
                onClick={() => setShowReportModal(false)}
                className="bg-black/45 hover:bg-black/75 border border-white/5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-gray-400"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 px-5 py-2 rounded-xl text-xs font-black uppercase text-white shadow-neon-green transition-all cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ABOUT MODAL on Dashboard */}
      {showAboutModal && (
        <div className="modal-overlay" onClick={() => setShowAboutModal(false)} style={{ zIndex: 60 }}>
          <div className="modal-content text-[#4C0519]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <NariLogoSVG className="w-12 h-12" />
                <div>
                  <h2 className="text-xl font-black text-rose-900 tracking-wider">About NARI SURAKSHA AI</h2>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-pink-500">Initiative for Safety</p>
                </div>
              </div>
              <button onClick={() => setShowAboutModal(false)} className="text-rose-400 hover:text-rose-700 text-xl cursor-pointer p-2 hover:bg-pink-50 rounded-full transition-all">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto flex flex-col gap-4 pr-2 text-sm leading-relaxed text-rose-900 font-medium">
              <h3 className="text-2xl font-black text-rose-900 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                A Small Initiative, A Big Dream
              </h3>
              <p><strong>"When a woman steps out of her home, she should carry confidence—not fear."</strong></p>
              <p>Every day, thousands of women across India leave their homes to study, work, travel, or simply live their lives. Safety should never be a privilege—it is a fundamental right.</p>
              <div className="flex justify-center soft-float"><ConfidentWomanIllustration size="w-40 h-40" /></div>
              <p><strong>Nari Suraksha AI</strong> uses Artificial Intelligence to provide safety insights, predict potentially risky areas, and help women make informed decisions while travelling.</p>
              <blockquote className="border-l-4 border-pink-500 pl-4 py-2 bg-rose-50 rounded-r-lg text-rose-950 font-bold italic">
                "If even one woman feels more secure because of this initiative, every hour spent building it will have been worthwhile."
              </blockquote>
              <div className="flex justify-center soft-float"><SisterhoodIllustration size="w-56 h-36" /></div>
              <p>We, <strong>Sanjeevani Dubey and Deepali Singh</strong>, are just common students who believe that meaningful change often begins with a single idea and the courage to act upon it.</p>
              <div className="text-center py-3">
                <span className="text-2xl font-black text-rose-900 font-bold">"Main surakshit hoon."</span>
                <span className="block text-sm mt-1">— By <span className="developer-credit text-lg font-bold">Sanjeevani Dubey & Deepali Singh</span></span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
