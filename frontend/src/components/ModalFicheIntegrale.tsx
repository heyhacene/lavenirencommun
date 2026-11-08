import { useState } from 'react';
import type { Section, Profile } from '../types/programme';
import {
  IconClose,
  IconCheck,
  IconShare,
  IconBell,
  IconStar,
  IconArrowLeft,
  renderProfileIcon,
  getProfileColor
} from './Icons';

interface ModalFicheIntegraleProps {
  section: Section | null;
  profiles: Profile[];
  onClose: () => void;
  onSelectCategory?: (profileId: string) => void;
  onSetAlertForFiche?: (section: Section) => void;
  onRandomFiche?: () => void;
}

export const ModalFicheIntegrale = ({
  section,
  profiles,
  onClose,
  onSelectCategory,
  onSetAlertForFiche,
  onRandomFiche
}: ModalFicheIntegraleProps) => {
  const [copied, setCopied] = useState(false);

  if (!section) return null;

  const profileMap = new Map(profiles.map(p => [p.id, p]));

  const handleShare = async () => {
    const textToShare = `${section.title}\n\n★ MESURE CLÉ :\n${section.mesureCle}\n\nProgramme officiel L'Avenir en commun 2027 (Jean-Luc Mélenchon)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: section.title,
          text: textToShare
        });
      } catch (e) {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(textToShare);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-[#140626] border border-purple-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 text-white">
        {/* Sticky Header with Back Button and Large Close Cross */}
        <div className="sticky top-0 z-20 bg-[#16062b]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Prominent Back Button */}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95"
              title="Retour aux fiches"
            >
              <IconArrowLeft size={16} />
              <span>Retour</span>
            </button>

            <span className="text-xs font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2.5 py-1 rounded-full shadow-sm">
              #{section.globalIndex}
            </span>
            <span className="text-xs text-purple-300 font-semibold truncate max-w-[150px] sm:max-w-[240px]">
              Partie {section.partieNumber} • {section.chapitreTitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onSetAlertForFiche && (
              <button
                onClick={() => onSetAlertForFiche(section)}
                title="Tester l'alerte sur cette fiche"
                className="w-10 h-10 flex items-center justify-center text-purple-300 hover:text-amber-300 hover:bg-purple-900/60 rounded-full transition-colors active:scale-95"
              >
                <IconBell size={18} />
              </button>
            )}
            <button
              onClick={handleShare}
              title="Partager"
              className="w-10 h-10 flex items-center justify-center text-purple-300 hover:text-white hover:bg-purple-900/60 rounded-full transition-colors active:scale-95"
            >
              {copied ? <IconCheck size={18} className="text-emerald-400" /> : <IconShare size={18} />}
            </button>

            {/* Large, Easy-to-Tap Close Cross (44px target) */}
            <button
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-colors ml-1"
              title="Fermer la fiche"
            >
              <IconClose size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6 flex-1">
          {/* Breadcrumb info */}
          <div className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
            <span>Partie {section.partieNumber} : {section.partieTitle}</span>
          </div>

          {/* Section title */}
          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
            {section.title}
          </h2>

          {/* Intro paragraph if present */}
          {section.intro && (
            <p className="text-sm text-slate-300 leading-relaxed bg-purple-950/40 p-4 rounded-2xl border border-purple-800/40 italic">
              « {section.intro} »
            </p>
          )}

          {/* Mesure clé highlighted in campaign glow */}
          {section.mesureCle && (
            <div className="stitch-mesure-phare p-5 rounded-2xl shadow-xl space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-black tracking-wider uppercase text-amber-300">
                <IconStar size={16} className="text-amber-400" />
                <span>Mesure Clé Phare du Mandat</span>
              </div>
              <p className="text-base font-bold text-white leading-relaxed">
                {section.mesureCle}
              </p>
            </div>
          )}

          {/* Full measures list */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-300">
                Version intégrale des mesures ({section.mesures.length})
              </h4>
              <span className="text-[11px] text-slate-400 font-medium">Texte officiel 2027</span>
            </div>

            {section.mesures.length === 0 ? (
              <p className="text-sm text-slate-400 italic bg-purple-950/30 p-4 rounded-xl">
                Cette fiche repose sur sa mesure clé principale ci-dessus.
              </p>
            ) : (
              <ol className="space-y-3">
                {section.mesures.map((m, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-2xl bg-purple-950/30 border border-purple-800/30 hover:border-purple-700/60 transition-colors text-sm leading-relaxed"
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-black text-xs flex items-center justify-center mt-0.5 shadow-md">
                      {idx + 1}
                    </span>
                    <span className="text-slate-100 font-medium">
                      {m}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* CLICKABLE CATEGORY / PROFILE TAGS (User requirement) */}
          <div className="pt-4 border-t border-purple-800/40">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-purple-400">
                Catégories &amp; Thématiques rattachées
              </h4>
              <span className="text-[11px] text-purple-300/70 italic">
                Cliquez sur un thème pour voir ses fiches
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {section.profiles.map(pid => {
                const prof = profileMap.get(pid);
                if (!prof) return null;
                const colors = getProfileColor(pid);
                return (
                  <button
                    key={pid}
                    onClick={() => onSelectCategory?.(pid)}
                    className={`inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl border ${colors.bg} ${colors.text} ${colors.border} hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer group`}
                    title={`Explorer toutes les fiches du thème « ${prof.label} »`}
                  >
                    {renderProfileIcon(prof.icon, "w-4 h-4")}
                    <span>{prof.label}</span>
                    <span className="text-[11px] opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer sticky bar with prominent buttons */}
        <div className="sticky bottom-0 bg-[#16062b] border-t border-purple-500/20 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2 pb-[max(1rem,env(safe-area-inset-bottom,16px))]">
          {onRandomFiche ? (
            <button
              onClick={onRandomFiche}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-900/90 to-amber-950/80 hover:from-purple-800 hover:to-amber-900 text-amber-300 hover:text-white border border-amber-500/40 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5"
              title="Passer à une autre proposition au hasard"
            >
              <span className="text-sm">🎲</span>
              <span>Autre proposition</span>
            </button>
          ) : (
            <span className="text-xs text-purple-300/80 font-medium">
              L'Avenir en commun • 2027
            </span>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95"
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
};
