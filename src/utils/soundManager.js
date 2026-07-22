/**
 * Jarvis Infinity System — Sound FX Manager (Web Audio API Synthesizer)
 *
 * Tổng hợp trực tiếp các tiếng click cơ học và âm thanh sci-fi.
 * Không phụ thuộc vào tài nguyên tệp âm thanh bên ngoài (.mp3/.wav).
 */

let audioCtx = null;
let soundEnabled = true;

export const soundManager = {
  /**
   * Cập nhật trạng thái bật/tắt âm thanh
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    soundEnabled = !!enabled;
  },

  /**
   * Phát âm thanh theo loại
   * @param {'click' | 'beep' | 'warning' | 'success'} type
   */
  play(type) {
    if (!soundEnabled) return;

    try {
      // Lazy initialization của AudioContext theo quy định của trình duyệt
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      switch (type) {
        case "click": {
          // Tiếng click ngắn sắc sảo
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.type = "sine";
          osc.frequency.setValueAtTime(1000, now);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

          osc.start(now);
          osc.stop(now + 0.035);
          break;
        }

        case "beep": {
          // Tiếng beep phản hồi cyber nhẹ
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.type = "triangle";
          osc.frequency.setValueAtTime(880, now);

          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

          osc.start(now);
          osc.stop(now + 0.07);
          break;
        }

        case "warning": {
          // Tiếng rè cảnh báo tần số thấp
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();

          osc.connect(gain);
          gain.connect(audioCtx.destination);

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.linearRampToValueAtTime(120, now + 0.15);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

          osc.start(now);
          osc.stop(now + 0.16);
          break;
        }

        case "success": {
          // Âm thanh kép thăng hoa báo hiệu hoàn thành
          const osc1 = audioCtx.createOscillator();
          const osc2 = audioCtx.createOscillator();
          const gain1 = audioCtx.createGain();
          const gain2 = audioCtx.createGain();

          osc1.connect(gain1);
          gain1.connect(audioCtx.destination);
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);

          osc1.type = "sine";
          osc1.frequency.setValueAtTime(523.25, now); // nốt Đô C5
          gain1.gain.setValueAtTime(0.05, now);
          gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

          osc2.type = "sine";
          osc2.frequency.setValueAtTime(783.99, now + 0.08); // nốt Sol G5
          gain2.gain.setValueAtTime(0.05, now + 0.08);
          gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

          osc1.start(now);
          osc1.stop(now + 0.15);
          osc2.start(now + 0.08);
          osc2.stop(now + 0.22);
          break;
        }

        default:
          break;
      }
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by permissions:", e);
    }
  }
};
