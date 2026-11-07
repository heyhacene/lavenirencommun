import React from 'react';
import { Section, Profile } from '../types/programme';
import { IconChevronRight, renderProfileIcon } from './Icons';

interface CardFicheProps {
  section: Section;
  profiles: Profile[];
  onOpenModal: (section: Section) => void;
}

export const CardFiche: React.FC<CardFicheProps> = ({ section, profiles, onOpenModal }) => {
  const profileMap = new Map(profiles.map(p => [p.id, p]));

  return (
    <article
      onClick={() => onOpenModal(section)}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] group flex flex-col justify-between"
    >
      <div>
        {/* Top meta tags */}
        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
          <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full">
            Fiche #{section.globalIndex}
          </span>
          <span className="text-slate-500 truncate max-w-[200px]">
            Partie {section.partieNumber} • {section.chapitreTitle}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-2 mb-2.5 leading-snug">
          {section.title}
        </h3>

        {/* Mesure clé condencee */}
        {section.mesureCle ? (
          <div className="bg-gradient-to-r from-purple-50/70 to-indigo-50/50 border-l-4 border-purple-600 rounded-r-xl p-3 my-2 text-xs leading-relaxed text-slate-800">
            <span className="font-bold text-purple-900 block mb-1 uppercase tracking-wider text-[10px]">
              ⭐ Mesure Clé Phare
            </span>
            <p className="line-clamp-3 font-medium">
              {section.mesureCle}
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-600 line-clamp-3 mb-2 leading-relaxed">
            {section.intro}
          </p>
        )}

        {/* Profile badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {section.profiles.slice(0, 3).map(pid => {
            const prof = profileMap.get(pid);
            if (!prof) return null;
            return (
              <span
                key={pid}
                className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
              >
                {renderProfileIcon(prof.icon, "w-3 h-3 text-purple-600")}
                {prof.label.split('&')[0].trim()}
              </span>
            );
          })}
          {section.profiles.length > 3 && (
            <span className="text-[11px] text-slate-400 font-medium px-1.5 py-0.5">
              +{section.profiles.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-600">
          {section.totalMesuresCount} mesure{section.totalMesuresCount > 1 ? 's' : ''} au total
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-purple-700 group-hover:translate-x-0.5 transition-transform">
          Voir l'intégralité
          <IconChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
