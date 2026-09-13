import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { DigitalYatraPassport, PassportStamp, StampInkColor, StampShape } from '../types';
import { PassportStampBadge } from '../components/PassportStampBadge';
import { AarambhLogo } from '../components/AarambhLogo';
import { heritageAudio } from '../utils/audioEffects';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Stamp,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  Download,
  Share2,
  Printer,
  Compass,
  Award,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  RotateCw,
  Plane,
  Train,
  ShieldCheck,
  Globe,
  User,
} from 'lucide-react';
import { handlePrintSection } from '../utils/print';

// Iconic Indian destinations that can be stamped
const HERITAGE_DESTINATIONS: Array<{
  id: string;
  name: string;
  hindiName: string;
  city: string;
  state: string;
  epoch: string;
  category: string;
  inkColor: StampInkColor;
  shape: StampShape;
  iconSymbol: string;
}> = [
  {
    id: 'varanasi-kashi',
    name: 'Kashi Vishwanath & Ganga Ghats',
    hindiName: 'काशी विश्वनाथ एवं दशाश्वमेध घाट',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    epoch: 'Ancient Vedic',
    category: 'Sacred Mandir',
    inkColor: 'crimson',
    shape: 'round',
    iconSymbol: '🕉️',
  },
  {
    id: 'hampi-virupaksha',
    name: 'Hampi Virupaksha & Stone Chariot',
    hindiName: 'हम्पी विरुपाक्ष मन्दिर',
    city: 'Hampi',
    state: 'Karnataka',
    epoch: '14th Century CE',
    category: 'UNESCO Landmark',
    inkColor: 'ochre',
    shape: 'octagon',
    iconSymbol: '🏛️',
  },
  {
    id: 'jaipur-amber',
    name: 'Amber Palace & Sheesh Mahal',
    hindiName: 'आमेर दुर्ग एवं शीश महल',
    city: 'Jaipur',
    state: 'Rajasthan',
    epoch: '1592 CE',
    category: 'Royal Citadel',
    inkColor: 'indigo',
    shape: 'shield',
    iconSymbol: '🏰',
  },
  {
    id: 'konark-sun',
    name: 'Konark Sun Chariot Temple',
    hindiName: 'कोणार्क सूर्य मन्दिर',
    city: 'Puri District',
    state: 'Odisha',
    epoch: '1250 CE',
    category: 'UNESCO Landmark',
    inkColor: 'ochre',
    shape: 'round',
    iconSymbol: '☸️',
  },
  {
    id: 'kedarnath-dham',
    name: 'Kedarnath Sacred Jyotirlinga',
    hindiName: 'केदारनाथ ज्योतिर्लिंग धाम',
    city: 'Rudraprayag',
    state: 'Uttarakhand',
    epoch: '8th Century CE',
    category: 'Himalayan Shrine',
    inkColor: 'emerald',
    shape: 'octagon',
    iconSymbol: '🏔️',
  },
  {
    id: 'amritsar-golden',
    name: 'Sri Harmandir Sahib (Golden Temple)',
    hindiName: 'श्री हरिमन्दिर साहिब',
    city: 'Amritsar',
    state: 'Punjab',
    epoch: '1577 CE',
    category: 'Sacred Gurdwara',
    inkColor: 'ochre',
    shape: 'round',
    iconSymbol: '✨',
  },
  {
    id: 'madurai-meenakshi',
    name: 'Madurai Meenakshi Sundareswarar',
    hindiName: 'मीनाक्षी अम्मन मन्दिर',
    city: 'Madurai',
    state: 'Tamil Nadu',
    epoch: '6th Century CE',
    category: 'Dravidian Gopuram',
    inkColor: 'purple',
    shape: 'shield',
    iconSymbol: '🛕',
  },
  {
    id: 'khajuraho-temples',
    name: 'Khajuraho Monument Complex',
    hindiName: 'खजुराहो मन्दिर समूह',
    city: 'Chhatarpur',
    state: 'Madhya Pradesh',
    epoch: '950 CE',
    category: 'UNESCO Landmark',
    inkColor: 'crimson',
    shape: 'round',
    iconSymbol: '🗿',
  },
  {
    id: 'ellora-kailasa',
    name: 'Kailasa Monolithic Temple (Cave 16)',
    hindiName: 'कैलास एकाश्मक मन्दिर एलोरा',
    city: 'Aurangabad',
    state: 'Maharashtra',
    epoch: '756 CE',
    category: 'Rock-Cut Marvel',
    inkColor: 'indigo',
    shape: 'octagon',
    iconSymbol: '⛰️',
  },
  {
    id: 'rani-ki-vav',
    name: 'Rani ki Vav Stepwell',
    hindiName: 'रानी की वाव',
    city: 'Patan',
    state: 'Gujarat',
    epoch: '1063 CE',
    category: 'Subterranean Heritage',
    inkColor: 'emerald',
    shape: 'rect',
    iconSymbol: '🌊',
  },
  {
    id: 'bodhgaya-mahabodhi',
    name: 'Mahabodhi Mahavihara',
    hindiName: 'महाबोधि मन्दिर बोधगया',
    city: 'Bodh Gaya',
    state: 'Bihar',
    epoch: '3rd Century BCE',
    category: 'Buddhist Sacred Site',
    inkColor: 'ochre',
    shape: 'round',
    iconSymbol: '🌿',
  },
  {
    id: 'delhi-redfort',
    name: 'Lal Qila (Red Fort)',
    hindiName: 'लाल किला दिल्ली',
    city: 'New Delhi',
    state: 'Delhi',
    epoch: '1638 CE',
    category: 'National Monument',
    inkColor: 'crimson',
    shape: 'shield',
    iconSymbol: '🚩',
  },
];

