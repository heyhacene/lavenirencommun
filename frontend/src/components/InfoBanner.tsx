import React, { useState, useEffect } from 'react';
import type { BroadcastBanner } from '../types/events';
import { IconClose, IconCalendar, IconMegaphone } from './Icons';

interface InfoBannerProps {
  banner: BroadcastBanner | null;
  onOpenEvents: () => void;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ banner, onOpenEvents }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('lfi_banner_dismissed');
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    } catch (e) {
      // Ignorer
    }
  }, []);

  if (!banner || !banner.enabled || isDismissed) {
    return null;
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    try {
      sessionStorage.setItem('lfi_banner_dismissed', 'true');
    } catch (err) {
      // Ignorer
    }
  };

  const getStyle = () => {
    switch (banner.type) {
      case 'urgent':
        return {
          bg: 'bg-gradient-to-r from-rose-900/90 via-red-900/90 to-purple-950/90 border-rose-500/50',
          badge: 'bg-rose-600 text-white',
          textColor: 'text-rose-100',
          icon: <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping inline-block" />
        };
      case 'event':
        return {
          bg: 'bg-gradient-to-r from-purple-900/90 via-fuchsia-950/90 to-[#180330]/90 border-purple-500/40',
          badge: 'bg-purple-600 text-white',
          textColor: 'text-purple-100',
          icon: <IconCalendar size={14} className="text-amber-300" />
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-indigo-950/90 via-purple-950/90 to-[#120025]/90 border-indigo-500/40',
          badge: 'bg-indigo-600 text-white',
          textColor: 'text-indigo-100',
          icon: <IconMegaphone size={14} className="text-indigo-300" />
        };
    }
  };

  const current = getStyle();

  return (
    <div
      onClick={onOpenEvents}
      className={`w-full py-2.5 px-3.5 sm:px-4 border-b backdrop-blur-md cursor-pointer transition-all flex items-center justify-between gap-3 shadow-md z-30 ${current.bg}`}
      style={{ touchAction: 'manipulation' }}
      title="Cliquer pour voir les détails de l'événement"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="flex items-center justify-center p-1 rounded-lg bg-black/30 flex-shrink-0">
          {current.icon}
        </div>
        <p className={`text-xs sm:text-sm font-bold truncate ${current.textColor}`}>
          {banner.message}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="hidden sm:inline-flex text-[11px] font-black uppercase tracking-wider text-amber-300 bg-black/40 px-2 py-0.5 rounded-lg border border-purple-500/30">
          {banner.linkText || "Voir l'agenda ➔"}
        </span>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 text-purple-300/80 hover:text-white rounded-lg hover:bg-black/40 transition-colors"
          style={{ touchAction: 'manipulation' }}
          title="Fermer le bandeau"
        >
          <IconClose size={15} />
        </button>
      </div>
    </div>
  );
};
