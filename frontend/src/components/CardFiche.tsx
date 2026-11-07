import type { Section, Profile } from '../types/programme';
import { IconChevronRight, IconStar, renderProfileIcon, getProfileColor } from './Icons';

interface CardFicheProps {
  section: Section;
  profiles: Profile[];
  onOpenModal: (section: Section) => void;
}

export const CardFiche = ({ section, profiles, onOpenModal }: CardFicheProps) => {
  const profileMap = new Map(profiles.map(p => [p.id, p]));

  return (
    <article
      onClick={() => onOpenModal(section)}
      className="stitch-card group cursor-pointer active:scale-[0.99]"
    >
      {/* Subtle campaign diagonal glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all" />

      <div className="flex-1 flex flex-col">
        {/* Top meta tags */}
        <div className="flex items-center justify-between gap-2 mb-3 text-xs">
          <span className="font-black text-purple-200 bg-purple-900/70 border border-purple-500/40 px-2.5 py-1 rounded-full text-[11px] tracking-wide shadow-xs">
            FICHE #{section.globalIndex}
          </span>
          <span className="text-slate-400 text-[11px] font-semibold truncate max-w-[210px]">
            Partie {section.partieNumber} • {section.chapitreTitle}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-white group-hover:text-purple-200 transition-colors line-clamp-2 mb-3 leading-snug">
          {section.title}
        </h3>

        {/* Mesure clé phare */}
        {section.mesureCle ? (
          <div className="stitch-mesure-phare my-2.5 text-xs text-slate-200 shadow-inner">
            <div className="flex items-center gap-1.5 font-black text-amber-300 mb-1 tracking-wider uppercase text-[10px]">
              <IconStar className="text-amber-400" size={14} />
              <span>Mesure Clé Phare</span>
            </div>
            <p className="line-clamp-3 font-medium leading-relaxed text-slate-100">
              {section.mesureCle}
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-300 line-clamp-3 mb-2.5 leading-relaxed italic bg-purple-950/30 p-3 rounded-xl border border-purple-800/30">
            « {section.intro} »
          </p>
        )}

        {/* Profile badges */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {section.profiles.slice(0, 3).map(pid => {
            const prof = profileMap.get(pid);
            if (!prof) return null;
            const colors = getProfileColor(pid);
            return (
              <span
                key={pid}
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${colors.bg} ${colors.text} ${colors.border}`}
              >
                {renderProfileIcon(prof.icon, "w-3 h-3")}
                {prof.label.split('&')[0].trim()}
              </span>
            );
          })}
          {section.profiles.length > 3 && (
            <span className="text-[11px] text-purple-300/80 font-bold px-2 py-1 bg-purple-950/50 rounded-lg border border-purple-800/40">
              +{section.profiles.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer action */}
      <div className="mt-4 pt-3.5 border-t border-purple-500/15 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium text-[11px]">
          {section.totalMesuresCount} mesure{section.totalMesuresCount > 1 ? 's' : ''} au programme
        </span>
        <span className="inline-flex items-center gap-1 font-bold text-purple-300 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all text-xs">
          Lire l'intégralité
          <IconChevronRight className="text-purple-400 group-hover:text-amber-300" size={14} />
        </span>
      </div>
    </article>
  );
};
