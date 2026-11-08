import React from 'react';
import { IconClose, IconShare, IconPlus, IconCheck } from './Icons';

interface IosInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IosInstallModal: React.FC<IosInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full sm:max-w-md bg-gradient-to-b from-[#180330] via-[#0f0122] to-[#070014] border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-200 hover:text-white flex items-center justify-center transition-all active:scale-90"
          aria-label="Fermer"
        >
          <IconClose size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2e0059] to-[#4c0297] border border-purple-400/40 flex items-center justify-center p-2 shadow-lg flex-shrink-0">
            <img src="./apple-touch-icon.png" alt="AEC" className="w-full h-full object-contain" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight uppercase">
              Installer sur iPhone &amp; iPad
            </h3>
            <p className="text-xs text-purple-300 font-medium">
              Application Web Progressive (PWA) &bull; Gratuit
            </p>
          </div>
        </div>

        {/* Benefits badge */}
        <div className="mb-5 p-3 rounded-2xl bg-purple-950/60 border border-purple-700/40 text-xs text-purple-200 flex items-center gap-2.5">
          <span className="text-base">✨</span>
          <span>
            Plein écran natif, <strong>100% hors-ligne</strong> (sans réseau), accès instantané depuis votre écran d'accueil sans passer par l'App Store.
          </span>
        </div>

        {/* Steps */}
        <div className="space-y-3.5 mb-6 text-sm">
          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-purple-500/20 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-semibold text-white">
                Ouvrez dans Safari
              </p>
              <p className="text-xs text-purple-300/80 mt-0.5">
                Sur votre iPhone, ouvrez cette page dans le navigateur <strong>Safari</strong>.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-purple-500/20 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                Appuyez sur Partager
                <span className="inline-flex items-center justify-center p-1 rounded bg-purple-800/80 text-purple-200 border border-purple-400/40 text-xs">
                  <IconShare size={13} />
                </span>
              </p>
              <p className="text-xs text-purple-300/80 mt-0.5">
                C'est le bouton carré avec une flèche vers le haut ⬆️ situé en bas de l'écran sur iPhone (ou en haut sur iPad).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-purple-500/20 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                « Sur l'écran d'accueil »
                <span className="inline-flex items-center justify-center p-1 rounded bg-purple-800/80 text-purple-200 border border-purple-400/40 text-xs">
                  <IconPlus size={13} />
                </span>
              </p>
              <p className="text-xs text-purple-300/80 mt-0.5">
                Faites défiler le menu d'actions vers le bas et touchez <strong>« Sur l'écran d'accueil »</strong>.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              4
            </div>
            <div>
              <p className="font-semibold text-emerald-200 flex items-center gap-1.5">
                Touchez « Ajouter » <IconCheck size={14} className="text-emerald-400" />
              </p>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                En haut à droite. L'icône de l'application apparaît aussitôt sur l'écran d'accueil de votre iPhone !
              </p>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white font-bold text-sm shadow-lg transition-all active:scale-[0.98]"
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
};
