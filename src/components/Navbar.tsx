import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES, getTranslation } from '../utils/translations';
import { AarambhLogo } from './AarambhLogo';
import {
  ChevronDown,
  Globe,
  Menu,
  X,
  Bookmark,
  User,
  LogOut,
  Award,
  Sparkles,
  Compass,
  Check,
} from 'lucide-react';

const GoogleIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenSaveMemory: () => void;
  onOpenItinerary: () => void;
  onReopenIntro: () => void;
  onOpenSearch?: () => void;
  savedItineraryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenSaveMemory,
  onOpenItinerary,
  savedItineraryCount,
}) => {
  const { user, openAuthModal, signOut, switchRole, language, setLanguage } = useAuth();

  // Dropdown state: 'more' | 'lang' | 'user' | null
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const langCode = (language || 'EN').substring(0, 2).toUpperCase();
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_LANGUAGES[0];

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  return (
    <header
      ref={dropdownRef}
      className="sticky top-0 z-50 w-full shadow-xs transition-all"
      style={{
        background:
          'linear-gradient(90deg, #F89B29 0%, #FBB35A 14%, #FFFFFF 30%, #FFFFFF 70%, #60B872 88%, #319C45 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* LEFT: Authentic Aarambh Brand Logo Mark */}
        <button
          onClick={() => {
            onTabChange('explore');
            setActiveDropdown(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center text-left cursor-pointer select-none transition-transform hover:opacity-95 shrink-0"
          aria-label="Aarambh Home"
        >
          <AarambhLogo size="md" />
        </button>

        {/* CENTER: Focused High-Value USPs (Discover, Heritage, E-Visit, Digital Passport) + Clean "More" Menu */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-stone-800">
          {/* 1. Core USP: Discover & Explore */}
          <button
            onClick={() => {
              onTabChange('explore');
              setActiveDropdown(null);
            }}
            className={`py-2 transition-colors cursor-pointer ${
              currentTab === 'explore'
                ? 'text-stone-950 font-bold border-b-2 border-stone-900 pb-1.5'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            {getTranslation('explore', langCode) || 'Explore'}
          </button>

          {/* 2. Core USP: Heritage Sites (UNESCO/ASI) */}
          <button
            onClick={() => {
              onTabChange('heritage');
              setActiveDropdown(null);
            }}
            className={`py-2 transition-colors cursor-pointer ${
              currentTab === 'heritage'
                ? 'text-stone-950 font-bold border-b-2 border-stone-900 pb-1.5'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            {getTranslation('heritage', langCode) || 'Heritage Sites'}
          </button>

          {/* 3. Core USP: 3D Darshan E-Visit */}
          <button
            onClick={() => {
              onTabChange('evisit');
              setActiveDropdown(null);
            }}
            className={`py-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'evisit'
                ? 'text-stone-950 font-bold border-b-2 border-stone-900 pb-1.5'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <span>🪔</span>
            <span>E-Visit</span>
          </button>

          {/* 4. Core Innovation USP: Digital Yatra Passport */}
          <button
            onClick={() => {
              onTabChange('passport');
              setActiveDropdown(null);
            }}
            className={`py-1.5 px-3 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'passport'
                ? 'bg-amber-900 text-white font-bold shadow-xs'
                : 'text-stone-900 hover:bg-amber-100/80 bg-white/70 border border-stone-300 font-semibold shadow-2xs'
            }`}
            title="Digital Yatra Passport with Live Rubber Ink Stamps"
          >
            <span>🛂</span>
            <span>Passport</span>
          </button>

          {/* If user is Cultural Contributor, show dedicated Contributor Studio pill */}
          {user?.role === 'CULTURAL_CREATOR' && (
            <button
              onClick={() => {
                onTabChange('creator');
                setActiveDropdown(null);
              }}
              className={`py-1.5 px-3 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === 'creator'
                  ? 'bg-orange-700 text-white font-bold shadow-xs'
                  : 'text-orange-950 hover:bg-orange-100/80 bg-orange-50 border border-orange-300/80 font-bold shadow-2xs'
              }`}
              title="Living Heritage Contributor Studio"
            >
              <span>🎨</span>
              <span>Contributor Studio</span>
            </button>
          )}

          {/* 5. Clean "More" Dropdown for secondary features (Crafts, Ancient Games, Community, Web3 Certificate) */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('more')}
              className={`py-2 transition-colors cursor-pointer flex items-center gap-1 ${
                ['living-heritage', 'games-canvas', 'community', 'certificate', 'creator'].includes(currentTab)
                  ? 'text-stone-950 font-bold border-b-2 border-stone-900 pb-1.5'
                  : 'text-stone-700 hover:text-stone-950'
              }`}
            >
              <span>More</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  activeDropdown === 'more' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {activeDropdown === 'more' && (
              <div className="absolute left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-stone-200 animate-fade-in z-50 space-y-1">
                <button
                  onClick={() => {
                    onTabChange('games-canvas');
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    currentTab === 'games-canvas'
                      ? 'bg-amber-50 text-amber-950 font-bold'
                      : 'hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <span className="text-sm">🎲</span>
                  <div>
                    <div className="font-semibold">Games & Canvas</div>
                    <div className="text-[10px] text-stone-500">Moksha Patam, Chaupar & Kolam</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onTabChange('living-heritage');
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    currentTab === 'living-heritage'
                      ? 'bg-amber-50 text-amber-950 font-bold'
                      : 'hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <span className="text-sm">🏺</span>
                  <div>
                    <div className="font-semibold">{getTranslation('crafts', langCode) || 'Living Crafts'}</div>
                    <div className="text-[10px] text-stone-500">Artisans, Handlooms & GI Tags</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onTabChange('community');
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    currentTab === 'community'
                      ? 'bg-amber-50 text-amber-950 font-bold'
                      : 'hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <span className="text-sm">👥</span>
                  <div>
                    <div className="font-semibold">Community Lore</div>
                    <div className="text-[10px] text-stone-500">Crowdsourced oral narratives</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onTabChange('certificate');
                    setActiveDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                    currentTab === 'certificate'
                      ? 'bg-amber-50 text-amber-950 font-bold'
                      : 'hover:bg-stone-100 text-stone-800'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <div className="font-semibold flex items-center gap-1">
                      <span>Web3 Certificate</span>
                      <span className="px-1 py-0.2 rounded bg-amber-600 text-white text-[8px] font-bold">NFT</span>
                    </div>
                    <div className="text-[10px] text-stone-500">Blockchain verified Yatra badge</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT CONTROLS: [Plan Trip] CTA button, Language & Profile */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          
          {/* Saved Places Bookmark Counter */}
          {savedItineraryCount > 0 && (
            <button
              onClick={onOpenItinerary}
              className="relative p-2 rounded-full hover:bg-black/5 text-stone-800 transition-colors cursor-pointer"
              title={getTranslation('savedPlaces', langCode)}
            >
              <Bookmark className="w-4 h-4 text-stone-800" />
              <span className="absolute 0 top-0.5 right-0.5 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center shadow-2xs">
                {savedItineraryCount}
              </span>
            </button>
          )}

          {/* Primary USP CTA: "Plan Trip" */}
          <button
            onClick={() => {
              onTabChange('plan-trip');
              setActiveDropdown(null);
            }}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'plan-trip'
                ? 'bg-black text-amber-300 ring-2 ring-amber-400'
                : 'bg-[#18181B] hover:bg-black text-white active:scale-95'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{getTranslation('planTrip', langCode) || 'Plan Trip'}</span>
          </button>

          {/* Language Switcher: 🌐 EN ⌄ */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('lang')}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full text-stone-800 hover:text-stone-950 text-xs sm:text-sm font-medium hover:bg-black/5 transition-colors cursor-pointer"
              title="Select Language"
            >
              <Globe className="w-4 h-4 text-sky-700" />
              <span className="font-semibold">{currentLangObj.code}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-stone-600 transition-transform ${
                  activeDropdown === 'lang' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Language Selection Dropdown Menu */}
            {activeDropdown === 'lang' && (
              <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-stone-200 animate-fade-in z-50 space-y-1">
                <div className="px-3 py-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center justify-between border-b border-stone-100">
                  <span>{getTranslation('language', langCode)}</span>
                  <span className="text-amber-700 font-semibold">{SUPPORTED_LANGUAGES.length} Languages</span>
                </div>

                <div className="max-h-64 overflow-y-auto pr-0.5 space-y-1">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLanguage(l.code);
                        setActiveDropdown(null);
                        
                        // Force Google Translate to translate the entire page
                        const targetLang = l.code.toLowerCase();
                        if (targetLang === 'en') {
                           // Remove translation cookie
                           document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                           document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
                        } else {
                           document.cookie = `googtrans=/en/${targetLang}; path=/`;
                           document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${window.location.hostname}`;
                        }
                        
                        // Reload to apply translation to entire page
                        setTimeout(() => window.location.reload(), 100);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                        langCode === l.code
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{l.flag}</span>
                        <span>{l.name}</span>
                      </div>
                      <span className="text-[11px] text-stone-400 font-mono">{l.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sign In with Google Quick Button if in Guest Mode */}
          {user?.isGuest && (
            <button
              onClick={() => openAuthModal('TRAVELER')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              title="Sign in with Gmail as Contributor or Traveler"
            >
              <GoogleIcon className="w-3.5 h-3.5" />
              <span>Sign in with Google</span>
            </button>
          )}

          {/* User Profile Avatar Icon */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('user')}
              className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center cursor-pointer transition-all overflow-hidden ${
                !user?.isGuest && user?.authProvider === 'google'
                  ? 'bg-amber-100 text-stone-900 border-2 border-amber-600 ring-2 ring-blue-500/40 shadow-xs'
                  : 'bg-stone-900/10 hover:bg-stone-900/20 text-stone-900 border border-stone-900/20'
              }`}
              title={user?.isGuest ? 'Guest Explorer (Click to Sign in)' : `${user.name} (${user.role})`}
            >
              {user?.avatar || user?.photoURL ? (
                <img
                  src={user.avatar || user.photoURL}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : user?.name ? (
                user.name.charAt(0).toUpperCase()
              ) : (
                <User className="w-3.5 h-3.5 text-stone-800" />
              )}
            </button>

            {activeDropdown === 'user' && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl p-3 shadow-2xl border border-stone-200 animate-fade-in z-50 space-y-2.5">
                {/* User Identity Header */}
                <div className="px-1 border-b border-stone-100 pb-2">
                  <div className="flex items-center justify-between gap-1">
                    <div className="text-xs font-bold text-stone-900 truncate">
                      {user?.name || 'Heritage Pilgrim'}
                    </div>
                    {!user?.isGuest ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700 shrink-0">
                        <GoogleIcon className="w-2.5 h-2.5" />
                        <span>Google</span>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-500 text-[10px] font-mono shrink-0">
                        Guest
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 truncate font-mono">
                    {user?.email || (user?.isGuest ? 'Guest Mode (Not signed in)' : 'traveler@aarambh.in')}
                  </div>
                </div>

                {/* 1-CLICK ROLE SWITCHER (Contributor <-> Traveler) */}
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-200/90">
                  <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Active Role Track</span>
                    <span className="text-amber-800 font-semibold">
                      {user?.role === 'CULTURAL_CREATOR' ? 'Contributor' : user?.role === 'ADMIN' ? 'Curator' : 'Traveler'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        switchRole('TRAVELER');
                        onTabChange('explore');
                      }}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        user?.role === 'TRAVELER'
                          ? 'bg-amber-900 text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-200/80 bg-white border border-stone-200'
                      }`}
                    >
                      <Compass className="w-3 h-3" />
                      <span>Traveler</span>
                    </button>
                    <button
                      onClick={() => {
                        switchRole('CULTURAL_CREATOR');
                        onTabChange('creator');
                      }}
                      className={`px-2 py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        user?.role === 'CULTURAL_CREATOR'
                          ? 'bg-orange-700 text-white shadow-xs'
                          : 'text-stone-600 hover:bg-stone-200/80 bg-white border border-stone-200'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Contributor</span>
                    </button>
                  </div>
                </div>

                {/* Guest Sign-in prompt */}
                {user?.isGuest && (
                  <button
                    onClick={() => {
                      openAuthModal('TRAVELER');
                      setActiveDropdown(null);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
                  >
                    <GoogleIcon className="w-3.5 h-3.5" />
                    <span>Sign in with Google / Gmail</span>
                  </button>
                )}

                {/* Role Specific Actions */}
                <div className="space-y-0.5 pt-1 border-t border-stone-100">
                  {user?.role === 'CULTURAL_CREATOR' ? (
                    <button
                      onClick={() => {
                        onTabChange('creator');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-950 font-bold transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>🎨</span>
                      <span>My Contributor Studio</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onTabChange('passport');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-xl hover:bg-stone-100 text-stone-800 font-medium transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>🛂</span>
                      <span>Digital Yatra Passport</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenSaveMemory();
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-xl hover:bg-stone-100 text-stone-800 font-medium transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>📸</span>
                    <span>{getTranslation('contributeMemoryBtn', langCode)}</span>
                  </button>

                  <button
                    onClick={() => {
                      onTabChange('admin');
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs rounded-xl hover:bg-stone-100 text-stone-800 font-medium transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>🏛️</span>
                    <span>{getTranslation('curatorDesk', langCode)}</span>
                  </button>
                </div>

                {/* Bottom action: Sign out or Sign in */}
                <div className="pt-1.5 border-t border-stone-100">
                  {!user?.isGuest ? (
                    <button
                      onClick={() => {
                        signOut();
                        setActiveDropdown(null);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs rounded-xl hover:bg-red-50 text-red-600 font-medium transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">Switch account</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        openAuthModal('CULTURAL_CREATOR');
                        setActiveDropdown(null);
                      }}
                      className="w-full text-center px-2 py-1 text-[11px] text-orange-700 hover:underline font-semibold cursor-pointer"
                    >
                      Sign in as Cultural Contributor
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-800 hover:text-stone-950 focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED DRAWER - Focused USP Layout */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-stone-200 px-4 py-4 space-y-3.5 animate-fade-in">
          {/* Mobile Auth Banner */}
          {user?.isGuest ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900">
                  Guest Explorer Mode
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 font-bold">
                  Free Access
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                Sign in with Gmail to save your heritage trail, collect rubber stamps, or submit folklore as a Contributor.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    openAuthModal('TRAVELER');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <GoogleIcon className="w-3.5 h-3.5" />
                  <span>As Traveler</span>
                </button>
                <button
                  onClick={() => {
                    openAuthModal('CULTURAL_CREATOR');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-200" />
                  <span>As Contributor</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center border border-amber-300">
                    {user?.avatar || user?.photoURL ? (
                      <img
                        src={user.avatar || user.photoURL}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      user?.name?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                      <span>{user?.name}</span>
                      <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded-full font-bold">
                        G-Verified
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono truncate max-w-[180px]">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>

              {/* Role Switcher in Mobile Drawer */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={() => {
                    switchRole('TRAVELER');
                    onTabChange('explore');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                    user?.role === 'TRAVELER'
                      ? 'bg-amber-900 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600'
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  <span>Traveler Track</span>
                </button>
                <button
                  onClick={() => {
                    switchRole('CULTURAL_CREATOR');
                    onTabChange('creator');
                    setMobileMenuOpen(false);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                    user?.role === 'CULTURAL_CREATOR'
                      ? 'bg-orange-700 text-white shadow-xs'
                      : 'bg-white border border-stone-200 text-stone-600'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Contributor Track</span>
                </button>
              </div>
            </div>
          )}

          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500 px-1">
            Primary Navigation
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {user?.role === 'CULTURAL_CREATOR' && (
              <button
                onClick={() => {
                  onTabChange('creator');
                  setMobileMenuOpen(false);
                }}
                className="col-span-2 p-2.5 rounded-xl bg-orange-700 text-white text-left font-bold flex items-center gap-2 shadow-xs"
              >
                <span>🎨</span>
                <span>Contributor Studio (My Lore & Crafts)</span>
              </button>
            )}
            <button
              onClick={() => {
                onTabChange('explore');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-stone-100 text-left font-semibold text-stone-900"
            >
              {getTranslation('explore', langCode) || 'Explore'}
            </button>
            <button
              onClick={() => {
                onTabChange('heritage');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-stone-100 text-left font-semibold text-stone-900"
            >
              Heritage Sites
            </button>
            <button
              onClick={() => {
                onTabChange('evisit');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-stone-100 text-left font-semibold text-stone-900"
            >
              🪔 E-Visit 3D
            </button>
            <button
              onClick={() => {
                onTabChange('passport');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-amber-100/80 text-amber-950 border border-amber-300 text-left font-semibold flex items-center gap-1.5"
            >
              <span>🛂</span>
              <span>Digital Passport</span>
            </button>
            <button
              onClick={() => {
                onTabChange('games-canvas');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-stone-100 text-left font-semibold text-stone-900 flex items-center gap-1.5"
            >
              <span>🎲</span>
              <span>Games & Canvas</span>
            </button>
            <button
              onClick={() => {
                onTabChange('living-heritage');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-stone-100 text-left font-semibold text-stone-900"
            >
              🏺 Living Crafts
            </button>
            <button
              onClick={() => {
                onTabChange('community');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-stone-100 text-left font-semibold text-stone-900"
            >
              👥 Community
            </button>
            <button
              onClick={() => {
                onTabChange('certificate');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-stone-100 text-left font-semibold text-stone-900 flex items-center gap-1.5"
            >
              <Award className="w-4 h-4 text-amber-700" />
              <span>Certificate</span>
            </button>
            <button
              onClick={() => {
                onTabChange('plan-trip');
                setMobileMenuOpen(false);
              }}
              className="col-span-2 p-2.5 rounded-xl bg-stone-900 text-white text-center font-semibold flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Plan Trip</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
