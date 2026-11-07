import { useState, useMemo, useRef, useEffect } from 'react';
import type { Section, Profile } from '../types/programme';
import { IconSearch, IconClose, IconChevronRight, renderProfileIcon, getProfileColor } from './Icons';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  profiles: Profile[];
  onSelectSection: (section: Section) => void;
}

export const SearchModal = ({
  isOpen,
  onClose,
  sections,
  profiles,
  onSelectSection
}: SearchModalProps) => {
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
      if (selectedProfile !== 'tous' && !sec.profiles.includes(selectedProfile)) {
        return false;
      }
      if (!q) return true;

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
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md text-white">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#140626] border border-purple-500/40 rounded-b-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-purple-500/20 flex items-center gap-3 bg-[#190730]">
          <div className="p-2 bg-purple-900/60 rounded-xl text-purple-300">
            <IconSearch size={18} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher (ex: SMIC 1600€, Retraite 60 ans, Hôpital, 6e République...)"
            className="w-full text-sm sm:text-base font-semibold outline-none placeholder:text-slate-500 bg-transparent text-white"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors"
            >
              <IconClose size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold text-purple-300 hover:text-white bg-purple-900/50 hover:bg-purple-900 rounded-xl transition-colors border border-purple-700/40"
          >
            Fermer
          </button>
        </div>

        {/* Quick filters */}
        <div className="px-4 py-3 bg-[#100322] border-b border-purple-500/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {profiles.map(p => {
            const active = selectedProfile === p.id;
            const colors = getProfileColor(p.id);
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProfile(p.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all border ${
                  active
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md scale-[1.02]'
                    : `bg-[#18082f] text-slate-300 border-purple-900/40 hover:border-purple-700`
                }`}
              >
                {renderProfileIcon(p.icon, `w-3.5 h-3.5 ${active ? 'text-white' : colors.text}`)}
                {p.label.split('&')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Results Header */}
        <div className="px-4 py-2.5 bg-[#120424] text-xs font-bold text-purple-300 flex justify-between items-center border-b border-purple-500/15">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {filteredSections.length} fiche{filteredSections.length > 1 ? 's' : ''} trouvée{filteredSections.length > 1 ? 's' : ''}
          </span>
          {query && <span className="text-slate-400 font-normal">Recherche : « <strong className="text-amber-300">{query}</strong> »</span>}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto divide-y divide-purple-900/30 p-2 space-y-1">
          {filteredSections.length === 0 ? (
            <div className="py-14 text-center text-slate-400 text-sm">
              <p className="font-bold text-white text-base">Aucun résultat pour cette recherche</p>
              <p className="text-xs text-purple-300/80 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Essayez d'autres mots-clés (ex: salaire, santé, énergie, prix, constituante, nucléaire, école...).
              </p>
            </div>
          ) : (
            filteredSections.map(sec => (
              <div
                key={sec.id}
                onClick={() => {
                  onSelectSection(sec);
                  onClose();
                }}
                className="p-3.5 hover:bg-purple-900/40 rounded-2xl cursor-pointer transition-all group flex items-center justify-between gap-3 border border-transparent hover:border-purple-600/30"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-purple-400">
                    <span className="font-black text-purple-200 bg-purple-900/80 px-2 py-0.5 rounded-full border border-purple-500/30">
                      #{sec.globalIndex}
                    </span>
                    <span className="truncate text-slate-400 font-semibold">
                      Partie {sec.partieNumber} • {sec.chapitreTitle}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-1">
                    {sec.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 font-normal">
                    {sec.mesureCle || sec.intro}
                  </p>
                </div>
                <IconChevronRight size={16} className="text-purple-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
