import { useState, useEffect, useMemo } from 'react';
import type { ProgrammeData, Section, AlertConfig } from './types/programme';
import { loadAlertConfig, scheduleDailyFicheAlert } from './services/notifications';
import { CardFiche } from './components/CardFiche';
import { ModalFicheIntegrale } from './components/ModalFicheIntegrale';
import { SearchModal } from './components/SearchModal';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { InAppAlertToast } from './components/InAppAlertToast';
import { ReaderView } from './components/ReaderView';
import { BudgetView } from './components/BudgetView';
import { PlansView } from './components/PlansView';
import {
  IconSearch,
  IconBell,
  IconCards,
  IconBudget,
  IconPlans,
  IconBookOpen,
  IconPhi,
  getProfileColor,
  renderProfileIcon
} from './components/Icons';

export default function App() {
  const [data, setData] = useState<ProgrammeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'fiches' | 'budget' | 'plans' | 'lecteur'>('fiches');
  const [selectedProfile, setSelectedProfile] = useState<string>('tous');
  const [selectedSectionForModal, setSelectedSectionForModal] = useState<Section | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [alertSettingsOpen, setAlertSettingsOpen] = useState(false);
  const [inAppToastSection, setInAppToastSection] = useState<Section | null>(null);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>(loadAlertConfig());

  // Load programme.json on mount
  useEffect(() => {
    fetch('/data/programme.json')
      .then(res => res.json())
      .then((progData: ProgrammeData) => {
        setData(progData);
        setLoading(false);

        // Setup notification background task
        const cfg = loadAlertConfig();
        scheduleDailyFicheAlert(cfg, progData.sections);

        // Check if an in-app alert should pop on launch
        const lastSeenDate = localStorage.getItem('aec_last_popup_date');
        const todayStr = new Date().toDateString();
        if (cfg.enabled && lastSeenDate !== todayStr) {
          const candidates = cfg.profile === 'tous'
            ? progData.sections
            : progData.sections.filter(s => s.profiles.includes(cfg.profile));
          const pool = candidates.length > 0 ? candidates : progData.sections;
          const randomSec = pool[Math.floor(Math.random() * pool.length)];
          if (randomSec) {
            setTimeout(() => {
              setInAppToastSection(randomSec);
              localStorage.setItem('aec_last_popup_date', todayStr);
            }, 1500);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load programme data:', err);
        setLoading(false);
      });
  }, []);

  // Filtered fiches for the main card list
  const filteredSections = useMemo(() => {
    if (!data) return [];
    if (selectedProfile === 'tous') return data.sections;
    return data.sections.filter(s => s.profiles.includes(selectedProfile));
  }, [data, selectedProfile]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#070114] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
        {/* Ambient neon orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-red-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 blur-lg opacity-60 animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-900 via-[#1e0741] to-purple-950 border border-purple-400/40 flex items-center justify-center shadow-2xl">
              <IconPhi className="w-12 h-12 text-white animate-pulse" />
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white uppercase">
            L'Avenir en commun
          </h1>
          <p className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 mt-1">
            Le programme de gouvernement • 2027
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs text-purple-300/80 bg-purple-950/60 px-4 py-2 rounded-full border border-purple-500/20">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>Chargement des 1 069 mesures & 111 fiches...</span>
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
      <header className="sticky top-0 z-40 bg-[#0B0118]/85 backdrop-blur-xl border-b border-purple-500/20 px-4 py-3 flex items-center justify-between shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#240046] via-[#10002b] to-[#3c096c] border border-purple-400/40 flex items-center justify-center text-white font-black shadow-md">
              <IconPhi className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black tracking-wider text-white uppercase leading-none flex items-center gap-1.5">
              <span>L'AVENIR EN COMMUN</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30">
                2027
              </span>
            </h1>
            <span className="text-[10px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300">
              Jean-Luc Mélenchon • 111 Fiches
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/20 text-purple-200 hover:text-white hover:bg-purple-900/60 hover:border-purple-400/50 transition-all shadow-sm active:scale-95"
            title="Rechercher une mesure"
          >
            <IconSearch className="w-4 h-4" />
          </button>

          {/* Alert Button */}
          <button
            onClick={() => setAlertSettingsOpen(true)}
            className="relative p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/20 text-purple-200 hover:text-white hover:bg-purple-900/60 hover:border-purple-400/50 transition-all shadow-sm active:scale-95"
            title="Programmer des alertes"
          >
            <IconBell className="w-4 h-4" />
            {alertConfig.enabled && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 ring-2 ring-[#0B0118]" />
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-28 relative z-10">
        {/* TAB 1: FICHES THÉMATIQUES */}
        {activeTab === 'fiches' && (
          <div className="space-y-6">
            {/* Militant Campaign Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1b053a] via-[#100326] to-[#070114] border border-purple-500/30 p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
              {/* Internal decorative radial glow */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-red-600/15 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-400/30 text-[11px] font-bold text-purple-200 uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Programme officiel de gouvernement • 2027
                </div>

                <div>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase leading-tight">
                    L'Avenir en commun
                  </h2>
                  <p className="text-sm sm:text-base text-purple-200/90 font-medium max-w-2xl mt-1">
                    Le projet de société porté par <strong className="text-white font-bold">Jean-Luc Mélenchon</strong>. 
                    Une révolution citoyenne pacifique, démocratique, sociale et écologique pour bâtir la 6ᵉ République.
                  </p>
                </div>

                {/* 4 Campaign KPI Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="bg-purple-950/40 backdrop-blur-md rounded-2xl p-3 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300">
                      1 069
                    </div>
                    <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
                      Mesures concrètes
                    </div>
                  </div>

                  <div className="bg-purple-950/40 backdrop-blur-md rounded-2xl p-3 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <div className="text-2xl font-black text-amber-300">
                      111
                    </div>
                    <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
                      Fiches thématiques
                    </div>
                  </div>

                  <div className="bg-purple-950/40 backdrop-blur-md rounded-2xl p-3 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <div className="text-2xl font-black text-emerald-300">
                      6
                    </div>
                    <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
                      Grandes parties
                    </div>
                  </div>

                  <div className="bg-purple-950/40 backdrop-blur-md rounded-2xl p-3 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                    <div className="text-2xl font-black text-rose-300">
                      100 Md€
                    </div>
                    <div className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider">
                      Investissement d'urgence
                    </div>
                  </div>
                </div>

                {/* Interactive Search Bar in Hero */}
                <div
                  onClick={() => setSearchModalOpen(true)}
                  className="mt-2 flex items-center gap-3 bg-purple-950/70 hover:bg-purple-900/60 border border-purple-400/30 hover:border-purple-400/60 rounded-2xl px-4 py-3 cursor-pointer transition-all shadow-inner group"
                >
                  <IconSearch className="w-5 h-5 text-purple-300 group-hover:text-white transition-colors" />
                  <span className="text-xs sm:text-sm text-purple-300/80 group-hover:text-purple-200 transition-colors font-medium">
                    Rechercher une mesure, un mot-clé (ex: <em className="not-italic text-amber-300 font-semibold">SMIC</em>, <em className="not-italic text-emerald-300 font-semibold">Retraite à 60 ans</em>, <em className="not-italic text-cyan-300 font-semibold">RIC</em>, <em className="not-italic text-fuchsia-300 font-semibold">Énergie</em>)...
                  </span>
                  <div className="ml-auto hidden sm:flex items-center gap-1 text-[10px] font-bold bg-purple-900/80 px-2.5 py-1 rounded-lg text-purple-200 border border-purple-400/20">
                    Ctrl + K
                  </div>
                </div>
              </div>
            </div>

            {/* Citizen Profile Filter Ribbon */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Filtrer par centre d'intérêt & profil citoyen
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
                      className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-white/30 scale-[1.02]'
                          : `bg-[#13042c]/70 hover:bg-[#1c0840] text-purple-200 border ${col.border} hover:border-purple-400/50`
                      }`}
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

        {/* TAB 3: LES 5 PLANS D'URGENCE */}
        {activeTab === 'plans' && (
          <PlansView plans={data.plans} />
        )}

        {/* TAB 4: LECTEUR INTÉGRAL DU LIVRE */}
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
        onOpenFiche={s => setSelectedSectionForModal(s)}
        onDismiss={() => setInAppToastSection(null)}
      />

      {/* Modal Fiche Intégrale */}
      <ModalFicheIntegrale
        section={selectedSectionForModal}
        profiles={data.profiles}
        onClose={() => setSelectedSectionForModal(null)}
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

      {/* Alert Settings Modal */}
      <AlertSettingsModal
        isOpen={alertSettingsOpen}
        onClose={() => setAlertSettingsOpen(false)}
        config={alertConfig}
        onUpdateConfig={cfg => setAlertConfig(cfg)}
        sections={data.sections}
        profiles={data.profiles}
        onTriggerInAppTest={s => setInAppToastSection(s)}
      />

      {/* Bottom Frosted Campaign Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0118]/90 backdrop-blur-2xl border-t border-purple-500/20 px-3 py-2 flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.6)]">
        {/* Tab 1: Fiches */}
        <button
          onClick={() => setActiveTab('fiches')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'fiches'
              ? 'bg-purple-600/20 text-white font-bold border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'text-purple-300/70 hover:text-white hover:bg-purple-950/30'
          }`}
        >
          <IconCards className={`w-5 h-5 ${activeTab === 'fiches' ? 'text-purple-300' : ''}`} />
          <span className="text-[10px] tracking-wide">Fiches</span>
        </button>

        {/* Tab 2: 5 Plans */}
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'plans'
              ? 'bg-purple-600/20 text-white font-bold border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'text-purple-300/70 hover:text-white hover:bg-purple-950/30'
          }`}
        >
          <IconPlans className={`w-5 h-5 ${activeTab === 'plans' ? 'text-amber-400' : ''}`} />
          <span className="text-[10px] tracking-wide">5 Plans</span>
        </button>

        {/* Search quick button in center */}
        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 text-purple-300/70 hover:text-white transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-500/30 group-hover:border-purple-400/60 flex items-center justify-center text-purple-300 group-hover:text-white shadow-sm transition-all group-hover:scale-105">
            <IconSearch className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-wide">Recherche</span>
        </button>

        {/* Tab 3: Chiffrage Budget */}
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'budget'
              ? 'bg-purple-600/20 text-white font-bold border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'text-purple-300/70 hover:text-white hover:bg-purple-950/30'
          }`}
        >
          <IconBudget className={`w-5 h-5 ${activeTab === 'budget' ? 'text-rose-400' : ''}`} />
          <span className="text-[10px] tracking-wide">Budget</span>
        </button>

        {/* Tab 4: Livre Intégral */}
        <button
          onClick={() => setActiveTab('lecteur')}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
            activeTab === 'lecteur'
              ? 'bg-purple-600/20 text-white font-bold border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
              : 'text-purple-300/70 hover:text-white hover:bg-purple-950/30'
          }`}
        >
          <IconBookOpen className={`w-5 h-5 ${activeTab === 'lecteur' ? 'text-cyan-400' : ''}`} />
          <span className="text-[10px] tracking-wide">Livre</span>
        </button>
      </nav>
    </div>
  );
}
