import { useState } from 'react';
import type { Section, Profile, AlertConfig } from '../types/programme';
import {
  scheduleDailyFicheAlert,
  triggerTestNotification,
  requestNotificationPermission
} from '../services/notifications';
import { IconBell, IconClose, IconCheck, renderProfileIcon, getProfileColor } from './Icons';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AlertConfig;
  onUpdateConfig: (newConfig: AlertConfig) => void;
  sections: Section[];
  profiles: Profile[];
  onTriggerInAppTest: (section: Section) => void;
}

export const AlertSettingsModal = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  sections,
  profiles,
  onTriggerInAppTest
}: AlertSettingsModalProps) => {
  const [enabled, setEnabled] = useState(config.enabled);
  const [hour, setHour] = useState(config.hour);
  const [minute, setMinute] = useState(config.minute);
  const [profile, setProfile] = useState(config.profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (enabled) {
      await requestNotificationPermission();
    }
    const newConfig: AlertConfig = {
      ...config,
      enabled,
      hour,
      minute,
      profile
    };
    await scheduleDailyFicheAlert(newConfig, sections);
    onUpdateConfig(newConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleTestNow = async () => {
    const pool = profile === 'tous'
      ? sections
      : sections.filter(s => s.profiles.includes(profile));
    const randomSection = pool[Math.floor(Math.random() * pool.length)] || sections[0];

    onTriggerInAppTest(randomSection);
    await triggerTestNotification(randomSection);

    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-white">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#140626] border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 animate-slide-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-purple-950 via-[#1d0638] to-[#120025]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl shadow-md text-amber-300">
              <IconBell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">Alertes &amp; Rappels AEC</h2>
              <p className="text-xs text-purple-300 font-medium">Notifications Android &amp; In-App combinées (Option C)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-purple-300 hover:text-white rounded-full transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Toggle Active */}
          <div className="flex items-center justify-between p-4.5 bg-purple-950/40 rounded-2xl border border-purple-800/40">
            <div>
              <div className="font-bold text-sm text-white">Activer la fiche quotidienne</div>
              <div className="text-xs text-purple-300/80 mt-0.5">Recevez chaque jour une mesure officielle du programme</div>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enabled ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {enabled && (
            <>
              {/* Hour Selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-purple-300 mb-2.5">
                  Heure de réception de la notification
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: '08:00', h: 8, m: 0 },
                    { label: '09:00', h: 9, m: 0 },
                    { label: '12:30', h: 12, m: 30 },
                    { label: '19:00', h: 19, m: 0 }
                  ].map(slot => {
                    const isSelected = hour === slot.h && minute === slot.m;
                    return (
                      <button
                        key={slot.label}
                        onClick={() => {
                          setHour(slot.h);
                          setMinute(slot.m);
                        }}
                        className={`py-2.5 px-3 text-xs font-black rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-md scale-[1.02]'
                            : 'bg-purple-950/30 text-purple-200 border-purple-800/40 hover:bg-purple-900/40'
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-xs text-purple-300 bg-purple-950/30 p-3 rounded-xl border border-purple-800/40">
                  <span>Ou heure personnalisée :</span>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={hour}
                    onChange={e => setHour(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-14 p-1.5 text-center font-bold bg-[#1d0638] text-white border border-purple-500/50 rounded-lg outline-none"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minute.toString().padStart(2, '0')}
                    onChange={e => setMinute(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-14 p-1.5 text-center font-bold bg-[#1d0638] text-white border border-purple-500/50 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Theme / Profile filter */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-purple-300 mb-2.5">
                  Thématique ciblée des alertes
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {profiles.map(p => {
                    const active = profile === p.id;
                    const colors = getProfileColor(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => setProfile(p.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                          active
                            ? 'bg-purple-900/80 border-purple-400 text-white shadow-md'
                            : `bg-purple-950/30 border-purple-900/40 text-slate-300 hover:border-purple-700`
                        }`}
                      >
                        {renderProfileIcon(p.icon, `w-4 h-4 flex-shrink-0 ${active ? 'text-amber-300' : colors.text}`)}
                        <span className="truncate">{p.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Test Button */}
              <div className="pt-2">
                <button
                  onClick={handleTestNow}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
                >
                  <IconBell className="w-4 h-4 text-slate-950" />
                  {testSuccess ? 'Notification déclenchée !' : "Tester l'alerte maintenant (popup 3s)"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#16062b] border-t border-purple-500/20 flex items-center justify-end gap-3">
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
                <IconCheck className="w-4 h-4 text-emerald-400" />
                Enregistré !
              </>
            ) : (
              'Enregistrer la programmation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
