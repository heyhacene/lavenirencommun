import React, { useState } from 'react';
import { Plan } from '../types/programme';
import { IconChevronDown } from './Icons';

interface PlansViewProps {
  plans: Plan[];
}

export const PlansView: React.FC<PlansViewProps> = ({ plans }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || 'sante');
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  return (
    <div className="max-w-3xl mx-auto pb-24 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block mb-1">
          Feuilles de Route Sectorielles
        </span>
        <h1 className="text-2xl sm:text-3xl font-black mb-2">
          Les 5 Plans d'Urgence et d'Investissement
        </h1>
        <p className="text-xs sm:text-sm text-purple-200 leading-relaxed max-w-xl">
          Des plans d'action immédiats pour débloquer les secteurs critiques dès les premiers mois du mandat.
        </p>
      </div>

      {/* Plan Selector Buttons */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {plans.map(p => {
          const active = p.id === selectedPlanId;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPlanId(p.id);
                setExpandedSection(0);
              }}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                active
                  ? 'bg-purple-800 text-white shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {p.title.split('pour')[1]?.trim() || p.title.split('de')[1]?.trim() || p.title}
            </button>
          );
        })}
      </div>

      {/* Current Plan Detail */}
      {currentPlan && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-2">
              {currentPlan.title}
            </h2>
            <p className="text-xs text-slate-500">
              {currentPlan.subsections.length} axes prioritaires d'intervention
            </p>
          </div>

          <div className="space-y-3">
            {currentPlan.subsections.map((sub, idx) => {
              const isExpanded = expandedSection === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{sub.title}</h3>
                    </div>
                    <IconChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
                      {sub.paragraphs.map((para, pIdx) => (
                        <p key={pIdx} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
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
