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
          <IconChevronRight size={14} className={`transition-transform ${showToc ? 'rotate-90' : ''}`} />
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
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#140626] border border-purple-500/40 rounded-3xl w-full max-w-lg max-h-[82vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-purple-950 to-[#1d0638]">
              <h3 className="font-black text-sm text-white">Sommaire de L'Avenir en commun</h3>
              <button onClick={() => setShowToc(false)} className="text-purple-300 hover:text-white">
                <IconClose size={20} />
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
      <div className="relative overflow-hidden stitch-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl mb-8 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <img
            src="/cover.jpg"
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
            Par <strong>Jean-Luc Mélenchon</strong> &bull; Coordination : <strong>Clémence Guetté &amp; Hadrien Clouet</strong>
          </p>
          <div className="inline-block mt-4 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-xs font-bold text-purple-200">
            Édition Officielle 2026-2027 &bull; Élection présidentielle 2027
          </div>
        </div>
      </div>

      {/* Reader Intro Content */}
      <section id="reader-intro" className="stitch-card rounded-3xl p-6 sm:p-8 border border-purple-500/20 shadow-xl mb-8 space-y-4">
        <h2 className="text-xl font-black text-white tracking-tight border-b border-purple-500/20 pb-3">
          {data.preface.title}
        </h2>
        <div className="space-y-3.5 text-slate-200 leading-relaxed text-sm sm:text-base font-normal">
          {data.preface.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="text-right pt-2 font-bold text-amber-300 text-sm">
          — {data.preface.author}
        </div>
      </section>

      {/* Parties & Chapters Continuous Flow */}
      <div className="space-y-12">
        {data.parties.map(p => (
          <section key={p.id} id={`reader-${p.id}`} className="space-y-6">
            {/* Party Header Banner */}
            <div className="bg-gradient-to-r from-purple-950 via-[#1e0741] to-[#120025] border-l-4 border-purple-400 p-6 rounded-2xl shadow-xl">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400 block mb-1">
                Grande Partie {p.number}
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                {p.title}
              </h2>
            </div>

            {/* Chapters inside Party */}
            <div className="space-y-8 pl-1 sm:pl-3">
              {p.chapters.map(c => (
                <div key={c.id} id={`reader-${c.id}`} className="space-y-4">
                  <div className="border-b border-purple-500/20 pb-2">
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                      Chapitre {c.number}
                    </span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      {c.title}
                    </h3>
                  </div>

                  {/* Sections / Fiches inside Chapter */}
                  <div className="space-y-4">
                    {c.sections.map(sec => (
                      <article
                        key={sec.id}
                        className="stitch-card rounded-2xl p-5 border border-purple-800/40 hover:border-purple-600/50 transition-all shadow-md"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                          <span className="font-black text-purple-200 bg-purple-900/80 px-2.5 py-0.5 rounded-full border border-purple-500/40">
                            Fiche #{sec.globalIndex}
                          </span>
                          <span className="text-slate-400 text-[11px] font-medium">
                            {sec.totalMesuresCount} mesures
                          </span>
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
                          <div className="stitch-mesure-phare my-3.5 shadow-md">
                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-300 mb-1">
                              <IconStar size={14} className="text-amber-400" />
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
                                <span className="text-purple-400 font-black text-xs mt-1">•</span>
                                <span>{m}</span>
                              </li>
                            ))}
                          </ol>
                        )}

                        <div className="mt-4 pt-3 border-t border-purple-900/40 flex justify-end">
                          <button
                            onClick={() => onOpenSectionModal(sec)}
                            className="text-xs font-bold text-purple-300 hover:text-amber-300 flex items-center gap-1 transition-colors"
                          >
                            <span>Consulter la fiche détaillée</span>
                            <IconChevronRight size={14} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
