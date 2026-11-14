import { useState, useEffect } from 'react';
import type { Plan } from '../types/programme';
import { IconChevronDown, IconVolume, IconStop, IconCopy, IconCheck } from './Icons';
import { tts } from '../services/tts';

interface PlansViewProps {
  plans: Plan[];
}

interface PlanMeta {
  label: string;
  badge: string;
  icon: string;
  type: 'urgence' | 'investissement';
  color: string;
}

const PLAN_META_MAP: Record<string, PlanMeta> = {
  'sante': {
    label: 'Santé & Hôpital',
    badge: 'Plan d’urgence',
    icon: '🏥',
    type: 'urgence',
    color: 'border-rose-500/40 from-rose-500/20'
  },
  'ruralites': {
    label: 'Ruralités & Proximité',
    badge: 'Plan d’urgence',
    icon: '🌾',
    type: 'urgence',
    color: 'border-emerald-500/40 from-emerald-500/20'
  },
  'esr': {
    label: 'Université & Recherche',
    badge: 'Plan d’urgence',
    icon: '🎓',
    type: 'urgence',
    color: 'border-indigo-500/40 from-indigo-500/20'
  },
  'btp-logement': {
    label: 'BTP & Logement (01)',
    badge: 'Investissement 01',
    icon: '🏗️',
    type: 'investissement',
    color: 'border-amber-500/40 from-amber-500/20'
  },
  'automobile': {
    label: 'Automobile (02)',
    badge: 'Investissement 02',
    icon: '🚗',
    type: 'investissement',
    color: 'border-orange-500/40 from-orange-500/20'
  },
  'textile': {
    label: 'Textile & Habillement (03)',
    badge: 'Investissement 03',
    icon: '👕',
    type: 'investissement',
    color: 'border-fuchsia-500/40 from-fuchsia-500/20'
  }
};

