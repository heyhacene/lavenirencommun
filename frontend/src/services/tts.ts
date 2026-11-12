// Service Text-To-Speech (TTS) hybride (Natif Capacitor Android + Web Speech API)
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

class TTSService {
  private isSpeakingState = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private resumeInterval: any = null;

  public isSupported(): boolean {
    if (Capacitor.isNativePlatform()) {
      return true;
    }
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public async speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void
  ): Promise<boolean> {
    const cleanText = text.trim();
    if (!cleanText) return false;

    // Arrêter toute lecture en cours
    await this.stop();

    // 1. Branche Native Android / iOS via Capacitor
    if (Capacitor.isNativePlatform()) {
      try {
        this.isSpeakingState = true;
        onStart?.();

        await TextToSpeech.speak({
          text: cleanText,
          lang: 'fr-FR',
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          category: 'playback'
        });

        this.isSpeakingState = false;
        onEnd?.();
        return true;
      } catch (nativeErr) {
        console.warn('[TTS] Native speak error, attempting Web fallback:', nativeErr);
        this.isSpeakingState = false;
        // Si le natif a échoué, continuer vers le Web fallback
      }
    }

    // 2. Branche Web Speech API (PWA / Navigateurs)
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const synth = window.speechSynthesis;

        // Débloquer l'audio Chrome/Safari
        try {
          synth.resume();
        } catch (e) {}

        this.isSpeakingState = true;

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Rechercher une voix française disponible
        const voices = synth.getVoices() || [];
        const frenchVoice =
          voices.find(v => v.lang === 'fr-FR' && !v.name.includes('compact')) ||
          voices.find(v => v.lang.startsWith('fr'));
        if (frenchVoice) {
          utterance.voice = frenchVoice;
        }

        utterance.onstart = () => {
          this.isSpeakingState = true;
          onStart?.();
        };

        const cleanupWeb = () => {
          this.isSpeakingState = false;
          this.currentUtterance = null;
          if (this.resumeInterval) {
            clearInterval(this.resumeInterval);
            this.resumeInterval = null;
          }
        };

        utterance.onend = () => {
          cleanupWeb();
          onEnd?.();
        };

        utterance.onerror = (e) => {
          cleanupWeb();
          if (e.error === 'canceled' || e.error === 'interrupted') {
            onEnd?.();
            return;
          }
          onError?.();
        };

        this.currentUtterance = utterance;

        // Ticker de réactivation pour éviter le bug des 15 secondes sur Chromium
        if (this.resumeInterval) clearInterval(this.resumeInterval);
        this.resumeInterval = setInterval(() => {
          if (synth.speaking && !synth.paused) {
            synth.pause();
            synth.resume();
          }
        }, 10000);

        // Petit délai pour laisser Chromium traiter l'annulation précédente
        setTimeout(() => {
          try {
            synth.speak(utterance);
          } catch (e) {
            cleanupWeb();
            onError?.();
          }
        }, 40);

        return true;
      } catch (err) {
        this.isSpeakingState = false;
        onError?.();
        return false;
      }
    }

    onError?.();
    return false;
  }

  public async stop(): Promise<void> {
    this.isSpeakingState = false;

    // Arrêter le natif si applicable
    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.stop();
      } catch (e) {}
    }

    // Arrêter le Web
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    this.currentUtterance = null;
    if (this.resumeInterval) {
      clearInterval(this.resumeInterval);
      this.resumeInterval = null;
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const tts = new TTSService();
