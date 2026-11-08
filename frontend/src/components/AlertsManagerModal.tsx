import { useState, useEffect } from 'react';
import type { Section, Profile, MultiAlertConfig, AlertSchedule } from '../types/programme';
import {
  scheduleAllAlerts,
  triggerTestNotification,
  requestNotificationPermission,
  checkNotificationPermission,
  openNativeNotificationSettings
} from '../services/notifications';
import {
  IconBell,
  IconClose,
  IconCheck,
  IconPlus,
  IconTrash,
  IconArrowLeft,
  renderProfileIcon,
  getProfileColor
} from './Icons';

interface AlertsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MultiAlertConfig;
  onUpdateConfig: (newConfig: MultiAlertConfig) => void;
  sections: Section[];
  profiles: Profile[];
  onTriggerInAppTest: (section: Section) => void;
}

export const AlertsManagerModal = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  sections,
  profiles,
  onTriggerInAppTest
}: AlertsManagerModalProps) => {
  const [globalEnabled, setGlobalEnabled] = useState(config.globalEnabled);
  const [schedules, setSchedules] = useState<AlertSchedule[]>(
    config.schedules && config.schedules.length > 0
      ? config.schedules
      : [
          { id: 'matin_0830', enabled: true, time: '08:30', label: 'Fiche du Matin', profile: 'tous' },
          { id: 'midi_1230', enabled: true, time: '12:30', label: 'Pause Déjeuner', profile: 'tous' },
          { id: 'soir_1930', enabled: true, time: '19:30', label: 'Fiche du Soir', profile: 'tous' }
        ]
  );
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  // Check Android permission whenever modal opens
  useEffect(() => {
    if (isOpen) {
      checkNotificationPermission().then(p => {
        setPermissionStatus(p.display as any);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGlobalToggle = async () => {
    const next = !globalEnabled;
    setGlobalEnabled(next);
    if (next) {
      const p = await requestNotificationPermission();
      setPermissionStatus(p.display as any);
    }
  };

  const handleToggleSchedule = (id: string) => {
    setSchedules(prev =>
      prev.map(s => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleTimeChange = (id: string, newTime: string) => {
    setSchedules(prev =>
      prev.map(s => (s.id === id ? { ...s, time: newTime } : s))
    );
  };

  const handleProfileChange = (id: string, newProfile: string) => {
    setSchedules(prev =>
      prev.map(s => (s.id === id ? { ...s, profile: newProfile } : s))
    );
  };

  const handleAddSchedule = () => {
    const newId = `alert_${Date.now()}`;
    const newSchedule: AlertSchedule = {
      id: newId,
      enabled: true,
      time: '18:00',
      label: `Rappel #${schedules.length + 1}`,
      profile: 'tous'
    };
    setSchedules(prev => [...prev, newSchedule]);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  const handleSave = async () => {
    if (globalEnabled) {
      const p = await requestNotificationPermission();
      setPermissionStatus(p.display as any);
    }
    const newConfig: MultiAlertConfig = {
      globalEnabled,
      schedules
    };
    await scheduleAllAlerts(newConfig, sections);
    onUpdateConfig(newConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1100);
  };

  const handleRequestPermission = async () => {
    const p = await requestNotificationPermission();
    setPermissionStatus(p.display as any);
    if (p.display === 'denied') {
      await openNativeNotificationSettings();
    }
  };

  const handleTestNow = async (profileId: string = 'tous') => {
    const pool = profileId === 'tous'
      ? sections
      : sections.filter(s => s.profiles && s.profiles.includes(profileId));
    const randomSection = pool[Math.floor(Math.random() * pool.length)] || sections[0];

    if (!randomSection) return;

    setTestResult(null);
    const res = await triggerTestNotification(randomSection);
    setPermissionStatus((res.display || 'unknown') as any);

    if (res.success) {
      setTestResult({
        success: true,
        msg: 'Notification envoyée ! Regardez dans votre barre d’état Android (en haut).'
      });
    } else if (res.error === 'permission_denied') {
      setTestResult({
        success: false,
        msg: 'Bloqué par Android : les notifications sont désactivées. Cliquez sur "Ouvrir Paramètres Android" ci-dessus.'
      });
    } else {
      setTestResult({
        success: false,
        msg: `Erreur : ${res.error || 'Impossible d’émettre la notification'}`
      });
    }

    setTimeout(() => setTestResult(null), 7000);
  };

  return (
    <div className="fixed inset-0 z-[105] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md text-white">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-[#140626] border border-purple-500/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
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
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-xl text-amber-300 shadow-md">
                <IconBell size={18} />
              </div>
              <div>
                <h2 className="text-base font-black tracking-tight text-white leading-tight">
                  Gestion des Alertes &amp; Rappels
                </h2>
                <p className="text-[11px] text-purple-300/80 font-semibold">
                  Programmez vos alertes de mesures officielles
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
        <div className="overflow-y-auto px-5 py-5 space-y-4 flex-1">
          {/* Android System Permission Banner */}
          {permissionStatus === 'denied' && (
            <div className="bg-gradient-to-br from-rose-950/80 to-purple-950/80 border-2 border-rose-500/60 p-4 rounded-2xl shadow-xl space-y-2.5 animate-pulse">
              <div className="flex items-center gap-2 text-rose-300 font-black text-xs uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                ⚠️ Notifications bloquées par Android
              </div>
              <p className="text-xs text-rose-100 font-medium leading-relaxed">
                Le système Android bloque les notifications pour cette application. Vous devez les autoriser dans les paramètres de votre téléphone pour recevoir les alertes.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={openNativeNotificationSettings}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-xs shadow-lg active:scale-95 flex items-center gap-1.5"
                >
                  <span>⚙️ Ouvrir les Paramètres Android</span>
                </button>
                <button
                  onClick={async () => {
                    const p = await checkNotificationPermission();
                    setPermissionStatus(p.display as any);
                  }}
                  className="px-3 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-bold"
                >
                  🔄 Re-vérifier
                </button>
              </div>
            </div>
          )}

          {permissionStatus === 'granted' && (
            <div className="bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-emerald-300 font-bold">
                <IconCheck size={16} className="text-emerald-400" />
                Notifications système autorisées par Android
              </span>
              <button
                onClick={openNativeNotificationSettings}
                className="text-[11px] text-purple-300 hover:text-white underline font-semibold"
              >
                Gérer ⚙️
              </button>
            </div>
          )}

          {permissionStatus === 'prompt' && (
            <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between text-xs">
              <span className="text-amber-200 font-bold">
                🔔 Autorisation Android requise
              </span>
              <button
                onClick={handleRequestPermission}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs active:scale-95"
              >
                Autoriser
              </button>
            </div>
          )}

          {/* Master Global Switch */}
          <div
            onClick={handleGlobalToggle}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-lg select-none ${
              globalEnabled
                ? 'bg-gradient-to-r from-emerald-950/60 to-purple-950/70 border-emerald-500/40'
                : 'bg-slate-900/80 border-slate-700/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  globalEnabled ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-slate-500'
                }`}
              />
              <div>
                <div className="font-extrabold text-sm text-white flex items-center gap-2">
                  <span>Système de notifications</span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      globalEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {globalEnabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                  </span>
                </div>
                <div className="text-xs text-purple-200/70 mt-0.5">
                  {globalEnabled
                    ? 'Les fiches apparaîtront aux heures définies ci-dessous'
                    : 'Toutes les alertes sont suspendues'}
                </div>
              </div>
            </div>

            {/* iOS/Material Style Switch Track */}
            <div
              className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 ease-in-out flex items-center ${
                globalEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
            </div>
          </div>

          {globalEnabled && (
            <>
              {/* Header section for schedules list */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Horaires programmés ({schedules.filter(s => s.enabled).length}/{schedules.length} actifs)
                </span>
                <button
                  onClick={handleAddSchedule}
                  className="px-2.5 py-1 rounded-xl bg-purple-600/40 hover:bg-purple-600 border border-purple-400/40 text-white text-xs font-bold flex items-center gap-1 transition-all active:scale-95"
                >
                  <IconPlus size={14} />
                  <span>Ajouter une heure</span>
                </button>
              </div>

              {/* Schedules List */}
              <div className="space-y-3">
                {schedules.map((schedule, idx) => (
                  <div
                    key={schedule.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      schedule.enabled
                        ? 'bg-[#1e073a] border-purple-500/40 shadow-md'
                        : 'bg-[#110424]/60 border-purple-900/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Left: Checkbox switch & Label */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => handleToggleSchedule(schedule.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            schedule.enabled
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-purple-950/80 border border-purple-700/50 text-transparent'
                          }`}
                        >
                          <IconCheck size={14} />
                        </button>

                        <div className="min-w-0 flex-1">
                          <input
                            type="text"
                            value={schedule.label}
                            onChange={e => {
                              const val = e.target.value;
                              setSchedules(prev =>
                                prev.map(s => (s.id === schedule.id ? { ...s, label: val } : s))
                              );
                            }}
                            className="bg-transparent border-b border-transparent focus:border-purple-400 text-white font-bold text-sm outline-none w-full truncate py-0.5"
                            placeholder="Nom du rappel..."
                          />
                        </div>
                      </div>

                      {/* Right: Native Time Input Clock */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#2b0852] border border-purple-400/50 rounded-xl px-2.5 py-1.5 shadow-inner">
                          <input
                            type="time"
                            value={schedule.time}
                            onChange={e => handleTimeChange(schedule.id, e.target.value)}
                            className="bg-transparent text-white font-black text-sm outline-none cursor-pointer"
                          />
                        </div>

                        {schedules.length > 1 && (
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition-colors active:scale-95"
                            title="Supprimer cette alerte"
                          >
                            <IconTrash size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Target Theme / Profile */}
                    <div className="mt-3 pt-3 border-t border-purple-800/30 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-purple-300/80 flex-shrink-0">
                        Thème ciblé :
                      </span>
                      <select
                        value={schedule.profile}
                        onChange={e => handleProfileChange(schedule.id, e.target.value)}
                        className="bg-[#240645] border border-purple-500/40 text-purple-100 text-xs font-bold rounded-xl px-2.5 py-1.5 outline-none flex-1 max-w-[240px] truncate"
                      >
                        <option value="tous">✨ Toutes les fiches (111)</option>
                        {profiles
                          .filter(p => p.id !== 'tous')
                          .map(p => (
                            <option key={p.id} value={p.id}>
                              {p.label}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Presets for adding slots */}
              <div className="bg-purple-950/30 p-3.5 rounded-2xl border border-purple-800/40 space-y-2">
                <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block">
                  Raccourcis d'heures fréquentes :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['07:30', '08:00', '09:00', '12:30', '18:00', '19:30', '21:00'].map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        const newId = `alert_${Date.now()}`;
                        setSchedules(prev => [
                          ...prev,
                          {
                            id: newId,
                            enabled: true,
                            time: t,
                            label: `Rappel ${t}`,
                            profile: 'tous'
                          }
                        ]);
                      }}
                      className="text-xs font-bold px-2.5 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white rounded-lg border border-purple-700/40 transition-all active:scale-95"
                    >
                      + {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Test Result Message */}
              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-bold leading-relaxed ${
                    testResult.success
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500/60 text-rose-200'
                  }`}
                >
                  {testResult.msg}
                </div>
              )}

              {/* Test Now Button */}
              <button
                onClick={() => handleTestNow('tous')}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-98"
              >
                <IconBell size={18} className="text-white" />
                <span>Tester une alerte Android maintenant (instantané)</span>
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#16062b] border-t border-purple-500/20 px-5 py-3.5 flex items-center justify-end gap-3 pb-[max(1rem,env(safe-area-inset-bottom,16px))]">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            {savedSuccess ? (
              <>
                <IconCheck size={16} className="text-emerald-400" />
                Programmation enregistrée !
              </>
            ) : (
              'Enregistrer & Appliquer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
