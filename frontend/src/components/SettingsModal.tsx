import type { MultiAlertConfig } from '../types/programme';
import {
  IconClose,
  IconBell,
  IconArrowLeft,
  IconChevronRight,
  IconRefresh,
  IconBookOpen,
  IconShare,
  IconMegaphone
} from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertConfig: MultiAlertConfig;
  onOpenAlerts: () => void;
  onOpenUpdates: () => void;
  onOpenShare: () => void;
  onOpenSocial: () => void;
  currentVersion?: string;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  alertConfig,
  onOpenAlerts,
  onOpenUpdates,
  onOpenShare,
  onOpenSocial,
  currentVersion = 'v1.0.18'
}: SettingsModalProps) => {
  if (!isOpen) return null;

  const activeAlertsCount = alertConfig.globalEnabled
    ? alertConfig.schedules.filter(s => s.enabled).length
    : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md text-white">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] bg-[#140626] border border-purple-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 px-5 py-4 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-[#20053b] via-[#140228] to-[#0c0019]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95"
            >
              <IconArrowLeft size={16} />
              <span>Retour</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2e0059] via-[#150033] to-[#4c0297] border border-purple-400/40 flex items-center justify-center shadow-md p-1">
                <img src="/logo-fi.png" alt="Phi LFI" className="w-full h-full object-contain drop-shadow" />
              </div>
              <h2 className="text-base font-black tracking-tight text-white leading-tight">
                Paramètres
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-colors"
            title="Fermer"
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

          {/* Card 2: Partager l'application & QR Code (User Requirement) */}
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

          {/* Card 3: Réseaux Sociaux LFI & Action Populaire (User Requirement) */}
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

          {/* Card 4: Mises à jour */}
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
                    <span>Mises à jour de l'application</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-500/30">
                      {currentVersion}
                    </span>
                  </div>
                  <div className="text-xs text-purple-300/80 mt-0.5">
                    Vérifier la disponibilité d'une nouvelle version du programme
                  </div>
                </div>
              </div>

              <div className="text-purple-400 group-hover:text-amber-300 transition-colors">
                <IconChevronRight size={18} />
              </div>
            </div>
          </div>

          {/* Card 5: À propos & Présentation du Programme */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider text-purple-300">
              <IconBookOpen size={16} className="text-purple-400" />
              <span>À propos du Programme</span>
            </div>

            <div className="space-y-1.5 text-xs text-purple-200/90 leading-relaxed">
              <p>
                <strong className="text-white">L'Avenir en commun</strong> est le programme de gouvernement porté par <strong>Jean-Luc Mélenchon</strong> pour l'élection présidentielle 2027.
              </p>
              <p className="text-purple-300/80">
                Coordination du programme : <strong>Clémence Guetté</strong> &amp; <strong>Hadrien Clouet</strong>.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 bg-purple-900/40 rounded-xl border border-purple-700/30">
                <div className="text-base font-black text-amber-300">111</div>
                <div className="text-[10px] font-bold text-purple-300 uppercase">Fiches</div>
              </div>
              <div className="p-2 bg-purple-900/40 rounded-xl border border-purple-700/30">
                <div className="text-base font-black text-purple-200">1 069</div>
                <div className="text-[10px] font-bold text-purple-300 uppercase">Mesures</div>
              </div>
              <div className="p-2 bg-purple-900/40 rounded-xl border border-purple-700/30">
                <div className="text-base font-black text-rose-300">100 Md€</div>
                <div className="text-[10px] font-bold text-purple-300 uppercase">Urgence</div>
              </div>
            </div>
          </div>

          {/* USER EXPLICIT REQUIREMENT: "Je veux signer 'By HO' en bas du menu paramètres" */}
          <div className="pt-6 pb-2 text-center border-t border-purple-800/40">
            <p className="text-xs font-semibold text-purple-300/80">
              Application pour l'appropriation populaire du programme
            </p>
            <p className="text-base font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300 mt-1">
              By HO
            </p>
            <p className="text-[10px] text-purple-400/60 mt-0.5">
              L'Avenir en commun • 2027
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#16062b] border-t border-purple-500/20 px-5 py-3.5 flex items-center justify-end pb-[max(1rem,env(safe-area-inset-bottom,16px))]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
