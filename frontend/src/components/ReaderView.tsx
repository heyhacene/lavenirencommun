import React, { useState } from 'react';
import { ProgrammeData, Section } from '../types/programme';
import { IconChevronRight, IconClose } from './Icons';

interface ReaderViewProps {
  data: ProgrammeData;
  onOpenSectionModal: (section: Section) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({ data, onOpenSectionModal }) => {
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
    <div className="relative max-w-3xl mx-auto pb-24">
      {/* Sticky Reader Controls */}
      <div className="sticky top-14 z-30 bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-200/80 flex items-center justify-between text-xs rounded-b-2xl shadow-sm mb-6">
        <button
          onClick={() => setShowToc(!showToc)}
          className="flex items-center gap-1.5 font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span>📑 Sommaire interactif</span>
          <IconChevronRight className={w-3.5 h-3.5 transition-transform } />
        </button>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setFontSize('normal')}
            className={px-2 py-0.5 rounded font-bold }
          >
            A
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={px-2 py-0.5 rounded font-bold text-sm }
          >
            A+
          </button>
          <button
            onClick={() => setFontSize('xlarge')}
            className={px-2 py-0.5 rounded font-bold text-base }
          >
            A++
          </button>
        </div>
      </div>

      {/* Sommaire Modal / Drawer */}
      {showToc && (
        <div className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-purple-900 text-white">
              <h3 className="font-bold text-sm">Sommaire du Programme</h3>
              <button onClick={() => setShowToc(false)} className="text-white/80 hover:text-white">
                <IconClose className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-3">
              <button
                onClick={() => scrollToAnchor('reader-intro')}
                className="w-full text-left font-bold text-sm text-purple-900 hover:bg-purple-50 p-2 rounded-xl block"
              >
                Introduction : Vers une nouvelle France
              </button>
              {data.parties.map(p => (
                <div key={p.id} className="space-y-1">
                  <button
                    onClick={() => scrollToAnchor(eader-)}
                    className="w-full text-left font-black text-xs uppercase tracking-wider text-purple-900 bg-purple-50/70 p-2 rounded-lg block"
                  >
                    Partie {p.number} • {p.title}
                  </button>
                  <div className="pl-3 space-y-1">
                    {p.chapters.map(c => (
                      <button
                        key={c.id}
                        onClick={() => scrollToAnchor(eader-)}
                        className="w-full text-left text-xs text-slate-700 hover:text-purple-700 hover:bg-slate-50 p-1.5 rounded-lg block"
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

      {/* Book Presentation Cover */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8 text-center">
        <img
          src="/cover.jpg"
          alt="Couverture L'Avenir en commun"
          className="w-48 sm:w-56 mx-auto rounded-2xl shadow-xl mb-6 border border-slate-200"
        />
        <h1 className="text-2xl sm:text-3xl font-black text-purple-950 uppercase tracking-tight">
          L'Avenir en commun
        </h1>
        <p className="text-sm font-semibold text-purple-700 mt-1">
          Le programme de gouvernement de la Nouvelle France
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Jean-Luc Mélenchon &bull; Coordination : Clémence Guetté &amp; Hadrien Clouet
        </p>
        <div className="flex justify-center gap-3 mt-4 text-[11px] text-slate-600 font-medium">
          <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full">6 Parties</span>
          <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full">23 Chapitres</span>
          <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full">111 Fiches</span>
          <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full">1 069 Mesures</span>
        </div>
      </div>

      {/* Introduction */}
      <section id="reader-intro" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-8">
        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
          Préface &bull; Jean-Luc Mélenchon
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">
          {data.introduction.title}
        </h2>

        {data.introduction.preamble.length > 0 && (
          <div className={space-y-4 text-slate-800 mb-8 font-serif }>
            {data.introduction.preamble.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        <div className="space-y-8">
          {data.introduction.sections.map((sec, idx) => (
            <div key={idx} className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-bold text-purple-900 mb-3">
                {sec.title}
              </h3>
              <div className={space-y-3.5 text-slate-700 }>
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
        <section key={partie.id} id={eader-} className="mb-10">
          {/* Party Banner */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
              Partie {partie.number}
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1 leading-snug">
              {partie.title}
            </h2>
            {partie.presentation.length > 0 && (
              <div className="mt-4 space-y-2 text-xs sm:text-sm text-purple-100/90 leading-relaxed font-normal border-t border-purple-800/60 pt-4">
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
                id={eader-}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm"
              >
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-1">
                    Chapitre {chap.number}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {chap.title}
                  </h3>
                </div>

                {/* Chapter Sections */}
                <div className="space-y-8 divide-y divide-slate-100">
                  {chap.sections.map((sec, sIdx) => (
                    <div key={sec.id} className={sIdx > 0 ? "pt-6" : ""}>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full">
                          Fiche #{sec.globalIndex}
                        </span>
                        <button
                          onClick={() => onOpenSectionModal(sec)}
                          className="text-xs font-semibold text-purple-700 hover:text-purple-900"
                        >
                          Ouvrir en popup &rarr;
                        </button>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 mb-2">
                        {sec.title}
                      </h4>

                      {sec.intro && (
                        <p className={	ext-slate-600 italic mb-4 }>
                          « {sec.intro} »
                        </p>
                      )}

                      {sec.mesureCle && (
                        <div className="bg-purple-50 border-l-4 border-purple-700 p-3.5 rounded-r-xl my-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 block mb-1">
                            ★ Mesure Clé Phare
                          </span>
                          <p className={ont-semibold text-purple-950 }>
                            {sec.mesureCle}
                          </p>
                        </div>
                      )}

                      {sec.mesures.length > 0 && (
                        <ol className="space-y-2 mt-3">
                          {sec.mesures.map((m, mIdx) => (
                            <li
                              key={mIdx}
                              className={lex items-start gap-2.5 text-slate-800 }
                            >
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center justify-center mt-0.5">
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
