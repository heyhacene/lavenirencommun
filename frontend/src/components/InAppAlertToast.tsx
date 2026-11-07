import type { Section } from '../types/programme';
import { IconBell, IconClose, IconChevronRight, IconStar } from './Icons';

interface InAppAlertToastProps {
  section: Section | null;
  onOpenFiche: (section: Section) => void;
  onDismiss: () => void;
}

export const InAppAlertToast = ({
  section,
  onOpenFiche,
  onDismiss
}: InAppAlertToastProps) => {
  if (!section) return null;

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[420px] z-[110]">
      <div className="bg-[#170530]/95 backdrop-blur-xl text-white p-4.5 rounded-2xl shadow-2xl border-2 border-purple-500/50 flex flex-col gap-3 relative overflow-hidden">
        {/* Top ambient glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-gradient-to-tr from-purple-600 to-rose-600 rounded-xl text-white shadow-md">
              <IconBell size={16} className="text-amber-300" />
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                ALERTE PROGRAMME 2027
              </span>
              <span className="text-xs text-purple-200 font-bold">
                Fiche #{section.globalIndex} • Partie {section.partieNumber}
              </span>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <IconClose size={16} />
          </button>
        </div>

        <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-800/40">
          <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">
            {section.title}
          </h4>
          <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
            {section.mesureCle || section.intro}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-[11px] text-purple-300/80 font-semibold">
            <IconStar size={14} className="text-amber-400 fill-amber-400" />
            <span>Mesure clé du jour</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDismiss}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 font-semibold"
            >
              Ignorer
            </button>
            <button
              onClick={() => {
                onOpenFiche(section);
                onDismiss();
              }}
              className="text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 px-3.5 py-1.5 rounded-xl flex items-center gap-1 transition-all shadow-md active:scale-95"
            >
              Voir la fiche
              <IconChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
