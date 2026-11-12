import type { MultiAlertConfig } from '../types/programme';
import { type FontSizePreference } from '../services/accessibility';
import {
  IconClose,
  IconBell,
  IconArrowLeft,
  IconChevronRight,
  IconRefresh,
  IconBookOpen,
  IconShare,
  IconMegaphone,
  IconCalendar
} from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertConfig: MultiAlertConfig;
  onOpenAlerts: () => void;
  onOpenUpdates: () => void;
  onOpenShare: () => void;
  onOpenSocial: () => void;
  onOpenIosInstall?: () => void;
  onOpenSimulator?: () => void;
  onOpenEvents?: () => void;
  currentVersion?: string;
  fontSizePreference?: FontSizePreference;
  onFontSizeChange?: (pref: FontSizePreference) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  alertConfig,
  onOpenAlerts,
  onOpenUpdates,
  onOpenShare,
  onOpenSocial,
  onOpenIosInstall,
  onOpenSimulator,
  onOpenEvents,
  currentVersion = 'v1.0.32',
  fontSizePreference = 'normal',
  onFontSizeChange
}: SettingsModalProps) => {
  if (!isOpen) return null;

  const activeAlertsCount = alertConfig.globalEnabled
    ? alertConfig.schedules.filter(s => s.enabled).length
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-gradient-to-b from-[#180330] via-[#0f0122] to-[#070014] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-purple-800/40 flex items-center justify-between bg-[#120126]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center p-1.5 shadow-inner">
              <img src="./logo-fi.png" alt="Phi LFI" className="w-full h-full object-contain drop-shadow" />
            </div>
            <div>
              <h2 className="font-black text-lg text-white uppercase tracking-wider">
                Paramètres
              </h2>
              <p className="text-xs text-purple-300 font-semibold">
                L'Avenir en commun • 2027
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-200 hover:text-white flex items-center justify-center transition-all active:scale-90"
            aria-label="Fermer"
          >
            <IconClose size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 py-6 space-y-4 flex-1">
          {/* Card 1: Alertes & Notifications */}
          <div
            onClick={onOpenAlerts}
            className="p-4 rounded-2xl bg-[#1b0833] border border-purple-500/30 hover:border-purple-400/60 transition-all cursor-pointer group shadow-lg active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-xl text-amber-300 shadow-md">
                  <IconBell size={20} />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white group-hover:text-purple-200 transition-colors flex items-center gap-2">
                    <span>Gestion des Alertes &amp; Rappels</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        activeAlertsCount > 0
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {activeAlertsCount > 0 ? `${activeAlertsCount} active${activeAlertsCount > 1 ? 's' : ''}` : 'Désactivées'}
                    </span>
                  </div>
                  <div className="text-xs text-purple-300/80 mt-0.5">
                    Heures personnalisées, fiches par thème, notifications Android &amp; in-app
                  </div>
                </div>
              </div>

              <div className="text-purple-400 group-hover:text-amber-300 transition-colors">
                <IconChevronRight size={18} />
              </div>
            </div>
          </div>

          {/* Card: Accessibilité & Taille de Police */}
          <div className="p-4 rounded-2xl bg-[#1b0833] border border-purple-500/30 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl text-white shadow-md flex items-center justify-center w-11 h-11 flex-shrink-0">
                  <span className="text-base font-black">Aa</span>
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Accessibilité &amp; Taille du texte</span>
                  </div>
                  <div className="text-xs text-purple-300/80 mt-0.5">
                    Ajustez la taille des caractères pour un meilleur confort de lecture
                  </div>
                </div>
              </div>
            </div>

            {/* 3 buttons: Normal / Grand / Très Grand */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => onFontSizeChange?.('normal')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                  fontSizePreference === 'normal'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md ring-1 ring-purple-400/60'
                    : 'bg-[#120326] text-purple-300 border-purple-900/60 hover:border-purple-600 hover:text-white'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block text-xs font-semibold">Normal</span>
                <span className="block text-[10px] text-purple-300 opacity-80">100%</span>
              </button>

              <button
                type="button"
                onClick={() => onFontSizeChange?.('large')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                  fontSizePreference === 'large'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md ring-1 ring-purple-400/60'
                    : 'bg-[#120326] text-purple-300 border-purple-900/60 hover:border-purple-600 hover:text-white'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block text-sm font-semibold">Grand</span>
                <span className="block text-[10px] text-purple-300 opacity-80">+15%</span>
              </button>

              <button
                type="button"
                onClick={() => onFontSizeChange?.('xlarge')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border text-center ${
                  fontSizePreference === 'xlarge'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md ring-1 ring-purple-400/60'
                    : 'bg-[#120326] text-purple-300 border-purple-900/60 hover:border-purple-600 hover:text-white'
                }`}
                style={{ touchAction: 'manipulation' }}
              >
                <span className="block text-base font-semibold">Très Grand</span>
                <span className="block text-[10px] text-purple-300 opacity-80">+30%</span>
              </button>
            </div>
          </div>

          {/* Card: Agenda des événements & Réunions */}
          {onOpenEvents && (
            <div
              onClick={onOpenEvents}
              className="p-4 rounded-2xl bg-[#1b0833] border border-purple-500/30 hover:border-amber-400/60 transition-all cursor-pointer group shadow-lg active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-tr from-amber-500 to-purple-600 rounded-xl text-white shadow-md">
                    <IconCalendar size={20} />
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                      <span>Agenda &amp; Réunions publiques</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                        Calendrier
                      </span>
                    </div>
                    <div className="text-xs text-purple-300/80 mt-0.5">
                      Meetings nationaux, réunions citoyennes, tractages et calendrier
                    </div>
                  </div>
                </div>

                <div className="text-purple-400 group-hover:text-amber-300 transition-colors">
                  <IconChevronRight size={18} />
                </div>
              </div>
            </div>
          )}

          {/* Card: Simulateur d'impôts & succession */}
          {onOpenSimulator && (
            <div
              onClick={onOpenSimulator}
              className="p-4 rounded-2xl bg-[#1b0833] border border-emerald-500/30 hover:border-emerald-400/60 transition-all cursor-pointer group shadow-lg active:scale-[0.99]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-xl text-white shadow-md">
                    <span className="text-xl leading-none">💼</span>
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2">
                      <span>Simulateur d'impôts &amp; succession</span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        14 tranches
                      </span>
                    </div>
                    <div className="text-xs text-purple-300/80 mt-0.5">
                      Révolution fiscale LFI : calculez vos impôts et vos droits de succession
                    </div>
                  </div>
                </div>

                <div className="text-purple-400 group-hover:text-emerald-300 transition-colors">
                  <IconChevronRight size={18} />
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Partager l'application & QR Code */}
          <div
            onClick={onOpenShare}
            className="p-4 rounded-2xl bg-[#1b0833] border border-purple-500/30 hover:border-amber-400/60 transition-all cursor-pointer group shadow-lg active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-amber-500 to-rose-600 rounded-xl text-white shadow-md">
                  <IconShare size={20} />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                    <span>Partager l'application &amp; QR Code</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      Nouveau
                    </span>
                  </div>
                  <div className="text-xs text-purple-300/80 mt-0.5">
                    Lien de téléchargement &amp; flash code pour militants et proches
                  </div>
                </div>
              </div>

              <div className="text-purple-400 group-hover:text-amber-300 transition-colors">
                <IconChevronRight size={18} />
              </div>
            </div>
          </div>

          {/* Card 3: Installer sur iPhone & iPad (PWA) */}
          <div
            onClick={onOpenIosInstall}
            className="p-4 rounded-2xl bg-[#1b0833] border border-purple-500/30 hover:border-pink-400/60 transition-all cursor-pointer group shadow-lg active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-pink-600 to-rose-600 rounded-xl text-white shadow-md">
                  <span className="text-xl leading-none">📱</span>
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white group-hover:text-pink-200 transition-colors flex items-center gap-2">
                    <span>Installer sur iPhone &amp; iPad</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/30">
                      PWA
                    </span>
                  </div>
                  <div className="text-xs text-purple-300/80 mt-0.5">
                    Guide d'installation plein écran hors-ligne sur Safari (gratuit)
                  </div>
                </div>
              </div>

              <div className="text-purple-400 group-hover:text-pink-300 transition-colors">
                <IconChevronRight size={18} />
              </div>
            </div>
          </div>

          {/* Card 4: Réseaux Sociaux LFI & Action Populaire */}
          <div
            onClick={onOpenSocial}
            className="p-4 rounded-2xl bg-[#1b0833] border border-purple-500/30 hover:border-indigo-400/60 transition-all cursor-pointer group shadow-lg active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white shadow-md">
                  <IconMegaphone size={20} />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white group-hover:text-purple-200 transition-colors flex items-center gap-2">
                    <span>Réseaux officiels &amp; Action Populaire</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                      LFI
                    </span>
                  </div>
                  <div className="text-xs text-purple-300/80 mt-0.5">
                    YouTube, TikTok, Telegram, Discord et l'application Action Populaire
                  </div>
                </div>
              </div>

              <div className="text-purple-400 group-hover:text-amber-300 transition-colors">
                <IconChevronRight size={18} />
              </div>
            </div>
          </div>

          {/* Card 5: Mises à jour */}
          <div
            onClick={onOpenUpdates}
            className="p-4 rounded-2xl bg-[#1b0833] border border-purple-500/30 hover:border-purple-400/60 transition-all cursor-pointer group shadow-lg active:scale-[0.99]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-tr from-indigo-600 to-cyan-600 rounded-xl text-white shadow-md">
                  <IconRefresh size={20} />
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white group-hover:text-purple-200 transition-colors flex items-center gap-2">
                    <span>Vérifier les Mises à jour</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      {currentVersion}
                    </span>
                  </div>
                  <div className="text-xs text-purple-300/80 mt-0.5">
                    Historique des versions et téléchargement direct du dernier APK
                  </div>
                </div>
              </div>

              <div className="text-purple-400 group-hover:text-amber-300 transition-colors">
                <IconChevronRight size={18} />
              </div>
            </div>
          </div>

          {/* Info Badge */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-300/80 leading-relaxed">
            <div className="font-bold text-purple-200 mb-1 flex items-center gap-1.5">
              <IconBookOpen size={14} className="text-purple-400" />
              <span>Programme officiel 2027</span>
            </div>
            Application citoyenne et militante pour la 6ᵉ République, l'écologie populaire et le partage des richesses.
          </div>
        </div>

        {/* Footer with "By HO" Signature */}
        <div className="px-6 py-4 bg-[#0d001a] border-t border-purple-900/40 flex items-center justify-between">
          <span className="text-[11px] text-purple-400/70 font-mono">
            {currentVersion} &bull; Édition 2027
          </span>

          <span className="text-xs font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 uppercase shadow-sm">
            By HO
          </span>
        </div>
      </div>
    </div>
  );
};
