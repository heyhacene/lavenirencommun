import React, { useState } from 'react';
import { Budget } from '../types/programme';
import { IconChevronDown } from './Icons';

interface BudgetViewProps {
  budget: Budget;
}

export const BudgetView: React.FC<BudgetViewProps> = ({ budget }) => {
  const [activeTab, setActiveTab] = useState<'depenses' | 'recettes' | 'investissement'>('depenses');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto pb-24 space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-1">
          Chiffrage Officiel 2027
        </span>
        <h1 className="text-2xl sm:text-3xl font-black mb-2">
          {budget.title}
        </h1>
        <p className="text-xs sm:text-sm text-purple-200 leading-relaxed max-w-xl">
          {budget.subtitle}
        </p>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[11px] text-purple-200 block font-medium">Dépenses</span>
            <span className="text-lg sm:text-xl font-black text-rose-300">
              {budget.balanceTotal.depensesAnnuelles}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[11px] text-purple-200 block font-medium">Recettes</span>
            <span className="text-lg sm:text-xl font-black text-emerald-300">
              {budget.balanceTotal.recettesAnnuelles}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[11px] text-purple-200 block font-medium">Baisses d'impôts</span>
            <span className="text-lg sm:text-xl font-black text-amber-300">
              {budget.balanceTotal.baissesImpotsEtCouts}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-[11px] text-purple-200 block font-medium">Pôle Invest.</span>
            <span className="text-lg sm:text-xl font-black text-cyan-300">
              {budget.balanceTotal.polePublicInvestissement}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('depenses')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'depenses'
              ? 'bg-white text-purple-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Où va l'argent ? (Dépenses)
        </button>
        <button
          onClick={() => setActiveTab('recettes')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'recettes'
              ? 'bg-white text-purple-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          D'où vient l'argent ? (Recettes)
        </button>
        <button
          onClick={() => setActiveTab('investissement')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'investissement'
              ? 'bg-white text-purple-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pôle Investissement
        </button>
      </div>

      {/* Tab 1: Dépenses */}
      {activeTab === 'depenses' && (
        <div className="space-y-3">
          <div className="text-xs text-slate-500 font-medium px-2">
            5 grands pôles de dépenses prioritaires pour réparer le pays :
          </div>
          {budget.depensesCategories.map((cat, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{cat.category}</h3>
                      <span className="text-xs font-semibold text-purple-700">{cat.amount}</span>
                    </div>
                  </div>
                  <IconChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50">
                    <ul className="space-y-2 mt-2">
                      {cat.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                          <span className="text-purple-600 font-bold mt-0.5">•</span>
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
          <div className="text-xs text-slate-500 font-medium px-2">
            La justice fiscale : faire payer ceux qui ont trop pour financer l'essentiel
          </div>
          {budget.recettesCategories.map((rec, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-slate-900">{rec.source}</h3>
                <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {rec.amount}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {rec.details}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Pôle d'investissement */}
      {activeTab === 'investissement' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-2xl">
              <span className="text-2xl font-black text-purple-800">
                {budget.poleInvestissement.total}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Grand Pôle Public d'Investissement
              </h3>
              <p className="text-xs text-slate-500">
                Hors budget de fonctionnement annuel
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {budget.poleInvestissement.description}
          </p>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Projets stratégiques financés :
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                🚆 <strong>Réseau ferroviaire &amp; Fret</strong> : réouverture des petites lignes et trains de nuit.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                💧 <strong>Réseaux d'eau</strong> : réparation des 20% de fuites d'eau potable en France.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                ⚡ <strong>Énergies renouvelables</strong> : parc éolien en mer, solaire public, géothermie.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                🏭 <strong>Relocalisations industrielles</strong> : souveraineté sanitaire et numérique.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
