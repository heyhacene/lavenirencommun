import { useState, useEffect } from 'react';
import {
  IconClose,
  IconCheck,
  IconArrowLeft,
  IconRefresh,
  IconDownload,
  IconExternalLink
} from './Icons';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion?: string;
}

interface ReleaseInfo {
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  apk_url?: string;
  html_url: string;
}

export const UpdateModal = ({
  isOpen,
  onClose,
  currentVersion = 'v1.0.36'
}: UpdateModalProps) => {
  const [loading, setLoading] = useState(false);
  const [release, setRelease] = useState<ReleaseInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  const fetchLatestRelease = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api.github.com/repos/heyhacene/lavenirencommun/releases/latest');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      const apkAsset = data.assets?.find((a: any) => a.name.endsWith('.apk'));
      setRelease({
        tag_name: data.tag_name,
        name: data.name || data.tag_name,
        body: data.body || '',
        published_at: data.published_at,
        apk_url: apkAsset ? apkAsset.browser_download_url : undefined,
        html_url: data.html_url
      });
      setHasChecked(true);
    } catch (e: any) {
      console.warn('Failed to fetch release info:', e);
      setError("Impossible de vérifier les mises à jour pour le moment (vérifiez votre connexion Internet).");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !hasChecked) {
      fetchLatestRelease();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isUpToDate = release ? release.tag_name === currentVersion : false;
  const isNewer = release ? release.tag_name !== currentVersion : false;

  return (
    <div className="fixed inset-0 z-[105] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md text-white">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] bg-[#140626] border border-purple-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="sticky top-0 z-20 px-5 py-4 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-[#20053b] via-[#140228] to-[#0c0019]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-2.5 py-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 hover:text-white flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95"
            >
              <IconArrowLeft size={16} />
              <span>Retour</span>
            </button>
            <div>
              <h2 className="text-base font-black tracking-tight text-white leading-tight">
                Mises à jour
              </h2>
              <p className="text-[11px] text-purple-300/80 font-semibold">
                Version officielle du programme
              </p>
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

        {/* Content */}
        <div className="overflow-y-auto px-5 py-6 space-y-6 flex-1">
          {/* Current Version Card */}
          <div className="p-4 rounded-2xl bg-[#1b0833] border border-purple-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Version installée
              </div>
              <div className="text-xl font-black text-white mt-0.5">
                {currentVersion}
              </div>
              <div className="text-[11px] text-purple-300/70 mt-1">
                Programme officiel 2027 • 1 069 mesures
              </div>
            </div>

            <button
              onClick={fetchLatestRelease}
              disabled={loading}
              className="p-3 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-500/30 transition-all active:scale-95 flex items-center gap-2 text-xs font-bold"
              title="Vérifier maintenant"
            >
              <IconRefresh size={18} className={loading ? 'animate-spin text-purple-300' : ''} />
              <span className="hidden sm:inline">Vérifier</span>
            </button>
          </div>

          {/* Status Display */}
          {loading && (
            <div className="p-6 rounded-2xl bg-purple-950/30 border border-purple-800/40 flex flex-col items-center justify-center text-center space-y-3">
              <IconRefresh size={32} className="animate-spin text-purple-400" />
              <p className="text-sm font-bold text-purple-200">
                Recherche de mise à jour sur le serveur...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-semibold">
              {error}
            </div>
          )}

          {!loading && release && isUpToDate && (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                <IconCheck size={18} />
                <span>Votre application est à jour !</span>
              </div>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Vous disposez de la toute dernière version ({release.tag_name}) avec l'ensemble des 111 fiches thématiques, les 5 plans sectoriels et le chiffrage budgétaire actualisé.
              </p>
            </div>
          )}

          {!loading && release && isNewer && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/60 via-[#2a064a] to-[#1a0033] border border-purple-400/50 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Nouvelle version disponible
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">
                    {release.name}
                  </h3>
                </div>
              </div>

              {release.apk_url && (
                <a
                  href={release.apk_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
                >
                  <IconDownload size={18} className="text-slate-950" />
                  <span>Télécharger la mise à jour (APK)</span>
                </a>
              )}

              {release.body && (
                <div className="pt-2 border-t border-purple-800/40">
                  <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider mb-1.5">
                    Nouveautés de la version :
                  </div>
                  <div className="text-xs text-purple-200/90 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto bg-purple-950/40 p-3 rounded-xl border border-purple-800/30">
                    {release.body}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Direct Link to GitHub Releases */}
          <div className="pt-2 text-center">
            <a
              href="https://github.com/heyhacene/lavenirencommun/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300 hover:text-white transition-colors"
            >
              <span>Consulter l'historique complet des versions</span>
              <IconExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#16062b] border-t border-purple-500/20 px-5 py-3.5 flex items-center justify-between pb-[max(1rem,env(safe-area-inset-bottom,16px))]">
          <span className="text-xs text-purple-300/70 font-semibold">
            Édition 2027 • Jean-Luc Mélenchon
          </span>
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
