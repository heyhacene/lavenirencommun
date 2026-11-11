import React from 'react';
import type { Partie, Section } from '../types/programme';
import { IconClose, IconChevronRight, IconBookOpen, IconCards } from './Icons';

interface PartiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  parties: Partie[];
  sections: Section[];
  selectedPartie: number | null;
  onSelectPartie: (partieNumber: number | null) => void;
  onOpenReaderPartie?: (partieNumber: number) => void;
}

export const PartiesModal: React.FC<PartiesModalProps> = ({
  isOpen,
  onClose,
  parties,
  sections,
  selectedPartie,
  onSelectPartie,
  onOpenReaderPartie
}) => {
  if (!isOpen) return null;

  // Party visual accent colors
  const partyAccents: Record<number, { gradient: string; badge: string; text: string; border: string }> = {
    1: {
      gradient: 'from-emerald-950/70 via-teal-950/40 to-[#120025]',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
      text: 'text-emerald-300',
      border: 'hover:border-emerald-400/70'
    },
    2: {
      gradient: 'from-amber-950/70 via-orange-950/40 to-[#120025]',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
      text: 'text-amber-300',
      border: 'hover:border-amber-400/70'
    },
    3: {
      gradient: 'from-rose-950/70 via-pink-950/40 to-[#120025]',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
      text: 'text-rose-300',
      border: 'hover:border-rose-400/70'
    },
    4: {
      gradient: 'from-purple-950/70 via-fuchsia-950/40 to-[#120025]',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
      text: 'text-purple-300',
      border: 'hover:border-purple-400/70'
    },
    5: {
      gradient: 'from-blue-950/70 via-indigo-950/40 to-[#120025]',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
      text: 'text-blue-300',
      border: 'hover:border-blue-400/70'
    },
    6: {
      gradient: 'from-cyan-950/70 via-sky-950/40 to-[#120025]',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
      text: 'text-cyan-300',
      border: 'hover:border-cyan-400/70'
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-white">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] bg-[#140626] border border-purple-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-[#16062b]/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-700 to-pink-600 border border-purple-400/40 flex items-center justify-center text-xl shadow-md">
              🏛️
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                Les 6 Grandes Parties
              </h2>
              <p className="text-xs text-purple-300 font-semibold">
                Structure officielle de L'Avenir en commun • 2027
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-colors"
            title="Fermer"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 sm:px-6 py-5 space-y-3.5 flex-1">
          {/* Option: Tout voir */}
          <div
            onClick={() => {
              onSelectPartie(null);
              onClose();
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99] ${
              selectedPartie === null
                ? 'bg-purple-600/30 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-[#18082f]/80 border-purple-800/40 hover:border-purple-600'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-200">
                <IconCards size={18} />
              </div>
              <div>
                <div className="text-sm font-black text-white group-hover:text-purple-200 transition-colors flex items-center gap-2">
                  <span>Toutes les fiches du programme</span>
                  {selectedPartie === null && (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40">
                      Actif
                    </span>
                  )}
                </div>
                <div className="text-xs text-purple-300/80 mt-0.5">
                  111 fiches thématiques réparties sur l'ensemble des 6 parties
                </div>
              </div>
            </div>

            <IconChevronRight size={18} className="text-purple-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>

          {/* 6 Parties List */}
          {parties.map(p => {
            const isSelected = selectedPartie === p.number;
            const accent = partyAccents[p.number] || partyAccents[1];
            const pSections = sections.filter(s => s.partieNumber === p.number);
            const chaptersCount = p.chapters ? p.chapters.length : 0;

            return (
              <div
                key={p.id || p.number}
                className={`p-4 sm:p-5 rounded-2xl border bg-gradient-to-r ${accent.gradient} transition-all shadow-md group ${
                  isSelected
                    ? 'border-purple-400 ring-2 ring-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : `border-purple-900/40 ${accent.border}`
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-lg border ${accent.badge}`}>
                        Partie {p.number}
                      </span>
                      <span className="text-[11px] text-purple-300/80 font-bold">
                        {pSections.length} fiches &bull; {chaptersCount} chapitre{chaptersCount > 1 ? 's' : ''}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                          Sélectionnée
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                      {p.title || `Partie ${p.number}`}
                    </h3>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-900/40 flex-shrink-0">
                    <button
                      onClick={() => {
                        onSelectPartie(p.number);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                      title={`Afficher les ${pSections.length} fiches de la Partie ${p.number}`}
                    >
                      <span>Voir les fiches ({pSections.length})</span>
                      <span>→</span>
                    </button>

                    {onOpenReaderPartie && (
                      <button
                        onClick={() => onOpenReaderPartie(p.number)}
                        className="px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 active:scale-95 text-purple-200 hover:text-white border border-purple-700/50 font-bold text-xs flex items-center gap-1.5 transition-all"
                        title={`Lire la Partie ${p.number} dans le livre`}
                      >
                        <IconBookOpen size={14} />
                        <span className="hidden sm:inline">Livre</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#16062b] border-t border-purple-500/20 px-5 sm:px-6 py-3.5 flex items-center justify-between text-xs text-purple-300 pb-[max(1rem,env(safe-area-inset-bottom,16px))]">
          <span className="font-semibold text-[11px] sm:text-xs">
            1 069 mesures officielles réparties dans ces 6 parties
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-white font-bold text-xs transition-all active:scale-95"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
