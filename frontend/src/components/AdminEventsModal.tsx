import React, { useState } from 'react';
import type { EventsData, AppEvent, BroadcastBanner, EventCategory } from '../types/events';
import { verifyAdminPasscode, saveLocalEventsData, setCustomAdminPasscode } from '../services/events';
import { IconClose, IconCheck, IconTrash, IconEdit, IconPlus, IconCopy, IconEye, IconEyeOff } from './Icons';

interface AdminEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventsData: EventsData;
  onUpdateEventsData: (newData: EventsData) => void;
}

export const AdminEventsModal: React.FC<AdminEventsModalProps> = ({
  isOpen,
  onClose,
  eventsData,
  onUpdateEventsData
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form states for banner
  const [bannerEnabled, setBannerEnabled] = useState(eventsData.banner.enabled);
  const [bannerType, setBannerType] = useState<'info' | 'urgent' | 'event'>(eventsData.banner.type);
  const [bannerMessage, setBannerMessage] = useState(eventsData.banner.message);

  // Form states for new/edit event
  const [isEditingEvent, setIsEditingEvent] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventCategory, setEventCategory] = useState<EventCategory>('reunion_publique');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [eventSpeakers, setEventSpeakers] = useState('');

  // Status feedback
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  // Form states for changing password
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showNewPasscode, setShowNewPasscode] = useState(false);
  const [passcodeChangeMessage, setPasscodeChangeMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPasscode(passcode)) {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Mot de passe administrateur incorrect.');
    }
  };

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasscode.trim()) {
      setPasscodeChangeMessage('Veuillez saisir un mot de passe.');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setPasscodeChangeMessage('Les deux mots de passe ne correspondent pas.');
      return;
    }
    setCustomAdminPasscode(newPasscode.trim());
    setPasscodeChangeMessage('✅ Mot de passe mis à jour avec succès !');
    setNewPasscode('');
    setConfirmPasscode('');
    setTimeout(() => setPasscodeChangeMessage(null), 4000);
  };

  const handleSaveBanner = () => {
    const updated: EventsData = {
      ...eventsData,
      banner: {
        ...eventsData.banner,
        enabled: bannerEnabled,
        type: bannerType,
        message: bannerMessage
      }
    };
    saveLocalEventsData(updated);
    onUpdateEventsData(updated);
    setSaveSuccess('Bandeau mis à jour avec succès !');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleOpenNewEvent = () => {
    setEditingEventId(null);
    setEventTitle('');
    setEventDate(new Date().toISOString().slice(0, 16));
    setEventCategory('reunion_publique');
    setEventLocation('');
    setEventDescription('');
    setEventLink('https://actionpopulaire.fr');
    setEventSpeakers('');
    setIsEditingEvent(true);
  };

  const handleOpenEditEvent = (ev: AppEvent) => {
    setEditingEventId(ev.id);
    setEventTitle(ev.title);
    setEventDate(ev.date ? ev.date.slice(0, 16) : '');
    setEventCategory(ev.category);
    setEventLocation(ev.location);
    setEventDescription(ev.description);
    setEventLink(ev.link || '');
    setEventSpeakers(ev.speakers ? ev.speakers.join(', ') : '');
    setIsEditingEvent(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const speakersArr = eventSpeakers
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    let updatedEvents: AppEvent[];
    if (editingEventId) {
      updatedEvents = eventsData.events.map(ev =>
        ev.id === editingEventId
          ? {
              ...ev,
              title: eventTitle.trim(),
              date: eventDate,
              category: eventCategory,
              location: eventLocation.trim(),
              description: eventDescription.trim(),
              link: eventLink.trim(),
              speakers: speakersArr
            }
          : ev
      );
    } else {
      const newEv: AppEvent = {
        id: `event-${Date.now()}`,
        title: eventTitle.trim(),
        date: eventDate,
        category: eventCategory,
        location: eventLocation.trim(),
        description: eventDescription.trim(),
        link: eventLink.trim(),
        speakers: speakersArr,
        isHighlighted: false
      };
      updatedEvents = [newEv, ...eventsData.events];
    }

    const updated: EventsData = {
      ...eventsData,
      events: updatedEvents
    };

    saveLocalEventsData(updated);
    onUpdateEventsData(updated);
    setIsEditingEvent(false);
    setSaveSuccess('Événement enregistré !');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleDeleteEvent = (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return;
    const updatedEvents = eventsData.events.filter(e => e.id !== id);
    const updated: EventsData = {
      ...eventsData,
      events: updatedEvents
    };
    saveLocalEventsData(updated);
    onUpdateEventsData(updated);
    setSaveSuccess('Événement supprimé.');
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleCopyJson = async () => {
    const jsonStr = JSON.stringify(eventsData, null, 2);
    try {
      await navigator.clipboard.writeText(jsonStr);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 3000);
    } catch {
      // Ignorer
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-white"
      onClick={onClose}
      style={{ touchAction: 'manipulation' }}
    >
      <div
        className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-3xl border border-amber-500/40 flex flex-col shadow-2xl overflow-hidden animate-scale"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-purple-900/50 bg-gradient-to-r from-amber-950/60 via-[#1e0538] to-[#100122] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🔒</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                Espace Organisateur &amp; Publication
              </h2>
              <p className="text-xs text-amber-300 font-semibold">
                Gestion du bandeau d’alerte et du calendrier des mobilisations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-purple-900/40 text-purple-200 hover:text-white flex items-center justify-center transition-all"
            style={{ touchAction: 'manipulation' }}
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto px-5 py-5 space-y-6 flex-1">
          {/* ÉCRAN DE VERROUILLAGE PAR CODE SECRET */}
          {!isAuthenticated ? (
            <form onSubmit={handleLogin} className="max-w-md mx-auto text-center py-8 space-y-5">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shadow-inner">
                🔑
              </div>
              <h3 className="text-lg font-extrabold text-white">
                Accès réservé aux organisateurs
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Veuillez renseigner le mot de passe secret pour gérer les annonces et le calendrier.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPasscode ? 'text' : 'password'}
                      value={passcode}
                      onChange={e => setPasscode(e.target.value)}
                      placeholder="Mot de passe secret"
                      className="w-full pl-4 pr-11 py-3 rounded-xl bg-purple-950/70 border border-purple-700/70 text-white placeholder-purple-400/50 text-sm font-bold focus:border-amber-400 outline-none tracking-wide"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-purple-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title={showPasscode ? "Masquer le mot de passe" : "Afficher le mot de passe en clair"}
                    >
                      {showPasscode ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
                    style={{ touchAction: 'manipulation' }}
                    title="Valider le mot de passe"
                  >
                    <span>OK</span>
                    <IconCheck size={16} />
                  </button>
                </div>

                {authError && (
                  <p className="text-xs text-rose-400 font-bold">{authError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{ touchAction: 'manipulation' }}
              >
                <span>Déverrouiller l'espace</span>
                <IconCheck size={16} />
              </button>
            </form>
          ) : (
            /* TABLEAU DE BORD ORGANISATEUR */
            <div className="space-y-6">
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <IconCheck size={16} />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {/* 1. GESTION DU BANDEAU D'ALERTE */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#1a0433]/80 border border-purple-600/30 space-y-3.5 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📢</span>
                    <h3 className="font-black text-sm text-white uppercase tracking-wider">
                      Bandeau d'annonce en haut de l'écran
                    </h3>
                  </div>

                  {/* Toggle Switch */}
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <span className={bannerEnabled ? 'text-emerald-300' : 'text-slate-400'}>
                      {bannerEnabled ? 'Activé' : 'Masqué'}
                    </span>
                    <input
                      type="checkbox"
                      checked={bannerEnabled}
                      onChange={e => setBannerEnabled(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['event', 'urgent', 'info'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBannerType(t)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                        bannerType === t
                          ? 'bg-amber-600 text-white border-amber-400 shadow'
                          : 'bg-purple-950/40 text-purple-300 border-purple-800/40'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      {t === 'urgent' ? '🔴 Alerte Urgente' : t === 'event' ? '📅 Événement' : 'ℹ️ Information'}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-300 mb-1">
                    Texte du message :
                  </label>
                  <textarea
                    rows={2}
                    value={bannerMessage}
                    onChange={e => setBannerMessage(e.target.value)}
                    placeholder="Ex: Réunion publique LFI ce samedi à 15h !"
                    className="w-full px-3 py-2 rounded-xl bg-purple-950/60 border border-purple-800 text-white text-xs sm:text-sm font-medium focus:border-amber-400 outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSaveBanner}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  style={{ touchAction: 'manipulation' }}
                >
                  Mettre à jour le bandeau
                </button>
              </div>

              {/* 2. GESTION DES ÉVÉNEMENTS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🗓️</span>
                    <h3 className="font-black text-sm text-white uppercase tracking-wider">
                      Événements du calendrier ({eventsData.events.length})
                    </h3>
                  </div>

                  {!isEditingEvent && (
                    <button
                      type="button"
                      onClick={handleOpenNewEvent}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
                      style={{ touchAction: 'manipulation' }}
                    >
                      <IconPlus size={14} />
                      <span>Ajouter un événement</span>
                    </button>
                  )}
                </div>

                {/* FORMULAIRE D'AJOUT / ÉDITION */}
                {isEditingEvent && (
                  <form onSubmit={handleSaveEvent} className="p-4 sm:p-5 rounded-2xl bg-purple-950/50 border border-purple-500/50 space-y-3">
                    <div className="flex items-center justify-between border-b border-purple-800/40 pb-2">
                      <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-300">
                        {editingEventId ? "Modifier l'événement" : 'Nouvel événement'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsEditingEvent(false)}
                        className="text-xs text-purple-300 hover:text-white"
                      >
                        Annuler
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-purple-300 mb-1">Titre :</label>
                        <input
                          type="text"
                          required
                          value={eventTitle}
                          onChange={e => setEventTitle(e.target.value)}
                          placeholder="Ex: Réunion publique LFI..."
                          className="w-full px-3 py-2 rounded-xl bg-[#120126] border border-purple-800 text-white text-xs font-semibold focus:border-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-purple-300 mb-1">Date et heure :</label>
                        <input
                          type="datetime-local"
                          required
                          value={eventDate}
                          onChange={e => setEventDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#120126] border border-purple-800 text-white text-xs font-semibold focus:border-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-purple-300 mb-1">Catégorie :</label>
                        <select
                          value={eventCategory}
                          onChange={e => setEventCategory(e.target.value as EventCategory)}
                          className="w-full px-3 py-2 rounded-xl bg-[#120126] border border-purple-800 text-white text-xs font-semibold focus:border-amber-400 outline-none"
                        >
                          <option value="reunion_publique">Réunion publique</option>
                          <option value="meeting">Meeting</option>
                          <option value="action_militante">Action militante / Tractage</option>
                          <option value="formation">Formation</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-purple-300 mb-1">Lieu :</label>
                        <input
                          type="text"
                          required
                          value={eventLocation}
                          onChange={e => setEventLocation(e.target.value)}
                          placeholder="Ex: Lille, Salle des Fêtes..."
                          className="w-full px-3 py-2 rounded-xl bg-[#120126] border border-purple-800 text-white text-xs font-semibold focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-purple-300 mb-1">Description :</label>
                      <textarea
                        rows={2}
                        value={eventDescription}
                        onChange={e => setEventDescription(e.target.value)}
                        placeholder="Détails, ordre du jour, informations pratiques..."
                        className="w-full px-3 py-2 rounded-xl bg-[#120126] border border-purple-800 text-white text-xs font-medium focus:border-amber-400 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-purple-300 mb-1">Intervenants (séparés par virgule) :</label>
                        <input
                          type="text"
                          value={eventSpeakers}
                          onChange={e => setEventSpeakers(e.target.value)}
                          placeholder="Ex: Député X, Syndicaliste Y..."
                          className="w-full px-3 py-2 rounded-xl bg-[#120126] border border-purple-800 text-white text-xs font-semibold focus:border-amber-400 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-purple-300 mb-1">Lien d'inscription / Action Populaire :</label>
                        <input
                          type="url"
                          value={eventLink}
                          onChange={e => setEventLink(e.target.value)}
                          placeholder="https://actionpopulaire.fr..."
                          className="w-full px-3 py-2 rounded-xl bg-[#120126] border border-purple-800 text-white text-xs font-semibold focus:border-amber-400 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingEvent(false)}
                        className="px-4 py-2 rounded-xl bg-purple-950 text-purple-200 text-xs font-bold"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow"
                      >
                        Enregistrer l'événement
                      </button>
                    </div>
                  </form>
                )}

                {/* LISTE SOMMAIRE DES ÉVÉNEMENTS */}
                <div className="space-y-2">
                  {eventsData.events.map(ev => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl bg-[#18082f]/80 border border-purple-900/50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-white block truncate">{ev.title}</span>
                        <span className="text-[11px] text-purple-300/80">
                          📍 {ev.location} &bull; ⏰ {ev.date ? ev.date.slice(0, 10) : ''}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditEvent(ev)}
                          className="p-1.5 text-purple-300 hover:text-white rounded-lg hover:bg-purple-900/50 transition-colors"
                          title="Modifier"
                        >
                          <IconEdit size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-1.5 text-rose-400 hover:text-rose-200 rounded-lg hover:bg-rose-950/50 transition-colors"
                          title="Supprimer"
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. SYNCHRONISATION GITHUB JSON */}
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">
                      Exportation &amp; Synchronisation collective
                    </h4>
                    <p className="text-[11px] text-purple-300/80">
                      Copiez le JSON pour le coller dans <code>public/data/events.json</code> sur GitHub afin que tous les utilisateurs le reçoivent.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyJson}
                    className="px-3 py-1.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-700/60 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                    style={{ touchAction: 'manipulation' }}
                  >
                    {copiedJson ? <IconCheck size={14} /> : <IconCopy size={14} />}
                    <span>{copiedJson ? 'Copié !' : 'Copier JSON'}</span>
                  </button>
                </div>
              </div>

              {/* 4. SÉCURITÉ & MODIFICATION DU MOT DE PASSE ORGANISATEUR */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#1a0433]/80 border border-purple-600/30 space-y-3 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔑</span>
                  <h3 className="font-black text-sm text-white uppercase tracking-wider">
                    Modifier votre mot de passe secret
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  Définissez votre propre mot de passe personnalisé. Vous seul et les camarades à qui vous le confiez pourrez publier.
                </p>

                <form onSubmit={handleChangePasscode} className="space-y-2.5 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="relative">
                      <input
                        type={showNewPasscode ? 'text' : 'password'}
                        value={newPasscode}
                        onChange={e => setNewPasscode(e.target.value)}
                        placeholder="Nouveau mot de passe"
                        className="w-full pl-3 pr-10 py-2 rounded-xl bg-[#120126] border border-purple-800 text-white text-xs font-semibold focus:border-amber-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPasscode(!showNewPasscode)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-purple-300 hover:text-white rounded transition-colors cursor-pointer"
                        title={showNewPasscode ? "Masquer" : "Afficher en clair"}
                      >
                        {showNewPasscode ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showNewPasscode ? 'text' : 'password'}
                        value={confirmPasscode}
                        onChange={e => setConfirmPasscode(e.target.value)}
                        placeholder="Confirmer le mot de passe"
                        className="w-full pl-3 pr-10 py-2 rounded-xl bg-[#120126] border border-purple-800 text-white text-xs font-semibold focus:border-amber-400 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPasscode(!showNewPasscode)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-purple-300 hover:text-white rounded transition-colors cursor-pointer"
                        title={showNewPasscode ? "Masquer" : "Afficher en clair"}
                      >
                        {showNewPasscode ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                      </button>
                    </div>
                  </div>

                  {passcodeChangeMessage && (
                    <p className={`text-xs font-bold ${passcodeChangeMessage.startsWith('✅') ? 'text-emerald-300' : 'text-rose-400'}`}>
                      {passcodeChangeMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition-all active:scale-95"
                    style={{ touchAction: 'manipulation' }}
                  >
                    Enregistrer le nouveau mot de passe
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-900/50 bg-[#100122] flex items-center justify-between flex-shrink-0">
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="text-xs text-purple-400 hover:text-purple-200 font-semibold"
            >
              Verrouiller l'espace
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-md"
            style={{ touchAction: 'manipulation' }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
