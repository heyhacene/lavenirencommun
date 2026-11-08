import {
  IconClose,
  IconArrowLeft,
  IconExternalLink,
  IconMegaphone,
  IconYouTube,
  IconTikTok,
  IconInstagram,
  IconTwitter,
  IconTelegram,
  IconFacebook,
  IconTwitch,
  IconDiscord,
  IconGlobe
} from './Icons';

interface SocialNetworksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SocialLink {
  name: string;
  handle: string;
  desc: string;
  url: string;
  icon: React.ReactNode;
  themeColor: string;
  badge?: string;
}

export const SocialNetworksModal = ({ isOpen, onClose }: SocialNetworksModalProps) => {
  if (!isOpen) return null;

  const socialLinks: SocialLink[] = [
    {
      name: 'YouTube LFI',
      handle: '@lafranceinsoumise',
      desc: 'Meetings, discours, commissions parlementaires et émissions officielles.',
      url: 'https://www.youtube.com/c/lafranceinsoumise',
      icon: <IconYouTube size={20} className="text-red-500" />,
      themeColor: 'border-red-500/30 hover:border-red-500/60 bg-red-950/20'
    },
    {
      name: 'YouTube Jean-Luc Mélenchon',
      handle: '@JeanLucMelenchon',
      desc: 'Revues de la semaine, entretiens approfondis et réflexions philosophiques.',
      url: 'https://www.youtube.com/c/JeanLucMelenchon',
      icon: <IconYouTube size={20} className="text-red-400" />,
      themeColor: 'border-red-500/30 hover:border-red-500/60 bg-red-950/20'
    },
    {
      name: 'TikTok',
      handle: '@lafranceinsoumise',
      desc: 'Interventions chocs, décryptages synthétiques et actualités en vidéo courte.',
      url: 'https://www.tiktok.com/@lafranceinsoumise',
      icon: <IconTikTok size={20} className="text-cyan-400" />,
      themeColor: 'border-cyan-500/30 hover:border-cyan-400/60 bg-slate-900/60'
    },
    {
      name: 'Instagram',
      handle: '@lafranceinsoumise',
      desc: 'Infographies de propositions, coulisses de campagne et visuels militants.',
      url: 'https://www.instagram.com/lafranceinsoumise/',
      icon: <IconInstagram size={20} className="text-pink-500" />,
      themeColor: 'border-pink-500/30 hover:border-pink-400/60 bg-pink-950/20'
    },
    {
      name: 'X (ex-Twitter)',
      handle: '@FranceInsoumise',
      desc: 'Réactions en direct, prises de position officielles et relais des mobilisations.',
      url: 'https://twitter.com/FranceInsoumise',
      icon: <IconTwitter size={20} className="text-slate-200" />,
      themeColor: 'border-slate-500/30 hover:border-slate-400/60 bg-slate-900/60'
    },
    {
      name: 'Telegram',
      handle: '@lafranceinsoumise',
      desc: 'Canal direct sans algorithme : alertes, communiqués et documents officiels.',
      url: 'https://t.me/lafranceinsoumise',
      icon: <IconTelegram size={20} className="text-sky-400" />,
      themeColor: 'border-sky-500/30 hover:border-sky-400/60 bg-sky-950/20'
    },
    {
      name: 'Facebook',
      handle: 'La France Insoumise',
      desc: 'Diffusions en direct, articles de fond et échanges avec la communauté.',
      url: 'https://www.facebook.com/lafranceinsoumise/',
      icon: <IconFacebook size={20} className="text-blue-500" />,
      themeColor: 'border-blue-500/30 hover:border-blue-400/60 bg-blue-950/20'
    },
    {
      name: 'Twitch',
      handle: 'jlmelenchon',
      desc: 'Émissions interactives et débats en direct.',
      url: 'https://www.twitch.tv/jlmelenchon',
      icon: <IconTwitch size={20} className="text-purple-400" />,
      themeColor: 'border-purple-500/30 hover:border-purple-400/60 bg-purple-950/20'
    },
    {
      name: 'Le Discord Insoumis',
      handle: 'discord.lafranceinsoumise.fr',
      desc: 'Espace citoyen de débat, d’entraide et d’organisation collaborative.',
      url: 'https://discord.lafranceinsoumise.fr/',
      icon: <IconDiscord size={20} className="text-indigo-400" />,
      themeColor: 'border-indigo-500/30 hover:border-indigo-400/60 bg-indigo-950/20'
    },
    {
      name: "L'Insoumission (Média)",
      handle: 'linsoumission.fr',
      desc: 'Le journal en ligne d’actualité sociale et politique du mouvement.',
      url: 'https://linsoumission.fr/',
      icon: <IconGlobe size={20} className="text-amber-400" />,
      themeColor: 'border-amber-500/30 hover:border-amber-400/60 bg-amber-950/20'
    },
    {
      name: 'Institut La Boétie',
      handle: 'institutlaboetie.fr',
      desc: 'Fondation d’éducation populaire, de recherche et de pensée critique.',
      url: 'https://institutlaboetie.fr/',
      icon: <IconGlobe size={20} className="text-emerald-400" />,
      themeColor: 'border-emerald-500/30 hover:border-emerald-400/60 bg-emerald-950/20'
    }
  ];

  return (
    <div className="fixed inset-0 z-[105] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md text-white">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-[#140626] border border-purple-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
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
              <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white shadow-md">
                <IconMegaphone size={18} />
              </div>
              <div>
                <h2 className="text-base font-black tracking-tight text-white leading-tight">
                  Réseaux &amp; Action Populaire
                </h2>
                <p className="text-[11px] text-purple-300/80 font-semibold">
                  Espaces officiels de La France Insoumise
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
          {/* SPECIAL FOCUS CARD: ACTION POPULAIRE */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#2a0845] via-[#1b0533] to-[#120224] border-2 border-amber-400/50 shadow-2xl space-y-3.5 relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                L'application citoyenne officielle
              </div>
              <span className="text-xs font-bold text-purple-300/80">Réseau d'action</span>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 font-black shadow-lg flex-shrink-0">
                <IconMegaphone size={26} className="text-slate-950" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight leading-snug">
                  Action Populaire
                </h3>
                <p className="text-xs text-purple-200 font-medium mt-1 leading-relaxed">
                  Le réseau social d'action des insoumis·es. Rejoignez ou créez votre groupe local, participez aux événements, tractages, collages et assemblées citoyennes près de chez vous !
                </p>
              </div>
            </div>

            {/* Action Populaire Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <a
                href="https://actionpopulaire.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 hover:text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <span>Rejoindre Action Populaire (Web)</span>
                <IconExternalLink size={14} />
              </a>

              <div className="flex items-center gap-2">
                <a
                  href="https://play.google.com/store/apps/details?id=fr.actionpopulaire.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-3.5 py-3 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  title="Télécharger sur Android"
                >
                  <span>Google Play</span>
                </a>
                <a
                  href="https://apps.apple.com/fr/app/action-populaire/id1552554708"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-3.5 py-3 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  title="Télécharger sur iPhone"
                >
                  <span>App Store</span>
                </a>
              </div>
            </div>
          </div>

          {/* Social Networks List Header */}
          <div className="flex items-center justify-between px-1 pt-1">
            <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Comptes &amp; Plateformes officielles LFI
            </span>
            <span className="text-[11px] text-purple-400/80 font-semibold">
              {socialLinks.length} réseaux
            </span>
          </div>

          {/* Grid of Social Links */}
          <div className="space-y-2.5">
            {socialLinks.map(s => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group shadow-md hover:scale-[1.01] active:scale-[0.99] ${s.themeColor}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0">
                    {s.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                        {s.name}
                      </span>
                      <span className="text-[10px] font-mono text-purple-300/70 truncate">
                        {s.handle}
                      </span>
                    </div>
                    <p className="text-xs text-purple-200/80 line-clamp-1 mt-0.5">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <div className="p-2 text-purple-400 group-hover:text-white flex-shrink-0">
                  <IconExternalLink size={16} />
                </div>
              </a>
            ))}
          </div>

          {/* Official Page Reference Link */}
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-center space-y-2">
            <p className="text-xs text-purple-300">
              Retrouvez l'annuaire complet des réseaux sur le site officiel de La France Insoumise :
            </p>
            <a
              href="https://lafranceinsoumise.fr/les-reseaux-sociaux-de-la-france-insoumise/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white underline"
            >
              <span>lafranceinsoumise.fr/les-reseaux-sociaux-de-la-france-insoumise</span>
              <IconExternalLink size={12} />
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
