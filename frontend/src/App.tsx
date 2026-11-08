import { useState, useEffect, useMemo, useRef } from 'react';
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
import { InAppAlertToast } from './components/InAppAlertToast';
import { ReaderView } from './components/ReaderView';
import { BudgetView } from './components/BudgetView';
import { PlansView } from './components/PlansView';
import {
  IconSearch,
  IconBell,
  IconSettings,
  IconCards,
  IconBudget,
  IconPlans,
  IconBookOpen,
  getProfileColor,
  renderProfileIcon
} from './components/Icons';

const APP_CURRENT_VERSION = 'v1.0.15';

export default function App() {
  const [data, setData] = useState<ProgrammeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'fiches' | 'budget' | 'plans' | 'lecteur'>('fiches');
  const [selectedProfile, setSelectedProfile] = useState<string>('tous');
  const [selectedSectionForModal, setSelectedSectionForModal] = useState<Section | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [alertsManagerOpen, setAlertsManagerOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [inAppToastSection, setInAppToastSection] = useState<Section | null>(null);
  const [multiAlertConfig, setMultiAlertConfig] = useState<MultiAlertConfig>(loadMultiAlertConfig());
  const dataRef = useRef<ProgrammeData | null>(null);

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
      setSearchModalOpen(false);
      setActiveTab('fiches');
      setSelectedSectionForModal(found);
    }
  };

  // Load programme.json on mount & setup notification channel
  useEffect(() => {
    ensureNotificationChannel();
    requestNotificationPermission();

    fetch('/data/programme.json')
      .then(res => res.json())
      .then((progData: ProgrammeData) => {
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

  // Back button handling: native Android back button + browser history popstate
  useEffect(() => {
    const isAnyModalOpen = Boolean(
      selectedSectionForModal ||
      searchModalOpen ||
      alertsManagerOpen ||
      settingsOpen ||
      updateModalOpen
    );

    if (isAnyModalOpen) {
      window.history.pushState({ modalOpen: true }, '');
    }

    const handlePopState = () => {
      if (selectedSectionForModal) {
        setSelectedSectionForModal(null);
      } else if (alertsManagerOpen) {
        setAlertsManagerOpen(false);
      } else if (updateModalOpen) {
        setUpdateModalOpen(false);
      } else if (settingsOpen) {
        setSettingsOpen(false);
      } else if (searchModalOpen) {
        setSearchModalOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedSectionForModal, searchModalOpen, alertsManagerOpen, settingsOpen, updateModalOpen]);

  // Native Capacitor back button listener
  useEffect(() => {
    let removeListener: (() => void) | undefined;

    const setupCapacitorBack = async () => {
      try {
        const { App: CapApp } = await import('@capacitor/app');
        const handle = await CapApp.addListener('backButton', ({ canGoBack }) => {
          if (selectedSectionForModal) {
            setSelectedSectionForModal(null);
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
          } else if (canGoBack) {
            window.history.back();
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
  }, [selectedSectionForModal, alertsManagerOpen, updateModalOpen, settingsOpen, searchModalOpen, activeTab]);

  // Filtered fiches for the main card list
  const filteredSections = useMemo(() => {
    if (!data) return [];
    if (selectedProfile === 'tous') return data.sections;
    return data.sections.filter(s => s.profiles && s.profiles.includes(selectedProfile));
  }, [data, selectedProfile]);

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
              <img src="/logo-fi.png" alt="Phi LFI" className="w-full h-full object-contain drop-shadow" />
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
      <header className="stitch-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2e0059] via-[#150033] to-[#4c0297] border border-purple-400/40 flex items-center justify-center shadow-md p-1.5">
              <img src="/logo-fi.png" alt="Phi LFI" className="w-full h-full object-contain drop-shadow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wider text-white uppercase leading-none">
                L'AVENIR EN COMMUN
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-600/40 text-purple-200 border border-purple-400/30">
                2027
              </span>
            </div>
            <span className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300">
              Jean-Luc Mélenchon • 111 Fiches officielles
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-900/60 transition-all flex items-center justify-center active:scale-95"
            title="Rechercher une mesure"
          >
            <IconSearch size={18} />
          </button>

          {/* Alerts Dedicated Button */}
          <button
            onClick={() => setAlertsManagerOpen(true)}
            className="relative w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-900/60 transition-all flex items-center justify-center active:scale-95"
            title="Gestion des alertes"
          >
            <IconBell size={18} />
            {activeAlertsCount > 0 && (
              <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-2 ring-[#0B0118]" />
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-200 hover:text-white hover:bg-purple-900/60 transition-all flex items-center justify-center active:scale-95"
            title="Paramètres de l'application"
          >
            <IconSettings size={18} />
          </button>
        </div>
      </header>

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

                {/* 4 Stitch Campaign Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="stitch-stat-box">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">
                      1 069
                    </div>
                    <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mt-0.5">
                      Mesures concrètes
                    </div>
                  </div>

                  <div className="stitch-stat-box">
                    <div className="text-2xl font-black text-amber-300">
                      111
                    </div>
                    <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mt-0.5">
                      Fiches thématiques
                    </div>
                  </div>

                  <div className="stitch-stat-box">
                    <div className="text-2xl font-black text-emerald-300">
                      6
                    </div>
                    <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mt-0.5">
                      Grandes parties
                    </div>
                  </div>

                  <div className="stitch-stat-box">
                    <div className="text-2xl font-black text-rose-300">
                      100 Md€
                    </div>
                    <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mt-0.5">
                      Investissement d'urgence
                    </div>
                  </div>
                </div>

                {/* Interactive Stitch Search Bar Pill */}
                <div
                  onClick={() => setSearchModalOpen(true)}
                  className="stitch-search-pill mt-3 group"
                >
                  <IconSearch className="text-purple-300 group-hover:text-white transition-colors" size={18} />
                  <span className="text-xs sm:text-sm text-purple-300/90 group-hover:text-purple-100 transition-colors font-medium">
                    Rechercher une mesure (ex: <em className="not-italic text-amber-300 font-semibold">SMIC</em>, <em className="not-italic text-emerald-300 font-semibold">Retraite à 60 ans</em>, <em className="not-italic text-cyan-300 font-semibold">RIC</em>)...
                  </span>
                  <div className="ml-auto hidden sm:flex items-center gap-1 text-[10px] font-bold bg-purple-900/80 px-2.5 py-1 rounded-lg text-purple-200 border border-purple-400/20">
                    Rechercher
                  </div>
                </div>
              </div>
            </div>

            {/* Citizen Profile Filter Ribbon */}
            <div className="space-y-2">
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

        {/* TAB 2: BUDGET & CHIFFRAGE */}
        {activeTab === 'budget' && (
          <BudgetView budget={data.budget} />
        )}

        {/* TAB 3: 5 PLANS SECTORIELS */}
        {activeTab === 'plans' && (
          <PlansView plans={data.plans} />
        )}

        {/* TAB 4: LECTEUR CONTINU DU LIVRE */}
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

      {/* Modal Fiche Intégrale with clickable category tags */}
      <ModalFicheIntegrale
        section={selectedSectionForModal}
        profiles={data.profiles}
        onClose={() => setSelectedSectionForModal(null)}
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
      />

      {/* Settings Modal (includes "By HO" signature & links to alerts/updates) */}
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
        currentVersion={APP_CURRENT_VERSION}
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

      {/* Bottom Frosted Stitch Navigation Bar */}
      <nav className="stitch-bottom-nav">
        {/* Tab 1: Fiches */}
        <button
          onClick={() => setActiveTab('fiches')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
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
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'plans'
              ? 'bg-purple-600/30 text-white font-bold border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'text-purple-300/70 hover:text-white'
          }`}
        >
          <IconPlans size={20} className={activeTab === 'plans' ? 'text-amber-400' : ''} />
          <span className="text-[10px] tracking-wide font-bold">5 Plans</span>
        </button>

        {/* Search quick button in center */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex flex-col items-center gap-1 py-0.5 px-3 text-purple-300/70 hover:text-white transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-700 to-indigo-800 border border-purple-400/40 group-hover:border-purple-300 flex items-center justify-center text-white shadow-lg transition-all group-hover:scale-110">
            <IconSearch size={16} />
          </div>
          <span className="text-[10px] tracking-wide font-bold">Recherche</span>
        </button>

        {/* Tab 3: Chiffrage Budget */}
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'budget'
              ? 'bg-purple-600/30 text-white font-bold border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
              : 'text-purple-300/70 hover:text-white'
          }`}
        >
          <IconBudget size={20} className={activeTab === 'budget' ? 'text-rose-400' : ''} />
          <span className="text-[10px] tracking-wide font-bold">Budget</span>
        </button>

        {/* Tab 4: Livre Intégral */}
        <button
          onClick={() => setActiveTab('lecteur')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
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
