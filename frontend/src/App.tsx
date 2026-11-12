import { useState, useEffect, useMemo, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import type { ProgrammeData, Section, MultiAlertConfig } from './types/programme';
import {
  loadMultiAlertConfig,
  scheduleAllAlerts,
  registerNotificationTargetListener,
  extractNotificationTarget,
  ensureNotificationChannel,
  requestNotificationPermission,
  dispatchNotificationTarget,
  getPendingNotificationTarget,
  clearPendingNotificationTarget
} from './services/notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { CardFiche } from './components/CardFiche';
import { ModalFicheIntegrale } from './components/ModalFicheIntegrale';
import { SearchModal } from './components/SearchModal';
import { AlertsManagerModal } from './components/AlertsManagerModal';
import { SettingsModal } from './components/SettingsModal';
import { UpdateModal } from './components/UpdateModal';
import { ShareModal } from './components/ShareModal';
import { SocialNetworksModal } from './components/SocialNetworksModal';
import { IosInstallModal } from './components/IosInstallModal';
import { IosInstallBanner } from './components/IosInstallBanner';
import { InAppAlertToast } from './components/InAppAlertToast';
import { ReaderView } from './components/ReaderView';
import { BudgetView } from './components/BudgetView';
import { type BudgetFicheKey } from './components/BudgetDetailModal';
import { PlansView } from './components/PlansView';
import { TaxSimulatorView } from './components/TaxSimulatorView';
import { PartiesModal } from './components/PartiesModal';
import { InfoBanner } from './components/InfoBanner';
import { EventsModal } from './components/EventsModal';
import { AdminEventsModal } from './components/AdminEventsModal';
import {
  loadFontSizePreference,
  saveFontSizePreference,
  applyFontSize,
  type FontSizePreference
} from './services/accessibility';
import { loadEventsData } from './services/events';
import type { EventsData } from './types/events';
import {
  IconSearch,
  IconBell,
  IconSettings,
  IconCards,
  IconBudget,
  IconPlans,
  IconBookOpen,
  IconCalculator,
  IconCalendar,
  getProfileColor,
  renderProfileIcon
} from './components/Icons';

const APP_CURRENT_VERSION = 'v1.0.36';

export const PARTY_TITLES: Record<number, string> = {
  1: 'Pour une bifurcation écologique et sociale',
  2: 'Une économie au service des besoins',
  3: 'Mettre en sécurité sociale',
  4: "Le goût du futur : aux nouvelles frontières de l'humanité",
  5: 'Fonder la 6ᵉ République',
  6: 'Un monde ordonné'
};

export default function App() {
  const [data, setData] = useState<ProgrammeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'fiches' | 'plans' | 'simulateur' | 'budget' | 'lecteur'>('fiches');
  const [selectedProfile, setSelectedProfile] = useState<string>('tous');
  const [selectedSectionForModal, setSelectedSectionForModal] = useState<Section | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [alertsManagerOpen, setAlertsManagerOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [iosInstallModalOpen, setIosInstallModalOpen] = useState(false);
  const [partiesModalOpen, setPartiesModalOpen] = useState(false);
  const [budgetFicheModal, setBudgetFicheModal] = useState<BudgetFicheKey | null>(null);
  const [selectedPartie, setSelectedPartie] = useState<number | null>(null);
  const [showRandomTooltip, setShowRandomTooltip] = useState(false);
  const [inAppToastSection, setInAppToastSection] = useState<Section | null>(null);
  const [multiAlertConfig, setMultiAlertConfig] = useState<MultiAlertConfig>(loadMultiAlertConfig());
  const [fontSizePreference, setFontSizePreference] = useState<FontSizePreference>(loadFontSizePreference());
  const [eventsData, setEventsData] = useState<EventsData | null>(null);
  const [eventsModalOpen, setEventsModalOpen] = useState(false);
  const [adminEventsModalOpen, setAdminEventsModalOpen] = useState(false);
  const dataRef = useRef<ProgrammeData | null>(null);

  // Apply font accessibility scale preference immediately
  useEffect(() => {
    applyFontSize(fontSizePreference);
  }, [fontSizePreference]);

  // Load events & broadcast banner data
  useEffect(() => {
    loadEventsData().then(data => {
      setEventsData(data);
    });
  }, []);

  // Check for updates automatically on app launch and show popup if newer release exists
  useEffect(() => {
    const checkUpdateStartup = async () => {
      try {
        const sessionChecked = sessionStorage.getItem('lfi_update_popup_checked');
        if (sessionChecked) return;
        sessionStorage.setItem('lfi_update_popup_checked', 'true');

        const res = await fetch('https://api.github.com/repos/heyhacene/lavenirencommun/releases/latest');
        if (res.ok) {
          const rel = await res.json();
          const lastNotified = localStorage.getItem('lfi_last_notified_release');
          if (rel.tag_name && rel.tag_name !== APP_CURRENT_VERSION && rel.tag_name !== lastNotified) {
            localStorage.setItem('lfi_last_notified_release', rel.tag_name);
            setUpdateModalOpen(true);
          }
        }
      } catch (e) {
        // Mode hors-ligne ou erreur réseau silencieuse
      }
    };
    checkUpdateStartup();
  }, []);

  // Helper to open a section by ID, globalIndex or title
  const openSectionFromTarget = (
    target: { sectionId?: string; globalIndex?: number; title?: string },
    sectionsList: Section[]
  ) => {
    if (!sectionsList || sectionsList.length === 0) return;

    const found = sectionsList.find(s => {
      if (target.sectionId && s.id === target.sectionId) return true;
      if (target.globalIndex && s.globalIndex === target.globalIndex) return true;
      if (target.title) {
        const cleanNotifTitle = target.title.replace(/^L'Avenir en commun •\s*/i, '').trim().toLowerCase();
        const cleanSecTitle = s.title.trim().toLowerCase();
        if (
          cleanNotifTitle === cleanSecTitle ||
          cleanNotifTitle.includes(cleanSecTitle) ||
          cleanSecTitle.includes(cleanNotifTitle)
        ) {
          return true;
        }
      }
      return false;
    });

    if (found) {
      console.log('[AEC] Opening section from notification tap:', found.title);
      setInAppToastSection(null);
      setSettingsOpen(false);
      setAlertsManagerOpen(false);
      setUpdateModalOpen(false);
      setShareModalOpen(false);
      setSocialModalOpen(false);
      setSearchModalOpen(false);
      setActiveTab('fiches');
      setSelectedSectionForModal(found);
    }
  };

  // Open a proposal completely at random
  const handleOpenRandomFiche = () => {
    if (!dataRef.current || !dataRef.current.sections || dataRef.current.sections.length === 0) return;
    const sections = dataRef.current.sections;
    const rand = sections[Math.floor(Math.random() * sections.length)];
    if (rand) {
      setInAppToastSection(null);
      setActiveTab('fiches');
      setSelectedSectionForModal(rand);
    }
  };

  // Launch tooltip for random proposal dice button
  useEffect(() => {
    const showTimer = setTimeout(() => setShowRandomTooltip(true), 800);
    const hideTimer = setTimeout(() => setShowRandomTooltip(false), 7000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Load programme.json on mount & setup notification channel
  useEffect(() => {
    ensureNotificationChannel();
    requestNotificationPermission();

    fetch('./data/programme.json')
      .then(res => res.json())
      .then((progData: ProgrammeData) => {
        // Enrich parties and sections with official titles if empty
        if (progData.parties) {
          progData.parties.forEach(p => {
            if (!p.title && PARTY_TITLES[p.number]) {
              p.title = PARTY_TITLES[p.number];
            }
          });
        }
        if (progData.sections) {
          progData.sections.forEach(s => {
            if (!s.partieTitle && PARTY_TITLES[s.partieNumber]) {
              s.partieTitle = PARTY_TITLES[s.partieNumber];
            }
          });
        }

        setData(progData);
        dataRef.current = progData;
        setLoading(false);

        // Check if there was an early notification target (cold start)
        const pendingTarget = getPendingNotificationTarget();
        if (pendingTarget) {
          clearPendingNotificationTarget();
          setTimeout(() => {
            openSectionFromTarget(pendingTarget, progData.sections);
          }, 150);
        }

        // Setup notification background task
        const cfg = loadMultiAlertConfig();
        scheduleAllAlerts(cfg, progData.sections);

        // Check if an in-app alert should pop on launch
        const lastSeenDate = localStorage.getItem('aec_last_popup_date');
        const todayStr = new Date().toDateString();
        if (cfg.globalEnabled && lastSeenDate !== todayStr && progData.sections.length > 0) {
          const randomSec = progData.sections[Math.floor(Math.random() * progData.sections.length)];
          if (randomSec) {
            setTimeout(() => {
              setInAppToastSection(randomSec);
              localStorage.setItem('aec_last_popup_date', todayStr);
            }, 1200);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load programme data:', err);
        setLoading(false);
      });
  }, []);

  // Listen to notification clicks (both cold start and foreground/background)
  useEffect(() => {
    let directHandle: any;

    const setupListeners = async () => {
      try {
        directHandle = await LocalNotifications.addListener('localNotificationActionPerformed', action => {
          console.log('[AEC] Direct localNotificationActionPerformed received in App:', action);
          const target = extractNotificationTarget(action.notification);
          if (target && dataRef.current) {
            openSectionFromTarget(target, dataRef.current.sections);
          } else if (target) {
            dispatchNotificationTarget(target);
          }
        });
      } catch (e) {
        console.warn('[AEC] Could not attach localNotificationActionPerformed listener:', e);
      }
    };

    setupListeners();

    const unregister = registerNotificationTargetListener(target => {
      console.log('[AEC] Notification target listener triggered:', target);
      if (dataRef.current) {
        openSectionFromTarget(target, dataRef.current.sections);
      }
    });

    return () => {
      unregister();
      if (directHandle && directHandle.remove) {
        directHandle.remove();
      }
    };
  }, []);

  // Back button handling: browser history popstate (PWA / Web only)
  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;

    const isAnyModalOpen = Boolean(
      selectedSectionForModal ||
      searchModalOpen ||
      alertsManagerOpen ||
      settingsOpen ||
      updateModalOpen ||
      shareModalOpen ||
      socialModalOpen ||
      iosInstallModalOpen ||
      partiesModalOpen ||
      budgetFicheModal ||
      eventsModalOpen ||
      adminEventsModalOpen
    );

    if (isAnyModalOpen) {
      window.history.pushState({ modalOpen: true }, '');
    }

    const handlePopState = () => {
      setAdminEventsModalOpen(false);
      setEventsModalOpen(false);
      setSelectedSectionForModal(null);
      setPartiesModalOpen(false);
      setBudgetFicheModal(null);
      setIosInstallModalOpen(false);
      setShareModalOpen(false);
      setSocialModalOpen(false);
      setAlertsManagerOpen(false);
      setUpdateModalOpen(false);
      setSettingsOpen(false);
      setSearchModalOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedSectionForModal, searchModalOpen, alertsManagerOpen, settingsOpen, updateModalOpen, shareModalOpen, socialModalOpen, iosInstallModalOpen, partiesModalOpen, budgetFicheModal, eventsModalOpen, adminEventsModalOpen]);

  // Native Capacitor back button listener
  useEffect(() => {
    let removeListener: (() => void) | undefined;

    const setupCapacitorBack = async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        const handle = await CapApp.addListener('backButton', () => {
          if (adminEventsModalOpen) {
            setAdminEventsModalOpen(false);
          } else if (eventsModalOpen) {
            setEventsModalOpen(false);
          } else if (budgetFicheModal) {
            setBudgetFicheModal(null);
          } else if (selectedSectionForModal) {
            setSelectedSectionForModal(null);
          } else if (partiesModalOpen) {
            setPartiesModalOpen(false);
          } else if (iosInstallModalOpen) {
            setIosInstallModalOpen(false);
          } else if (shareModalOpen) {
            setShareModalOpen(false);
          } else if (socialModalOpen) {
            setSocialModalOpen(false);
          } else if (alertsManagerOpen) {
            setAlertsManagerOpen(false);
          } else if (updateModalOpen) {
            setUpdateModalOpen(false);
          } else if (settingsOpen) {
            setSettingsOpen(false);
          } else if (searchModalOpen) {
            setSearchModalOpen(false);
          } else if (activeTab !== 'fiches') {
            setActiveTab('fiches');
          } else {
            CapApp.exitApp();
          }
        });
        removeListener = () => handle.remove();
      } catch (e) {
        // Native Capacitor App plugin not available in browser
      }
    };

    setupCapacitorBack();

    return () => {
      if (removeListener) removeListener();
    };
  }, [selectedSectionForModal, alertsManagerOpen, updateModalOpen, settingsOpen, searchModalOpen, shareModalOpen, socialModalOpen, iosInstallModalOpen, partiesModalOpen, budgetFicheModal, eventsModalOpen, adminEventsModalOpen, activeTab]);

  // Filtered fiches for the main card list (by profile and/or by party)
  const filteredSections = useMemo(() => {
    if (!data) return [];
    let list = data.sections;
    if (selectedPartie !== null) {
      list = list.filter(s => s.partieNumber === selectedPartie);
    }
    if (selectedProfile !== 'tous') {
      list = list.filter(s => s.profiles && s.profiles.includes(selectedProfile));
    }
    return list;
  }, [data, selectedProfile, selectedPartie]);

  const activeAlertsCount = multiAlertConfig.globalEnabled
    ? multiAlertConfig.schedules.filter(s => s.enabled).length
    : 0;

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#070114] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        {/* Ambient neon orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-red-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 blur-lg opacity-60 animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#240046] via-[#10002b] to-[#3c096c] border border-purple-400/40 flex items-center justify-center shadow-2xl p-3">
              <img src="./logo-fi.png" alt="Phi LFI" className="w-full h-full object-contain drop-shadow" />
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white uppercase">
            L'Avenir en commun
          </h1>
          <p className="text-sm font-semibold text-purple-300 mt-1">
            Le programme de gouvernement • 2027
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs text-purple-300/80 bg-purple-950/60 px-4 py-2 rounded-full border border-purple-500/20">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>Chargement des 1 069 mesures &amp; 111 fiches...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070114] text-slate-100 flex flex-col font-sans relative selection:bg-purple-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-20 w-[450px] h-[450px] bg-fuchsia-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-20 -left-20 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Top Header */}
      <header className="stitch-header flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Left: Enlarged LFI Logo + Interactive Title */}
        <div
          onClick={() => {
            setSelectedPartie(null);
            setSelectedProfile('tous');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 cursor-pointer select-none"
          title="Retour au sommet de la page"
        >
          {/* Enlarged Phi LFI Logo */}
          <div className="relative group flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#3d0075] via-[#1a003f] to-[#5a05b3] border border-purple-400/50 flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.4)] p-1 hover:scale-105 transition-all">
              <img src="./logo-fi.png" alt="Phi LFI" className="w-full h-full object-contain drop-shadow" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-sm font-black tracking-wider text-white uppercase leading-none truncate">
                L'AVENIR EN COMMUN
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-600/40 text-purple-200 border border-purple-400/30 flex-shrink-0">
                2027
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 truncate block mt-0.5">
              Jean-Luc Mélenchon • 111 Fiches
            </span>
          </div>
        </div>

        {/* Right: Action Buttons (Guaranteed visibility with flex-shrink-0) */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
          {/* 1. Proposition au hasard */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => {
                setShowRandomTooltip(false);
                handleOpenRandomFiche();
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-950/60 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-600/30 transition-all flex items-center justify-center active:scale-95 text-sm sm:text-base relative flex-shrink-0"
              title="Une proposition au hasard"
            >
              🎲
            </button>

            {/* Launch Tooltip Bubble */}
            {showRandomTooltip && (
              <div
                onClick={() => {
                  setShowRandomTooltip(false);
                  handleOpenRandomFiche();
                }}
                className="absolute top-full mt-2.5 right-0 z-50 animate-bounce cursor-pointer select-none"
                style={{ animationDuration: '2s' }}
              >
                <div className="absolute -top-1 right-2.5 w-2.5 h-2.5 bg-amber-500 rotate-45 rounded-[2px]" />
                <div className="relative flex items-center gap-1 px-2 py-1 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-slate-950 font-black text-[10px] shadow-[0_6px_20px_rgba(245,158,11,0.5)] border border-amber-200/50 whitespace-nowrap">
                  <span>🎲</span>
                  <span>Au hasard</span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-900/60 transition-all flex items-center justify-center active:scale-95 flex-shrink-0"
            title="Rechercher une mesure"
          >
            <IconSearch size={16} />
          </button>

          {/* 3. Calendar & Events Dedicated Button */}
          <button
            onClick={() => setEventsModalOpen(true)}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-900/60 transition-all flex items-center justify-center active:scale-95 flex-shrink-0"
            title="Agenda des événements & Réunions publiques"
          >
            <IconCalendar size={16} />
            {eventsData?.banner?.enabled && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 ring-1 ring-[#0B0118]" />
              </span>
            )}
          </button>

          {/* 4. Alerts Dedicated Button */}
          <button
            onClick={() => setAlertsManagerOpen(true)}
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-900/60 transition-all flex items-center justify-center active:scale-95 flex-shrink-0"
            title="Gestion des alertes"
          >
            <IconBell size={16} />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-1 ring-[#0B0118]" />
              </span>
            )}
          </button>

          {/* 5. Settings Button (Toujours visible avec badge d'accentuation) */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-purple-800/90 to-indigo-800/90 border border-purple-400/50 text-white hover:border-purple-300 hover:bg-purple-700 shadow-[0_0_10px_rgba(168,85,247,0.35)] transition-all flex items-center justify-center active:scale-95 flex-shrink-0"
            title="Paramètres de l'application"
          >
            <IconSettings size={16} />
          </button>
        </div>
      </header>

      {/* Top Broadcast Information Banner (Public meetings, actions, campaigns) */}
      <InfoBanner
        banner={eventsData?.banner || null}
        onOpenEvents={() => setEventsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-28 relative z-10" style={{ paddingBottom: '96px' }}>
        {/* TAB 1: FICHES THÉMATIQUES */}
        {activeTab === 'fiches' && (
          <div className="space-y-6">
            {/* Militant Stitch Campaign Hero Banner */}
            <div className="stitch-hero">
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/30 text-[11px] font-bold text-purple-200 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Programme officiel de gouvernement • 2027
                </div>

                <div>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase leading-tight">
                    L'Avenir en commun
                  </h2>
                  <p className="text-sm sm:text-base text-purple-200/90 font-medium max-w-2xl mt-1.5 leading-relaxed">
                    Le projet de société porté par <strong className="text-white font-bold">Jean-Luc Mélenchon</strong>. 
                    Une révolution citoyenne pacifique, démocratique, sociale et écologique pour bâtir la 6ᵉ République.
                  </p>
                </div>

                {/* 4 Stitch Campaign Stat Cards (Clickable & Interactive) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  {/* Card 1: 1 069 Mesures concrètes -> Ouvre la recherche */}
                  <button
                    type="button"
                    onClick={() => setSearchModalOpen(true)}
                    className="stitch-stat-box text-left w-full cursor-pointer group hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden"
                    style={{ touchAction: 'manipulation' }}
                    title="Rechercher parmi les 1 069 mesures concrètes"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">
                        1 069
                      </div>
                      <span className="text-[11px] text-purple-400 group-hover:text-white transition-colors">
                        🔍
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mt-0.5">
                      Mesures concrètes
                    </div>
                    <div className="text-[10px] text-purple-400/80 font-semibold mt-1 flex items-center gap-1 group-hover:text-purple-200">
                      <span>Rechercher</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </button>

                  {/* Card 2: 111 Fiches thématiques -> Fait défiler vers les fiches */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPartie(null);
                      setSelectedProfile('tous');
                      const el = document.getElementById('fiches-grid-section');
                      if (el) {
                        try {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } catch (e) {
                          window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
                        }
                      } else {
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }
                    }}
                    className="stitch-stat-box text-left w-full cursor-pointer group hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden"
                    style={{ touchAction: 'manipulation' }}
                    title="Voir les 111 fiches thématiques"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black text-amber-300">
                        111
                      </div>
                      <span className="text-[11px] text-amber-400 group-hover:text-white transition-colors">
                        🗂️
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mt-0.5">
                      Fiches thématiques
                    </div>
                    <div className="text-[10px] text-amber-400/80 font-semibold mt-1 flex items-center gap-1 group-hover:text-amber-200">
                      <span>Voir la liste</span>
                      <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
                    </div>
                  </button>

                  {/* Card 3: 6 Grandes parties -> Ouvre la modale des 6 parties */}
                  <button
                    type="button"
                    onClick={() => setPartiesModalOpen(true)}
                    className="stitch-stat-box text-left w-full cursor-pointer group hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden"
                    style={{ touchAction: 'manipulation' }}
                    title="Choisir et explorer les 6 Grandes Parties du programme"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black text-emerald-300">
                        6
                      </div>
                      <span className="text-[11px] text-emerald-400 group-hover:text-white transition-colors">
                        🏛️
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mt-0.5">
                      Grandes parties
                    </div>
                    <div className="text-[10px] text-emerald-400/80 font-semibold mt-1 flex items-center gap-1 group-hover:text-emerald-200">
                      <span>Choisir une partie</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </button>

                  {/* Card 4: 100 Md€ Investissement d'urgence -> Ouvre l'onglet Budget */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('budget')}
                    className="stitch-stat-box text-left w-full cursor-pointer group hover:scale-[1.02] active:scale-95 transition-all relative overflow-hidden"
                    style={{ touchAction: 'manipulation' }}
                    title="Consulter le chiffrage et l'investissement d'urgence de 100 Md€"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-black text-rose-300">
                        100 Md€
                      </div>
                      <span className="text-[11px] text-rose-400 group-hover:text-white transition-colors">
                        💶
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mt-0.5">
                      Investissement d'urgence
                    </div>
                    <div className="text-[10px] text-rose-400/80 font-semibold mt-1 flex items-center gap-1 group-hover:text-rose-200">
                      <span>Voir le budget</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </button>
                </div>

                {/* Search Bar & Random Proposal Action Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 mt-3">
                  <div
                    onClick={() => setSearchModalOpen(true)}
                    className="stitch-search-pill flex-1 group"
                  >
                    <IconSearch className="text-purple-300 group-hover:text-white transition-colors" size={18} />
                    <span className="text-xs sm:text-sm text-purple-300/90 group-hover:text-purple-100 transition-colors font-medium truncate">
                      Rechercher une mesure (ex: <em className="not-italic text-amber-300 font-semibold">SMIC</em>, <em className="not-italic text-emerald-300 font-semibold">Retraite à 60 ans</em>)...
                    </span>
                    <div className="ml-auto hidden sm:flex items-center gap-1 text-[10px] font-bold bg-purple-900/80 px-2.5 py-1 rounded-lg text-purple-200 border border-purple-400/20">
                      Rechercher
                    </div>
                  </div>

                  {/* Bouton "Une proposition au hasard" */}
                  <button
                    onClick={handleOpenRandomFiche}
                    className="py-3 px-4.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 hover:text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 border border-amber-300/40 select-none cursor-pointer flex-shrink-0"
                    title="Découvrir une proposition au hasard"
                  >
                    <span className="text-base">🎲</span>
                    <span className="tracking-wide uppercase font-black text-[12px]">Une proposition au hasard</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active selected Partie Banner */}
            {selectedPartie !== null && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/90 via-[#27074d] to-indigo-950 border border-purple-400/40 text-xs shadow-lg animate-fadeIn">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-black text-amber-300 uppercase px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-[11px] flex-shrink-0">
                    Partie {selectedPartie}
                  </span>
                  <span className="font-extrabold text-white truncate text-xs sm:text-sm">
                    {data.parties.find(p => p.number === selectedPartie)?.title || ("Partie " + selectedPartie)}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setPartiesModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-purple-800/80 hover:bg-purple-700 text-purple-200 text-[11px] font-bold transition-all active:scale-95"
                  >
                    Changer
                  </button>
                  <button
                    onClick={() => setSelectedPartie(null)}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold transition-all active:scale-95"
                    title="Afficher toutes les parties"
                  >
                    ✕ Tout voir
                  </button>
                </div>
              </div>
            )}

            {/* Citizen Profile Filter Ribbon */}
            <div id="fiches-grid-section" className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Filtrer par centre d'intérêt &amp; profil citoyen
                </span>
                <span className="text-[11px] font-semibold text-purple-400/80">
                  {filteredSections.length} fiche{filteredSections.length > 1 ? 's' : ''} affichée{filteredSections.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {data.profiles.map(p => {
                  const active = selectedProfile === p.id;
                  const col = getProfileColor(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProfile(p.id)}
                      className={`stitch-chip ${active ? 'stitch-chip-active' : 'stitch-chip-inactive'}`}
                    >
                      <span className={active ? 'text-white' : col.text}>
                        {renderProfileIcon(p.icon, 'w-3.5 h-3.5')}
                      </span>
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSections.map(sec => (
                <CardFiche
                  key={sec.id}
                  section={sec}
                  profiles={data.profiles}
                  onOpenModal={s => setSelectedSectionForModal(s)}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: 5 PLANS SECTORIELS */}
        {activeTab === 'plans' && (
          <PlansView plans={data.plans} />
        )}

        {/* TAB 3: SIMULATEUR D'IMPÔTS & SUCCESSION LFI */}
        {activeTab === 'simulateur' && (
          <TaxSimulatorView onOpenShare={() => setShareModalOpen(true)} />
        )}

        {/* TAB 4: BUDGET & CHIFFRAGE */}
        {activeTab === 'budget' && (
          <BudgetView
            budget={data.budget}
            onOpenSimulator={() => setActiveTab('simulateur')}
            activeFicheModal={budgetFicheModal}
            onOpenFicheModal={setBudgetFicheModal}
          />
        )}

        {/* TAB 5: LECTEUR CONTINU DU LIVRE */}
        {activeTab === 'lecteur' && (
          <ReaderView
            data={data}
            onOpenSectionModal={s => setSelectedSectionForModal(s)}
          />
        )}
      </main>

      {/* Floating In-App Toast Alert */}
      <InAppAlertToast
        section={inAppToastSection}
        onOpenFiche={s => {
          setInAppToastSection(null);
          setActiveTab('fiches');
          setSelectedSectionForModal(s);
        }}
        onDismiss={() => setInAppToastSection(null)}
      />

      {/* Modal Fiche Intégrale with clickable category tags & random proposal cycling */}
      <ModalFicheIntegrale
        section={selectedSectionForModal}
        profiles={data.profiles}
        onClose={() => setSelectedSectionForModal(null)}
        onRandomFiche={handleOpenRandomFiche}
        onSelectCategory={profileId => {
          setSelectedSectionForModal(null);
          setActiveTab('fiches');
          setSelectedProfile(profileId);
          window.scrollTo({ top: 320, behavior: 'smooth' });
        }}
        onSetAlertForFiche={s => {
          setInAppToastSection(s);
        }}
      />

      {/* Search Command Palette Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        sections={data.sections}
        profiles={data.profiles}
        onSelectSection={s => setSelectedSectionForModal(s)}
        onOpenSimulator={() => {
          setActiveTab('simulateur');
        }}
      />

      {/* Settings Modal (includes "By HO" signature, Alerts, Share & QR, Social, and Updates) */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        alertConfig={multiAlertConfig}
        onOpenAlerts={() => {
          setSettingsOpen(false);
          setAlertsManagerOpen(true);
        }}
        onOpenUpdates={() => {
          setSettingsOpen(false);
          setUpdateModalOpen(true);
        }}
        onOpenShare={() => {
          setSettingsOpen(false);
          setShareModalOpen(true);
        }}
        onOpenSocial={() => {
          setSettingsOpen(false);
          setSocialModalOpen(true);
        }}
        onOpenIosInstall={() => {
          setSettingsOpen(false);
          setIosInstallModalOpen(true);
        }}
        onOpenSimulator={() => {
          setSettingsOpen(false);
          setActiveTab('simulateur');
        }}
        onOpenEvents={() => {
          setSettingsOpen(false);
          setEventsModalOpen(true);
        }}
        onOpenAdmin={() => {
          setSettingsOpen(false);
          setAdminEventsModalOpen(true);
        }}
        currentVersion={APP_CURRENT_VERSION}
        fontSizePreference={fontSizePreference}
        onFontSizeChange={(pref) => {
          setFontSizePreference(pref);
          saveFontSizePreference(pref);
          applyFontSize(pref);
        }}
      />

      {/* Dedicated 6 Parties Selection Modal */}
      <PartiesModal
        isOpen={partiesModalOpen}
        onClose={() => setPartiesModalOpen(false)}
        parties={data.parties}
        sections={data.sections}
        selectedPartie={selectedPartie}
        onSelectPartie={pNum => {
          setSelectedPartie(pNum);
          setPartiesModalOpen(false);
          setTimeout(() => {
            const el = document.getElementById('fiches-grid-section');
            if (el) {
              try {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } catch (e) {
                window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
              }
            }
          }, 100);
        }}
        onOpenReaderPartie={pNum => {
          setPartiesModalOpen(false);
          setActiveTab('lecteur');
          setTimeout(() => {
            const el = document.getElementById("reader-partie-" + pNum);
            if (el) {
              try {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } catch (e) {
                window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
              }
            }
          }, 150);
        }}
      />

      {/* Dedicated iOS & Web PWA Install Guide Modal */}
      <IosInstallModal
        isOpen={iosInstallModalOpen}
        onClose={() => setIosInstallModalOpen(false)}
      />

      {/* Floating iOS Install Banner (only shown on iOS Safari in browser mode) */}
      <IosInstallBanner
        onOpenGuide={() => setIosInstallModalOpen(true)}
      />

      {/* Dedicated Share & QR Code Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      {/* Dedicated Social Networks & Action Populaire Modal */}
      <SocialNetworksModal
        isOpen={socialModalOpen}
        onClose={() => setSocialModalOpen(false)}
      />

      {/* Dedicated Alerts & Notifications Manager Modal */}
      <AlertsManagerModal
        isOpen={alertsManagerOpen}
        onClose={() => setAlertsManagerOpen(false)}
        config={multiAlertConfig}
        onUpdateConfig={cfg => setMultiAlertConfig(cfg)}
        sections={data.sections}
        profiles={data.profiles}
        onTriggerInAppTest={s => setInAppToastSection(s)}
      />

      {/* Dedicated Updates Modal */}
      <UpdateModal
        isOpen={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        currentVersion={APP_CURRENT_VERSION}
      />

      {/* Dedicated Events & Action Agenda Modal */}
      <EventsModal
        isOpen={eventsModalOpen}
        onClose={() => setEventsModalOpen(false)}
        events={eventsData?.events || []}
        onOpenAdmin={() => {
          setEventsModalOpen(false);
          setAdminEventsModalOpen(true);
        }}
      />

      {/* Dedicated Admin / Organizer Dashboard Modal */}
      <AdminEventsModal
        isOpen={adminEventsModalOpen}
        onClose={() => setAdminEventsModalOpen(false)}
        eventsData={
          eventsData || {
            banner: { enabled: false, type: 'info', message: '' },
            events: []
          }
        }
        onUpdateEventsData={newData => {
          setEventsData(newData);
        }}
      />

      {/* Bottom Frosted Stitch Navigation Bar */}
      <nav className="stitch-bottom-nav">
        {/* Tab 1: Fiches */}
        <button
          onClick={() => setActiveTab('fiches')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'fiches'
              ? 'bg-purple-600/30 text-white font-bold border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'text-purple-300/70 hover:text-white'
          }`}
        >
          <IconCards size={20} className={activeTab === 'fiches' ? 'text-purple-300' : ''} />
          <span className="text-[10px] tracking-wide font-bold">Fiches</span>
        </button>

        {/* Tab 2: 5 Plans */}
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'plans'
              ? 'bg-purple-600/30 text-white font-bold border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'text-purple-300/70 hover:text-white'
          }`}
        >
          <IconPlans size={20} className={activeTab === 'plans' ? 'text-amber-400' : ''} />
          <span className="text-[10px] tracking-wide font-bold">5 Plans</span>
        </button>

        {/* Tab 3: Simulateur Impôts & Héritage */}
        <button
          onClick={() => setActiveTab('simulateur')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'simulateur'
              ? 'bg-emerald-600/30 text-white font-bold border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
              : 'text-purple-300/70 hover:text-white'
          }`}
        >
          <IconCalculator size={20} className={activeTab === 'simulateur' ? 'text-emerald-300' : 'text-emerald-400/80'} />
          <span className="text-[10px] tracking-wide font-bold">Impôts</span>
        </button>

        {/* Tab 4: Chiffrage Budget */}
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'budget'
              ? 'bg-purple-600/30 text-white font-bold border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'text-purple-300/70 hover:text-white'
          }`}
        >
          <IconBudget size={20} className={activeTab === 'budget' ? 'text-rose-400' : ''} />
          <span className="text-[10px] tracking-wide font-bold">Budget</span>
        </button>

        {/* Tab 5: Livre Intégral */}
        <button
          onClick={() => setActiveTab('lecteur')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            activeTab === 'lecteur'
              ? 'bg-purple-600/30 text-white font-bold border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'text-purple-300/70 hover:text-white'
          }`}
        >
          <IconBookOpen size={20} className={activeTab === 'lecteur' ? 'text-cyan-400' : ''} />
          <span className="text-[10px] tracking-wide font-bold">Livre</span>
        </button>
      </nav>
    </div>
  );
}
