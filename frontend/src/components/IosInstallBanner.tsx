import React, { useState, useEffect } from 'react';
import { IconShare, IconClose } from './Icons';

interface IosInstallBannerProps {
  onOpenGuide: () => void;
}

export const IosInstallBanner: React.FC<IosInstallBannerProps> = ({ onOpenGuide }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Detect if running on iOS (iPhone/iPad/iPod)
    const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent);
    
    // Detect if already installed / running in standalone mode
    // (navigator as any).standalone is true when running from Home Screen on iOS
    const isStandalone = 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    // Check if dismissed previously
    const isDismissed = localStorage.getItem('aec_ios_install_dismissed') === 'true';

    if (isIos && !isStandalone && !isDismissed) {
      // Delay display slightly so it doesn't clash with loading
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('aec_ios_install_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-lg mx-auto animate-bounce-short">
      <div className="bg-gradient-to-r from-[#2a044e] via-[#1a0134] to-[#3a0640] border border-purple-400/50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-white">
        <div className="flex items-center gap-3 min-w-0" onClick={onOpenGuide} role="button">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 p-1.5 flex items-center justify-center flex-shrink-0 shadow-md">
            <img src="./apple-touch-icon.png" alt="AEC" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-black tracking-tight text-white uppercase flex items-center gap-1.5">
              <span>Installer sur iPhone</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-500/30 text-[10px] text-purple-200 border border-purple-400/30">
                PWA
              </span>
            </p>
            <p className="text-[11px] text-purple-200/90 truncate">
              Touchez <IconShare size={11} className="inline mx-0.5 text-purple-300" /> puis « Sur l'écran d'accueil »
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenGuide}
            className="px-2.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            Guide
          </button>
          <button
            onClick={handleDismiss}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white flex items-center justify-center transition-all"
            aria-label="Fermer la bannière"
          >
            <IconClose size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
