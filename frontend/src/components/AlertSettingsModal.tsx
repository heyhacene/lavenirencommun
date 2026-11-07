import React, { useState } from 'react';
import { Section, Profile, AlertConfig } from '../types/programme';
import {
  scheduleDailyFicheAlert,
  triggerTestNotification,
  requestNotificationPermission
} from '../services/notifications';
import { IconBell, IconClose, IconCheck, renderProfileIcon } from './Icons';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AlertConfig;
  onUpdateConfig: (newConfig: AlertConfig) => void;
  sections: Section[];
  profiles: Profile[];
  onTriggerInAppTest: (section: Section) => void;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  sections,
  profiles,
  onTriggerInAppTest
}) => {
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

    // Trigger in-app toast
    onTriggerInAppTest(randomSection);

    // Trigger native notification
    await triggerTestNotification(randomSection);

    setTestSuccess(true);
    setTimeout(() => setTestSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 animate-slide-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-purple-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl">
              <IconBell className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">Programmer les Alertes</h2>
              <p className="text-xs text-purple-200">Option C : Notifs Android &amp; In-App combinées</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-full transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Toggle Active */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div>
              <div className="font-bold text-sm text-slate-900">Activer les alertes quotidiennes</div>
              <div className="text-xs text-slate-500">Recevez chaque jour une fiche condensée du programme</div>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enabled ? 'bg-purple-700' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {enabled && (
            <>
              {/* Hour Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Heure de réception de la fiche
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
                        className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <span>Ou heure personnalisée :</span>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={hour}
                    onChange={e => setHour(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-14 p-1.5 text-center font-bold bg-white border border-slate-300 rounded-lg outline-none"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minute.toString().padStart(2, '0')}
                    onChange={e => setMinute(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-14 p-1.5 text-center font-bold bg-white border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Theme / Profile filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Thématique ciblée des fiches
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {profiles.map(p => {
                    const active = profile === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setProfile(p.id)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                          active
                            ? 'bg-purple-50 border-purple-600 text-purple-900 font-bold'
                            : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {renderProfileIcon(p.icon, `w-4 h-4 flex-shrink-0 ${active ? 'text-purple-700' : 'text-slate-500'}`)}
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
                  className="w-full py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <IconBell className="w-4 h-4 text-purple-700" />
                  {testSuccess ? 'Notification déclenchée !' : "Tester l'alerte maintenant (popup 3s)"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {savedSuccess ? (
              <>
                <IconCheck className="w-4 h-4" />
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
