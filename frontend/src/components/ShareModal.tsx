import { useState } from 'react';
import { QRCodeSVG } from './QRCodeSVG';
import {
  IconClose,
  IconArrowLeft,
  IconShare,
  IconCopy,
  IconCheck,
  IconTelegram,
  IconTwitter,
  IconExternalLink
} from './Icons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal = ({ isOpen, onClose }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const downloadUrl = 'https://github.com/heyhacene/lavenirencommun/releases/latest';
  const shareText = "Découvrez l'application officielle du programme L'Avenir en commun (Jean-Luc Mélenchon 2027) : 111 fiches thématiques, 1 069 mesures, chiffrage et alertes quotidiennes ! Téléchargez-la ici :";
  const fullShareMessage = `${shareText} ${downloadUrl}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "L'Avenir en commun • Application 2027",
          text: shareText,
          url: downloadUrl
        });
      } catch (e) {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareChannels = [
    {
      name: 'WhatsApp',
      icon: '💬',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareMessage)}`,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white'
    },
    {
      name: 'Telegram',
      icon: <IconTelegram size={16} />,
      url: `https://t.me/share/url?url=${encodeURIComponent(downloadUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-sky-600 hover:bg-sky-500 text-white'
    },
    {
      name: 'X (Twitter)',
      icon: <IconTwitter size={16} />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(fullShareMessage)}`,
      color: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
    },
    {
      name: 'SMS',
      icon: '✉️',
      url: `sms:?body=${encodeURIComponent(fullShareMessage)}`,
      color: 'bg-purple-800 hover:bg-purple-700 text-white'
    },
    {
      name: 'E-mail',
      icon: '📧',
      url: `mailto:?subject=${encodeURIComponent("Application L'Avenir en commun 2027")}&body=${encodeURIComponent(fullShareMessage)}`,
      color: 'bg-indigo-700 hover:bg-indigo-600 text-white'
    }
  ];

  return (
    <div className="fixed inset-0 z-[105] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md text-white">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] bg-[#140626] border border-purple-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
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
              <div className="p-2 bg-gradient-to-tr from-amber-500 to-rose-600 rounded-xl text-white shadow-md">
                <IconShare size={18} />
              </div>
              <div>
                <h2 className="text-base font-black tracking-tight text-white leading-tight">
                  Partager l'application
                </h2>
                <p className="text-[11px] text-purple-300/80 font-semibold">
                  Diffusez le programme officiel 2027
                </p>
              </div>
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
        <div className="overflow-y-auto px-5 py-5 space-y-5 flex-1">
          {/* Main Action Share Button */}
          <button
            onClick={handleNativeShare}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 hover:text-white font-black text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-xl active:scale-98 cursor-pointer"
          >
            <IconShare size={20} />
            <span>Partager par le moyen de votre choix</span>
          </button>

          {/* QR Code Section */}
          <div className="bg-[#180830] border border-purple-500/30 rounded-3xl p-5 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-1.5">
              <span>📱</span>
              <span>Flash code de téléchargement</span>
            </span>
            <p className="text-xs text-purple-200/90 max-w-xs mb-4">
              Faites flasher ce QR code à un camarade pour télécharger directement l'application :
            </p>

            <div className="p-3 bg-white/5 rounded-3xl border border-purple-400/30 shadow-inner">
              <QRCodeSVG text={downloadUrl} size={190} />
            </div>

            {/* URL Display with Copy Button */}
            <div className="mt-4 w-full bg-[#100322] border border-purple-700/40 rounded-xl p-2.5 flex items-center justify-between gap-2">
              <span className="text-xs text-purple-200 font-mono truncate select-all">
                {downloadUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all flex-shrink-0 active:scale-95 shadow-sm"
                title="Copier le lien"
              >
                {copied ? (
                  <>
                    <IconCheck size={14} className="text-emerald-300" />
                    <span>Copié !</span>
                  </>
                ) : (
                  <>
                    <IconCopy size={14} />
                    <span>Copier</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Share Channels */}
          <div className="space-y-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-purple-300 block px-1">
              Partage direct :
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {shareChannels.map(ch => (
                <a
                  key={ch.name}
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-md active:scale-95 ${ch.color}`}
                >
                  <span className="flex-shrink-0">{ch.icon}</span>
                  <span>{ch.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Direct APK Link Box */}
          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between text-xs text-purple-200">
            <div>
              <div className="font-bold text-white">Lien direct vers l'APK</div>
              <div className="text-[11px] text-purple-300/80">Fichier d'installation autonome</div>
            </div>
            <a
              href="https://github.com/heyhacene/lavenirencommun/releases/latest/download/lavenirencommun.apk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-purple-900/80 hover:bg-purple-800 text-amber-300 hover:text-white rounded-lg border border-purple-600/40 font-bold flex items-center gap-1 transition-all active:scale-95"
            >
              <span>Télécharger</span>
              <IconExternalLink size={13} />
            </a>
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
