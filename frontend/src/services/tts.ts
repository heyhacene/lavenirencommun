// Service Text-To-Speech (TTS) natif pour écouter les mesures et fiches

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private frenchVoice: SpeechSynthesisVoice | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const findVoice = () => {
      const voices = this.synth?.getVoices() || [];
      // Priorité à une voix française de qualité (Google français, Thomas, Amélie, etc.)
      this.frenchVoice =
        voices.find(v => v.lang === 'fr-FR' && !v.name.includes('compact')) ||
        voices.find(v => v.lang.startsWith('fr')) ||
        null;
      this.isInitialized = true;
    };

    findVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = findVoice;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void
  ): boolean {
    if (!this.isSupported() || !this.synth) {
      return false;
    }

    // Arrêter toute lecture précédente
    this.stop();

    const cleanText = text.trim();
    if (!cleanText) return false;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      if (!this.frenchVoice && !this.isInitialized) {
        this.initVoices();
      }
      if (this.frenchVoice) {
        utterance.voice = this.frenchVoice;
      }

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        // Ignorer les erreurs dues à une annulation volontaire
        if (e.error === 'canceled' || e.error === 'interrupted') {
          onEnd?.();
          return;
        }
        this.currentUtterance = null;
        onError?.();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;
    } catch (err) {
      this.currentUtterance = null;
      onError?.();
      return false;
    }
  }

  public stop(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // Ignorer
      }
    }
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }
}

export const tts = new TTSService();