export const PlansView = ({ plans }: PlansViewProps) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || 'sante');
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [filterType, setFilterType] = useState<'all' | 'urgence' | 'investissement'>('all');
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Stop TTS when component unmounts or plan changes
  useEffect(() => {
    return () => {
      tts.stop();
    };
  }, []);

  useEffect(() => {
    tts.stop();
    setPlayingIdx(null);
    setCopiedIdx(null);
  }, [selectedPlanId]);

  const currentPlan = plans.find(p => p.id === selectedPlanId) || plans[0];
  const currentMeta = currentPlan ? PLAN_META_MAP[currentPlan.id] : null;

  const filteredPlans = plans.filter(p => {
    if (filterType === 'all') return true;
    const meta = PLAN_META_MAP[p.id];
    return meta?.type === filterType;
  });

  const handleToggleSpeak = (idx: number, sub: { title: string; paragraphs: string[] }) => {
    if (playingIdx === idx) {
      tts.stop();
      setPlayingIdx(null);
      return;
    }

    setPlayingIdx(idx);
    const textToRead = `${sub.title}. ${sub.paragraphs.join(' ')}`;
    tts.speak(
      textToRead,
      () => setPlayingIdx(idx),
      () => setPlayingIdx(null),
      () => setPlayingIdx(null)
    );
  };

  const handleCopySection = (idx: number, sub: { title: string; paragraphs: string[] }) => {
    const textToCopy = `[${currentPlan?.title || 'Plan'}]\n${sub.title}\n\n${sub.paragraphs.join('\n\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedIdx(idx);
    setTimeout(() => {
      setCopiedIdx(null);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 space-y-6 text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2b0854] via-[#1d0638] to-[#120025] rounded-3xl p-6 sm:p-8 border border-purple-500/40 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-purple-900/80 border border-purple-500/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-300">
              ⚡ Feuilles de Route Sectorielles
            </span>
            <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-amber-200">
              {plans.length} plans officiels
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Plans d'Urgence &amp; d'Investissement Productif
          </h1>

          <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-xl">
            Retrouvez les plans d'urgence des services publics ainsi que la collection officielle des{' '}
            <strong className="text-amber-300">Plans d'investissement productif (BTP 01, Automobile 02, Textile 03)</strong>{' '}
            pour planifier la bifurcation écologique et réindustrialiser la France.
          </p>
        </div>
      </div>

      {/* Filter Chips: Tous / Plans d'Urgence / Plans d'Investissement */}
      <div className="flex items-center gap-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
            filterType === 'all'
              ? 'bg-purple-600 text-white border-purple-400 shadow'
              : 'bg-[#18082f] text-slate-300 border-purple-900/50 hover:text-white'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          Tous ({plans.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterType('investissement')}
          className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
            filterType === 'investissement'
              ? 'bg-amber-600 text-white border-amber-400 shadow'
              : 'bg-[#18082f] text-slate-300 border-purple-900/50 hover:text-white'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <span>🏭 Investissement Productif</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-black">
            {plans.filter(p => PLAN_META_MAP[p.id]?.type === 'investissement').length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setFilterType('urgence')}
          className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
            filterType === 'urgence'
              ? 'bg-rose-600 text-white border-rose-400 shadow'
              : 'bg-[#18082f] text-slate-300 border-purple-900/50 hover:text-white'
          }`}
          style={{ touchAction: 'manipulation' }}
        >
          <span>🚨 Plans d'Urgence</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-black">
            {plans.filter(p => PLAN_META_MAP[p.id]?.type === 'urgence').length}
          </span>
        </button>
      </div>

      {/* Plan Selector Buttons (Horizontal Scroll) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {filteredPlans.map(p => {
          const active = p.id === selectedPlanId;
          const meta = PLAN_META_MAP[p.id] || {
            label: p.title,
            badge: 'Plan sectoriel',
            icon: '📋',
            type: 'urgence',
            color: 'border-purple-500/40'
          };
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPlanId(p.id);
                setExpandedSection(0);
              }}
              className={`flex-shrink-0 px-3.5 py-2.5 rounded-2xl font-black text-xs transition-all border flex items-center gap-2.5 cursor-pointer ${
                active
                  ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white border-purple-400 shadow-xl scale-[1.02]'
                  : 'bg-[#18082f] text-slate-300 border-purple-900/50 hover:border-purple-600/60 hover:text-white'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              <span className="text-base select-none">{meta.icon}</span>
              <div className="text-left">
                <span className="block text-[9px] uppercase tracking-wider text-purple-300/80 font-bold leading-none mb-0.5">
                  {meta.badge}
                </span>
                <span className="block font-black leading-tight text-xs sm:text-sm">
                  {meta.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Plan Detail */}
      {currentPlan && (
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-purple-500/30 shadow-lg space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl select-none">{currentMeta?.icon || '📋'}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-950/80 border border-purple-500/50 text-amber-300">
                {currentMeta?.badge || 'Plan sectoriel'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
              {currentPlan.title}
            </h2>
            <p className="text-xs text-purple-300 font-semibold">
              {currentPlan.subsections.length} axes d'intervention prioritaires
            </p>
          </div>

          <div className="space-y-3">
            {currentPlan.subsections.map((sub, idx) => {
              const isExpanded = expandedSection === idx;
              const isPlayingThis = playingIdx === idx;
              const isCopiedThis = copiedIdx === idx;

              return (
                <div
                  key={idx}
                  className="glass-panel rounded-2xl border border-purple-500/20 overflow-hidden shadow-md"
                >
                  <button
                    onClick={() => setExpandedSection(isExpanded ? null : idx)}
                    className="w-full p-4 sm:p-4.5 flex items-center justify-between text-left hover:bg-purple-900/30 transition-colors gap-3 cursor-pointer"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <span
                        className="flex-shrink-0 w-7 h-7 min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] aspect-square rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-black text-xs flex items-center justify-center shadow-md select-none self-center"
                        style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px', maxWidth: '28px', maxHeight: '28px', borderRadius: '9999px', flexShrink: 0 }}
                      >
                        {idx + 1}
                      </span>
                      <h3 className="font-extrabold text-sm sm:text-base text-white">{sub.title}</h3>
                    </div>
                    <IconChevronDown
                      className={`w-4 h-4 text-purple-400 transition-transform ${isExpanded ? 'rotate-180 text-amber-300' : ''}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-3 border-t border-purple-900/50 bg-[#120324]/80 space-y-3.5">
                      {/* Audio & Copy Action Bar */}
                      <div className="flex items-center justify-end gap-2 pb-1 border-b border-purple-900/40">
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(idx, sub)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isPlayingThis
                              ? 'bg-amber-500 text-slate-950 shadow-md animate-pulse'
                              : 'bg-purple-900/40 text-purple-200 hover:text-white hover:bg-purple-800/60'
                          }`}
                          style={{ touchAction: 'manipulation' }}
                          title={isPlayingThis ? 'Arrêter la lecture' : 'Écouter cette partie en audio'}
                        >
                          {isPlayingThis ? <IconStop size={14} /> : <IconVolume size={14} />}
                          <span>{isPlayingThis ? 'Arrêter' : 'Écouter'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopySection(idx, sub)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isCopiedThis
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-purple-900/40 text-purple-200 hover:text-white hover:bg-purple-800/60'
                          }`}
                          style={{ touchAction: 'manipulation' }}
                          title="Copier le texte de cette partie"
                        >
                          {isCopiedThis ? <IconCheck size={14} /> : <IconCopy size={14} />}
                          <span>{isCopiedThis ? 'Copié !' : 'Copier'}</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {sub.paragraphs.map((para, pIdx) => (
                          <p key={pIdx} className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>
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
