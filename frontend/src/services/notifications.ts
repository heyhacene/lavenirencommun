import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertConfig, Section } from '../types/programme';

const STORAGE_KEY_ALERT = 'aec_alert_config_v1';
const NOTIFICATION_ID = 422027;

export const defaultAlertConfig: AlertConfig = {
  enabled: true,
  hour: 9,
  minute: 0,
  profile: 'tous'
};

export function loadAlertConfig(): AlertConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALERT);
    if (raw) {
      return { ...defaultAlertConfig, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load alert config:', e);
  }
  return defaultAlertConfig;
}

export function saveAlertConfig(config: AlertConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_ALERT, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save alert config:', e);
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
    console.warn('Native notifications not supported on web/dev platform:', e);
    return false;
  }
}

export async function scheduleDailyFicheAlert(
  config: AlertConfig,
  sections: Section[]
): Promise<boolean> {
  saveAlertConfig(config);

  if (!config.enabled) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] });
    } catch (e) {
      // Ignore
    }
    return true;
  }

  // Filter candidate sections
  const candidates = config.profile === 'tous'
    ? sections
    : sections.filter(s => s.profiles.includes(config.profile));

  const pool = candidates.length > 0 ? candidates : sections;
  const fiche = pool[Math.floor(Math.random() * pool.length)];

  if (!fiche) return false;

  // Calculate next trigger time
  const now = new Date();
  const target = new Date();
  target.setHours(config.hour, config.minute, 0, 0);

  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  try {
    await LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] });

    await LocalNotifications.schedule({
      notifications: [
        {
          id: NOTIFICATION_ID,
          title: L'Avenir en commun • \,
          body: fiche.mesureCle || fiche.intro || 'Découvrez la mesure du jour du programme 2027.',
          schedule: {
            at: target,
            allowWhileIdle: true,
            repeats: true,
            every: 'day'
          },
          sound: 'beep.wav',
          extra: {
            sectionId: fiche.id
          }
        }
      ]
    });

    console.log(Notification scheduled for \ daily (Section: \));
    return true;
  } catch (e) {
    console.warn('Could not schedule native notification:', e);
    return false;
  }
}

export async function triggerTestNotification(section: Section): Promise<boolean> {
  const granted = await requestNotificationPermission();
  try {
    const testId = 999999;
    const testTime = new Date(Date.now() + 3000); // 3 seconds later

    await LocalNotifications.schedule({
      notifications: [
        {
          id: testId,
          title: L'Avenir en commun • \,
          body: section.mesureCle || section.intro || 'Test de notification du programme 2027.',
          schedule: {
            at: testTime,
            allowWhileIdle: true
          },
          sound: 'beep.wav',
          extra: {
            sectionId: section.id
          }
        }
      ]
    });
    return true;
  } catch (e) {
    console.warn('Failed to schedule test notification:', e);
    return false;
  }
}
