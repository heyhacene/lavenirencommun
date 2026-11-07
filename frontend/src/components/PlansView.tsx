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
      <div className="stitch-hero">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 bg-purple-950/80 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-300 mb-2">
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
              className={`stitch-chip ${active ? 'stitch-chip-active' : 'stitch-chip-inactive'}`}
            >
              {shortLabel}
            </button>
          );
        })}
      </div>

      {/* Current Plan Detail */}
      {currentPlan && (
        <div className="space-y-4">
          <div className="stitch-card">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mb-1">
              Plan Sectoriel Prioritaire
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mb-2">
              {currentPlan.title}
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
              {currentPlan.intro}
            </p>
          </div>

          {/* Sections of the plan */}
          <div className="space-y-3">
            {currentPlan.sections.map((sec, idx) => {
              const isExpanded = expandedSection === idx;
              return (
                <div
                  key={idx}
                  className="stitch-card overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left transition-colors"
                  >
                    <span className="font-extrabold text-sm sm:text-base text-white pr-4">
                      {sec.subtitle}
                    </span>
                    <IconChevronDown
                      size={16}
                      className={`text-purple-400 transition-transform ${isExpanded ? 'rotate-180 text-amber-300' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-purple-900/50 bg-[#120324]/80">
                      <ul className="space-y-2 mt-2">
                        {sec.points.map((pt, pIdx) => (
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
          </div>
        </div>
      )}
    </div>
  );
};
