"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";

export default function SoundManager() {
  const isSoundEnabled = useStore((state) => state.isSoundEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isSoundEnabled) {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // Automatic watch beat simulation
      // We play a double mechanical click (tick-tock) at ~5.5Hz (180ms intervals)
      let tickCount = 0;
      const playWatchTick = () => {
        if (ctx.state === "suspended") {
          return; // browser security - waiting for user click to resume
        }

        const now = ctx.currentTime;
        tickCount++;

        // 1. High frequency sine oscillator for metal ring (jewel pallet fork strike)
        const osc = ctx.createOscillator();
        const gainOsc = ctx.createGain();
        osc.type = "sine";
        
        // Alternating frequency slightly for tick vs tock
        const freq = tickCount % 2 === 0 ? 3200 : 2800;
        osc.frequency.setValueAtTime(freq, now);
        
        // Decays extremely quickly (10ms)
        gainOsc.gain.setValueAtTime(0.003, now);
        gainOsc.gain.exponentialRampToValueAtTime(0.00001, now + 0.015);

        osc.connect(gainOsc);
        gainOsc.connect(ctx.destination);

        // 2. High-pass noise buffer for the spring/gear escapement snap
        const bufferSize = ctx.sampleRate * 0.015; // 15ms buffer
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.setValueAtTime(6000, now);

        const gainNoise = ctx.createGain();
        // Alternating volume slightly
        const vol = tickCount % 2 === 0 ? 0.005 : 0.0035;
        gainNoise.gain.setValueAtTime(vol, now);
        gainNoise.gain.exponentialRampToValueAtTime(0.00001, now + 0.01);

        noise.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.02);
        noise.start(now);
        noise.stop(now + 0.02);
      };

      // 180ms is equivalent to 20,000 vibrations per hour (vph)
      timerIdRef.current = setInterval(playWatchTick, 180);
    } catch (e) {
      console.warn("Web Audio API not supported or blocked: ", e);
    }

    return () => {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isSoundEnabled]);

  // Handle auto-resume on user click
  useEffect(() => {
    const resumeAudio = () => {
      if (isSoundEnabled && audioContextRef.current && audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume().catch(() => {});
      }
    };

    window.addEventListener("click", resumeAudio);
    window.addEventListener("touchstart", resumeAudio);
    return () => {
      window.removeEventListener("click", resumeAudio);
      window.removeEventListener("touchstart", resumeAudio);
    };
  }, [isSoundEnabled]);

  return null;
}
