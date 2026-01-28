<template>
  <div class="video-carousel-preview" v-if="videos.length">
    <div class="carousel-frame">
      <button class="nav prev" @click="prev">‹</button>
      <div class="carousel-viewport" ref="viewport">
        <div class="carousel-track" :style="trackStyle">
          <div
            class="slide"
            v-for="(v, idx) in extendedVideos"
            :key="idx"
            :style="{ width: slideWidth + 'px' }"
          >
            <div class="video-card" @click="openVideo(v)">
              <div class="video-thumb">
                <img :src="v.thumbnail || defaultThumb" :alt="v.title || 'Video'" />
                <div class="play-overlay">
                  <span class="play-icon">▶</span>
                </div>
              </div>
              <div class="video-caption" v-if="v.title">
                {{ v.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="nav next" @click="next">›</button>
    </div>

    <div class="indicators">
      <span
        v-for="(p, idx) in videos"
        :key="idx"
        :class="{ active: idx === normalizedCurrent }"
        @click="go(idx)"
      ></span>
    </div>

    <div
      v-if="showPlayer && activeVideo"
      class="video-modal"
      @click.self="closePlayer"
    >
      <div class="video-modal-content">
        <button class="video-modal-close" @click="closePlayer">✖</button>

        <div class="video-modal-player-wrapper" @click="closeOverlayMenus">
          <video
            ref="modalVideo"
            class="video-modal-player"
            :src="activeVideo.url"
            :poster="activeVideo.thumbnail || ''"
            autoplay
            playsinline
            @play="onModalVideoPlay"
            @pause="onModalVideoPause"
            @ended="onModalVideoEnded"
            @timeupdate="onModalTimeUpdate"
            @loadedmetadata="onModalLoadedMetadata"
            @volumechange="onModalVolumeChangeEvent"
          ></video>

          <!-- Barra de controles personalizada -->
          <div class="custom-controls">
            <div class="controls-left">
              <button class="control-btn" @click.stop="toggleModalPlay">
                {{ isPlaying ? '▪' : '➡' }}
              </button>
              <span class="time-label">
                {{ formattedCurrentTime }} / {{ formattedDuration }}
              </span>
            </div>

            <div class="controls-center">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                v-model.number="progress"
                @input.stop="onModalSeek"
                class="progress-bar"
              >
            </div>

            <div class="controls-right">
              <button class="control-btn" @click.stop="toggleModalMute">
                {{ isMuted ? '🔇' : '🔈' }}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                v-model.number="volume"
                @input.stop="onModalVolumeInput"
                class="volume-slider"
              >
              <button class="control-btn" @click.stop="toggleModalFullscreen">
                {{ isFullscreen ? '⎚' : '🖵' }}
              </button>

              <!-- Botón de subtítulos tipo "CC" -->
              <div v-if="subtitleTracks.length" class="overlay-group">
                <button
                  class="overlay-btn"
                  title="Subtítulos"
                  @click.stop="toggleSubtitleMenu"
                >
                  CC
                </button>
                <div v-if="showSubtitleMenu" class="overlay-menu">
                  <button
                    :class="{ active: activeSubtitleIndex === -1 }"
                    @click.stop="setModalSubtitle(-1)"
                  >
                    🚫 Sin subtítulos
                  </button>
                  <button
                    v-for="(s, idx) in subtitleTracks"
                    :key="idx"
                    :class="{ active: activeSubtitleIndex === idx }"
                    @click.stop="setModalSubtitle(idx)"
                  >
                    💬 Sub {{ idx + 1 }}
                  </button>
                </div>
              </div>

              <!-- Botón de selección de idioma de audio -->
              <div v-if="audioTracks.length" class="overlay-group">
                <button
                  class="overlay-btn"
                  title="Pistas de audio"
                  @click.stop="toggleAudioMenu"
                >
                  🗣
                </button>
                <div v-if="showAudioMenu" class="overlay-menu">
                  <button
                    :class="{ active: activeAudioIndex === -1 }"
                    @click.stop="setModalAudio(-1)"
                  >
                    🎵 Audio original
                  </button>
                  <button
                    v-for="(a, idx) in audioTracks"
                    :key="idx"
                    :class="{ active: activeAudioIndex === idx }"
                    @click.stop="setModalAudio(idx)"
                  >
                    🔊 Pista {{ idx + 1 }}
                  </button>
                  <div v-if="activeAudioIndex !== -1" class="modal-volume">
                    <input
                      type="range"
                      v-model.number="externalVolume"
                      min="0"
                      max="1"
                      step="0.01"
                      @input="changeModalExternalVolume"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="video-modal-title" v-if="activeVideo.title">
          {{ activeVideo.title }}
        </div>
      </div>
    </div>
  </div>

  <div v-else class="carousel-empty">
    No hay videos en el carrusel. Agrégalos desde Admin → Gestión de Videos.
  </div>
</template>

<script>
import * as VideoStore from '../videoIndexedDB';

export default {
  name: 'VideoCarouselPreviewFixed',
  data() {
    return {
      videos: [],
      videosPerView: 3,
      gapPx: 12,
      currentIndex: 0,
      transitioning: false,
      slideWidth: 0,
      timer: null,
      _resetTimer: null,
      activeVideo: null,
      showPlayer: false,
      // Soporte de pistas
      audioTracks: [],
      subtitleTracks: [],
      audioElements: [],
      activeAudioIndex: -1,
      activeSubtitleIndex: -1,
      externalVolume: 1,
      _syncInterval: null,
      showAudioMenu: false,
      showSubtitleMenu: false,
      // Controles personalizados del reproductor
      isPlaying: false,
      isMuted: false,
      duration: 0,
      currentTime: 0,
      progress: 0,
      volume: 1,
      isFullscreen: false,
      _preMuteExternalVolume: 1,
      defaultThumb:
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="225" viewBox="0 0 400 225"><rect width="400" height="225" fill="%23000000"/><polygon points="160,70 280,112.5 160,155" fill="%23ffffff"/></svg>'
    };
  },
  mounted() {
    this.loadVideos();
    window.addEventListener('video-carousel-updated', this.loadVideos);
    window.addEventListener('videos-updated', this.loadVideos);
    window.addEventListener('resize', this.computeSlideWidth);
    this.startAuto();
  },
  beforeUnmount() {
    window.removeEventListener('video-carousel-updated', this.loadVideos);
    window.removeEventListener('videos-updated', this.loadVideos);
    window.removeEventListener('resize', this.computeSlideWidth);
    this.stopAuto();
    clearTimeout(this._resetTimer);
  },
  computed: {
    extendedVideos() {
      if (!this.videos || this.videos.length === 0) return [];
      return [...this.videos, ...this.videos, ...this.videos];
    },
    normalizedCurrent() {
      if (!this.videos.length) return 0;
      const n = this.videos.length;
      return ((this.currentIndex - n) % n + n) % n;
    },
    trackStyle() {
      if (!this.videos.length) return {};
      const gapTotal = this.gapPx * (this.extendedVideos.length - 1);
      const width = this.extendedVideos.length * this.slideWidth + gapTotal;
      const slideStep = this.slideWidth + this.gapPx;
      const translateX = -this.currentIndex * slideStep;
      return {
        width: width + 'px',
        transform: `translateX(${translateX}px)`,
        transition: this.transitioning ? 'transform 500ms ease' : 'none'
      };
    },

    formattedCurrentTime() {
      return this.formatTime(this.currentTime);
    },

    formattedDuration() {
      return this.formatTime(this.duration);
    }
  },
  methods: {
    loadVideos() {
      let ids = [];
      let allVideos = [];

      try {
        const storedIds = localStorage.getItem('admin_carousel_videos');
        ids = storedIds ? JSON.parse(storedIds) : [];
      } catch (e) {
        ids = [];
      }

      try {
        const storedAll = localStorage.getItem('jdmTuningVideos');
        allVideos = storedAll ? JSON.parse(storedAll) : [];
      } catch (e) {
        allVideos = [];
      }

      const byId = new Map(allVideos.map(v => [v.id, v]));
      const list = ids
        .map(id => byId.get(id))
        .filter(Boolean)
        .map(v => ({
          id: v.id,
          title: v.title || v.name || 'Video',
          // La URL se resolverá bajo demanda desde IndexedDB si es necesario
          url: v.videoUrl || v.url || v.dataUrl || null,
          storage: v.storage || null,
          thumbnail: v.thumbnail || null,
          audioTracks: v.audioTracks || [],
          subtitles: v.subtitles || []
        }));

      this.videos = list;

      this.$nextTick(() => {
        this.computeSlideWidth();
        this.currentIndex = this.videos.length ? this.videos.length : 0;
      });
    },

    computeSlideWidth() {
      this.$nextTick(() => {
        const vp = this.$refs.viewport;
        if (!vp) return;
        const vw = vp.clientWidth;
        const totalGaps = this.gapPx * (this.videosPerView - 1);
        this.slideWidth = Math.floor((vw - totalGaps) / this.videosPerView);
      });
    },

    prev() {
      if (!this.videos.length) return;
      this.transitioning = true;
      this.currentIndex -= 1;
      this.afterTransitionCheck();
      this.restartAuto();
    },

    next() {
      if (!this.videos.length) return;
      this.transitioning = true;
      this.currentIndex += 1;
      this.afterTransitionCheck();
      this.restartAuto();
    },

    go(i) {
      if (!this.videos.length) return;
      this.transitioning = true;
      this.currentIndex = this.videos.length + i;
      this.afterTransitionCheck();
      this.restartAuto();
    },

    afterTransitionCheck() {
      const duration = 500;
      clearTimeout(this._resetTimer);
      this._resetTimer = setTimeout(() => {
        this.transitioning = false;
        const n = this.videos.length;
        if (this.currentIndex >= 2 * n) {
          this.currentIndex = this.currentIndex - n;
        } else if (this.currentIndex < n) {
          this.currentIndex = this.currentIndex + n;
        }
      }, duration);
    },

    startAuto() {
      this.stopAuto();
      this.timer = setInterval(() => {
        if (this.videos.length) this.next();
      }, 7000);
    },

    stopAuto() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    restartAuto() {
      this.stopAuto();
      this.startAuto();
    },

    async openVideo(video) {
      if (!video) return;

      let url = video.url;
      if (!url && video.storage === 'indexeddb') {
        try {
          url = await VideoStore.getVideoUrl(video.id);
        } catch (e) {
          console.error('Error obteniendo video desde IndexedDB:', e);
        }
      }

      if (!url) return;

      this.activeVideo = { ...video, url };
      this.audioTracks = [...(video.audioTracks || [])];
      this.subtitleTracks = [...(video.subtitles || [])];
      this.activeAudioIndex = -1;
      this.activeSubtitleIndex = -1;
      this.showPlayer = true;
      this.stopAuto();

      this.$nextTick(() => {
        this.setupModalTracks();
        const v = this.$refs.modalVideo;
        if (v) {
          this.duration = v.duration || 0;
          this.currentTime = v.currentTime || 0;
          this.volume = v.volume != null ? v.volume : 1;
          this.isMuted = !!v.muted;
          this.updateModalProgressFromVideo();
        }
      });
    },

    closePlayer() {
      this.showPlayer = false;
      this.activeVideo = null;
      this.cleanupModalTracks();
      this.showAudioMenu = false;
      this.showSubtitleMenu = false;
      this.startAuto();
    },

    // ===== Soporte de audio/subtítulos en el modal =====
    getBlobUrlIfNeeded(src) {
      if (!src || typeof src !== 'string') return src;
      if (!src.startsWith('data:')) return src;
      try {
        const parts = src.split(',');
        const meta = parts[0];
        const isBase64 = meta.indexOf(';base64') !== -1;
        const mime = meta.split(':')[1].split(';')[0] || 'application/octet-stream';
        const data = parts[1] || '';
        let byteString;
        if (isBase64) byteString = atob(data);
        else byteString = decodeURIComponent(data);
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        const blob = new Blob([ia], { type: mime });
        return URL.createObjectURL(blob);
      } catch (e) {
        console.error('getBlobUrlIfNeeded failed (modal)', e);
        return src;
      }
    },

    convertSubtitleToVttUrl(src) {
      if (!src || typeof src !== 'string') return src;
      if (!src.startsWith('data:')) return src;
      try {
        const comma = src.indexOf(',');
        const meta = src.substring(5, comma);
        const isBase64 = meta.indexOf(';base64') !== -1;
        const data = src.substring(comma + 1);
        let text;
        if (isBase64) text = atob(data);
        else text = decodeURIComponent(data);

        const srtPattern = /\d{2}:\d{2}:\d{2},\d{3}/;
        let vttText = text;
        if (srtPattern.test(text) && !/^WEBVTT/m.test(text)) {
          vttText = 'WEBVTT\n\n' + text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
        } else if (!/^WEBVTT/m.test(text)) {
          vttText = 'WEBVTT\n\n' + text;
        }

        const blob = new Blob([vttText], { type: 'text/vtt' });
        return URL.createObjectURL(blob);
      } catch (e) {
        console.error('convertSubtitleToVttUrl failed (modal)', e);
        return src;
      }
    },

    setupModalTracks() {
      const videoElement = this.$refs.modalVideo;
      if (!videoElement) return;

      // Limpiar anteriores
      this.cleanupModalTracks(false);

      // Subtítulos
      try {
        const existing = videoElement.querySelectorAll('track');
        existing.forEach(t => t.remove());

        (this.subtitleTracks || []).forEach((subSrc, idx) => {
          if (!subSrc) return;
          const track = document.createElement('track');
          track.kind = 'subtitles';
          track.label = `Sub ${idx + 1}`;
          track.srclang = 'es';
          const real = this.convertSubtitleToVttUrl(subSrc);
          track.src = real;
          track.default = false;
          track.mode = 'disabled';
          videoElement.appendChild(track);
        });
      } catch (e) {
        console.error('Error configurando subtítulos (modal):', e);
      }

      // Audio externo
      try {
        this.audioElements = (this.audioTracks || []).map((audioSrc, index) => {
          if (!audioSrc) return null;
          try {
            let realSrc = audioSrc;
            if (audioSrc.startsWith('data:audio/')) realSrc = this.getBlobUrlIfNeeded(audioSrc);
            const audioElement = new Audio();
            audioElement.src = realSrc;
            audioElement.preload = 'metadata';
            audioElement.crossOrigin = 'anonymous';
            audioElement.volume = this.externalVolume;
            return audioElement;
          } catch (err) {
            console.error(`Failed to create modal audio element for track ${index}:`, err);
            return null;
          }
        }).filter(Boolean);
      } catch (error) {
        console.error('Error configurando pistas de audio (modal):', error);
        this.audioElements = [];
      }
    },

    cleanupModalTracks(stopAll = true) {
      const videoElement = this.$refs.modalVideo;

      if (stopAll) {
        if (this._syncInterval) {
          clearInterval(this._syncInterval);
          this._syncInterval = null;
        }
      }

      (this.audioElements || []).forEach(a => {
        try {
          a.pause();
          a.src = '';
        } catch (e) {}
      });
      this.audioElements = [];

      if (videoElement) {
        const existing = videoElement.querySelectorAll('track');
        existing.forEach(t => t.remove());
      }
    },

    onModalVideoPlay() {
      const videoElement = this.$refs.modalVideo;
      if (!videoElement) return;
      this.isPlaying = true;
      if (this.activeAudioIndex !== -1 && this.audioElements[this.activeAudioIndex]) {
        const audioElement = this.audioElements[this.activeAudioIndex];
        audioElement.currentTime = videoElement.currentTime;
        audioElement.play().catch(() => {});
      }
      this.startModalSyncInterval();
    },

    onModalVideoPause() {
      this.isPlaying = false;
      if (this.activeAudioIndex !== -1 && this.audioElements[this.activeAudioIndex]) {
        this.audioElements[this.activeAudioIndex].pause();
      }
      if (this._syncInterval) {
        clearInterval(this._syncInterval);
        this._syncInterval = null;
      }
    },

    onModalVideoEnded() {
      this.isPlaying = false;
      if (this.activeAudioIndex !== -1 && this.audioElements[this.activeAudioIndex]) {
        this.audioElements[this.activeAudioIndex].pause();
        this.audioElements[this.activeAudioIndex].currentTime = 0;
      }
      if (this._syncInterval) {
        clearInterval(this._syncInterval);
        this._syncInterval = null;
      }
    },

    startModalSyncInterval() {
      if (this._syncInterval) {
        clearInterval(this._syncInterval);
      }
      this._syncInterval = setInterval(() => {
        this.syncModalAudioWithVideo();
      }, 120);
    },

    syncModalAudioWithVideo() {
      const videoElement = this.$refs.modalVideo;
      if (!videoElement || this.activeAudioIndex === -1 || !this.audioElements[this.activeAudioIndex]) return;

      const audioElement = this.audioElements[this.activeAudioIndex];
      const videoTime = videoElement.currentTime;
      const audioTime = audioElement.currentTime;
      if (Math.abs(videoTime - audioTime) > 0.1) {
        audioElement.currentTime = videoTime;
      }
      if (!videoElement.paused && audioElement.paused) {
        audioElement.play().catch(() => {});
      }
    },

    onModalAudioChange() {
      this.changeModalAudioTrack(this.activeAudioIndex);
    },

    changeModalAudioTrack(index) {
      const videoElement = this.$refs.modalVideo;
      if (!videoElement) return;

      if (this.activeAudioIndex !== -1 && this.audioElements[this.activeAudioIndex]) {
        try { this.audioElements[this.activeAudioIndex].pause(); } catch (e) {}
      }

      this.activeAudioIndex = index;

      if (index === -1) {
        videoElement.muted = false;
        return;
      }

      const chosenAudio = this.audioElements[index];
      if (!chosenAudio) return;
      chosenAudio.volume = this.externalVolume;
      videoElement.muted = true;

      if (!videoElement.paused) {
        chosenAudio.currentTime = videoElement.currentTime;
        chosenAudio.play().catch(() => {});
        this.startModalSyncInterval();
      }
    },

    changeModalExternalVolume() {
      if (this.activeAudioIndex !== -1 && this.audioElements[this.activeAudioIndex]) {
        this.audioElements[this.activeAudioIndex].volume = this.externalVolume;
      }
    },

    changeModalSubtitleTrack(index) {
      const videoElement = this.$refs.modalVideo;
      if (!videoElement) return;
      const textTracks = videoElement.textTracks || [];
      for (let i = 0; i < textTracks.length; i++) {
        try {
          textTracks[i].mode = (i === index) ? 'showing' : 'disabled';
        } catch (e) {}
      }
    },

    // UI de botones tipo reproductor
    closeOverlayMenus() {
      this.showAudioMenu = false;
      this.showSubtitleMenu = false;
    },

    toggleAudioMenu() {
      this.showAudioMenu = !this.showAudioMenu;
      if (this.showAudioMenu) this.showSubtitleMenu = false;
    },

    toggleSubtitleMenu() {
      this.showSubtitleMenu = !this.showSubtitleMenu;
      if (this.showSubtitleMenu) this.showAudioMenu = false;
    },

    setModalSubtitle(index) {
      this.activeSubtitleIndex = index;
      this.changeModalSubtitleTrack(index);
      this.showSubtitleMenu = false;
    },

    setModalAudio(index) {
      // Delegamos el cambio completo (incluyendo parar la pista previa)
      this.changeModalAudioTrack(index);
      // mantenemos el menú abierto para poder ajustar volumen
    },

    // ===== Controles personalizados de la barra =====
    formatTime(seconds) {
      if (!isFinite(seconds) || seconds < 0) return '0:00';
      const s = Math.floor(seconds % 60).toString().padStart(2, '0');
      const m = Math.floor(seconds / 60).toString();
      return `${m}:${s}`;
    },

    updateModalProgressFromVideo() {
      const v = this.$refs.modalVideo;
      if (!v || !isFinite(v.duration) || v.duration <= 0) {
        this.progress = 0;
        return;
      }
      this.duration = v.duration;
      this.currentTime = v.currentTime;
      this.progress = (v.currentTime / v.duration) * 100;
    },

    onModalLoadedMetadata() {
      const v = this.$refs.modalVideo;
      if (!v) return;
      this.duration = v.duration || 0;
      this.currentTime = v.currentTime || 0;
      this.updateModalProgressFromVideo();
    },

    onModalTimeUpdate() {
      this.updateModalProgressFromVideo();
    },

    onModalSeek() {
      const v = this.$refs.modalVideo;
      if (!v || !isFinite(this.duration) || this.duration <= 0) return;
      const clamped = Math.min(100, Math.max(0, this.progress));
      const newTime = (clamped / 100) * this.duration;
      v.currentTime = newTime;
      this.currentTime = newTime;
      if (this.activeAudioIndex !== -1 && this.audioElements[this.activeAudioIndex]) {
        this.audioElements[this.activeAudioIndex].currentTime = newTime;
      }
    },

    onModalVolumeInput() {
      const v = this.$refs.modalVideo;
      if (!v) return;
      const vol = Math.min(1, Math.max(0, this.volume));
      this.volume = vol;
      v.volume = vol;
      this.isMuted = v.muted || vol === 0;
    },

    onModalVolumeChangeEvent() {
      const v = this.$refs.modalVideo;
      if (!v) return;
      this.volume = v.volume;
      this.isMuted = !!v.muted || v.volume === 0;
    },

    toggleModalPlay() {
      const v = this.$refs.modalVideo;
      if (!v) return;
      if (v.paused) v.play().catch(() => {});
      else v.pause();
    },

    toggleModalMute() {
      const v = this.$refs.modalVideo;
      if (!v) return;

      if (this.activeAudioIndex === -1) {
        v.muted = !v.muted;
        this.isMuted = !!v.muted;
      } else {
        if (this.externalVolume > 0) {
          this._preMuteExternalVolume = this.externalVolume;
          this.externalVolume = 0;
        } else {
          this.externalVolume = this._preMuteExternalVolume || 1;
        }
        this.changeModalExternalVolume();
        this.isMuted = this.externalVolume === 0;
      }
    },

    async toggleModalFullscreen() {
      const container = this.$el.querySelector('.video-modal-content');
      if (!container || typeof document === 'undefined') return;

      try {
        if (!document.fullscreenElement) {
          if (container.requestFullscreen) await container.requestFullscreen();
          this.isFullscreen = true;
        } else {
          if (document.exitFullscreen) await document.exitFullscreen();
          this.isFullscreen = false;
        }
      } catch (e) {
        console.error('Error al cambiar a pantalla completa:', e);
      }
    }
  }
};
</script>

<style scoped>
.carousel-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 10px 0;
  border-radius: 8px;
}

.carousel-viewport {
  overflow: hidden;
  width: 100%;
}

.carousel-track {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.slide {
  flex: 0 0 auto;
}

.video-card {
  width: 100%;
  cursor: pointer;
}

.video-thumb {
  position: relative;
  width: 100%;
  height: 260px;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
}

.video-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.55));
}

