import type { EventsData, AppEvent, BroadcastBanner } from '../types/events';

const LOCAL_EVENTS_KEY = 'lfi_custom_events_data';
const ADMIN_PASSCODE_KEY = 'lfi_admin_passcode';
const DEFAULT_PASSCODE = '2027LFI';

export const loadEventsData = async (): Promise<EventsData> => {
  // 1. Vérifier si l'administrateur local a personnalisé les événements sur son appareil
  try {
    const local = localStorage.getItem(LOCAL_EVENTS_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && parsed.events && parsed.banner) {
        return parsed;
      }
    }
  } catch (e) {
    // Poursuivre vers le fetch distant
  }

  // 2. Récupérer le fichier events.json officiel avec anti-cache pour être toujours à jour
  try {
    const timestamp = Date.now();
    const res = await fetch(`./data/events.json?v=${timestamp}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
    if (res.ok) {
      const data: EventsData = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Impossible de charger les événements distants:', err);
  }

  // 3. Repli statique si réseau coupé
  return {
    banner: {
      enabled: true,
      type: 'event',
      message: '📅 Réunion publique LFI : bifurcation écologique & 6ᵉ République — Samedi à 15h !',
      linkText: "Voir l'agenda",
      eventId: 'event-1'
    },
    events: [
      {
        id: 'event-1',
        title: 'Grande réunion publique : Pour la 6ᵉ République et la bifurcation écologique',
        date: '2026-11-21T18:30:00',
        category: 'reunion_publique',
        location: 'Maison du Peuple, Lille (et en direct sur YouTube)',
        description: 'Présentation des 111 fiches thématiques et du chiffrage budgétaire avec nos députés et orateurs nationaux.',
        speakers: ['Députés LFI', 'Militants syndicaux et associatifs'],
        link: 'https://actionpopulaire.fr',
        isHighlighted: true
      }
    ]
  };
};

export const saveLocalEventsData = (data: EventsData): void => {
  try {
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Impossible de sauvegarder localement les événements', e);
  }
};

export const verifyAdminPasscode = (inputCode: string): boolean => {
  try {
    const customCode = localStorage.getItem(ADMIN_PASSCODE_KEY);
    const validCode = customCode || DEFAULT_PASSCODE;
    return inputCode.trim() === validCode;
  } catch (e) {
    return inputCode.trim() === DEFAULT_PASSCODE;
  }
};

export const setCustomAdminPasscode = (newCode: string): void => {
  try {
    localStorage.setItem(ADMIN_PASSCODE_KEY, newCode.trim());
  } catch (e) {
    // Ignorer
  }
};