const POPULAR_ORIGIN_CITIES = [
  'New Delhi',
  'Varanasi',
  'Mumbai',
  'Jaipur',
  'Bengaluru',
  'Kolkata',
  'Chennai',
  'Ahmedabad',
  'Srinagar',
  'Amritsar',
  'Bhubaneswar',
  'Hyderabad',
];

interface DigitalPassportViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const DigitalPassportView: React.FC<DigitalPassportViewProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();

  // Sound toggle
  const [soundOn, setSoundOn] = useState<boolean>(heritageAudio.isEnabled());

  // Passport state
  const [passport, setPassport] = useState<DigitalYatraPassport>(() => {
    const saved = localStorage.getItem('aarambh_digital_passport');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback below
      }
    }
    return {
      passportNumber: 'IND-YR-2026-78419',
      holderName: 'Arun Heritage Traveler',
      originCity: 'New Delhi',
      destinationCity: 'Varanasi',
      tripStartDate: new Date().toISOString().split('T')[0],
      circuitName: 'Sacred Ganga & Kashi Yatra Circuit',
      issueDate: '12 September 2026',
      stamps: [
        {
          id: 'varanasi-kashi',
          name: 'Kashi Vishwanath & Ganga Ghats',
          hindiName: 'काशी विश्वनाथ एवं दशाश्वमेध घाट',
          city: 'Varanasi',
          state: 'Uttar Pradesh',
          date: '2026-09-12',
          inkColor: 'crimson',
          shape: 'round',
          motto: 'सत्यमेव जयते',
          iconSymbol: '🕉️',
          verified: true,
          rotation: -4,
          stampCategory: 'Sacred Mandir',
        },
        {
          id: 'origin-stamp',
          name: 'Yatra Origin Departure Seal',
          hindiName: 'यात्रा प्रस्थान मोहर',
          city: 'New Delhi',
          state: 'Delhi NCR',
          date: '2026-09-12',
          inkColor: 'indigo',
          shape: 'octagon',
          motto: 'अतिथि देवो भव',
          iconSymbol: '🚆',
          verified: true,
          rotation: 3,
          stampCategory: 'Origin Station',
        },
      ],
      stampedCount: 2,
      totalTripsCompleted: 1,
      citizenshipTier: 'Sanskriti Sahayak',
    };
  });

  // Current booklet page: 0 = Cover, 1 = Bio / ID Page, 2 = Visa Page 1, 3 = Visa Page 2, 4 = Badges & Perks
  const [activePage, setActivePage] = useState<number>(1);

  // New Trip Start form modal / state
  const [showTripSetup, setShowTripSetup] = useState<boolean>(false);
  const [newOrigin, setNewOrigin] = useState<string>(passport.originCity);
  const [newDestination, setNewDestination] = useState<string>(passport.destinationCity);
  const [newCircuit, setNewCircuit] = useState<string>(passport.circuitName);

  // Stamping Animation State
  const [isStampingAnimation, setIsStampingAnimation] = useState<boolean>(false);
  const [animatingStamp, setAnimatingStamp] = useState<PassportStamp | null>(null);
  const [justStampedId, setJustStampedId] = useState<string | null>(null);

  // Custom Place to Stamp
  const [showCustomStampModal, setShowCustomStampModal] = useState<boolean>(false);
  const [customName, setCustomName] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customColor, setCustomColor] = useState<StampInkColor>('crimson');

  // Search in stamping drawer
  const [searchQuery, setSearchQuery] = useState('');

  // Persist passport
  useEffect(() => {
    localStorage.setItem('aarambh_digital_passport', JSON.stringify(passport));
  }, [passport]);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    heritageAudio.setEnabled(next);
  };

  const handlePageChange = (page: number) => {
    setActivePage(page);
    heritageAudio.playPageFlipSound();
  };

  // Perform a realistic stamp slam animation
  const handleStampPlace = (dest: typeof HERITAGE_DESTINATIONS[0]) => {
    // Check if already stamped
    const already = passport.stamps.some((s) => s.id === dest.id);
    if (already) {
      alert(`Already stamped: ${dest.name} is already stamped in your passport!`);
      return;
    }

    const newStamp: PassportStamp = {
      id: dest.id,
      name: dest.name,
      hindiName: dest.hindiName,
      city: dest.city,
      state: dest.state,
      date: new Date().toISOString().split('T')[0],
      inkColor: dest.inkColor,
      shape: dest.shape,
      motto: 'सत्यमेव जयते',
      iconSymbol: dest.iconSymbol,
      verified: true,
      rotation: Math.floor(Math.random() * 14) - 7, // natural -7 to +7 deg
      stampCategory: dest.category,
    };

    setAnimatingStamp(newStamp);
    setIsStampingAnimation(true);

    // Auto-navigate to visa pages to watch the stamp drop
    setActivePage(2);

    setTimeout(() => {
      // Audio THUD impact!
      heritageAudio.playStampSound();

      // Confetti burst
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.55 },
        colors: ['#b91c1c', '#1e3a8a', '#d97706', '#059669'],
      });

      // Update passport state
      setPassport((prev) => {
        const nextStamps = [...prev.stamps, newStamp];
        const count = nextStamps.length;
        let tier: DigitalYatraPassport['citizenshipTier'] = 'Sanskriti Sahayak';
        if (count >= 12) tier = 'Maha Yatri';
        else if (count >= 7) tier = 'Dharohar Rakshak';
        else if (count >= 4) tier = 'Yatra Pathik';

        return {
          ...prev,
          stamps: nextStamps,
          stampedCount: count,
          citizenshipTier: tier,
        };
      });

      setJustStampedId(newStamp.id);

      setTimeout(() => {
        setIsStampingAnimation(false);
        setAnimatingStamp(null);
      }, 700);

      setTimeout(() => {
        setJustStampedId(null);
      }, 3000);
    }, 600);
  };

  const handleStartNewTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrigin.trim()) return;

    // Generate origin departure stamp
    const originStamp: PassportStamp = {
      id: `origin-${Date.now()}`,
      name: `Departure: ${newOrigin}`,
      hindiName: `प्रस्थान केंद्र: ${newOrigin}`,
      city: newOrigin,
      state: 'Bharat',
      date: new Date().toISOString().split('T')[0],
      inkColor: 'indigo',
      shape: 'octagon',
      motto: 'शुभ यात्रा',
      iconSymbol: '🛫',
      verified: true,
      rotation: Math.floor(Math.random() * 10) - 5,
      stampCategory: 'Origin Departure Seal',
    };

    setPassport((prev) => ({
      ...prev,
      originCity: newOrigin,
      destinationCity: newDestination || 'Varanasi',
      circuitName: newCircuit || 'Custom Bharat Heritage Circuit',
      passportNumber: `IND-YR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      stamps: [originStamp, ...prev.stamps.filter((s) => !s.id.startsWith('origin-'))],
      stampedCount: prev.stamps.length + 1,
    }));

    setShowTripSetup(false);
    setActivePage(1); // open to bio page
    heritageAudio.playStampSound();
  };

  const handleAddCustomStamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customCity.trim()) return;

    const customStamp: PassportStamp = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      city: customCity.trim(),
      state: 'Bharat',
      date: new Date().toISOString().split('T')[0],
      inkColor: customColor,
      shape: 'round',
      motto: 'धर्माय नमः',
      iconSymbol: '🏛️',
      verified: true,
      rotation: Math.floor(Math.random() * 12) - 6,
      stampCategory: 'Custom Explorer Site',
    };

    setAnimatingStamp(customStamp);
    setIsStampingAnimation(true);
    setActivePage(2);
    setShowCustomStampModal(false);

    setTimeout(() => {
      heritageAudio.playStampSound();
      setPassport((prev) => ({
        ...prev,
        stamps: [...prev.stamps, customStamp],
        stampedCount: prev.stamps.length + 1,
      }));
      setJustStampedId(customStamp.id);
      setTimeout(() => {
        setIsStampingAnimation(false);
        setAnimatingStamp(null);
      }, 700);
    }, 600);

    setCustomName('');
    setCustomCity('');
  };

  const filteredDestinations = HERITAGE_DESTINATIONS.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Divide stamps across pages (Page 2: stamps 0-5, Page 3: stamps 6-11, etc.)
  const page1Stamps = passport.stamps.slice(0, 6);
  const page2Stamps = passport.stamps.slice(6, 12);

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-stone-900 pb-20 selection:bg-amber-100">
      {/* HEADER SECTION */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Stamp className="w-3.5 h-3.5 text-amber-700" />
                  Bharatiya Sanskriti Yatra Mudra
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-300 text-stone-700 text-xs font-mono font-semibold">
                  {passport.passportNumber}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-royal text-stone-950">
                Aarambh Digital Heritage Passport
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl font-light">
                Your sovereign digital passport for exploring India. Set your journey's starting city, and as you explore historical landmarks, temples, and stepwells, stamp your passport with authentic physical-feel ink mudras.
              </p>
            </div>

            {/* Quick Actions & Sound Control */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleSound}
                className={`p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                  soundOn
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-stone-100 border-stone-300 text-stone-500'
                }`}
                title={soundOn ? 'Sound Effects Enabled' : 'Sound Muted'}
              >
                {soundOn ? <Volume2 className="w-4 h-4 text-amber-700" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">{soundOn ? 'SFX On' : 'Muted'}</span>
              </button>

              <button
                onClick={() => setShowTripSetup(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Compass className="w-4 h-4 text-amber-200" />
                <span>Start New Trip</span>
              </button>

              <button
                onClick={() => handlePrintSection('printable-passport-booklet', 'portrait')}
                className="px-4 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Print Passport Booklet"
              >
                <Printer className="w-4 h-4 text-stone-600" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* PAGE NAVIGATION TABS */}
          <div className="flex items-center justify-between border-t border-stone-100 mt-5 pt-3 overflow-x-auto gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[
                { id: 0, label: 'Cover', icon: '📘' },
                { id: 1, label: 'Identity / Bio', icon: '👤' },
                { id: 2, label: `Visas (1-6) [${page1Stamps.length}]`, icon: '🪶' },
                { id: 3, label: `Visas (7-12) [${page2Stamps.length}]`, icon: '🪶' },
                { id: 4, label: 'Explorer Badges', icon: '🎖️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handlePageChange(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                    activePage === tab.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-stone-600 bg-stone-50 px-3 py-1 rounded-md border border-stone-200">
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>Origin: <strong>{passport.originCity}</strong></span>
              <span className="text-stone-300">•</span>
              <span>Total Stamps: <strong className="text-amber-800">{passport.stamps.length}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN PASSPORT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: THE PASSPORT BOOKLET VIEW (SPAN 7) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* BOOKLET ENCLOSURE */}
            <div id="printable-passport-booklet" className="relative w-full max-w-xl perspective-1000">
              
              {/* STAMPING ANIMATION OVERLAY (The Flying Rubber Stamp) */}
              {isStampingAnimation && animatingStamp && (
                <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
                  <div className="flex flex-col items-center animate-stamp-slam drop-shadow-2xl">
                    {/* Wooden / Brass Stamp Handle */}
                    <div className="w-10 h-16 bg-gradient-to-b from-[#4a2a18] via-[#783e1e] to-[#2c180e] rounded-t-full border-2 border-[#d97706] shadow-xl flex items-center justify-center">
                      <div className="w-2 h-10 bg-amber-400/40 rounded-full" />
                    </div>
                    {/* Brass Mount Collar */}
                    <div className="w-18 h-4 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-700 rounded-sm border border-amber-900 shadow-md" />
                    {/* Rubber Head */}
                    <div className="w-28 h-8 bg-stone-800 rounded-md border border-stone-900 shadow-2xl flex items-center justify-center">
                      <span className="text-[10px] font-mono text-amber-300 font-bold tracking-widest uppercase">
                        ★ ASI MUDRA ★
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= PAGE 0: COVER ================= */}
              {activePage === 0 && (
                <div
                  onClick={() => handlePageChange(1)}
                  className="w-full min-h-[520px] sm:min-h-[580px] bg-[#14213d] text-[#e5a93b] rounded-2xl p-8 sm:p-12 shadow-2xl border-4 border-[#0b1325] flex flex-col justify-between items-center text-center select-none cursor-pointer transition-transform hover:scale-[1.01] relative overflow-hidden"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 0 40px rgba(0,0,0,0.6)',
                  }}
                >
                  {/* Leatherette Grain Effect */}
                  <div
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)',
                      backgroundSize: '4px 4px',
                    }}
                  />

                  {/* Top Gold Headings */}
                  <div className="space-y-2 z-10">
                    <div className="text-sm sm:text-base font-bold tracking-[0.25em] uppercase font-serif">
                      गणराज्य भारत
                    </div>
                    <div className="text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase text-[#F3E5AB]">
                      REPUBLIC OF INDIA
                    </div>
                  </div>

                  {/* Center Emblem & Aarambh Insignia */}
                  <div className="my-auto z-10 flex flex-col items-center space-y-5">
                    {/* Ashoka Lion / Sacred Mandala Emblem */}
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-[#e5a93b] p-2 flex items-center justify-center shadow-inner">
                      <div className="w-full h-full rounded-full border border-dashed border-[#F3E5AB] flex flex-col items-center justify-center">
                        <AarambhLogo size="lg" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-black font-royal tracking-widest text-[#FBF5B7] uppercase drop-shadow-md">
                        आरम्भ यात्रा पासपोर्ट
                      </h2>
                      <div className="text-xs sm:text-sm font-serif font-bold tracking-widest text-[#e5a93b] uppercase">
                        AARAMBH HERITAGE PASSPORT
                      </div>
                    </div>
                  </div>

                  {/* Bottom Passport Details */}
                  <div className="w-full z-10 border-t border-[#e5a93b]/40 pt-4 flex items-center justify-between text-xs font-mono text-[#F3E5AB]/80">
                    <span>{passport.passportNumber}</span>
                    <span className="flex items-center gap-1 font-bold text-white hover:underline">
                      Open Booklet <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )}

              {/* ================= PAGE 1: BIO / ID PAGE ================= */}
              {activePage === 1 && (
                <div
                  id="passport-bio-page"
                  className="w-full min-h-[520px] sm:min-h-[580px] bg-[#FAF6EE] text-stone-900 rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-stone-300 flex flex-col justify-between select-none relative overflow-hidden font-sans"
                  style={{
                    backgroundImage: 'radial-gradient(#d6c7b0 1px, transparent 1px)',
                    backgroundSize: '16px 16px',
                  }}
                >
                  {/* Subtle Guilloche Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                    <svg className="w-96 h-96" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
                      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  </div>

                  {/* Top Security Header */}
                  <div className="border-b-2 border-stone-300 pb-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 font-mono">
                        BHARAT CULTURAL CITIZENRY REGISTRY
                      </div>
                      <div className="text-sm sm:text-base font-black font-royal text-stone-900">
                        भारत गणराज्य • PASSPORT / पारपत्र
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        {passport.citizenshipTier}
                      </span>
                    </div>
                  </div>

                  {/* Bio Info Grid */}
                  <div className="my-auto py-4 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    {/* Left: Passport Photo / Avatar */}
                    <div className="sm:col-span-4 flex flex-col items-center">
                      <div className="w-28 h-36 bg-gradient-to-tr from-stone-200 to-stone-100 rounded-xl border-2 border-stone-400 p-1 shadow-inner relative flex flex-col items-center justify-center overflow-hidden">
                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="Traveler"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-stone-400">
                            <User className="w-12 h-12 text-stone-500" />
                            <span className="text-[9px] font-mono text-stone-500 mt-1 font-bold">HERITAGE YATRI</span>
                          </div>
                        )}
                        {/* Official holographic watermark stamp across photo */}
                        <div className="absolute -bottom-2 -right-2 w-14 h-14 rounded-full border border-amber-500/60 bg-amber-400/20 backdrop-blur-xs flex items-center justify-center rotate-12">
                          <span className="text-[6px] font-mono font-bold text-amber-900 text-center leading-tight">
                            ASI<br />VERIFIED
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-[10px] font-mono text-stone-500 font-semibold">
                        STATUS: ACTIVE
                      </div>
                    </div>

                    {/* Right: Traveler Fields */}
                    <div className="sm:col-span-8 space-y-2.5 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[9px] uppercase font-bold text-stone-400 font-mono">Passport No.</div>
                          <div className="font-mono font-bold text-stone-900 text-sm">{passport.passportNumber}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-stone-400 font-mono">Traveler Name</div>
                          <div className="font-bold text-stone-900 truncate">
                            {user?.displayName || passport.holderName}
                          </div>
                        </div>
                      </div>

                      {/* Origin City (KEY REQUIREMENT: Jha se trip start krega) */}
                      <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-[9px] uppercase font-extrabold text-amber-900 font-mono flex items-center gap-1">
                              <Compass className="w-3 h-3 text-amber-700" />
                              <span>Trip Origin / प्रस्थान स्थल</span>
                            </div>
                            <div className="text-sm font-black text-amber-950 mt-0.5">
                              {passport.originCity}
                            </div>
                          </div>
                          <button
                            onClick={() => setShowTripSetup(true)}
                            className="text-[10px] text-amber-800 font-bold underline hover:text-amber-950"
                          >
                            Change Origin
                          </button>
                        </div>
                        <div className="text-[10px] text-stone-600 mt-1">
                          Circuit: <strong className="text-stone-800">{passport.circuitName}</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-[9px] uppercase font-bold text-stone-400 font-mono">Issue Date</div>
                          <div className="font-medium text-stone-800">{passport.issueDate}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-stone-400 font-mono">Validity</div>
                          <div className="font-bold text-emerald-800">LIFETIME BHARAT CITIZEN</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[9px] uppercase font-bold text-stone-400 font-mono">Authority</div>
                        <div className="text-[11px] font-semibold text-stone-800">
                          Aarambh Sanskriti Mission & ASI Heritage Trust
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom MRZ Lines (Machine Readable Zone) */}
                  <div className="border-t-2 border-stone-300 pt-2 font-mono text-[10px] sm:text-[11px] text-stone-600 tracking-widest break-all bg-stone-100/60 p-2 rounded-lg">
                    P&lt;INDBHARAT&lt;&lt;{(user?.displayName || passport.holderName).replace(/\s+/g, '&lt;').toUpperCase()}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                    <br />
                    {passport.passportNumber.replace(/-/g, '')}7IND2609124M9999999&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;02
                  </div>
                </div>
              )}

              {/* ================= PAGE 2 & 3: VISAS AND STAMPS ================= */}
              {(activePage === 2 || activePage === 3) && (
                <div
                  className="w-full min-h-[520px] sm:min-h-[580px] bg-[#FAF7F0] text-stone-900 rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-stone-300 flex flex-col justify-between select-none relative overflow-hidden"
                  style={{
                    backgroundImage: `
                      radial-gradient(#c7b299 1px, transparent 1px),
                      repeating-linear-gradient(45deg, rgba(200, 180, 150, 0.05) 0px, rgba(200, 180, 150, 0.05) 20px, transparent 20px, transparent 40px)
                    `,
                    backgroundSize: '20px 20px, 40px 40px',
                  }}
                >
                  {/* Top Visa Page Header */}
                  <div className="border-b border-stone-300 pb-2 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-stone-400">
                        VISAS & HERITAGE ENTRY MUDRAS / वीज़ा पृष्ठ
                      </div>
                      <div className="text-sm font-bold font-royal text-stone-800">
                        {activePage === 2 ? 'PAGE 1 - 2 (NORTH & CENTRAL)' : 'PAGE 3 - 4 (SOUTH & EAST)'}
                      </div>
                    </div>
                    <div className="text-xs font-mono font-bold text-stone-500">
                      PAGE {activePage} OF 4
                    </div>
                  </div>

                  {/* The Stamps Grid (2 rows x 3 cols = 6 slots) */}
                  <div className="my-auto py-4 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 justify-items-center items-center">
                    {(activePage === 2 ? page1Stamps : page2Stamps).map((st) => (
                      <div key={st.id} className="relative">
                        <PassportStampBadge
                          stamp={st}
                          size="sm"
                          isJustStamped={justStampedId === st.id}
                        />
                      </div>
                    ))}

                    {/* Empty Slots waiting to be stamped */}
                    {Array.from({
                      length: Math.max(0, 6 - (activePage === 2 ? page1Stamps.length : page2Stamps.length)),
                    }).map((_, idx) => (
                      <div
                        key={`empty-${idx}`}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-dashed border-stone-300/80 flex flex-col items-center justify-center p-2 text-center text-stone-400 group hover:border-amber-400 transition-colors"
                      >
                        <Stamp className="w-5 h-5 text-stone-300 group-hover:text-amber-600 transition-colors mb-1" />
                        <span className="text-[8px] font-mono uppercase font-bold tracking-wider">
                          Awaiting Visit
                        </span>
                        <span className="text-[7px] text-stone-400">
                          Click place on right
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Footer Note */}
                  <div className="border-t border-stone-200 pt-2 flex items-center justify-between text-[10px] font-mono text-stone-500">
                    <span>SEALED BY ASI ARCHIVAL LEDGER</span>
                    <span className="text-amber-800 font-bold">
                      {passport.stamps.length} SITES CERTIFIED
                    </span>
                  </div>
                </div>
              )}

              {/* ================= PAGE 4: BADGES & PERKS ================= */}
              {activePage === 4 && (
                <div
                  className="w-full min-h-[520px] sm:min-h-[580px] bg-white text-stone-900 rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-stone-300 flex flex-col justify-between select-none relative overflow-hidden"
                >
                  <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700">
                        PILGRIM ACHIEVEMENTS
                      </div>
                      <h3 className="text-lg font-bold font-royal text-stone-900">
                        Heritage Guardian Badges
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                      Tier: {passport.citizenshipTier}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-auto py-2">
                    {[
                      {
                        title: 'Ghat Pilgrim',
                        desc: 'Visit sacred Ganga / Yamuna Ghats',
                        unlocked: passport.stamps.some((s) => s.city.includes('Varanasi')),
                        icon: '🪔',
                      },
                      {
                        title: 'Fortress Explorer',
                        desc: 'Stamp 1 Royal Rajputana Citadel',
                        unlocked: passport.stamps.some((s) => s.city.includes('Jaipur') || s.state.includes('Rajasthan')),
                        icon: '🏰',
                      },
                      {
                        title: 'Chola & Vijayanagara',
                        desc: 'Stamp ancient Deccan empires',
                        unlocked: passport.stamps.some((s) => s.city.includes('Hampi') || s.state.includes('Tamil Nadu')),
                        icon: '🏛️',
                      },
                      {
                        title: 'Subterranean Master',
                        desc: 'Visit historical stepwell marvels',
                        unlocked: passport.stamps.some((s) => s.id.includes('stepwell') || s.id.includes('vav')),
                        icon: '🌊',
                      },
                      {
                        title: 'Himalayan Devbhumi',
                        desc: 'Trek or e-visit holy Char Dham',
                        unlocked: passport.stamps.some((s) => s.state.includes('Uttarakhand')),
                        icon: '🏔️',
                      },
                      {
                        title: 'Maha Yatri Club',
                        desc: 'Collect 10+ official mudras',
                        unlocked: passport.stamps.length >= 10,
                        icon: '👑',
                      },
                    ].map((badge, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                          badge.unlocked
                            ? 'bg-amber-50/60 border-amber-300 text-stone-900'
                            : 'bg-stone-50 border-stone-200 opacity-50'
                        }`}
                      >
                        <div className="text-xl">{badge.icon}</div>
                        <div>
                          <div className="text-xs font-bold flex items-center gap-1">
                            {badge.title}
                            {badge.unlocked && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          </div>
                          <div className="text-[10px] text-stone-500 leading-tight mt-0.5">{badge.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-stone-200 pt-3 text-center text-xs text-stone-500">
                    Share your passport with friends or print for framing.
                  </div>
                </div>
              )}

              {/* BOOKLET CONTROLS (PREV / NEXT PAGE) */}
              <div className="flex items-center justify-between mt-4 w-full px-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, activePage - 1))}
                  disabled={activePage === 0}
                  className="px-3 py-1.5 bg-white hover:bg-stone-100 disabled:opacity-30 border border-stone-200 rounded-lg text-xs font-bold text-stone-700 flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous Page
                </button>

                <div className="text-xs font-mono text-stone-600">
                  Page {activePage} of 4
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(4, activePage + 1))}
                  disabled={activePage === 4}
                  className="px-3 py-1.5 bg-white hover:bg-stone-100 disabled:opacity-30 border border-stone-200 rounded-lg text-xs font-bold text-stone-700 flex items-center gap-1 cursor-pointer"
                >
                  Next Page <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: DESTINATION STAMPING DRAWER (SPAN 5) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold font-royal text-stone-900 flex items-center gap-2">
                    <Stamp className="w-4 h-4 text-amber-700" />
                    <span>Stamp Visited Places</span>
                  </h2>
                  <p className="text-xs text-stone-500">
                    Click any place below to apply its official rubber ink seal
                  </p>
                </div>

                <button
                  onClick={() => setShowCustomStampModal(true)}
                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-bold text-stone-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Custom Place</span>
                </button>
              </div>

              {/* Search filter */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search landmark, city, state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Stamping Directory List */}
              <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                {filteredDestinations.map((dest) => {
                  const isStamped = passport.stamps.some((s) => s.id === dest.id);

                  return (
                    <div
                      key={dest.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                        isStamped
                          ? 'bg-emerald-50/50 border-emerald-300'
                          : 'bg-stone-50/70 border-stone-200 hover:bg-amber-50/50 hover:border-amber-300'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{dest.iconSymbol}</span>
                          <span className="font-bold text-xs text-stone-900 truncate">
                            {dest.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span className="truncate">{dest.city}, {dest.state}</span>
                          <span className="text-stone-300">•</span>
                          <span className="font-mono text-stone-400">{dest.epoch}</span>
                        </div>
                      </div>

                      {isStamped ? (
                        <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Stamped
                        </span>
                      ) : (
                        <button
                          onClick={() => handleStampPlace(dest)}
                          className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Stamp className="w-3 h-3 text-amber-200" />
                          <span>Stamp</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

              {/* Trip Planner Bridge Card */}
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/40 rounded-2xl border border-amber-200 space-y-2">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-amber-800" />
                  <span>Planning a live trip right now?</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Head over to the Trip Planner to customize your travel route, check real IRCTC trains, and auto-sync your itinerary into your passport!
                </p>
                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('plan-trip')}
                    className="mt-1 text-xs font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Connected Trip Planner</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: START NEW TRIP / ORIGIN SETUP ================= */}
      {showTripSetup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-5 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Yatra Initiation
              </span>
              <h3 className="text-xl font-bold font-royal text-stone-900">
                Start Trip & Issue Passport
              </h3>
              <p className="text-xs text-stone-500">
                Where will your pilgrimage or heritage journey begin? We will stamp your starting origin into your digital passport.
              </p>
            </div>

            <form onSubmit={handleStartNewTrip} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Starting City / Origin (प्रस्थान नगर) *
                </label>
                <input
                  type="text"
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  placeholder="e.g. New Delhi, Varanasi, Jaipur, etc."
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Quick Pick Chips */}
              <div>
                <div className="text-[11px] font-semibold text-stone-500 mb-1.5">Popular Starting Points:</div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_ORIGIN_CITIES.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setNewOrigin(city)}
                      className={`px-2 py-0.5 rounded-md text-xs transition-colors cursor-pointer ${
                        newOrigin === city
                          ? 'bg-amber-700 text-white font-bold'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Target Destination or Circuit Name
                </label>
                <input
                  type="text"
                  value={newCircuit}
                  onChange={(e) => setNewCircuit(e.target.value)}
                  placeholder="e.g. Kashi Vishwanath & Sacred Ghats"
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTripSetup(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white rounded-xl shadow-md cursor-pointer"
                >
                  Issue Passport & Stamp Origin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD CUSTOM STAMP ================= */}
      {showCustomStampModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-5 animate-fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Explorer Discovery
              </span>
              <h3 className="text-xl font-bold font-royal text-stone-900">
                Stamp a Custom Monument or Temple
              </h3>
              <p className="text-xs text-stone-500">
                Did you visit an ancient stepwell, village shrine, or regional fort? Add it to your passport with a custom ink color!
              </p>
            </div>

            <form onSubmit={handleAddCustomStamp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Monument / Landmark Name *</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Sanchi Stupa, Golconda Fort"
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">City / Region *</label>
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="e.g. Hyderabad, Sanchi, Thanjavur"
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Stamp Ink Color</label>
                <div className="flex items-center gap-3">
                  {[
                    { id: 'crimson', bg: 'bg-red-700', label: 'Crimson' },
                    { id: 'indigo', bg: 'bg-blue-900', label: 'Indigo' },
                    { id: 'emerald', bg: 'bg-emerald-700', label: 'Emerald' },
                    { id: 'ochre', bg: 'bg-amber-700', label: 'Ochre' },
                    { id: 'purple', bg: 'bg-purple-800', label: 'Purple' },
                  ].map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setCustomColor(color.id as StampInkColor)}
                      className={`w-7 h-7 rounded-full ${color.bg} transition-all cursor-pointer ${
                        customColor === color.id
                          ? 'ring-4 ring-amber-300 scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomStampModal(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white rounded-xl shadow-md cursor-pointer"
                >
                  Apply Custom Mudra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
