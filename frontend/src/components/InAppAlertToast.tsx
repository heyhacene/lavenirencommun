import type { Section } from '../types/programme';
import { IconBell, IconClose, IconChevronRight } from './Icons';

interface InAppAlertToastProps {
  section: Section | null;
  onOpenFiche: (section: Section) => void;
  onDismiss: () => void;
}

export const InAppAlertToast: React.FC<InAppAlertToastProps> = ({
  section,
  onOpenFiche,
  onDismiss
}) => {
  if (!section) return null;

  return (
    <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-slide-up">
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-purple-500/30 backdrop-blur-lg flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-purple-600 rounded-lg text-white">
              <IconBell className="w-4 h-4 text-amber-300" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300">
              Alerte Fiche • #{section.globalIndex}
            </span>
          </div>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white line-clamp-1">
            {section.title}
          </h4>
          <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
            {section.mesureCle || section.intro}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
          <button
            onClick={onDismiss}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
          >
            Fermer
          </button>
          <button
            onClick={() => {
              onOpenFiche(section);
              onDismiss();
            }}
            className="text-xs font-bold text-purple-300 hover:text-white bg-purple-600/50 hover:bg-purple-600 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
          >
            Voir la fiche
            <IconChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
