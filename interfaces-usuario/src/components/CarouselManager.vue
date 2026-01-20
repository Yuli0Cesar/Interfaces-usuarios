<template>
  <div class="carousel-manager">
    <h3>🖼️ Gestor de Carrusel</h3>
    
    <!-- Información de límites -->
    <div class="limits-info">
      <p>📊 Límites: <span :class="{ 'limit-warning': images.length < 3 }">Mínimo 3 imágenes</span> | Máximo 6 imágenes</p>
      <p>📈 Actualmente: <strong>{{ images.length }}/6 imágenes</strong></p>
      <p v-if="images.length < 3" class="warning-text">
        ⚠️ Necesitas al menos {{ 3 - images.length }} imagen(es) más para activar el carrusel
      </p>
    </div>

    <!-- Layout principal -->
    <div class="manager-layout">
      <!-- Columna izquierda: Subida y miniaturas -->
      <div class="manager-left">
        <!-- Área de subida -->
        <div class="upload-section">
          <div class="uploader">
            <label class="upload-label">
              <span class="upload-icon">📤</span>
              <span class="upload-text">Subir nueva imagen</span>
              <input 
                type="file" 
                accept="image/*" 
                @change="onFileChange" 
                :disabled="images.length >= 6"
              />
            </label>
            <small v-if="images.length >= 6" class="upload-disabled">
              ❌ Límite máximo alcanzado (6 imágenes)
            </small>
          </div>

          <!-- Área de recorte -->
          <div v-if="srcImage" class="crop-area">
            <div class="crop-header">
              <h5>✂️ Recortar imagen</h5>
              <small>Arrastra para seleccionar el área</small>
              <!-- Mostrar nombre del archivo -->
              <div v-if="currentFileName" class="file-name-display">
                📄 Archivo: <strong>{{ currentFileName }}</strong>
              </div>
            </div>
            <div class="crop-preview">
              <img ref="cropImg" :src="srcImage" alt="to-crop" />
            </div>
            <div class="crop-actions">
              <button @click="cropAndAdd" :disabled="images.length >= 6" class="crop-confirm-btn">
                ✅ Recortar y Añadir
              </button>
              <button @click="clearCrop" class="crop-cancel-btn">❌ Cancelar</button>
            </div>
          </div>
        </div>

        <!-- Miniaturas -->
        <div class="thumbs-section">
          <h4>📸 Imágenes Subidas ({{ images.length }}/6)</h4>
          
          <div v-if="images.length === 0" class="no-images">
            <div class="empty-state">
              <span class="empty-icon">🖼️</span>
              <p>No hay imágenes guardadas.</p>
              <p>Sube al menos 3 imágenes para activar el carrusel.</p>
            </div>
          </div>
          
          <div v-else>
            <div class="thumb-grid">
              <div 
                class="thumb" 
                v-for="(img, idx) in images" 
                :key="idx"
                :class="{ 
                  'active': normalizedCurrent === idx,
                  'first': idx === 0,
                  'last': idx === images.length - 1
                }"
                @click="previewGoTo(idx)"
              >
                <div class="thumb-header">
                  <span class="thumb-number">#{{ idx + 1 }}</span>
                  <button 
                    @click.stop="removeImage(idx)"
                    class="thumb-remove-btn"
                    :disabled="images.length <= 3"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
                <div class="thumb-image">
                  <img :src="img" :alt="`Imagen ${idx + 1}`" />
                </div>
                <div class="thumb-footer">
                  <span class="size-info">{{ getImageSize(img) }}</span>
                </div>
              </div>
              
              <!-- Espacio para nueva imagen -->
              <div 
                class="thumb add-new" 
                v-if="images.length < 6"
                @click="triggerFileInput"
              >
                <div class="add-new-content">
                  <span class="add-icon">+</span>
                  <p>Añadir imagen</p>
                  <small>{{ 6 - images.length }} restantes</small>
                </div>
              </div>
            </div>
            
            <!-- Botón para añadir más -->
            <div 
              v-if="images.length < 6 && !srcImage"
              class="add-more-section"
            >
              <button @click="triggerFileInput" class="add-more-btn">
                📤 Añadir más imágenes
              </button>
            </div>
            
            <!-- Validación -->
            <div 
              class="validation-message"
              :class="{ 
                'error': images.length < 3, 
                'warning': images.length >= 3 && images.length < 6,
                'success': images.length === 6 
              }"
            >
              <span v-if="images.length < 3">
                ⚠️ Necesitas al menos {{ 3 - images.length }} imagen(es) más
              </span>
              <span v-if="images.length === 6">
                ✅ Máximo alcanzado (6/6 imágenes)
              </span>
              <span v-if="images.length >= 3 && images.length < 6">
                ✅ Tienes {{ images.length }}/6 imágenes
                <span class="available-text">
                  (puedes añadir {{ 6 - images.length }} más)
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna derecha: Vista previa -->
      <div class="manager-right">
        <div class="preview-section">
          <h4>👁️ Vista Previa del Carrusel</h4>
          
          <div v-if="images.length >= 3" class="preview-container">
            <div class="preview-header">
              <span class="preview-title">Carrusel Activo</span>
              <span class="preview-count">{{ normalizedCurrent + 1 }}/{{ images.length }}</span>
            </div>
            
            <div class="preview-carousel">
              <div class="preview-frame">
                <button class="preview-nav prev" @click="previewPrev">‹</button>
                <div class="preview-viewport" ref="viewport">
                  <div class="preview-track" :style="trackStyle">
                    <div 
                      class="preview-slide" 
                      v-for="(img, idx) in extendedImages" 
                      :key="idx"
                      :style="slideStyle(idx)"
                    >
                      <div class="slide-image-container">
                        <img :src="img" alt="carousel-image" />
                        <div class="slide-overlay">
                          <span class="slide-number">#{{ (idx % images.length) + 1 }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button class="preview-nav next" @click="previewNext">›</button>
              </div>
              
              <div class="preview-indicators">
                <span 
                  v-for="(img, idx) in images" 
                  :key="`indicator-${idx}`"
                  :class="{ 'active': normalizedCurrent === idx }" 
                  @click="previewGoTo(idx)"
                ></span>
              </div>
            </div>
            
            <div class="preview-info">
              <div class="info-item">
                <span class="info-label">Estado:</span>
                <span class="info-value status-active">✅ Activo</span>
              </div>
              <div class="info-item">
                <span class="info-label">Auto-play:</span>
                <span class="info-value">{{ autoPreviewInterval ? 'Activado' : 'Pausado' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Imagen activa:</span>
                <span class="info-value">#{{ normalizedCurrent + 1 }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Visibles:</span>
                <span class="info-value">
                  {{ visibleIndices.map(i => `#${i + 1}`).join(', ') }}
                </span>
              </div>
              
              <div class="preview-actions">
                <button 
                  @click="toggleAutoPreview"
                  class="preview-action-btn"
                  :class="{ 'active': autoPreviewInterval }"
                >
                  {{ autoPreviewInterval ? '⏸️ Pausar' : '▶️ Auto-play' }}
                </button>
                <button 
                  @click="removeCurrentImage"
                  class="preview-action-btn danger"
                  :disabled="images.length <= 3"
                >
                  🗑️ Eliminar actual
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="preview-inactive">
            <div class="inactive-state">
              <span class="inactive-icon">⏸️</span>
              <h5>Carrusel Inactivo</h5>
              <p>El carrusel requiere al menos 3 imágenes.</p>
              <p class="inactive-count">
                Actualmente tienes: <strong>{{ images.length }}/3</strong>
              </p>
              <div class="progress-container">
                <div 
                  class="progress-bar" 
                  :style="{ width: `${(images.length / 3) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Estadísticas -->
        <div class="stats-section">
          <h4>📊 Estadísticas</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🖼️</div>
              <div class="stat-value">{{ images.length }}</div>
              <div class="stat-label">Imágenes</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📏</div>
              <div class="stat-value">{{ getTotalSize() }}</div>
              <div class="stat-label">Tamaño total</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⚙️</div>
              <div class="stat-value">{{ images.length >= 3 ? 'Activo' : 'Inactivo' }}</div>
              <div class="stat-label">Estado</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input de archivo oculto -->
    <input 
      type="file" 
      ref="fileInput"
      accept="image/*" 
      @change="onFileChange"
      style="display: none"
    />
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
      images: [],
      currentIndex: 0,
      autoPreviewInterval: null,
      currentFileName: '',
      slideWidth: 0,
      imagesPerView: 3,
      gap: 10,
      transitionActive: false
    };
  },
  computed: {
    // Array extendido para efecto infinito
    extendedImages() {
      if (!this.images || this.images.length === 0) return [];
      // Duplicamos el array para que haya suficientes imágenes para la rotación
      return [...this.images, ...this.images];
    },
    
    normalizedCurrent() {
      if (!this.images.length) return 0;
      return this.currentIndex % this.images.length;
    },
    
    trackStyle() {
      if (!this.images.length) return {};
      const totalWidth = this.extendedImages.length * this.slideWidth + 
                        (this.extendedImages.length - 1) * this.gap;
      const translateX = -this.currentIndex * (this.slideWidth + this.gap);
      
      return {
        width: `${totalWidth}px`,
        transform: `translateX(${translateX}px)`,
        transition: this.transitionActive ? 'transform 500ms ease' : 'none',
        display: 'flex',
        gap: `${this.gap}px`
      };
    },
    
    visibleIndices() {
      if (this.images.length < 3) return [];
      const total = this.images.length;
      const indices = [];
      
      // Las 3 imágenes que están completamente visibles
      for (let i = 0; i < 3; i++) {
        let idx = (this.normalizedCurrent + i) % total;
        indices.push(idx);
      }
      
      return indices;
    }
  },
  mounted() {
    this.loadImages();
    window.addEventListener('resize', this.computeSlideWidth);
    if (this.images.length >= 3) {
      this.$nextTick(() => {
        this.computeSlideWidth();
        this.startAutoPreview();
      });
    }
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.computeSlideWidth);
    this.stopAutoPreview();
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
  },
  watch: {
    images(newImages) {
      if (newImages.length >= 3) {
        this.$nextTick(() => {
          this.computeSlideWidth();
          this.startAutoPreview();
        });
      } else {
        this.stopAutoPreview();
      }
    }
  },
  methods: {
    onFileChange(e) {
      if (this.images.length >= 6) {
        alert('❌ Has alcanzado el límite máximo de 6 imágenes.');
        return;
      }
      
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      
      this.currentFileName = file.name;
      
      if (file.size > 5 * 1024 * 1024) {
        alert('⚠️ La imagen es demasiado grande. Máximo 5MB.');
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
        aspectRatio: 1,
        autoCropArea: 1,
        responsive: true,
        movable: true,
        zoomable: true,
        rotatable: false,
        background: false
      });
    },
    
    cropAndAdd() {
      if (!this.cropper) return;
      
      if (this.images.length >= 6) {
        alert('❌ Has alcanzado el límite máximo de 6 imágenes.');
        return;
      }
      
      const canvas = this.cropper.getCroppedCanvas({
        width: 400,
        height: 400,
        imageSmoothingQuality: 'medium'
      });
      
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      
      if (dataUrl.length > 300000) {
        alert('⚠️ La imagen resultante es demasiado grande. Intenta con una imagen más pequeña.');
        return;
      }
      
      this.addImage(dataUrl);
      this.clearCrop();
    },
    
    addImage(dataUrl) {
      const maxImages = 6;
      if (this.images.length >= maxImages) {
        alert(`❌ Máximo ${maxImages} imágenes permitidas.`);
        return;
      }
      
      this.images.push(dataUrl);
      this.saveImages();
    },
    
    removeImage(i) {
      if (this.images.length <= 3) {
        alert('⚠️ Debes mantener al menos 3 imágenes en el carrusel.');
        return;
      }
      
      if (confirm('¿Eliminar esta imagen del carrusel?')) {
        this.images.splice(i, 1);
        if (this.normalizedCurrent >= this.images.length) {
          this.currentIndex = 0;
        }
        this.saveImages();
      }
    },
    
    removeCurrentImage() {
      this.removeImage(this.normalizedCurrent);
    },
    
    saveImages() {
      try {
        localStorage.setItem('admin_carousel_images', JSON.stringify(this.images));
        window.dispatchEvent(new Event('carousel-updated'));
      } catch (e) {
        alert('❌ Error al guardar imágenes. Límite de almacenamiento excedido.');
        console.error('Error en localStorage:', e);
      }
    },
    
    loadImages() {
      try {
        const stored = localStorage.getItem('admin_carousel_images');
        this.images = stored ? JSON.parse(stored) : [];
        if (this.images.length >= 3) {
          this.$nextTick(() => {
            this.computeSlideWidth();
            this.currentIndex = 0;
          });
        }
      } catch (e) {
        console.error('Error al cargar imágenes:', e);
        this.images = [];
      }
    },
    
    computeSlideWidth() {
      this.$nextTick(() => {
        const vp = this.$refs.viewport;
        if (!vp) return;
        const vw = vp.clientWidth;
        const totalGap = (this.imagesPerView - 1) * this.gap;
        this.slideWidth = Math.floor((vw - totalGap) / this.imagesPerView);
      });
    },
    
    clearCrop() {
      if (this.cropper) { 
        this.cropper.destroy(); 
        this.cropper = null; 
      }
      this.srcImage = null;
      this.currentFileName = '';
      const inputs = this.$el.querySelectorAll('input[type=file]');
      inputs.forEach(input => {
        if (input) input.value = '';
      });
    },
    
    previewPrev() {
      if (!this.images.length || this.images.length < 3) return;
      
      this.transitionActive = true;
      this.currentIndex--;
      
      // Después de la transición, ajustar si estamos en el límite
      setTimeout(() => {
        this.transitionActive = false;
        const totalImages = this.images.length;
        
        // Si hemos pasado al array duplicado, resetear a la posición original
        if (this.currentIndex < 0) {
          this.currentIndex = totalImages - 1;
        }
      }, 500);
      
      this.restartAutoPreview();
    },
    
    previewNext() {
      if (!this.images.length || this.images.length < 3) return;
      
      this.transitionActive = true;
      this.currentIndex++;
      
      // Después de la transición, ajustar si estamos en el límite
      setTimeout(() => {
        this.transitionActive = false;
        const totalImages = this.images.length;
        
        // Si hemos pasado al array duplicado, resetear a la posición original
        if (this.currentIndex >= totalImages) {
          this.currentIndex = 0;
        }
      }, 500);
      
      this.restartAutoPreview();
    },
    
    previewGoTo(idx) {
      if (!this.images.length || this.images.length < 3) return;
      
      // Si ya está en una de las posiciones visibles, no hacer nada
      if (this.visibleIndices.includes(idx)) return;
      
      this.transitionActive = true;
      
      // Calcular la nueva posición
      const currentCenter = this.normalizedCurrent;
      const total = this.images.length;
      
      // Encontrar la distancia más corta
      let forwardDistance = 0;
      let tempIdx = currentCenter;
      while (tempIdx !== idx && forwardDistance < total) {
        forwardDistance++;
        tempIdx = (tempIdx + 1) % total;
      }
      
      let backwardDistance = 0;
      tempIdx = currentCenter;
      while (tempIdx !== idx && backwardDistance < total) {
        backwardDistance++;
        tempIdx = (tempIdx - 1 + total) % total;
      }
      
      // Usar la distancia más corta
      if (forwardDistance <= backwardDistance) {
        this.currentIndex += forwardDistance;
      } else {
        this.currentIndex -= backwardDistance;
      }
      
      setTimeout(() => {
        this.transitionActive = false;
        const totalImages = this.images.length;
        
        // Ajustar si estamos fuera del rango
        if (this.currentIndex < 0) {
          this.currentIndex = totalImages - 1;
        } else if (this.currentIndex >= totalImages) {
          this.currentIndex = 0;
        }
      }, 500);
      
      this.restartAutoPreview();
    },
    
    slideStyle(idx) {
      return {
        width: `${this.slideWidth}px`,
        flex: '0 0 auto'
      };
    },
    
    startAutoPreview() {
      if (this.images.length < 3) return;
      this.stopAutoPreview();
      this.autoPreviewInterval = setInterval(() => {
        if (this.images.length >= 3) this.previewNext();
      }, 4000);
    },
    
    stopAutoPreview() {
      if (this.autoPreviewInterval) {
        clearInterval(this.autoPreviewInterval);
        this.autoPreviewInterval = null;
      }
    },
    
    restartAutoPreview() {
      this.stopAutoPreview();
      this.startAutoPreview();
    },
    
    toggleAutoPreview() {
      if (this.autoPreviewInterval) {
        this.stopAutoPreview();
      } else if (this.images.length >= 3) {
        this.startAutoPreview();
      }
    },
    
    triggerFileInput() {
      if (this.images.length < 6) {
        this.$refs.fileInput.click();
      }
    },
    
    getImageSize(dataUrl) {
      const base64Length = dataUrl.length - (dataUrl.indexOf(',') + 1);
      const padding = dataUrl.endsWith('==') ? 2 : dataUrl.endsWith('=') ? 1 : 0;
      const fileSize = Math.floor((base64Length * 3) / 4) - padding;
      
      if (fileSize < 1024) {
        return fileSize + ' B';
      } else if (fileSize < 1024 * 1024) {
        return (fileSize / 1024).toFixed(1) + ' KB';
      } else {
        return (fileSize / (1024 * 1024)).toFixed(1) + ' MB';
      }
    },
    
    getTotalSize() {
      let totalBytes = 0;
      this.images.forEach(img => {
        const base64Length = img.length - (img.indexOf(',') + 1);
        const padding = img.endsWith('==') ? 2 : img.endsWith('=') ? 1 : 0;
        totalBytes += Math.floor((base64Length * 3) / 4) - padding;
      });
      
      if (totalBytes < 1024 * 1024) {
        return (totalBytes / 1024).toFixed(1) + ' KB';
      } else {
        return (totalBytes / (1024 * 1024)).toFixed(1) + ' MB';
      }
    }
  }
};
</script>

