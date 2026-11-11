import { useState } from 'react';
import type { Budget } from '../types/programme';
import { IconChevronDown, IconCalculator } from './Icons';
import { BudgetDetailModal, ALLEGEMENTS_DATA, type BudgetFicheKey } from './BudgetDetailModal';

export interface BudgetViewProps {
  budget: Budget;
  onOpenSimulator?: () => void;
  activeFicheModal?: BudgetFicheKey | null;
  onOpenFicheModal?: (key: BudgetFicheKey | null) => void;
}

export const BudgetView = ({
  budget,
  onOpenSimulator,
  activeFicheModal,
  onOpenFicheModal
}: BudgetViewProps) => {
  const [activeTab, setActiveTab] = useState<BudgetFicheKey>('depenses');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [internalFicheModal, setInternalFicheModal] = useState<BudgetFicheKey | null>(null);

  const currentFicheModal = onOpenFicheModal !== undefined ? activeFicheModal : internalFicheModal;

  const handleOpenFiche = (key: BudgetFicheKey) => {
    setActiveTab(key);
    if (onOpenFicheModal) {
      onOpenFicheModal(key);
    } else {
      setInternalFicheModal(key);
    }
  };

  const handleCloseFiche = () => {
    if (onOpenFicheModal) {
      onOpenFicheModal(null);
    } else {
      setInternalFicheModal(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 space-y-6 text-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2b0854] via-[#1d0638] to-[#120025] rounded-3xl p-6 sm:p-8 border border-purple-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-900/80 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-300 mb-2">
            <span>Chiffrage Officiel • Élection 2027</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
            {budget.title}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-xl">
            {budget.subtitle}
          </p>

          {/* 4 Interactive Summary Stats Cards -> Ouvre la Fiche Détaillée */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
            {/* Pavé 1: Dépenses */}
            <button
              type="button"
              onClick={() => handleOpenFiche('depenses')}
              className="budget-stat-pave budget-stat-pave-depenses group active:scale-95"
              style={{ touchAction: 'manipulation' }}
              title="Consulter la fiche détaillée des dépenses (+106,4 Md€)"
            >
              <span className="text-[11px] text-rose-300 font-bold uppercase tracking-wider block">
                Dépenses
              </span>
              <span className="text-lg sm:text-xl font-black text-white mt-1 block tracking-tight">
                {budget.balanceTotal.depensesAnnuelles}
              </span>
              <span className="text-[10px] text-rose-300/80 font-semibold mt-1 inline-flex items-center gap-1 group-hover:text-rose-200">
                <span>Fiche détaillée</span>
                <span className="text-[9px] group-hover:translate-x-0.5 transition-transform">➔</span>
              </span>
            </button>

            {/* Pavé 2: Recettes */}
            <button
              type="button"
              onClick={() => handleOpenFiche('recettes')}
              className="budget-stat-pave budget-stat-pave-recettes group active:scale-95"
              style={{ touchAction: 'manipulation' }}
              title="Consulter la fiche détaillée des recettes (+81,7 Md€)"
            >
              <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">
                Recettes
              </span>
              <span className="text-lg sm:text-xl font-black text-white mt-1 block tracking-tight">
                {budget.balanceTotal.recettesAnnuelles}
              </span>
              <span className="text-[10px] text-emerald-300/80 font-semibold mt-1 inline-flex items-center gap-1 group-hover:text-emerald-200">
                <span>Fiche détaillée</span>
                <span className="text-[9px] group-hover:translate-x-0.5 transition-transform">➔</span>
              </span>
            </button>

            {/* Pavé 3: Allègements */}
            <button
              type="button"
              onClick={() => handleOpenFiche('allegements')}
              className="budget-stat-pave budget-stat-pave-allegements group active:scale-95"
              style={{ touchAction: 'manipulation' }}
              title="Consulter la fiche détaillée des allègements et baisses d'impôts (-24,7 Md€)"
            >
              <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider block">
                Allègements
              </span>
              <span className="text-lg sm:text-xl font-black text-white mt-1 block tracking-tight">
                {budget.balanceTotal.baissesImpotsEtCouts}
              </span>
              <span className="text-[10px] text-amber-300/80 font-semibold mt-1 inline-flex items-center gap-1 group-hover:text-amber-200">
                <span>Fiche détaillée</span>
                <span className="text-[9px] group-hover:translate-x-0.5 transition-transform">➔</span>
              </span>
            </button>

            {/* Pavé 4: Pôle Investissement */}
            <button
              type="button"
              onClick={() => handleOpenFiche('investissement')}
              className="budget-stat-pave budget-stat-pave-investissement group active:scale-95"
              style={{ touchAction: 'manipulation' }}
              title="Consulter la fiche détaillée du Grand Pôle Public d'Investissement (100 Md€)"
            >
              <span className="text-[11px] text-cyan-300 font-bold uppercase tracking-wider block">
                Pôle Invest.
              </span>
              <span className="text-lg sm:text-xl font-black text-white mt-1 block tracking-tight">
                {budget.balanceTotal.polePublicInvestissement}
              </span>
              <span className="text-[10px] text-cyan-300/80 font-semibold mt-1 inline-flex items-center gap-1 group-hover:text-cyan-200">
                <span>Fiche détaillée</span>
                <span className="text-[9px] group-hover:translate-x-0.5 transition-transform">➔</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bannière d'accès direct au Simulateur d'impôts & succession */}
      {onOpenSimulator && (
        <div
          onClick={onOpenSimulator}
          className="group cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-purple-950/70 to-indigo-950/70 border border-emerald-500/40 hover:border-emerald-400/80 transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center justify-between gap-4"
          style={{ touchAction: 'manipulation' }}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform">
              💼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-300">Simulateur officiel LFI</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-bold">14 tranches</span>
              </div>
              <p className="text-sm font-bold text-white mt-0.5 group-hover:text-emerald-200 transition-colors">
                Calculez précisément votre impôt et vos droits de succession
              </p>
              <p className="text-xs text-purple-200/70">
                90% des Français paieront moins ou pas plus d'impôts avec notre barème progressif.
              </p>
            </div>
          </div>
          <span className="text-emerald-400 group-hover:translate-x-1 transition-transform text-lg flex-shrink-0 font-bold">
            Accéder ➜
          </span>
        </div>
      )}

      {/* 4 Tabs Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#16062b] p-1.5 rounded-2xl border border-purple-500/20 gap-1">
        <button
          type="button"
          onClick={() => setActiveTab('depenses')}
          className={`py-2.5 px-2 rounded-xl font-black text-xs transition-all text-center ${
            activeTab === 'depenses'
              ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
              : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          Dépenses (+106,4 Md€)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('recettes')}
          className={`py-2.5 px-2 rounded-xl font-black text-xs transition-all text-center ${
            activeTab === 'recettes'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          Recettes (+81,7 Md€)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('allegements')}
          className={`py-2.5 px-2 rounded-xl font-black text-xs transition-all text-center ${
            activeTab === 'allegements'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
              : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          Allègements (-24,7 Md€)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('investissement')}
          className={`py-2.5 px-2 rounded-xl font-black text-xs transition-all text-center ${
            activeTab === 'investissement'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          Pôle Invest. (100 Md€)
        </button>
      </div>

      {/* Tab 1: Dépenses */}
      {activeTab === 'depenses' && (
        <div className="space-y-3">
          <div className="text-xs text-purple-300 font-semibold px-2">
            5 pôles de dépenses prioritaires pour la bifurcation écologique et la justice sociale :
          </div>
          {budget.depensesCategories.map((cat, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-purple-500/20 overflow-hidden shadow-lg transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4.5 flex items-center justify-between text-left hover:bg-purple-900/30 transition-colors"
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 shadow-sm" />
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-white">{cat.category}</h3>
                      <span className="text-xs font-black text-amber-300">{cat.amount}</span>
                    </div>
                  </div>
                  <IconChevronDown
                    className={`w-4 h-4 text-purple-400 transition-transform ${isExpanded ? 'rotate-180 text-amber-300' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-purple-900/50 bg-[#120324]/80">
                    <ul className="space-y-2.5 mt-2">
                      {cat.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                          <span className="text-amber-400 font-black mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Recettes */}
      {activeTab === 'recettes' && (
        <div className="space-y-3">
          <div className="text-xs text-purple-300 font-semibold px-2">
            Justice fiscale : faire contribuer les multinationales, les superprofits et les ultra-riches
          </div>
          {budget.recettesCategories.map((rec, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl p-5 border border-purple-500/20 shadow-lg"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="font-bold text-sm sm:text-base text-white">{rec.source}</h3>
                <span className="text-xs sm:text-sm font-black text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-3 py-1 rounded-full whitespace-nowrap">
                  {rec.amount}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {rec.details}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Allègements */}
      {activeTab === 'allegements' && (
        <div className="space-y-3">
          <div className="text-xs text-purple-300 font-semibold px-2">
            Redonner du pouvoir d’achat : baisses de TVA, barème fiscal à 14 tranches et soutien TPE/PME
          </div>
          {ALLEGEMENTS_DATA.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="glass-panel rounded-2xl border border-amber-500/20 overflow-hidden shadow-lg transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4.5 flex items-center justify-between text-left hover:bg-purple-900/30 transition-colors"
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 shadow-sm" />
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-white">{item.title}</h3>
                      <span className="text-xs font-black text-amber-300">{item.amount}</span>
                    </div>
                  </div>
                  <IconChevronDown
                    className={`w-4 h-4 text-purple-400 transition-transform ${isExpanded ? 'rotate-180 text-amber-300' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-purple-900/50 bg-[#120324]/80 space-y-2">
                    <p className="text-xs text-purple-200/90 font-medium">
                      {item.description}
                    </p>
                    <ul className="space-y-2 mt-2">
                      {item.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200 leading-relaxed">
                          <span className="text-amber-400 font-black mt-0.5">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}

          {onOpenSimulator && (
            <button
              type="button"
              onClick={onOpenSimulator}
              className="w-full mt-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              style={{ touchAction: 'manipulation' }}
            >
              <IconCalculator size={18} />
              <span>Calculer vos économies d’impôts sur le simulateur LFI ➔</span>
            </button>
          )}
        </div>
      )}

      {/* Tab 4: Pôle d'investissement */}
      {activeTab === 'investissement' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-2xl space-y-5">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-tr from-cyan-600 to-purple-600 rounded-2xl shadow-xl">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {budget.poleInvestissement.total}
              </span>
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-white">
                Grand Pôle Public d'Investissement
              </h3>
              <p className="text-xs text-purple-300">
                Financement écologique d'avenir (infrastructures, mer, rail, énergie)
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#120324] p-4.5 rounded-2xl border border-purple-800/40">
            {budget.poleInvestissement.description}
          </p>

          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-purple-300">
              Chantiers prioritaires financés :
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-200">
              <div className="p-3.5 bg-purple-950/40 rounded-xl border border-purple-800/40">
                🚆 <strong>Réseau ferroviaire &amp; Fret</strong> : réouverture des lignes de desserte fine et trains de nuit.
              </div>
              <div className="p-3.5 bg-purple-950/40 rounded-xl border border-purple-800/40">
                💧 <strong>Réseaux d'eau potable</strong> : fin des fuites (1 litre sur 5 perdu) et gestion publique.
              </div>
              <div className="p-3.5 bg-purple-950/40 rounded-xl border border-purple-800/40">
                ⚡ <strong>Énergies renouvelables</strong> : parc éolien citoyen en mer, géothermie, solaire sur toits.
              </div>
              <div className="p-3.5 bg-purple-950/40 rounded-xl border border-purple-800/40">
                🏭 <strong>Relocalisations industrielles</strong> : souveraineté sur les médicaments et composants clés.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fiche Détaillée Pop-up Modal */}
      <BudgetDetailModal
        ficheKey={currentFicheModal || null}
        onClose={handleCloseFiche}
        budget={budget}
        onOpenSimulator={onOpenSimulator}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (onOpenFicheModal) {
            onOpenFicheModal(tab);
          } else {
            setInternalFicheModal(tab);
          }
        }}
      />
    </div>
  );
};
