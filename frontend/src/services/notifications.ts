import { LocalNotifications } from '@capacitor/local-notifications';
import type { MultiAlertConfig, AlertSchedule, Section } from '../types/programme';

const STORAGE_KEY_MULTI_ALERT = 'aec_multi_alerts_v2';
const STORAGE_KEY_LEGACY = 'aec_alert_config_v1';
export const NOTIFICATION_CHANNEL_ID = 'aec_programme_alerts';

export const defaultSchedules: AlertSchedule[] = [
  {
    id: 'matin_0830',
    enabled: true,
    time: '08:30',
    label: 'Fiche du Matin',
    profile: 'tous'
  },
  {
    id: 'midi_1230',
    enabled: true,
    time: '12:30',
    label: 'Pause Déjeuner',
    profile: 'tous'
  },
  {
    id: 'soir_1930',
    enabled: true,
    time: '19:30',
    label: 'Fiche du Soir',
    profile: 'tous'
  }
];

export const defaultMultiAlertConfig: MultiAlertConfig = {
  globalEnabled: true,
  schedules: defaultSchedules
};

export interface NotificationPayloadTarget {
  sectionId?: string;
  globalIndex?: number;
  title?: string;
}

let pendingNotificationTarget: NotificationPayloadTarget | null = null;
let notificationTargetListener: ((target: NotificationPayloadTarget) => void) | null = null;

export function extractNotificationTarget(notification: any): NotificationPayloadTarget | null {
  if (!notification) return null;
  let sectionId: string | undefined;
  let globalIndex: number | undefined;
  let title: string | undefined = notification.title;

  const extra = notification.extra;
  if (extra) {
    if (typeof extra === 'string') {
      try {
        const parsed = JSON.parse(extra);
        sectionId = parsed.sectionId;
        globalIndex = parsed.globalIndex ? Number(parsed.globalIndex) : undefined;
        if (parsed.title) title = parsed.title;
      } catch {
        sectionId = extra;
      }
    } else if (typeof extra === 'object') {
      sectionId = extra.sectionId;
      globalIndex = extra.globalIndex ? Number(extra.globalIndex) : undefined;
      if (extra.title) title = extra.title;
    }
  }

  return { sectionId, globalIndex, title };
}

export function registerNotificationTargetListener(
  listener: (target: NotificationPayloadTarget) => void
): () => void {
  notificationTargetListener = listener;
  if (pendingNotificationTarget) {
    const target = pendingNotificationTarget;
    pendingNotificationTarget = null;
    setTimeout(() => {
      listener(target);
    }, 200);
  }
  return () => {
    if (notificationTargetListener === listener) {
      notificationTargetListener = null;
    }
  };
}

export function dispatchNotificationTarget(target: NotificationPayloadTarget) {
  if (notificationTargetListener) {
    notificationTargetListener(target);
  } else {
    pendingNotificationTarget = target;
  }
}

export function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 900000) + 100000;
}

export function loadMultiAlertConfig(): MultiAlertConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MULTI_ALERT);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.schedules)) {
        return {
          globalEnabled: parsed.globalEnabled !== false,
          schedules: parsed.schedules
        };
      }
    }

    // Check legacy single-alert migration
    const legacyRaw = localStorage.getItem(STORAGE_KEY_LEGACY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      const hStr = (legacy.hour ?? 9).toString().padStart(2, '0');
      const mStr = (legacy.minute ?? 0).toString().padStart(2, '0');
      return {
        globalEnabled: legacy.enabled !== false,
        schedules: [
          {
            id: 'legacy_custom',
            enabled: legacy.enabled !== false,
            time: `${hStr}:${mStr}`,
            label: 'Rappel Personnalisé',
            profile: legacy.profile || 'tous'
          },
          ...defaultSchedules.slice(1)
        ]
      };
    }
  } catch (e) {
    console.error('Failed to load multi alert config:', e);
  }

  return defaultMultiAlertConfig;
}