.play-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.7rem;
  background: rgba(0, 0, 0, 0.35);
}

.video-caption {
  margin-top: 10px;
  text-align: center;
  font-weight: 600;
  color: var(--text);
  font-family: var(--font-family);
}

.video-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.video-modal-content {
  background: #000;
  padding: 0.75rem 0.75rem 1rem;
  border-radius: 10px;
  max-width: 900px;
  width: 95%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  position: relative;
}

.video-modal-close {
  position: absolute;
  top: 6px;
  right: 8px;
  border: none;
  background: transparent;
  color: #fff;
  font-size: 1.4rem;
  cursor: pointer;
}

.video-modal-player {
  width: 100%;
  max-height: 70vh;
  border-radius: 8px;
  background: #000;
}

.video-modal-player-wrapper {
  position: relative;
}

.custom-controls {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #fff;
}

.controls-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.controls-center {
  flex: 1;
}

.controls-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.control-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.time-label {
  font-size: 0.78rem;
  min-width: 90px;
}

.progress-bar {
  width: 100%;
}

.volume-slider {
  width: 80px;
}

.overlay-group {
  position: relative;
}

.overlay-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.overlay-menu {
  position: absolute;
  bottom: 32px;
  right: 0;
  background: rgba(0, 0, 0, 0.85);
  padding: 4px 6px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 120px;
}

.overlay-menu button {
  background: transparent;
  border: none;
  color: #fff;
  text-align: left;
  padding: 3px 4px;
  font-size: 0.75rem;
  cursor: pointer;
}

.overlay-menu button.active {
  background: rgba(255, 255, 255, 0.15);
}

.modal-volume {
  margin-top: 4px;
}

.modal-volume input[type="range"] {
  width: 100%;
}

.video-modal-title {
  margin-top: 0.6rem;
  text-align: center;
  color: #fff;
  font-weight: 600;
  font-family: var(--font-family);
}

.nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border: none;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  font-size: 1.4rem;
  z-index: 2;
  border-radius: 6px;
}

.prev {
  left: 6px;
}

.next {
  right: 6px;
}

.indicators {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-top: 12px;
}

.indicators span {
  width: 10px;
  height: 10px;
  background: #ddd;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
}

.indicators span.active {
  background: #333;
}

.carousel-empty {
  color: var(--text);
  padding: 1rem;
}

@media (max-width: 900px) {
  .video-thumb {
    height: 200px;
  }
}

@media (max-width: 520px) {
  .video-thumb {
    height: 160px;
  }
}
</style>
