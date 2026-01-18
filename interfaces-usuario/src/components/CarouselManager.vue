<template>
  <div class="carousel-manager">
    <h3>Gestor de Carousel</h3>
    <div class="uploader">
      <input type="file" accept="image/*" @change="onFileChange" />
    </div>

    <div v-if="srcImage" class="crop-area">
      <div class="crop-preview">
        <img ref="cropImg" :src="srcImage" alt="to-crop" />
      </div>
      <div class="crop-actions">
        <button @click="cropAndAdd">Recortar y Añadir</button>
        <button @click="clearCrop">Cancelar</button>
      </div>
    </div>

    <div class="thumbs">
      <div v-if="images.length === 0">No hay imágenes guardadas.</div>
      <div class="thumb" v-for="(img, idx) in images" :key="idx">
        <img :src="img" alt="thumb" />
        <div class="thumb-actions">
          <button @click="removeImage(idx)">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

export default {
  name: 'CarouselManager',
  data() {
    return {
      srcImage: null,
      cropper: null,
      images: []
    };
  },
  mounted() {
    this.loadImages();
  },
  beforeUnmount() {
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.srcImage = ev.target.result;
        this.$nextTick(this.initCropper);
      };
      reader.readAsDataURL(file);
    },
    initCropper() {
      if (this.cropper) this.cropper.destroy();
      const img = this.$refs.cropImg;
      if (!img) return;
      this.cropper = new Cropper(img, {
        viewMode: 1,
        aspectRatio: 16 / 9,
        autoCropArea: 1,
        responsive: true,
        movable: true,
        zoomable: true,
        rotatable: false
      });
    },
    cropAndAdd() {
      if (!this.cropper) return;
      const canvas = this.cropper.getCroppedCanvas({
        maxWidth: 1600,
        maxHeight: 900,
        imageSmoothingQuality: 'high'
      });
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      this.addImage(dataUrl);
      this.clearCrop();
    },
    addImage(dataUrl) {
      this.images.push(dataUrl);
      localStorage.setItem('admin_carousel_images', JSON.stringify(this.images));
      window.dispatchEvent(new Event('carousel-updated'));
    },
    removeImage(i) {
      this.images.splice(i, 1);
      localStorage.setItem('admin_carousel_images', JSON.stringify(this.images));
      window.dispatchEvent(new Event('carousel-updated'));
    },
    loadImages() {
      const stored = localStorage.getItem('admin_carousel_images');
      this.images = stored ? JSON.parse(stored) : [];
    },
    clearCrop() {
      if (this.cropper) { this.cropper.destroy(); this.cropper = null; }
      this.srcImage = null;
      // clear file input value if present
      const input = this.$el.querySelector('input[type=file]');
      if (input) input.value = '';
    }
  }
};
</script>

<style scoped>
.carousel-manager { padding: 8px; }
.crop-area { display:flex; gap:12px; align-items:flex-start; margin-top:8px; }
.crop-preview img { max-width: 480px; width: 100%; height: auto; display:block; }
.crop-actions { display:flex; flex-direction:column; gap:8px; }
.thumbs { display:flex; gap:12px; flex-wrap:wrap; margin-top:12px; }
.thumb { width:120px; position:relative; }
.thumb img { width:100%; height:80px; object-fit:cover; border-radius:6px; }
.thumb-actions { margin-top:6px; }
</style>
