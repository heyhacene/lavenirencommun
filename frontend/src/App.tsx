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
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h1 className="text-xl font-bold tracking-tight">L'Avenir en commun</h1>
        <p className="text-xs text-purple-300 mt-1">Chargement du programme officiel 2027...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-900 flex items-center justify-center text-white font-black text-base shadow-sm">
            Φ
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 leading-none">
              L'Avenir en commun
            </h1>
            <span className="text-[11px] font-medium text-purple-700">
              Programme 2027 &bull; {data.sections.length} Fiches
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Search button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-2.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
            title="Rechercher"
          >
            <IconSearch className="w-5 h-5" />
          </button>

          {/* Alert button */}
          <button
            onClick={() => setAlertSettingsOpen(true)}
            className="relative p-2.5 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
            title="Programmer les alertes"
          >
            <IconBell className="w-5 h-5" />
            {alertConfig.enabled && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-24">
        {/* TAB 1: Fiches thématiques condensées */}
        {activeTab === 'fiches' && (
          <div className="space-y-4">
            {/* Citizen profile chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
              {data.profiles.map(p => {
                const active = selectedProfile === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProfile(p.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
                      active
                        ? 'bg-purple-900 text-white shadow-sm'
                        : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-100'
                    }`}
                  >
                    {renderProfileIcon(p.icon, `w-3.5 h-3.5 ${active ? 'text-purple-200' : 'text-purple-700'}`)}
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Filter info banner */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
              <span>
                <strong>{filteredSections.length}</strong> fiche{filteredSections.length > 1 ? 's' : ''} affichée{filteredSections.length > 1 ? 's' : ''}
              </span>
              <span className="text-[11px] text-slate-400">
                Cliquez sur une fiche pour voir l'intégralité
              </span>
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

        {/* TAB 2: Budget */}
        {activeTab === 'budget' && (
          <BudgetView budget={data.budget} />
        )}

        {/* TAB 3: Plans d'urgence */}
        {activeTab === 'plans' && (
          <PlansView plans={data.plans} />
        )}

        {/* TAB 4: Lecteur intégral */}
        {activeTab === 'lecteur' && (
          <ReaderView
            data={data}
            onOpenSectionModal={s => setSelectedSectionForModal(s)}
          />
        )}
      </main>

      {/* In-App Toast Alert */}
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

      {/* Search Modal */}
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

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('fiches')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'fiches' ? 'text-purple-800 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <IconCards className="w-5 h-5" />
          <span className="text-[10px]">Fiches</span>
        </button>

        <button
          onClick={() => setSearchModalOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 text-slate-400 hover:text-slate-600 rounded-xl transition-all"
        >
          <IconSearch className="w-5 h-5" />
          <span className="text-[10px]">Recherche</span>
        </button>

        <button
          onClick={() => setActiveTab('budget')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'budget' ? 'text-purple-800 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <IconBudget className="w-5 h-5" />
          <span className="text-[10px]">Budget</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'plans' ? 'text-purple-800 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <IconPlans className="w-5 h-5" />
          <span className="text-[10px]">5 Plans</span>
        </button>

        <button
          onClick={() => setActiveTab('lecteur')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'lecteur' ? 'text-purple-800 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <IconBookOpen className="w-5 h-5" />
          <span className="text-[10px]">Livre</span>
        </button>
      </nav>
    </div>
  );
}
