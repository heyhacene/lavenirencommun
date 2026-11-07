import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Section, Profile } from '../types/programme';
import { IconSearch, IconClose, IconChevronRight, renderProfileIcon } from './Icons';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  profiles: Profile[];
  onSelectSection: (section: Section) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  sections,
  profiles,
  onSelectSection
}) => {
  const [query, setQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<string>('tous');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setSelectedProfile('tous');
    }
  }, [isOpen]);

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sections.filter(sec => {
      // Profile filter
      if (selectedProfile !== 'tous' && !sec.profiles.includes(selectedProfile)) {
        return false;
      }
      if (!q) return true;

      // Match query
      if (sec.title.toLowerCase().includes(q)) return true;
      if (sec.mesureCle && sec.mesureCle.toLowerCase().includes(q)) return true;
      if (sec.intro && sec.intro.toLowerCase().includes(q)) return true;
      if (sec.chapitreTitle && sec.chapitreTitle.toLowerCase().includes(q)) return true;
      if (sec.partieTitle && sec.partieTitle.toLowerCase().includes(q)) return true;
      if (sec.mesures.some(m => m.toLowerCase().includes(q))) return true;

      return false;
    });
  }, [sections, query, selectedProfile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-b-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-slide-up">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
          <IconSearch className="w-5 h-5 text-purple-700 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher une mesure, un thème (SMIC, retraite, santé, climat...)"
            className="w-full text-base font-medium outline-none placeholder:text-slate-400 bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <IconClose className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>

        {/* Quick filters */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {profiles.map(p => {
            const active = selectedProfile === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProfile(p.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all ${
                  active
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {renderProfileIcon(p.icon, `w-3 h-3 ${active ? 'text-purple-200' : 'text-purple-600'}`)}
                {p.label.split('&')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Results Header */}
        <div className="px-4 py-2 bg-slate-50/50 text-xs font-medium text-slate-500 flex justify-between items-center border-b border-slate-100">
          <span>{filteredSections.length} résultat{filteredSections.length > 1 ? 's' : ''} trouvé{filteredSections.length > 1 ? 's' : ''}</span>
          {query && <span>Mot-clé : « {query} »</span>}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-slate-100 p-2">
          {filteredSections.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              <p className="font-semibold text-slate-700">Aucun résultat ne correspond à votre recherche.</p>
              <p className="text-xs text-slate-400 mt-1">Essayez un autre mot-clé ou sélectionnez un autre profil.</p>
            </div>
          ) : (
            filteredSections.map(sec => (
              <div
                key={sec.id}
                onClick={() => {
                  onSelectSection(sec);
                  onClose();
                }}
                className="p-3.5 hover:bg-purple-50/50 rounded-2xl cursor-pointer transition-colors group flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                    <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      #{sec.globalIndex}
                    </span>
                    <span className="truncate">Partie {sec.partieNumber} • {sec.chapitreTitle}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition-colors line-clamp-1">
                    {sec.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {sec.mesureCle || sec.intro}
                  </p>
                </div>
                <IconChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
