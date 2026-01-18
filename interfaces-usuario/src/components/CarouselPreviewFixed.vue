<template>
  <div class="carousel-preview" v-if="images.length">
    <div class="carousel-frame">
      <button class="nav prev" @click="prev">‹</button>
      <div class="carousel-viewport" ref="viewport">
        <div class="carousel-track" :style="trackStyle" ref="track">
          <div class="slide" v-for="(img, idx) in extendedImages" :key="idx" :style="{ width: slideWidth + 'px' }">
            <img :src="img" alt="carousel-image" />
          </div>
        </div>
      </div>
      <button class="nav next" @click="next">›</button>
    </div>
    <div class="indicators">
      <span v-for="(p, idx) in images" :key="idx" :class="{ active: idx === normalizedCurrent }" @click="go(idx)"></span>
    </div>
  </div>
  <div v-else class="carousel-empty">No hay imágenes en el carousel.</div>
</template>

<script>
export default {
  name: 'CarouselPreviewFixed',
  data() {
    return {
      images: [],
      imagesPerView: 3,
      gapPx: 8,
      currentIndex: 0,
      transitioning: false,
      slideWidth: 0,
      timer: null,
      _resetTimer: null
    };
  },
  mounted() {
    this.loadImages();
    window.addEventListener('carousel-updated', this.loadImages);
    window.addEventListener('resize', this.computeSlideWidth);
    this.startAuto();
  },
  beforeUnmount() {
    window.removeEventListener('carousel-updated', this.loadImages);
    window.removeEventListener('resize', this.computeSlideWidth);
    this.stopAuto();
    clearTimeout(this._resetTimer);
  },
  computed: {
    extendedImages() {
      if (!this.images || this.images.length === 0) return [];
      return [...this.images, ...this.images, ...this.images];
    },
    normalizedCurrent() {
      if (!this.images.length) return 0;
      const n = this.images.length;
      return ((this.currentIndex - n) % n + n) % n;
    },
    trackStyle() {
      if (!this.images.length) return {};
      const gapTotal = this.gapPx * (this.extendedImages.length - 1);
      const width = this.extendedImages.length * this.slideWidth + gapTotal;
      const slideStep = this.slideWidth + this.gapPx;
      const translateX = -this.currentIndex * slideStep;
      return {
        width: width + 'px',
        transform: `translateX(${translateX}px)`,
        transition: this.transitioning ? 'transform 500ms ease' : 'none'
      };
    }
  },
  methods: {
    loadImages() {
      const stored = localStorage.getItem('admin_carousel_images');
      this.images = stored ? JSON.parse(stored) : [];
      this.$nextTick(() => {
        this.computeSlideWidth();
        if (this.images.length) {
          this.currentIndex = this.images.length;
        } else {
          this.currentIndex = 0;
        }
      });
    },
    computeSlideWidth() {
      this.$nextTick(() => {
        const vp = this.$refs.viewport;
        if (!vp) return;
        const vw = vp.clientWidth;
        const totalGaps = this.gapPx * (this.imagesPerView - 1);
        this.slideWidth = Math.floor((vw - totalGaps) / this.imagesPerView);
      });
    },
    prev() {
      if (!this.images.length) return;
      this.transitioning = true;
      this.currentIndex -= 1;
      this.afterTransitionCheck();
      this.restartAuto();
    },
    next() {
      if (!this.images.length) return;
      this.transitioning = true;
      this.currentIndex += 1;
      this.afterTransitionCheck();
      this.restartAuto();
    },
    go(i) {
      if (!this.images.length) return;
      this.transitioning = true;
      this.currentIndex = this.images.length + i;
      this.afterTransitionCheck();
      this.restartAuto();
    },
    afterTransitionCheck() {
      const duration = 500;
      clearTimeout(this._resetTimer);
      this._resetTimer = setTimeout(() => {
        this.transitioning = false;
        const n = this.images.length;
        if (this.currentIndex >= 2 * n) {
          this.currentIndex = this.currentIndex - n;
        } else if (this.currentIndex < n) {
          this.currentIndex = this.currentIndex + n;
        }
      }, duration);
    },
    startAuto() {
      this.stopAuto();
      this.timer = setInterval(() => { if (this.images.length) this.next(); }, 4000);
    },
    stopAuto() {
      if (this.timer) { clearInterval(this.timer); this.timer = null; }
    },
    restartAuto() {
      this.stopAuto();
      this.startAuto();
    }
  }
};
</script>

<style scoped>
.carousel-frame { position: relative; display:flex; align-items:center; justify-content:center; background:transparent; padding:10px 0; border-radius:8px; }
.carousel-viewport { overflow: hidden; width: 100%; }
.carousel-track { display:flex; gap:8px; align-items:center; }
.slide { flex: 0 0 auto; }
.slide img { width:100%; height:320px; object-fit:cover; display:block; border-radius:8px; }
.nav { position:absolute; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.45); color:#fff; border:none; padding:0.4rem 0.6rem; cursor:pointer; font-size:1.4rem; z-index:2; border-radius:6px; }
.prev { left:6px; }
.next { right:6px; }
.indicators { display:flex; gap:6px; justify-content:center; margin-top:12px; }
.indicators span { width:10px; height:10px; background:#ddd; border-radius:50%; display:inline-block; cursor:pointer; }
.indicators span.active { background:#333; }
.carousel-empty { color:var(--text); padding:1rem; }

@media (max-width: 900px) {
  .slide img { height:220px; }
}

@media (max-width: 520px) {
  .slide img { height:160px; }
}
</style>
