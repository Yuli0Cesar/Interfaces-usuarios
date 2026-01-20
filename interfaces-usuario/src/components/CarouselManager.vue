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
      
      // Validar tamaño máximo (ej: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Máximo 5MB.');
        return;
      }
      
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
        width: 800, // Reducir tamaño para ahorrar espacio
        height: 450,
        imageSmoothingQuality: 'medium' // Reducir calidad para ahorrar espacio
      });
      
      // Comprimir más la imagen
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 0.7 calidad
      
      // Validar límite de localStorage (≈5MB)
      if (dataUrl.length > 500000) { // ≈500KB por imagen
        alert('La imagen resultante es demasiado grande. Intenta con una imagen más pequeña.');
        return;
      }
      
      this.addImage(dataUrl);
      this.clearCrop();
    },
    addImage(dataUrl) {
      // Limitar número máximo de imágenes
      const maxImages = 10;
      if (this.images.length >= maxImages) {
        alert(`Máximo ${maxImages} imágenes permitidas. Elimina alguna antes de añadir más.`);
        return;
      }
      
      this.images.push(dataUrl);
      this.saveImages();
    },
    removeImage(i) {
      if (confirm('¿Eliminar esta imagen del carrusel?')) {
        this.images.splice(i, 1);
        this.saveImages();
      }
    },
    saveImages() {
      try {
        localStorage.setItem('admin_carousel_images', JSON.stringify(this.images));
        window.dispatchEvent(new Event('carousel-updated'));
        console.log('Imágenes guardadas correctamente. Total:', this.images.length);
      } catch (e) {
        alert('Error al guardar imágenes. Es posible que haya excedido el límite de almacenamiento.');
        console.error('Error en localStorage:', e);
      }
    },
    loadImages() {
      try {
        const stored = localStorage.getItem('admin_carousel_images');
        this.images = stored ? JSON.parse(stored) : [];
        console.log('Imágenes cargadas:', this.images.length);
      } catch (e) {
        console.error('Error al cargar imágenes:', e);
        this.images = [];
      }
    },
    clearCrop() {
      if (this.cropper) { 
        this.cropper.destroy(); 
        this.cropper = null; 
      }
      this.srcImage = null;
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
