import { useState } from 'react';
import type { ProgrammeData, Section } from '../types/programme';
import { IconChevronRight, IconClose, IconStar } from './Icons';

interface ReaderViewProps {
  data: ProgrammeData;
  onOpenSectionModal: (section: Section) => void;
}

export const ReaderView = ({ data, onOpenSectionModal }: ReaderViewProps) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showToc, setShowToc] = useState(false);

  const textSizeClasses = {
    normal: 'text-sm sm:text-base leading-relaxed',
    large: 'text-base sm:text-lg leading-relaxed',
    xlarge: 'text-lg sm:text-xl leading-relaxed'
  };

  const scrollToAnchor = (id: string) => {
    setShowToc(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto pb-24 text-white">
      {/* Sticky Reader Controls */}
      <div className="sticky top-16 z-30 bg-[#16062b]/95 backdrop-blur-md px-4 py-2.5 border border-purple-500/20 flex items-center justify-between text-xs rounded-2xl shadow-xl mb-6">
        <button
          onClick={() => setShowToc(!showToc)}
          className="flex items-center gap-2 font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-3.5 py-1.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          <span>📑 Sommaire du livre</span>
          <IconChevronRight className={`w-3.5 h-3.5 transition-transform ${showToc ? 'rotate-90' : ''}`} />
        </button>

        <div className="flex items-center gap-1 bg-[#100322] p-1 rounded-xl border border-purple-900/50">
          <button
            onClick={() => setFontSize('normal')}
            className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${fontSize === 'normal' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            A
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-2.5 py-1 rounded-lg font-bold text-sm transition-all ${fontSize === 'large' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            A+
          </button>
          <button
            onClick={() => setFontSize('xlarge')}
            className={`px-2.5 py-1 rounded-lg font-bold text-base transition-all ${fontSize === 'xlarge' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'}`}
          >
            A++
          </button>
        </div>
      </div>

      {/* Sommaire Modal / Drawer */}
      {showToc && (
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#140626] border border-purple-500/40 rounded-3xl w-full max-w-lg max-h-[82vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-purple-950 to-[#1d0638]">
              <h3 className="font-black text-sm text-white">Sommaire de L'Avenir en commun</h3>
              <button onClick={() => setShowToc(false)} className="text-purple-300 hover:text-white">
                <IconClose className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3">
              <button
                onClick={() => scrollToAnchor('reader-intro')}
                className="w-full text-left font-bold text-sm text-purple-200 hover:text-white hover:bg-purple-900/50 p-2.5 rounded-xl block transition-colors"
              >
                Introduction : Vers une nouvelle France
              </button>
              {data.parties.map(p => (
                <div key={p.id} className="space-y-1">
                  <button
                    onClick={() => scrollToAnchor(`reader-${p.id}`)}
                    className="w-full text-left font-black text-xs uppercase tracking-wider text-amber-300 bg-purple-950/60 border border-purple-800/40 p-2.5 rounded-xl block hover:bg-purple-900/60 transition-colors"
                  >
                    Partie {p.number} • {p.title}
                  </button>
                  <div className="pl-3 space-y-1">
                    {p.chapters.map(c => (
                      <button
                        key={c.id}
                        onClick={() => scrollToAnchor(`reader-${c.id}`)}
                        className="w-full text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-purple-900/40 p-2 rounded-lg block transition-colors"
                      >
                        Chapitre {c.number} • {c.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Book Presentation Cover Hero */}
      <div className="relative overflow-hidden glass-panel rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl mb-8 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <img
            src="./cover.jpg"
            alt="Couverture L'Avenir en commun"
            className="w-48 sm:w-56 mx-auto rounded-2xl shadow-2xl mb-6 border-2 border-purple-500/40"
          />
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            L'Avenir en commun
          </h1>
          <p className="text-sm sm:text-base font-bold text-purple-300 mt-1.5">
            Le programme de gouvernement de la Nouvelle France
          </p>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Jean-Luc Mélenchon &bull; Coordination : Clémence Guetté &amp; Hadrien Clouet
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-5 text-[11px] font-bold">
            <span className="bg-purple-950/80 border border-purple-500/30 text-purple-200 px-3 py-1 rounded-full">6 Parties</span>
            <span className="bg-purple-950/80 border border-purple-500/30 text-purple-200 px-3 py-1 rounded-full">23 Chapitres</span>
            <span className="bg-purple-950/80 border border-purple-500/30 text-purple-200 px-3 py-1 rounded-full">111 Fiches</span>
            <span className="bg-purple-950/80 border border-purple-500/30 text-amber-300 px-3 py-1 rounded-full">1 069 Mesures</span>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <section id="reader-intro" className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-xl mb-8">
        <span className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-1">
          Préface &bull; Jean-Luc Mélenchon
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mb-6">
          {data.introduction.title}
        </h2>

        {data.introduction.preamble.length > 0 && (
          <div className={`space-y-4 text-slate-200 mb-8 italic border-l-2 border-purple-500/50 pl-4 ${textSizeClasses[fontSize]}`}>
            {data.introduction.preamble.map((para, i) => (
              <p key={i}>« {para} »</p>
            ))}
          </div>
        )}

        <div className="space-y-8">
          {data.introduction.sections.map((sec, idx) => (
            <div key={idx} className="border-t border-purple-900/50 pt-6">
              <h3 className="text-lg font-black text-purple-200 mb-3">
                {sec.title}
              </h3>
              <div className={`space-y-3.5 text-slate-300 ${textSizeClasses[fontSize]}`}>
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Continuous Parties & Chapters */}
      {data.parties.map(partie => (
        <section key={partie.id} id={`reader-${partie.id}`} className="mb-10">
          {/* Party Banner */}
          <div className="bg-gradient-to-r from-purple-900 via-[#27074d] to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-500/30 mb-6">
            <span className="text-xs font-black uppercase tracking-widest text-amber-300">
              Partie {partie.number}
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1.5 leading-snug">
              {partie.title}
            </h2>
            {partie.presentation.length > 0 && (
              <div className="mt-4 space-y-2 text-xs sm:text-sm text-purple-200 leading-relaxed font-normal border-t border-purple-800/60 pt-4">
                {partie.presentation.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </div>

          {/* Chapters */}
          <div className="space-y-8">
            {partie.chapters.map(chap => (
              <div
                key={chap.id}
                id={`reader-${chap.id}`}
                className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-md"
              >
                <div className="border-b border-purple-900/50 pb-4 mb-6">
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider block mb-1">
                    Chapitre {chap.number}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {chap.title}
                  </h3>
                </div>

                {/* Chapter Sections */}
                <div className="space-y-8 divide-y divide-purple-900/30">
                  {chap.sections.map((sec, sIdx) => (
                    <div key={sec.id} className={sIdx > 0 ? "pt-6" : ""}>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-black text-purple-200 bg-purple-900/70 border border-purple-500/40 px-2.5 py-0.5 rounded-full">
                          Fiche #{sec.globalIndex}
                        </span>
                        <button
                          onClick={() => onOpenSectionModal(sec)}
                          className="text-xs font-bold text-amber-300 hover:text-white"
                        >
                          Fiche complète &rarr;
                        </button>
                      </div>

                      <h4 className="text-base font-extrabold text-white mb-2 leading-snug">
                        {sec.title}
                      </h4>

                      {sec.intro && (
                        <p className={`text-slate-300 italic mb-4 bg-purple-950/30 p-3.5 rounded-xl border border-purple-800/30 ${textSizeClasses[fontSize]}`}>
                          « {sec.intro} »
                        </p>
                      )}

                      {sec.mesureCle && (
                        <div className="bg-gradient-to-r from-purple-950/90 to-indigo-950/80 border-l-4 border-amber-400 p-4 rounded-r-xl my-3.5 shadow-md">
                          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300 mb-1">
                            <IconStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>Mesure Clé Phare</span>
                          </div>
                          <p className={`font-bold text-white ${textSizeClasses[fontSize]}`}>
                            {sec.mesureCle}
                          </p>
                        </div>
                      )}

                      {sec.mesures.length > 0 && (
                        <ol className="space-y-2 mt-3">
                          {sec.mesures.map((m, mIdx) => (
                            <li
                              key={mIdx}
                              className={`flex items-start gap-2.5 text-slate-200 ${textSizeClasses[fontSize]}`}
                            >
                              <span className="flex-shrink-0 w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] aspect-square rounded-full bg-purple-900/80 text-purple-200 font-black text-[11px] flex items-center justify-center mt-0.5 border border-purple-700/50 select-none">
                                {mIdx + 1}
                              </span>
                              <span>{m}</span>
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
