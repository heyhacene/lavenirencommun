export type EventCategory = 'reunion_publique' | 'meeting' | 'action_militante' | 'formation' | 'autre';

export interface AppEvent {
  id: string;
  title: string;
  date: string; // ISO string ou date lisible
  category: EventCategory;
  location: string;
  description: string;
  speakers?: string[];
  link?: string;
  isHighlighted?: boolean;
}

export interface BroadcastBanner {
  enabled: boolean;
  type: 'info' | 'urgent' | 'event';
  message: string;
  linkText?: string;
  eventId?: string;
}

export interface EventsData {
  banner: BroadcastBanner;
  events: AppEvent[];
}
