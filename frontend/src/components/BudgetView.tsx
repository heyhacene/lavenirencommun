import { useState } from 'react';
import type { Budget } from '../types/programme';
import { IconChevronDown } from './Icons';

interface BudgetViewProps {
  budget: Budget;
}

export const BudgetView = ({ budget }: BudgetViewProps) => {
  const [activeTab, setActiveTab] = useState<'depenses' | 'recettes' | 'investissement'>('depenses');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto pb-24 space-y-6 text-white">
      {/* Hero Header */}
      <div className="stitch-hero">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-purple-950/80 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-300 mb-2">
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
            <div className="stitch-stat-box text-center">
              <span className="text-[11px] text-rose-300 block font-bold uppercase tracking-wider">Dépenses</span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">
                {budget.balanceTotal.depensesAnnuelles}
              </span>
            </div>

            <div className="stitch-stat-box text-center">
              <span className="text-[11px] text-emerald-300 block font-bold uppercase tracking-wider">Recettes</span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">
                {budget.balanceTotal.recettesAnnuelles}
              </span>
            </div>

            <div className="stitch-stat-box text-center">
              <span className="text-[11px] text-amber-300 block font-bold uppercase tracking-wider">Allègements</span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">
                {budget.balanceTotal.baissesImpotsEtCouts}
              </span>
            </div>

            <div className="stitch-stat-box text-center">
              <span className="text-[11px] text-cyan-300 block font-bold uppercase tracking-wider">Pôle Invest.</span>
              <span className="text-lg sm:text-xl font-black text-white mt-0.5 block">
                {budget.balanceTotal.polePublicInvestissement}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#120324] p-1.5 rounded-2xl border border-purple-900/60 text-xs font-bold">
        <button
          onClick={() => setActiveTab('depenses')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all ${
            activeTab === 'depenses'
              ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Dépenses ({budget.depensesCategories.length})
        </button>
        <button
          onClick={() => setActiveTab('recettes')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all ${
            activeTab === 'recettes'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Recettes ({budget.recettesCategories.length})
        </button>
        <button
          onClick={() => setActiveTab('investissement')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all ${
            activeTab === 'investissement'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Investissement
        </button>
      </div>

      {/* Tab 1: Dépenses */}
      {activeTab === 'depenses' && (
        <div className="space-y-3">
          <div className="text-xs text-purple-300 font-semibold px-2">
            Répartition des investissements prioritaires par poste
          </div>
          {budget.depensesCategories.map((cat, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="stitch-card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm sm:text-base text-white">{cat.category}</span>
                      <span className="text-xs sm:text-sm font-black text-rose-300 bg-rose-950/70 border border-rose-500/40 px-2.5 py-0.5 rounded-full ml-2">
                        {cat.amount}
                      </span>
                    </div>
                  </div>
                  <IconChevronDown
                    size={16}
                    className={`text-purple-400 transition-transform ${isExpanded ? 'rotate-180 text-amber-300' : ''}`}
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
              className="stitch-card p-5"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <h3 className="font-bold text-sm sm:text-base text-white">{rec.source}</h3>
                <span className="text-xs sm:text-sm font-black text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-3 py-1 rounded-full whitespace-nowrap">
                  {rec.amount}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {rec.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Pôle Public d'Investissement */}
      {activeTab === 'investissement' && (
        <div className="space-y-4">
          <div className="stitch-card p-6">
            <span className="text-xs font-black uppercase tracking-widest text-cyan-300 block mb-1">
              Grand Emprunt &amp; Pôle Public Bancaire
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
              Plan d'investissement d'urgence de 100 milliards d'euros
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4">
              Financé hors budget de fonctionnement annuel via un pôle public bancaire, la création monétaire écologique et la mobilisation de l'épargne citoyenne populaire.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="stitch-stat-box">
                <span className="text-xs font-bold text-cyan-300 block mb-1">50 Md€ • Transition Écologique</span>
                <span className="text-xs text-slate-300 leading-relaxed">
                  Rénovation thermique globale de 700 000 logements/an, fret ferroviaire, conversion agricole biologique, énergies renouvelables citoyennes.
                </span>
              </div>
              <div className="stitch-stat-box">
                <span className="text-xs font-bold text-purple-300 block mb-1">50 Md€ • Services Publics &amp; Humain</span>
                <span className="text-xs text-slate-300 leading-relaxed">
                  Plan d'urgence pour l'hôpital public, création de 500 000 places en crèche, réhabilitation des écoles et universités, réseau de transports publics.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