<style scoped>
.carousel-manager {
  padding: 20px;
  background: var(--background, #f8f9fa);
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 10px rgba(0,0,0,0.1));
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

h3 {
  color: var(--primary, #2c3e50);
  margin-bottom: 20px;
  font-size: 1.8rem;
  border-bottom: 3px solid var(--secondary, #e74c3c);
  padding-bottom: 10px;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.limits-info {
  background: var(--accent, #ffffff);
  padding: 15px;
  border-radius: var(--border-radius, 8px);
  margin-bottom: 25px;
  border-left: 4px solid var(--primary, #2c3e50);
  border: 1px solid rgba(0,0,0,0.05);
}

.limits-info p {
  margin: 8px 0;
  color: var(--text, #2c3e50);
  font-size: 0.95rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.limit-warning {
  color: #f44336;
  font-weight: bold;
}

.warning-text {
  background: rgba(255, 152, 0, 0.1);
  padding: 10px;
  border-radius: 6px;
  border-left: 3px solid #ff9800;
  margin-top: 10px !important;
  color: #e65100 !important;
}

/* ===== LAYOUT PRINCIPAL ===== */
.manager-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 30px;
  width: 100%;
}

/* Columna izquierda - CONTROLES */
.manager-left {
  display: flex;
  flex-direction: column;
  gap: 25px;
  min-width: 300px;
}

.upload-section {
  background: var(--accent, #ffffff);
  padding: 20px;
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 8px rgba(0,0,0,0.08));
  border: 1px solid rgba(0,0,0,0.05);
}

.uploader {
  margin-bottom: 20px;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px;
  background: var(--accent, #ffffff);
  border: 2px dashed var(--primary, #2c3e50);
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.upload-label:hover {
  border-color: var(--secondary, #e74c3c);
  background: var(--background, #f8f9fa);
  transform: translateY(-2px);
}

.upload-label input {
  display: none;
}

.upload-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
  display: block;
}

.upload-text {
  font-weight: 600;
  color: var(--primary, #2c3e50);
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.upload-disabled {
  display: block;
  margin-top: 10px;
  color: #f44336;
  font-style: italic;
  text-align: center;
  font-family: var(--secondary-font, Arial, sans-serif);
}

/* Área de recorte */
.crop-area {
  margin-top: 20px;
  padding: 20px;
  background: var(--accent, #ffffff);
  border-radius: var(--border-radius, 8px);
  border: 1px solid rgba(0,0,0,0.1);
}

.crop-header {
  margin-bottom: 15px;
  text-align: center;
}

.crop-header h5 {
  margin: 0 0 5px 0;
  color: var(--primary, #2c3e50);
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.crop-header small {
  color: var(--text, #7f8c8d);
  font-size: 0.9rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.file-name-display {
  margin-top: 10px;
  padding: 8px 12px;
  background: var(--background, #f8f9fa);
  border-radius: var(--border-radius, 6px);
  border: 1px solid rgba(var(--primary-rgb, 44, 62, 80), 0.1);
  color: var(--text, #2c3e50);
  font-size: 0.9rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.file-name-display strong {
  color: var(--secondary, #e74c3c);
}

.crop-preview {
  margin-bottom: 20px;
}

.crop-preview img {
  max-width: 100%;
  height: 180px;
  object-fit: contain;
  border-radius: var(--border-radius, 8px);
  border: 1px solid rgba(0,0,0,0.1);
}

.crop-actions {
  display: flex;
  gap: 10px;
}

.crop-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: var(--border-radius, 6px);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.crop-confirm-btn {
  background: var(--secondary, #e74c3c);
  color: white;
}

.crop-confirm-btn:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.crop-confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.crop-cancel-btn {
  background: var(--primary, #2c3e50);
  color: white;
  border: 1px solid rgba(0,0,0,0.1);
}

.crop-cancel-btn:hover {
  background: var(--text, #7f8c8d);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* Miniaturas */
.thumbs-section {
  background: var(--accent, #ffffff);
  padding: 20px;
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 8px rgba(0,0,0,0.08));
  border: 1px solid rgba(0,0,0,0.05);
}

.thumbs-section h4 {
  margin: 0 0 20px 0;
  color: var(--primary, #2c3e50);
  font-size: 1.3rem;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.no-images {
  text-align: center;
  padding: 40px 20px;
}

.empty-state {
  color: var(--text, #7f8c8d);
  font-family: var(--secondary-font, Arial, sans-serif);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 15px;
  opacity: 0.5;
}

.thumb-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.thumb {
  background: var(--accent, #ffffff);
  border-radius: var(--border-radius, 8px);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: var(--shadow, 0 2px 8px rgba(0,0,0,0.08));
}

.thumb:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.thumb.active {
  border-color: var(--secondary, #e74c3c);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.2);
}

.thumb.first {
  border-left: 4px solid var(--primary, #2c3e50);
}

.thumb.last {
  border-right: 4px solid var(--primary, #2c3e50);
}

.thumb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: var(--background, #f8f9fa);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.thumb-number {
  font-weight: bold;
  color: var(--primary, #2c3e50);
  font-size: 0.9rem;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.thumb-remove-btn {
  background: transparent;
  color: #f44336;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  padding: 5px;
  border-radius: 4px;
}

.thumb-remove-btn:hover:not(:disabled) {
  background: #ffebee;
  transform: scale(1.1);
}

.thumb-remove-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.thumb-image {
  height: 90px;
  overflow: hidden;
}

.thumb-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-footer {
  padding: 8px 10px;
  background: var(--background, #f8f9fa);
  border-top: 1px solid rgba(0,0,0,0.05);
}

.size-info {
  font-size: 0.75rem;
  color: var(--text, #7f8c8d);
  font-family: var(--secondary-font, Arial, sans-serif);
}

/* Miniatura para añadir nueva */
.thumb.add-new {
  border: 2px dashed var(--primary, #2c3e50);
  background: var(--accent, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
}

.add-new-content {
  text-align: center;
  padding: 20px;
}

.add-icon {
  font-size: 2rem;
  color: var(--primary, #2c3e50);
  display: block;
  margin-bottom: 10px;
  opacity: 0.7;
}

.add-new p {
  margin: 0;
  color: var(--primary, #2c3e50);
  font-weight: 600;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.add-new small {
  color: var(--text, #7f8c8d);
  font-size: 0.8rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.add-new:hover {
  border-color: var(--secondary, #e74c3c);
  background: var(--background, #f8f9fa);
}

.add-more-section {
  text-align: center;
  margin: 20px 0;
}

.add-more-btn {
  background: var(--primary, #2c3e50);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: var(--border-radius, 6px);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.add-more-btn:hover {
  background: var(--secondary, #e74c3c);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* Validación */
.validation-message {
  padding: 15px;
  border-radius: var(--border-radius, 8px);
  text-align: center;
  font-weight: 600;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.validation-message.error {
  background: rgba(244, 67, 54, 0.1);
  color: #c62828;
  border: 1px solid #ffcdd2;
}

.validation-message.warning {
  background: rgba(255, 193, 7, 0.1);
  color: #f57c00;
  border: 1px solid #fff3cd;
}

.validation-message.success {
  background: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.available-text {
  opacity: 0.8;
  font-weight: normal;
  font-size: 0.9rem;
}

/* ===== COLUMNA DERECHA: VISTA PREVIA ===== */
.manager-right {
  display: flex;
  flex-direction: column;
  gap: 25px;
  flex: 1;
  min-width: 0;
}

.preview-section {
  background: var(--accent, #ffffff);
  padding: 25px;
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 8px rgba(0,0,0,0.08));
  border: 1px solid rgba(0,0,0,0.05);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.preview-section h4 {
  margin: 0 0 25px 0;
  color: var(--primary, #2c3e50);
  font-size: 1.4rem;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.preview-container {
  animation: fadeIn 0.5s ease;
  flex: 1;
  display: flex;
  flex-direction: column;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid var(--background, #f8f9fa);
}

.preview-title {
  font-weight: 600;
  color: var(--primary, #2c3e50);
  font-size: 1.2rem;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.preview-count {
  background: var(--secondary, #e74c3c);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: var(--secondary-font, Arial, sans-serif);
}

/* ===== CARRUSEL CON ROTACIÓN INFINITA ===== */
.preview-carousel {
  position: relative;
  margin-bottom: 25px;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
}

.preview-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 5px 0;
  width: 100%;
}

.preview-viewport {
  overflow: hidden;
  width: 100%;
  border-radius: var(--border-radius, 12px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  background: var(--background, #f8f9fa);
  min-height: 250px;
  padding: 0;
  flex: 1;
}

.preview-track {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  height: 100%;
  width: 100%;
  will-change: transform;
}

.preview-slide {
  flex: 0 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.preview-slide .slide-image-container {
  width: 100%;
  height: 230px;
  position: relative;
  border-radius: var(--border-radius, 8px);
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}

/* Destacar imagen central */
.preview-slide:nth-child(2) .slide-image-container {
  border: 2px solid var(--secondary, #e74c3c);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
}

.preview-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Overlay con número de slide */
.slide-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-family: var(--secondary-font, Arial, sans-serif);
  font-weight: 600;
  z-index: 5;
}

/* Botones de navegación */
.preview-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.45);
  color: #fff;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
}

.preview-nav:hover {
  background: rgba(0,0,0,0.6);
  transform: translateY(-50%) scale(1.1);
}

.preview-nav.prev {
  left: 2px;
}

.preview-nav.next {
  right: 2px;
}

/* Indicadores */
.preview-indicators {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-top: 12px;
  padding: 0;
}

.preview-indicators span {
  width: 8px;
  height: 8px;
  background: var(--background, #ddd);
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.preview-indicators span.active {
  background: var(--secondary, #e74c3c);
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.5);
}

.preview-indicators span:hover {
  background: var(--primary, #2c3e50);
  transform: scale(1.2);
}

/* ===== INFORMACIÓN Y ACCIONES ===== */
.preview-info {
  background: var(--background, #f8f9fa);
  padding: 15px;
  border-radius: var(--border-radius, 10px);
  border: 1px solid rgba(0,0,0,0.05);
  margin-top: auto;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-family: var(--secondary-font, Arial, sans-serif);
  font-size: 0.9rem;
}

.info-label {
  color: var(--text, #7f8c8d);
  font-weight: 500;
}

.info-value {
  color: var(--primary, #2c3e50);
  font-weight: 600;
}

.status-active {
  color: #27ae60 !important;
}

.preview-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.preview-action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
  background: var(--primary, #2c3e50);
  color: white;
  border: 1px solid rgba(0,0,0,0.1);
}

.preview-action-btn:hover:not(:disabled) {
  background: var(--secondary, #e74c3c);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.2);
}

.preview-action-btn.active {
  background: var(--secondary, #e74c3c);
  color: white;
}

.preview-action-btn.danger {
  background: #dc3545;
  color: white;
}

.preview-action-btn.danger:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(220, 53, 69, 0.3);
}

.preview-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== VISTA PREVIA INACTIVA ===== */
.preview-inactive {
  text-align: center;
  padding: 30px 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.inactive-state {
  color: var(--text, #7f8c8d);
  font-family: var(--secondary-font, Arial, sans-serif);
  max-width: 350px;
}

.inactive-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 15px;
  opacity: 0.5;
}

.inactive-state h5 {
  margin: 0 0 12px 0;
  color: var(--primary, #2c3e50);
  font-size: 1.2rem;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.inactive-count {
  margin: 15px 0 !important;
  color: var(--text, #2c3e50) !important;
  font-size: 1.1rem !important;
  font-weight: 600;
}

.progress-container {
  height: 8px;
  background: var(--background, #e0e0e0);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 15px;
}

.progress-bar {
  height: 100%;
  background: var(--secondary, #e74c3c);
  transition: width 0.5s ease;
}

/* ===== ESTADÍSTICAS ===== */
.stats-section {
  background: var(--accent, #ffffff);
  padding: 15px;
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 8px rgba(0,0,0,0.08));
  border: 1px solid rgba(0,0,0,0.05);
}

.stats-section h4 {
  margin: 0 0 15px 0;
  color: var(--primary, #2c3e50);
  font-size: 1.2rem;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  text-align: center;
  padding: 15px 8px;
  background: var(--background, #f8f9fa);
  border-radius: var(--border-radius, 10px);
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.12);
}

.stat-icon {
  font-size: 1.5rem;
  margin-bottom: 8px;
  display: block;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary, #2c3e50);
  margin-bottom: 4px;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text, #7f8c8d);
  font-family: var(--secondary-font, Arial, sans-serif);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .manager-layout {
    grid-template-columns: 280px 1fr;
  }
  
  .preview-slide .slide-image-container {
    height: 210px;
  }
  
  .preview-viewport {
    min-height: 230px;
  }
}

@media (max-width: 992px) {
  .manager-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .manager-left {
    min-width: auto;
  }
  
  .thumb-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .preview-slide .slide-image-container {
    height: 190px;
  }
  
  .preview-viewport {
    min-height: 210px;
  }
  
  .thumb-image {
    height: 100px;
  }
}

@media (max-width: 768px) {
  .carousel-manager {
    padding: 15px;
  }
  
  .thumb-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .crop-actions {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .preview-slide .slide-image-container {
    height: 170px;
  }
  
  .preview-viewport {
    min-height: 190px;
  }
  
  .preview-nav {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
  
  .preview-nav.prev {
    left: 1px;
  }
  
  .preview-nav.next {
    right: 1px;
  }
}

@media (max-width: 480px) {
  .thumb-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-indicators {
    flex-wrap: wrap;
  }
  
  .preview-nav {
    width: 28px;
    height: 28px;
    font-size: 0.9rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-slide .slide-image-container {
    height: 140px;
  }
  
  .preview-viewport {
    min-height: 160px;
  }
  
  .preview-track {
    gap: 8px;
  }
  
  .slide-overlay {
    top: 6px;
    right: 6px;
    padding: 3px 6px;
    font-size: 0.75rem;
  }
}
</style>