export function saveMultiAlertConfig(config: MultiAlertConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_MULTI_ALERT, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save multi alert config:', e);
  }
}

export async function ensureNotificationChannel(): Promise<void> {
  try {
    await LocalNotifications.createChannel({
      id: NOTIFICATION_CHANNEL_ID,
      name: "Alertes L'Avenir en commun",
      description: "Rappels et notifications des mesures officielles du programme 2027",
      importance: 5, // High importance (banner, vibration, heads-up)
      visibility: 1, // Public on lockscreen
      vibration: true
    });
  } catch (e) {
    console.warn('[AEC] Could not create notification channel:', e);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const status = await LocalNotifications.checkPermissions();
    if (status.display === 'granted') {
      return true;
    }
    const res = await LocalNotifications.requestPermissions();
    return res.display === 'granted';
  } catch (e) {
    console.warn('Native notifications check failed / web fallback:', e);
    return false;
  }
}

export async function scheduleAllAlerts(
  config: MultiAlertConfig,
  sections: Section[]
): Promise<boolean> {
  saveMultiAlertConfig(config);

  await ensureNotificationChannel();

  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications && pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  } catch (e) {
    console.warn('Could not clear pending notifications:', e);
  }

  if (!config.globalEnabled || !config.schedules || config.schedules.length === 0) {
    return true;
  }

  if (sections.length === 0) return false;

  const notifsToSchedule: any[] = [];
  const now = new Date();

  for (const schedule of config.schedules) {
    if (!schedule.enabled) continue;

    const [hPart, mPart] = schedule.time.split(':');
    const hour = parseInt(hPart, 10) || 0;
    const minute = parseInt(mPart, 10) || 0;

    // Filter candidate fiches for this specific schedule
    const candidates = schedule.profile === 'tous'
      ? sections
      : sections.filter(s => s.profiles && s.profiles.includes(schedule.profile));

    const pool = candidates.length > 0 ? candidates : sections;
    const fiche = pool[Math.floor(Math.random() * pool.length)];
    if (!fiche) continue;

    const target = new Date();
    target.setHours(hour, minute, 0, 0);
    if (target.getTime() <= now.getTime()) {
      target.setDate(target.getDate() + 1);
    }

    const notifId = hashStringToNumber(schedule.id);

    notifsToSchedule.push({
      id: notifId,
      title: `L'Avenir en commun • ${fiche.title}`,
      body: fiche.mesureCle || fiche.intro || 'Découvrez une mesure officielle du programme 2027.',
      channelId: NOTIFICATION_CHANNEL_ID,
      schedule: {
        at: target,
        allowWhileIdle: true,
        repeats: true,
        every: 'day'
      },
      extra: {
        sectionId: fiche.id,
        globalIndex: fiche.globalIndex,
        title: fiche.title,
        scheduleId: schedule.id
      }
    });
  }

  if (notifsToSchedule.length === 0) return true;

  try {
    await LocalNotifications.schedule({ notifications: notifsToSchedule });
    console.log(`[AEC] Scheduled ${notifsToSchedule.length} notifications successfully.`);
    return true;
  } catch (e) {
    console.warn('[AEC] Could not schedule native notifications:', e);
    return false;
  }
}

export async function triggerTestNotification(section: Section): Promise<boolean> {
  await requestNotificationPermission();
  await ensureNotificationChannel();

  try {
    const testId = 999999;

    // Post immediately so Android displays it right away in notification center
    await LocalNotifications.schedule({
      notifications: [
        {
          id: testId,
          title: `L'Avenir en commun • ${section.title}`,
          body: section.mesureCle || section.intro || 'Test de notification du programme 2027.',
          channelId: NOTIFICATION_CHANNEL_ID,
          extra: {
            sectionId: section.id,
            globalIndex: section.globalIndex,
            title: section.title
          }
        }
      ]
    });
    console.log('[AEC] Test notification triggered immediately for:', section.title);
    return true;
  } catch (e) {
    console.error('[AEC] Failed to trigger test notification:', e);
    return false;
  }
}
