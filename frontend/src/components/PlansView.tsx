import { useState } from 'react';
import type { Plan } from '../types/programme';
import { IconChevronDown } from './Icons';

interface PlansViewProps {
  plans: Plan[];
}

export const PlansView = ({ plans }: PlansViewProps) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || 'sante');
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  return (
    <div className="max-w-3xl mx-auto pb-24 space-y-6 text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2b0854] via-[#1d0638] to-[#120025] rounded-3xl p-6 sm:p-8 border border-purple-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-purple-900/80 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-300 mb-2">
            Feuilles de Route Sectorielles
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">
            Les 5 Grands Plans d'Urgence
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-xl">
            Des mesures concrètes et immédiatement applicables dès les premiers mois du mandat pour réparer les secteurs clés.
          </p>
        </div>
      </div>

      {/* Plan Selector Buttons */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {plans.map(p => {
          const active = p.id === selectedPlanId;
          const shortLabel = p.title.split('pour')[1]?.trim() || p.title.split('de')[1]?.trim() || p.title;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPlanId(p.id);
                setExpandedSection(0);
              }}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl font-black text-xs transition-all border ${
                active
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-lg scale-[1.02]'
                  : 'bg-[#18082f] text-slate-300 border-purple-900/50 hover:border-purple-600/60 hover:text-white'
              }`}
            >
              {shortLabel}
            </button>
          );
        })}
      </div>

      {/* Current Plan Detail */}
      {currentPlan && (
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6 border border-purple-500/30 shadow-lg">
            <h2 className="text-lg sm:text-xl font-black text-white mb-1.5 leading-snug">
              {currentPlan.title}
            </h2>
            <p className="text-xs text-purple-300 font-semibold">
              {currentPlan.subsections.length} axes d'intervention prioritaires
            </p>
          </div>

          <div className="space-y-3">
            {currentPlan.subsections.map((sub, idx) => {
              const isExpanded = expandedSection === idx;
              return (
                <div
                  key={idx}
                  className="glass-panel rounded-2xl border border-purple-500/20 overflow-hidden shadow-md"
                >
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : idx)}
                    className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-purple-900/30 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <span className="flex-shrink-0 w-7 h-7 min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] aspect-square rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-black text-xs flex items-center justify-center shadow-md select-none">
                        {idx + 1}
                      </span>
                      <h3 className="font-extrabold text-sm sm:text-base text-white">{sub.title}</h3>
                    </div>
                    <IconChevronDown
                      className={`w-4 h-4 text-purple-400 transition-transform ${isExpanded ? 'rotate-180 text-amber-300' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-purple-900/50 bg-[#120324]/80 space-y-3">
                      {sub.paragraphs.map((para, pIdx) => (
                        <p key={pIdx} className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
