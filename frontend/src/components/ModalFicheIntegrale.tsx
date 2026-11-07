import React, { useState } from 'react';
import { Section, Profile } from '../types/programme';
import { IconClose, IconCheck, IconShare, IconBell, renderProfileIcon } from './Icons';

interface ModalFicheIntegraleProps {
  section: Section | null;
  profiles: Profile[];
  onClose: () => void;
  onSetAlertForFiche?: (section: Section) => void;
}

export const ModalFicheIntegrale: React.FC<ModalFicheIntegraleProps> = ({
  section,
  profiles,
  onClose,
  onSetAlertForFiche
}) => {
  const [copied, setCopied] = useState(false);

  if (!section) return null;

  const profileMap = new Map(profiles.map(p => [p.id, p]));

  const handleShare = async () => {
    const textToShare = `${section.title}\n\nMesure clé :\n${section.mesureCle}\n\nProgramme L'Avenir en commun 2027`;
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 animate-slide-up">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-purple-100 text-purple-900 px-3 py-1 rounded-full">
              Fiche #{section.globalIndex}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Partie {section.partieNumber}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {onSetAlertForFiche && (
              <button
                onClick={() => onSetAlertForFiche(section)}
                title="Tester l'alerte sur cette fiche"
                className="p-2 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors"
              >
                <IconBell className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleShare}
              title="Partager"
              className="p-2 text-slate-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors"
            >
              {copied ? <IconCheck className="w-5 h-5 text-emerald-600" /> : <IconShare className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            >
              <IconClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 text-slate-900">
          {/* Breadcrumb info */}
          <div className="text-xs font-medium text-purple-800">
            {section.partieTitle} &bull; {section.chapitreTitle}
          </div>

          {/* Section title */}
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
            {section.title}
          </h2>

          {/* Intro paragraph if present */}
          {section.intro && (
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
              « {section.intro} »
            </p>
          )}

          {/* Mesure clé highlighted */}
          {section.mesureCle && (
            <div className="bg-purple-900 text-white p-5 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-purple-200">
                <span className="text-amber-400">★</span> Mesure Clé Phare
              </div>
              <p className="text-base font-semibold leading-relaxed">
                {section.mesureCle}
              </p>
            </div>
          )}

          {/* Full measures list */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Version intégrale des mesures ({section.mesures.length})
            </h4>

            {section.mesures.length === 0 ? (
              <p className="text-sm text-slate-500 italic">
                Cette fiche repose sur sa mesure clé principale.
              </p>
            ) : (
              <ol className="space-y-3">
                {section.mesures.map((m, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100/90 text-sm leading-relaxed"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium">
                      {m}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Profile tags */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Profils citoyens concernés
            </h4>
            <div className="flex flex-wrap gap-2">
              {section.profiles.map(pid => {
                const prof = profileMap.get(pid);
                if (!prof) return null;
                return (
                  <span
                    key={pid}
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-50 text-purple-800 px-3 py-1.5 rounded-lg border border-purple-100"
                  >
                    {renderProfileIcon(prof.icon, "w-3.5 h-3.5 text-purple-700")}
                    {prof.label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer sticky bar */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            L'Avenir en commun • 2027
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl transition-colors shadow-sm"
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
};
