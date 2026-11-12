import React, { useState } from 'react';
import type { AppEvent, EventCategory } from '../types/events';
import {
  IconClose,
  IconCalendar,
  IconArrowLeft,
  IconShare,
  IconCheck,
  IconExternalLink
} from './Icons';

interface EventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: AppEvent[];
  onOpenAdmin: () => void;
}

export const EventsModal: React.FC<EventsModalProps> = ({
  isOpen,
  onClose,
  events,
  onOpenAdmin
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredEvents = events.filter(e => {
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const getCategoryBadge = (cat: EventCategory) => {
    switch (cat) {
      case 'meeting':
        return { label: 'Meeting National', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'reunion_publique':
        return { label: 'Réunion Publique', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'action_militante':
        return { label: 'Action Militante', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'formation':
        return { label: 'Formation', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      default:
        return { label: 'Événement', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
    }
  };

  const handleShareEvent = async (event: AppEvent) => {
    const text = `🗓️ ${event.title}\n📍 ${event.location}\n⏰ ${formatDate(event.date)}\n\n${event.description}\nPlus d'infos : ${event.link || 'https://actionpopulaire.fr'}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: text,
          url: event.link || 'https://actionpopulaire.fr'
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedEventId(event.id);
        setTimeout(() => setCopiedEventId(null), 2500);
      } catch (e) {
        // Fallback
      }
    }
  };

  const handleAddToCalendar = (event: AppEvent) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // +2 heures

    const formatGCalDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(event.location)}`;

    window.open(gcalUrl, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn text-white"
      onClick={onClose}
      style={{ touchAction: 'manipulation' }}
    >
      <div
        className="glass-panel w-full max-w-2xl max-h-[90vh] rounded-3xl border border-purple-500/40 flex flex-col shadow-2xl overflow-hidden animate-scale"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-purple-900/50 bg-gradient-to-r from-[#28054a] via-[#1a0333] to-[#0f0022] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-amber-300 shadow-md flex-shrink-0">
              <IconCalendar size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                Agenda &amp; Mobilisations
              </h2>
              <p className="text-xs text-purple-300 font-semibold">
                Réunions publiques, meetings et actions populaires
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 to-rose-500/25 hover:from-amber-500/40 hover:to-rose-500/40 border border-amber-400/50 text-amber-300 hover:text-white text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
              style={{ touchAction: 'manipulation' }}
              title="Accès organisateur pour publier sur le bandeau d'accueil ou modifier le calendrier"
            >
              <span>🔒</span>
              <span className="hidden sm:inline">Espace Organisateur</span>
              <span className="sm:hidden">Organisateur</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-200 hover:text-white flex items-center justify-center transition-all active:scale-90"
              style={{ touchAction: 'manipulation' }}
              title="Fermer l'agenda"
            >
              <IconClose size={20} />
            </button>
          </div>
        </div>

        {/* Organizer Prompt Banner */}
        <div className="px-5 py-2.5 bg-gradient-to-r from-amber-950/50 via-purple-950/40 to-[#120126] border-b border-purple-900/40 flex items-center justify-between text-xs flex-shrink-0">
          <div className="flex items-center gap-2 text-amber-200 font-medium truncate">
            <span>📢</span>
            <span className="truncate">Vous organisez une réunion publique ou un événement ?</span>
          </div>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex-shrink-0 ml-2 font-black text-amber-300 hover:text-white underline underline-offset-2 flex items-center gap-1"
          >
            <span>Connexion organisateur</span>
            <span>➔</span>
          </button>
        </div>

        {/* Categories Filter Tabs */}
        <div className="px-5 py-3 border-b border-purple-900/40 bg-[#120126]/60 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {[
            { id: 'all', label: 'Tous les événements' },
            { id: 'reunion_publique', label: 'Réunions publiques' },
            { id: 'meeting', label: 'Meetings' },
            { id: 'action_militante', label: 'Actions de terrain' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === tab.id
                  ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                  : 'bg-[#18082f] text-purple-300 border-purple-900/50 hover:border-purple-600 hover:text-white'
              }`}
              style={{ touchAction: 'manipulation' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events List Body */}
        <div className="overflow-y-auto px-5 sm:px-6 py-5 space-y-4 flex-1">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <div className="text-3xl">🗓️</div>
              <p className="text-sm font-semibold">Aucun événement prévu dans cette catégorie pour le moment.</p>
            </div>
          ) : (
            filteredEvents.map(event => {
              const badge = getCategoryBadge(event.category);
              const isCopied = copiedEventId === event.id;

              return (
                <div
                  key={event.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-lg space-y-3 ${
                    event.isHighlighted
                      ? 'bg-gradient-to-br from-purple-950/70 via-[#180630]/80 to-[#100122]/90 border-purple-400/60 ring-1 ring-purple-500/30'
                      : 'bg-[#180630]/80 border-purple-800/40 hover:border-purple-600/60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-xs font-black text-amber-300 bg-black/40 px-2.5 py-1 rounded-lg border border-purple-800/40">
                      ⏰ {formatDate(event.date)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs font-bold text-purple-200 mt-1 flex items-center gap-1.5">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {event.description}
                  </p>

                  {event.speakers && event.speakers.length > 0 && (
                    <div className="text-xs text-purple-200/90 font-semibold pt-1 border-t border-purple-900/40">
                      <span className="text-purple-400">Intervenants :</span> {event.speakers.join(', ')}
                    </div>
                  )}

                  {/* Actions buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-purple-900/40">
                    <button
                      type="button"
                      onClick={() => handleAddToCalendar(event)}
                      className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-700/50 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                      style={{ touchAction: 'manipulation' }}
                      title="Ajouter à Google Agenda"
                    >
                      <IconCalendar size={14} />
                      <span>Ajouter au calendrier</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareEvent(event)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border active:scale-95 ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                          : 'bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border-purple-700/50'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                      title="Partager cet événement"
                    >
                      {isCopied ? <IconCheck size={14} /> : <IconShare size={14} />}
                      <span>{isCopied ? 'Lien copié !' : 'Partager'}</span>
                    </button>

                    {event.link && (
                      <a
                        href={event.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                        style={{ touchAction: 'manipulation' }}
                      >
                        <span>S'inscrire / Participer</span>
                        <IconExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Organizer Access */}
        <div className="p-4 border-t border-purple-900/50 bg-[#100122] flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onOpenAdmin}
            className="text-[11px] font-bold text-purple-400 hover:text-purple-200 flex items-center gap-1.5 transition-colors"
            style={{ touchAction: 'manipulation' }}
            title="Accès réservé aux organisateurs désignés"
          >
            <span>🔒</span>
            <span>Espace Organisateur</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors shadow-md"
            style={{ touchAction: 'manipulation' }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
