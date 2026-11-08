import { useState } from 'react';
import type { Budget } from '../types/programme';
import { IconChevronDown } from './Icons';

interface BudgetViewProps {
  budget: Budget;
  onOpenSimulator?: () => void;
}

export const BudgetView = ({ budget, onOpenSimulator }: BudgetViewProps) => {
  const [activeTab, setActiveTab] = useState<'depenses' | 'recettes' | 'investissement'>('depenses');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

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

          {/* 4 Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
            <div className="bg-[#18082f]/80 backdrop-blur-md rounded-2xl p-3.5 border border-rose-500/30 text-center shadow-lg">
              <span className="text-[11px] text-rose-300 block font-bold uppercase tracking-wider">Dépenses</span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">
                {budget.balanceTotal.depensesAnnuelles}
              </span>
            </div>

            <div className="bg-[#18082f]/80 backdrop-blur-md rounded-2xl p-3.5 border border-emerald-500/30 text-center shadow-lg">
              <span className="text-[11px] text-emerald-300 block font-bold uppercase tracking-wider">Recettes</span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">
                {budget.balanceTotal.recettesAnnuelles}
              </span>
            </div>

            <div className="bg-[#18082f]/80 backdrop-blur-md rounded-2xl p-3.5 border border-amber-500/30 text-center shadow-lg">
              <span className="text-[11px] text-amber-300 block font-bold uppercase tracking-wider">Allègements</span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">
                {budget.balanceTotal.baissesImpotsEtCouts}
              </span>
            </div>

            <div className="bg-[#18082f]/80 backdrop-blur-md rounded-2xl p-3.5 border border-cyan-500/30 text-center shadow-lg">
              <span className="text-[11px] text-cyan-300 block font-bold uppercase tracking-wider">Pôle Invest.</span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">
                {budget.balanceTotal.polePublicInvestissement}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bannière d'accès direct au Simulateur d'impôts & succession */}
      {onOpenSimulator && (
        <div
          onClick={onOpenSimulator}
          className="group cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-purple-950/70 to-indigo-950/70 border border-emerald-500/40 hover:border-emerald-400/80 transition-all shadow-lg hover:shadow-emerald-900/30 flex items-center justify-between gap-4"
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

      {/* Tabs */}
      <div className="flex bg-[#16062b] p-1.5 rounded-2xl border border-purple-500/20">
        <button
          onClick={() => setActiveTab('depenses')}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
            activeTab === 'depenses'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          Où va l'argent ? (Dépenses)
        </button>
        <button
          onClick={() => setActiveTab('recettes')}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
            activeTab === 'recettes'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          D'où vient l'argent ? (Recettes)
        </button>
        <button
          onClick={() => setActiveTab('investissement')}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
            activeTab === 'investissement'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-purple-300 hover:text-white'
          }`}
        >
          Pôle Investissement
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
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4.5 flex items-center justify-between text-left hover:bg-purple-900/30 transition-colors"
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

      {/* Tab 3: Pôle d'investissement */}
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
    </div>
  );
};
