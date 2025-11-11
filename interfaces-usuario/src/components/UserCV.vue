<template>
  <div class="user-cv-container">
    <!-- Header con navegación -->
    <header>
      <div class="container">
        <nav>
          <a href="#" class="logo">JDM TUNING</a>
          <div class="nav-links">
            <a href="#" @click="goToAbout">Volver al Sitio</a>
            
            <!-- Panel de usuario -->
            <div class="user-panel" v-if="user">
              <span class="user-greeting">
                Hola, {{ user.email }}
              </span>
              <button class="logout-btn" @click="handleLogout">Cerrar Sesión</button>
            </div>
          </div>
        </nav>
      </div>
    </header>

    <!-- Contenido principal -->
    <main class="cv-builder">
      <div class="container">
        <div class="builder-header">
          <h1>Creador de Currículum Profesional</h1>
          <p>Crea tu currículum profesional en formato gris oscuro</p>
          <div class="header-actions">
            <button class="action-btn secondary" @click="resetForm">
              🔄 Reiniciar
            </button>
            <button class="action-btn primary" @click="downloadCV" :disabled="!isFormValid">
              📄 Descargar PDF
            </button>
          </div>
        </div>

        <!-- Layout principal: Formulario izquierda, Vista previa derecha -->
        <div class="cv-layout">
          <!-- Columna izquierda: Formulario -->
          <div class="form-column">
            <div class="form-container">
              <!-- Navegación por pasos -->
              <div class="steps-navigation">
                <button 
                  v-for="step in steps" 
                  :key="step.id"
                  class="step-tab"
                  :class="{ active: currentStep === step.id }"
                  @click="setCurrentStep(step.id)"
                >
                  <span class="step-icon">{{ step.icon }}</span>
                  <span class="step-text">{{ step.title }}</span>
                </button>
              </div>

              <!-- Contenido del formulario -->
              <div class="form-content">
                <!-- Paso 1: Información Personal -->
                <div v-if="currentStep === 1" class="form-section">
                  <h2>Información Personal</h2>
                  
                  <!-- Campo para subir foto -->
                  <div class="form-group full-width">
                    <label>Foto de Perfil (Opcional)</label>
                    <div class="photo-upload-container">
                      <div class="photo-preview" v-if="formData.personalInfo.photo">
                        <img :src="formData.personalInfo.photo" alt="Foto de perfil" class="photo-preview-img">
                        <button type="button" class="remove-photo-btn" @click="removePhoto">🗑️</button>
                      </div>
                      <div class="photo-upload-area" v-else>
                        <input
                          type="file"
                          ref="photoInput"
                          accept="image/*"
                          @change="handlePhotoUpload"
                          class="photo-input"
                          id="photo-upload"
                        >
                        <label for="photo-upload" class="photo-upload-label">
                          <span class="upload-icon">📷</span>
                          <span class="upload-text">Haz clic para subir una foto</span>
                          <span class="upload-hint">Recomendado: 150x150 px</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="form-grid">
                    <div class="form-group">
                      <label>Nombre Completo *</label>
                      <input
                        type="text"
                        v-model="formData.personalInfo.fullName"
                        placeholder="Ej: Alejandro Torres"
                        required
                      >
                    </div>

                    <div class="form-group">
                      <label>Título Profesional *</label>
                      <input
                        type="text"
                        v-model="formData.personalInfo.title"
                        placeholder="Ej: Programador web"
                        required
                      >
                    </div>

                    <div class="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        v-model="formData.personalInfo.email"
                        placeholder="Ej: Hola@unsitiogenial.es"
                        required
                      >
                    </div>

                    <div class="form-group">
                      <label>Teléfono</label>
                      <input
                        type="tel"
                        v-model="formData.personalInfo.phone"
                        placeholder="Ej: +34-91-1234-567"
                      >
                    </div>

                    <div class="form-group">
                      <label>Ubicación</label>
                      <input
                        type="text"
                        v-model="formData.personalInfo.location"
                        placeholder="Ej: Calle Cualquiera 123, Cualquier Lugar"
                      >
                    </div>

                    <div class="form-group">
                      <label>Sitio Web (opcional)</label>
                      <input
                        type="url"
                        v-model="formData.personalInfo.website"
                        placeholder="Ej: www.unsitiogenial.es"
                      >
                    </div>
                  </div>
                </div>

                <!-- Paso 2: Perfil Profesional -->
                <div v-if="currentStep === 2" class="form-section">
                  <h2>Perfil Profesional</h2>
                  
                  <div class="form-group">
                    <label>Perfil * (Máximo 200 caracteres)</label>
                    <textarea
                      v-model="formData.profile"
                      rows="6"
                      placeholder="Describe tu experiencia profesional, habilidades clave y objetivos de carrera..."
                      required
                      maxlength="200"
                      :class="{
                        'char-limit-safe': formData.profile.length <= 180,
                        'char-limit-warning': formData.profile.length > 180 && formData.profile.length <= 200,
                        'char-limit-danger': formData.profile.length > 200
                      }"
                    ></textarea>
                    
                    <div class="char-counter-container">
                      <div class="char-progress-bar">
                        <div 
                          class="char-progress-fill"
                          :class="{
                            'progress-safe': formData.profile.length <= 180,
                            'progress-warning': formData.profile.length > 180 && formData.profile.length <= 200,
                            'progress-danger': formData.profile.length > 200
                          }"
                          :style="{ width: Math.min((formData.profile.length / 200) * 100, 100) + '%' }"
                        ></div>
                      </div>
                      
                      <div class="char-count" 
                          :class="{
                            'count-safe': formData.profile.length <= 180,
                            'count-warning': formData.profile.length > 180 && formData.profile.length <= 200,
                            'count-danger': formData.profile.length > 200
                          }">
                        <span class="char-number">{{ formData.profile.length }}/200</span>
                        <span v-if="formData.profile.length > 180 && formData.profile.length <= 200" class="char-message">
                          ⚠️ Cerca del límite
                        </span>
                        <span v-else-if="formData.profile.length > 200" class="char-message">
                          ❌ Límite excedido
                        </span>
                        <span v-else class="char-message">
                          ✅ Dentro del límite
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Paso 3: Experiencia Laboral -->
                <div v-if="currentStep === 3" class="form-section">
                  <div class="section-header">
                    <h2>Experiencia Laboral</h2>
                    <button class="add-btn" @click="addExperience">
                      + Añadir Experiencia
                    </button>
                  </div>
                  
                  <div class="items-list">
                    <div v-for="(exp, index) in formData.experience" :key="index" class="form-item">
                      <div class="item-header">
                        <h3>Experiencia {{ index + 1 }}</h3>
                        <button class="remove-btn" @click="removeExperience(index)" v-if="formData.experience.length > 1">
                          🗑️ Eliminar
                        </button>
                      </div>

                      <div class="form-grid">
                        <div class="form-group">
                          <label>Empresa *</label>
                          <input
                            type="text"
                            v-model="exp.company"
                            placeholder="Ej: Multinacional González"
                            required
                          >
                        </div>

                        <div class="form-group">
                          <label>Período *</label>
                          <input
                            type="text"
                            v-model="exp.period"
                            placeholder="Ej: 2019 - 2023"
                            required
                          >
                        </div>

                        <div class="form-group full-width">
                          <label>Descripción</label>
                          <textarea
                            v-model="exp.description"
                            rows="4"
                            placeholder="Describe tus responsabilidades, logros y habilidades utilizadas..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Paso 4: Formación Académica -->
                <div v-if="currentStep === 4" class="form-section">
                  <div class="section-header">
                    <h2>Formación Académica</h2>
                    <button class="add-btn" @click="addEducation">
                      + Añadir Formación
                    </button>
                  </div>
                  
                  <div class="items-list">
                    <div v-for="(edu, index) in formData.education" :key="index" class="form-item">
                      <div class="item-header">
                        <h3>Formación {{ index + 1 }}</h3>
                        <button class="remove-btn" @click="removeEducation(index)" v-if="formData.education.length > 1">
                          🗑️ Eliminar
                        </button>
                      </div>

                      <div class="form-grid">
                        <div class="form-group">
                          <label>Título o Grado *</label>
                          <input
                            type="text"
                            v-model="edu.degree"
                            placeholder="Ej: Ingeniería en sistemas"
                            required
                          >
                        </div>

                        <div class="form-group">
                          <label>Institución *</label>
                          <input
                            type="text"
                            v-model="edu.institution"
                            placeholder="Ej: Universidad Ensigna"
                            required
                          >
                        </div>

                        <div class="form-group">
                          <label>Período</label>
                          <input
                            type="text"
                            v-model="edu.period"
                            placeholder="Ej: 2018 - 2023"
                          >
                        </div>

                        <div class="form-group full-width">
                          <label>Especialización (opcional)</label>
                          <input
                            type="text"
                            v-model="edu.specialization"
                            placeholder="Ej: Programación web"
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Paso 5: Competencias -->
                <div v-if="currentStep === 5" class="form-section">
                  <div class="section-header">
                    <h2>Competencias</h2>
                    <button class="add-btn" @click="addCompetence">
                      + Añadir Competencia
                    </button>
                  </div>
                  
                  <div class="items-list">
                    <div v-for="(comp, index) in formData.competences" :key="index" class="form-item">
                      <div class="item-header">
                        <h3>Competencia {{ index + 1 }}</h3>
                        <button class="remove-btn" @click="removeCompetence(index)" v-if="formData.competences.length > 1">
                          🗑️ Eliminar
                        </button>
                      </div>

                      <div class="form-group">
                        <label>Competencia *</label>
                        <input
                          type="text"
                          v-model="comp.name"
                          placeholder="Ej: Liderazgo, Software 01, Creatividad"
                          required
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Paso 6: Habilidades -->
                <div v-if="currentStep === 6" class="form-section">
                  <div class="section-header">
                    <h2>Habilidades</h2>
                    <button class="add-btn" @click="addSkill">
                      + Añadir Habilidad
                    </button>
                  </div>
                  <div class="items-list">
                    <div v-for="(skill, index) in formData.skills" :key="index" class="form-item">
                      <div class="item-header">
                        <h3>Habilidad {{ index + 1 }}</h3>
                        <button class="remove-btn" @click="removeSkill(index)" v-if="formData.skills.length > 1">
                          🗑️ Eliminar
                        </button>
                      </div>
                      <div class="form-grid">
                        <div class="form-group">
                          <label>Nombre *</label>
                          <input
                            type="text"
                            v-model="skill.name"
                            placeholder="Ej: Trabajo en equipo, Creatividad, Vue.js"
                            required
                          />
                        </div>
                        <div class="form-group">
                          <label>Nivel</label>
                          <div class="rating-selector">
                            <select v-model="skill.rating" class="rating-dropdown">
                              <option value="1">⭐ (1 - Básico)</option>
                              <option value="2">⭐⭐ (2 - Principiante)</option>
                              <option value="3">⭐⭐⭐ (3 - Intermedio)</option>
                              <option value="4">⭐⭐⭐⭐ (4 - Avanzado)</option>
                              <option value="5">⭐⭐⭐⭐⭐ (5 - Experto)</option>
                            </select>
                            <div class="rating-preview">
                              <span class="stars-preview">{{ '⭐'.repeat(skill.rating) }}{{ '☆'.repeat(5 - skill.rating) }}</span>
                              <span class="rating-text">({{ skill.rating }}/5)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Paso 7: Idiomas -->
                <div v-if="currentStep === 7" class="form-section">
                  <div class="section-header">
                    <h2>Idiomas</h2>
                    <button class="add-btn" @click="addLanguage">
                      + Añadir Idioma
                    </button>
                  </div>
                  
                  <div class="items-list">
                    <div v-for="(lang, index) in formData.languages" :key="index" class="form-item">
                      <div class="item-header">
                        <h3>Idioma {{ index + 1 }}</h3>
                        <button class="remove-btn" @click="removeLanguage(index)" v-if="formData.languages.length > 1">
                          🗑️ Eliminar
                        </button>
                      </div>

                      <div class="form-grid">
                        <div class="form-group">
                          <label>Idioma *</label>
                          <input
                            type="text"
                            v-model="lang.name"
                            placeholder="Ej: Español, Inglés"
                            required
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Navegación -->
                <div class="form-navigation">
                  <button class="nav-btn prev" @click="prevStep" v-if="currentStep > 1">
                    ← Anterior
                  </button>
                  <button class="nav-btn next" @click="nextStep" v-if="currentStep < steps.length">
                    Siguiente →
                  </button>
                  <button class="nav-btn save" @click="saveCV" v-if="currentStep === steps.length">
                    💾 Guardar Currículum
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna derecha: Vista previa -->
          <div class="preview-column">
            <div class="preview-container">
              <div class="preview-header">
                <h2>Vista Previa - Estilo Gris Oscuro</h2>
                <div class="preview-actions">
                  <button class="preview-btn" @click="downloadCV" :disabled="!isFormValid">
                    📄 Descargar PDF
                  </button>
                </div>
              </div>
              
              <div class="preview-content" ref="cvPreview">
                <div class="cv-template-dark">
                  <!-- CABECERA CON PERFIL Y DATOS PERSONALES -->
                                    <div class="cv-header-dark">
                    <div class="header-main-with-photo">
                      <!-- Foto de perfil a la izquierda -->
                      <div class="photo-container" v-if="formData.personalInfo.photo">
                        <img :src="formData.personalInfo.photo" alt="Foto de perfil" class="profile-photo">
                      </div>
                      <!-- Nombre y título centrados -->
                      <div class="header-text-center">
                        <h1>{{ formData.personalInfo.fullName || 'Tu Nombre Completo' }}</h1>
                        <p class="cv-title-dark">{{ formData.personalInfo.title || 'Tu Profesión' }}</p>
                      </div>
                      <!-- Espacio vacío a la derecha para balance -->
                      <div class="photo-placeholder" v-if="!formData.personalInfo.photo"></div>
                    </div>
                    <div class="header-grid">
                      <!-- Izquierda: Perfil -->
                      <div class="header-left">
                        <div class="profile-section" v-if="formData.profile">
                          <h2 class="section-title-dark">Mi Perfil</h2>
                          <p class="profile-text">{{ formData.profile }}</p>
                        </div>
                      </div>
                      <!-- Derecha: Datos personales -->
                      <div class="header-right">
                        <span v-if="formData.personalInfo.phone">📞 {{ formData.personalInfo.phone }}</span>
                        <span v-if="formData.personalInfo.email">✉️ {{ formData.personalInfo.email }}</span>
                        <span v-if="formData.personalInfo.website">🌐 {{ formData.personalInfo.website }}</span>
                        <span v-if="formData.personalInfo.location">📍 {{ formData.personalInfo.location }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="cv-content-dark">
                    <!-- COLUMNA IZQUIERDA: Experiencia Laboral y Formación Académica -->
                    <div class="cv-left-column">
                      <!-- Experiencia laboral -->
                      <div class="cv-section-dark" v-if="formData.experience.some(exp => exp.company)">
                        <h2 class="section-title-dark">Experiencia Laboral</h2>
                        <div class="experience-list-dark">
                          <div class="experience-item-dark" v-for="(exp, index) in formData.experience.filter(exp => exp.company)" :key="index">
                            <div class="exp-header-dark">
                              <span class="exp-check">✅</span>
                              <div class="exp-info">
                                <h3 class="company-name">{{ exp.company }}</h3>
                                <p class="exp-period">{{ exp.period }}</p>
                              </div>
                            </div>
                            <p class="exp-description" v-if="exp.description">{{ exp.description }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Formación académica -->
                      <div class="cv-section-dark" v-if="formData.education.some(edu => edu.degree)">
                        <h2 class="section-title-dark">Formación Académica</h2>
                        <div class="education-list-dark">
                          <div class="education-item-dark" v-for="(edu, index) in formData.education.filter(edu => edu.degree)" :key="index">
                            <div class="edu-header-dark">
                              <span class="edu-check">✅</span>
                              <div class="edu-info">
                                <h3 class="edu-degree">{{ edu.degree }}</h3>
                                <p class="edu-period" v-if="edu.period">{{ edu.period }}</p>
                              </div>
                            </div>
                            <p class="edu-institution" v-if="edu.institution">{{ edu.institution }}</p>
                            <p class="edu-specialization" v-if="edu.specialization">{{ edu.specialization }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- COLUMNA DERECHA: Idiomas y Competencias -->
                    <div class="cv-right-column">
                      <!-- Idiomas -->
                      <div class="cv-section-dark" v-if="formData.languages.some(lang => lang.name)">
                        <h2 class="section-title-dark">Idiomas</h2>
                        <div class="languages-list-dark">
                          <div class="language-item-dark" v-for="(lang, index) in formData.languages.filter(lang => lang.name)" :key="index">
                            <span class="language-check">✅</span>
                            <span class="language-name-dark">{{ lang.name }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Competencias -->
                      <div class="cv-section-dark" v-if="formData.competences.some(comp => comp.name)">
                        <h2 class="section-title-dark">Competencias</h2>
                        <div class="competences-list-dark">
                          <div class="competence-item-dark" v-for="(comp, index) in formData.competences.filter(comp => comp.name)" :key="index">
                            {{ comp.name }}
                          </div>
                        </div>
                      </div>

                      <!-- Paso visualización de habilidades en el preview (en la vista previa del CV) -->
                      <div class="cv-section-dark" v-if="formData.skills && formData.skills.some(skill => skill.name)">
                        <h2 class="section-title-dark">Habilidades</h2>
                        <div class="skills-list-dark">
                          <div class="skill-item-dark" v-for="(skill, index) in formData.skills.filter(skill => skill.name)" :key="index">
                            <span class="skill-name">{{ skill.name }}</span>
                            <StarRating :rating="skill.rating" :editable="false" :max="5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import pdfMake from 'pdfmake/build/pdfmake';

// Configuración de fuentes para pdfmake
let fontsLoaded = false;

async function loadPdfFonts() {
  if (fontsLoaded) {
    return true;
  }

  return new Promise((resolve, reject) => {
    // Si ya están cargadas, resolver inmediatamente
    if (pdfMake.vfs && Object.keys(pdfMake.vfs).length > 0) {
      fontsLoaded = true;
      console.log('Fuentes ya cargadas:', Object.keys(pdfMake.vfs));
      resolve(true);
      return;
    }

    // Intentar cargar desde CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js';
    script.onload = () => {
      console.log('vfs_fonts.js cargado desde CDN');
      
      // Dar tiempo para que se procese
      setTimeout(() => {
        if (pdfMake.vfs && Object.keys(pdfMake.vfs).length > 0) {
          fontsLoaded = true;
          console.log('Fuentes cargadas correctamente:', Object.keys(pdfMake.vfs));
          
          // Configurar las fuentes para pdfmake
          pdfMake.fonts = {
            Roboto: {
              normal: 'Roboto-Regular.ttf',
              bold: 'Roboto-Medium.ttf',
              italics: 'Roboto-Italic.ttf',
              bolditalics: 'Roboto-MediumItalic.ttf'
            }
          };
          
          resolve(true);
        } else {
          console.warn('vfs_fonts cargado pero no se detectaron fuentes');
          // Intentar con fuentes fallback
          setupFallbackFonts();
          resolve(true);
        }
      }, 100);
    };

    script.onerror = () => {
      console.warn('No se pudieron cargar las fuentes desde CDN, usando fallback');
      setupFallbackFonts();
      resolve(true);
    };

    document.head.appendChild(script);
  });
}

// Fuentes fallback en caso de que falle la carga desde CDN
function setupFallbackFonts() {
  console.log('Configurando fuentes fallback');
  
  // Crear VFS básico con fuentes mínimas si no existe
  if (!pdfMake.vfs) {
    pdfMake.vfs = {};
  }
  
  // Configurar fuentes básicas
  pdfMake.fonts = {
    Roboto: {
      normal: 'Roboto-Regular.ttf',
      bold: 'Roboto-Medium.ttf',
      italics: 'Roboto-Italic.ttf',
      bolditalics: 'Roboto-MediumItalic.ttf'
    }
  };
  
  fontsLoaded = true;
}

const StarRating = {
  props: {
    rating: { type: Number, required: true },
    max: { type: Number, default: 5 },
    editable: { type: Boolean, default: true },
  },
  emits: ["update:rating"],
  methods: {
    setRating(val) {
      if (this.editable) this.$emit("update:rating", val);
    },
  },
  template: `
    <span class='star-rating'>
      <span v-for="n in max" :key="n" @click="setRating(n)" style="cursor: pointer; font-size: 1.4em; color: #EAB308;">
        <span v-if="n <= rating">★</span><span v-else>☆</span>
      </span>
    </span>
  `
};

export default {
  name: 'UserCV',
  components: {
    StarRating
  },
  data() {
    return {
      user: null,
      currentStep: 1,
      steps: [
        { id: 1, icon: '👤', title: 'Personal' },
        { id: 2, icon: '📝', title: 'Perfil' },
        { id: 3, icon: '💼', title: 'Experiencia' },
        { id: 4, icon: '🎓', title: 'Formación' },
        { id: 5, icon: '⚡', title: 'Competencias' },
        { id: 6, icon: '⭐', title: 'Habilidades' },
        { id: 7, icon: '🌐', title: 'Idiomas' }
      ],
      formData: {
        personalInfo: {
          fullName: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          photo: null // Nuevo campo para la foto
        },
        profile: '',
        experience: [
          {
            company: '',
            period: '',
            description: ''
          }
        ],
        education: [
          {
            degree: '',
            institution: '',
            period: '',
            specialization: ''
          }
        ],
        competences: [
          {
            name: ''
          }
        ],
        skills: [
          {
            name: '',
            rating: 3
          }
        ],
        languages: [
          {
            name: '',
            level: ''
          }
        ]
      }
    }
  },
  computed: {
    isFormValid() {
      const personalInfo = this.formData.personalInfo;
      return personalInfo.fullName && personalInfo.title && personalInfo.email;
    }
  },
  async mounted() {
    this.checkAuthentication();
    this.loadSavedCV();
    // Precargar fuentes al montar el componente
    await loadPdfFonts();
  },
  methods: {
    checkAuthentication() {
      const storedUser = localStorage.getItem('jdmCurrentUser');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        if (this.user.email && !this.formData.personalInfo.email) {
          this.formData.personalInfo.email = this.user.email;
        }
      } else {
        this.goToAbout();
      }
    },

    goToAbout() {
      this.$emit('back-to-main');
    },

    handleLogout() {
      this.user = null;
      localStorage.removeItem('jdmCurrentUser');
      this.goToAbout();
    },

    // Navegación entre pasos
    setCurrentStep(step) {
      this.currentStep = step;
    },

    nextStep() {
      if (this.currentStep < this.steps.length) {
        this.currentStep++;
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },

    // Métodos para manejar la foto de perfil
    handlePhotoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          alert('Por favor, selecciona un archivo de imagen válido.');
          return;
        }

        // Validar tamaño (máximo 2MB)
        if (file.size > 2 * 1024 * 1024) {
          alert('La imagen no debe superar los 2MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          this.formData.personalInfo.photo = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    removePhoto() {
      this.formData.personalInfo.photo = null;
      if (this.$refs.photoInput) {
        this.$refs.photoInput.value = '';
      }
    },

    // Gestión de experiencia
    addExperience() {
      this.formData.experience.push({
        company: '',
        period: '',
        description: ''
      });
    },

    removeExperience(index) {
      if (this.formData.experience.length > 1) {
        this.formData.experience.splice(index, 1);
      }
    },

    // Gestión de educación
    addEducation() {
      this.formData.education.push({
        degree: '',
        institution: '',
        period: '',
        specialization: ''
      });
    },

    removeEducation(index) {
      if (this.formData.education.length > 1) {
        this.formData.education.splice(index, 1);
      }
    },

    // Gestión de competencias
    addCompetence() {
      this.formData.competences.push({
        name: ''
      });
    },

    removeCompetence(index) {
      if (this.formData.competences.length > 1) {
        this.formData.competences.splice(index, 1);
      }
    },

    // Gestión de habilidades
    addSkill() {
      this.formData.skills.push({ 
        name: '', 
        rating: 3  // Valor por defecto: Intermedio
      });
    },

    removeSkill(index) {
      if (this.formData.skills.length > 1) {
        this.formData.skills.splice(index, 1);
      }
    },

    // Gestión de idiomas
    addLanguage() {
      this.formData.languages.push({
        name: '',
        level: ''
      });
    },

    removeLanguage(index) {
      if (this.formData.languages.length > 1) {
        this.formData.languages.splice(index, 1);
      }
    },

    // Guardar CV
    saveCV() {
      if (!this.isFormValid) {
        alert('Por favor completa los campos obligatorios (Nombre, Título y Email)');
        return;
      }
      
      // Validación para el límite de caracteres del perfil
      if (this.formData.profile.length > 200) {
        alert('El perfil profesional no puede tener más de 200 caracteres. Actualmente tienes ' + this.formData.profile.length + ' caracteres.');
        return;
      }
      
      // Validación para habilidades
      if (!this.formData.skills.some(skill => skill.name.trim() !== '')) {
        alert('Debes agregar al menos una habilidad.');
        return;
      }
      
      const userCVs = this.getStoredCVs();
      const userCVIndex = userCVs.findIndex(cv => cv.userId === this.user.id);
      const cvData = {
        ...this.formData,
        userId: this.user.id,
        lastUpdated: new Date().toISOString()
      };

      if (userCVIndex !== -1) {
        userCVs[userCVIndex] = cvData;
      } else {
        userCVs.push(cvData);
      }
      localStorage.setItem('jdmUserCVs', JSON.stringify(userCVs));
      alert('¡Currículum guardado correctamente!');
    },

    // Cargar CV guardado
    loadSavedCV() {
      const userCVs = this.getStoredCVs();
      const userCV = userCVs.find(cv => cv.userId === this.user.id);
      
      if (userCV) {
        this.formData = { ...userCV };
      }
    },

    getStoredCVs() {
      const cvs = localStorage.getItem('jdmUserCVs');
      return cvs ? JSON.parse(cvs) : [];
    },

    // Reiniciar formulario
    resetForm() {
      if (confirm('¿Estás seguro de que quieres reiniciar el formulario? Se perderán todos los datos no guardados.')) {
        this.formData = {
          personalInfo: {
            fullName: '',
            title: '',
            email: this.user?.email || '',
            phone: '',
            location: '',
            website: '',
            photo: null
          },
          profile: '',
          experience: [
            {
              company: '',
              period: '',
              description: ''
            }
          ],
          education: [
            {
              degree: '',
              institution: '',
              period: '',
              specialization: ''
            }
          ],
          competences: [
            {
              name: ''
            }
          ],
          skills: [
            {
              name: '',
              rating: 3
            }
          ],
          languages: [
            {
              name: '',
              level: ''
            }
          ]
        };
        this.currentStep = 1;
      }
    },

    // Descargar PDF
    async downloadCV() {
      if (!this.isFormValid) {
        alert('Por favor completa los campos obligatorios antes de descargar');
        return;
      }

      // Validación para el límite de caracteres del perfil
      if (this.formData.profile.length > 200) {
        alert('El perfil profesional no puede tener más de 200 caracteres. Actualmente tienes ' + this.formData.profile.length + ' caracteres. Por favor, acorta tu perfil antes de descargar.');
        return;
      }

      try {
        console.log('Iniciando generación de PDF...');
        
        // Asegurar que las fuentes estén cargadas
        await loadPdfFonts();
        
        if (!fontsLoaded) {
          throw new Error('No se pudieron cargar las fuentes para PDF');
        }

        console.log('Fuentes cargadas, generando documento...');
        const docDefinition = this.buildPDFDocument();
        const filename = `CV_${this.formData.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`;
        
        // Crear y descargar el PDF
        pdfMake.createPdf(docDefinition).download(filename);
        console.log('PDF generado exitosamente');
        
      } catch (error) {
        console.error('Error detallado al generar PDF:', error);
        alert(`Error al generar el PDF: ${error.message}. Por favor, intenta nuevamente.`);
      }
    },

    // Construir el documento PDF con backdrop cuadrado ajustado
    buildPDFDocument() {
      const personalInfo = this.formData.personalInfo;
      
      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [0, 0, 0, 0],
        background: [
          // Fondo gris oscuro para la cabecera
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: 595.28,
                h: 220,
                color: '#2c3e50'
              }
            ]
          }
        ],
        content: [
          // CONTENIDO PRINCIPAL
          {
            stack: [
              // CABECERA CON FONDO OSCURO
              {
                stack: [
                  // Contenedor con foto, nombre y título
                  {
                    columns: [
                      // Foto a la izquierda (si existe)
                      this.formData.personalInfo.photo ? {
                        width: 60,
                        stack: [
                          {
                            image: this.formData.personalInfo.photo,
                            width: 50,
                            height: 50,
                            margin: [0, 0, 0, 0]
                          }
                        ],
                        margin: [40, 30, 0, 0]
                      } : { width: 60, text: '' }, // Espacio reservado si no hay foto
                      
                      // Nombre y título centrados
                      {
                        width: '*',
                        stack: [
                          {
                            text: personalInfo.fullName || 'Nombre Completo',
                            style: 'header',
                            alignment: 'center',
                            margin: [0, 0, 0, 5]
                          },
                          {
                            text: personalInfo.title || 'Título Profesional',
                            style: 'subheader',
                            alignment: 'center',
                            margin: [0, 0, 0, 25]
                          }
                        ]
                      },
                      
                      // Espacio a la derecha para balance
                      { width: 60, text: '' }
                    ]
                  },
                  
                  // Grid de dos columnas para perfil y contacto
                  {
                    columns: [
                      // Columna izquierda: Perfil profesional
                      {
                        width: '60%',
                        stack: [
                          this.formData.profile ? {
                            text: 'MI PERFIL',
                            style: 'sectionTitleLight',
                            margin: [0, 0, 0, 8]
                          } : null,
                          
                          this.formData.profile ? {
                            text: this.formData.profile,
                            style: 'profileText',
                            margin: [0, 0, 0, 0]
                          } : null
                        ].filter(Boolean)
                      },
                      
                      // Columna derecha: Datos de contacto
                      {
                        width: '40%',
                        stack: [
                          personalInfo.phone ? {
                            text: `📞 ${personalInfo.phone}`,
                            style: 'contactInfo',
                            margin: [0, 0, 0, 8]
                          } : null,
                          
                          personalInfo.email ? {
                            text: `✉️ ${personalInfo.email}`,
                            style: 'contactInfo',
                            margin: [0, 0, 0, 8]
                          } : null,
                          
                          personalInfo.website ? {
                            text: `🌐 ${personalInfo.website}`,
                            style: 'contactInfo',
                            margin: [0, 0, 0, 8]
                          } : null,
                          
                          personalInfo.location ? {
                            text: `📍 ${personalInfo.location}`,
                            style: 'contactInfo',
                            margin: [0, 0, 0, 8]
                          } : null
                        ].filter(Boolean)
                      }
                    ],
                    margin: [40, 0, 40, 0]
                  }
                ]
              },
              
              // CONTENIDO PRINCIPAL CON TÍTULOS CON BACKDROP AJUSTADO
              {
                stack: [
                  {
                    columns: [
                      {
                        width: '60%',
                        stack: [
                          // Experiencia Laboral CON BACKDROP AJUSTADO
                          ...(this.formData.experience.filter(exp => exp.company).length > 0 ? [
                            {
                              stack: [
                                // Fondo cuadrado ajustado para el título
                                {
                                  canvas: [
                                    {
                                      type: 'rect',
                                      x: 0,
                                      y: 0,
                                      w: 320, // Ancho ajustado para columna izquierda
                                      h: 20,
                                      color: '#34495e'
                                    }
                                  ]
                                },
                                // Título sobre el fondo
                                {
                                  text: 'EXPERIENCIA LABORAL',
                                  style: 'sectionTitleWithBackdrop',
                                  margin: [10, -15, 0, 12]
                                }
                              ],
                              margin: [0, 25, 0, 12]
                            },
                            ...this.formData.experience.filter(exp => exp.company).flatMap((exp, index) => [
                              {
                                columns: [
                                  {
                                    width: 20,
                                    text: '✅',
                                    style: 'icon',
                                    margin: [0, 2, 5, 0]
                                  },
                                  {
                                    width: '*',
                                    stack: [
                                      {
                                        text: exp.company,
                                        style: 'itemTitle',
                                        margin: [0, 0, 0, 2]
                                      },
                                      exp.period ? {
                                        text: exp.period,
                                        style: 'itemSubtitle',
                                        margin: [0, 0, 0, 5]
                                      } : null,
                                      exp.description ? {
                                        text: exp.description,
                                        style: 'body',
                                        margin: [0, 0, 0, 15]
                                      } : { text: '', margin: [0, 0, 0, 15] }
                                    ].filter(Boolean)
                                  }
                                ],
                                margin: [0, 0, 0, 12]
                              }
                            ])
                          ] : []),
                          
                          // Formación Académica CON BACKDROP AJUSTADO
                          ...(this.formData.education.filter(edu => edu.degree).length > 0 ? [
                            {
                              stack: [
                                // Fondo cuadrado ajustado para el título
                                {
                                  canvas: [
                                    {
                                      type: 'rect',
                                      x: 0,
                                      y: 0,
                                      w: 320, // Ancho ajustado para columna izquierda
                                      h: 20,
                                      color: '#34495e'
                                    }
                                  ]
                                },
                                // Título sobre el fondo
                                {
                                  text: 'FORMACIÓN ACADÉMICA',
                                  style: 'sectionTitleWithBackdrop',
                                  margin: [10, -15, 0, 12]
                                }
                              ],
                              margin: [0, 20, 0, 12]
                            },
                            ...this.formData.education.filter(edu => edu.degree).flatMap((edu, index) => [
                              {
                                columns: [
                                  {
                                    width: 20,
                                    text: '✅',
                                    style: 'icon',
                                    margin: [0, 2, 5, 0]
                                  },
                                  {
                                    width: '*',
                                    stack: [
                                      {
                                        text: edu.degree,
                                        style: 'itemTitle',
                                        margin: [0, 0, 0, 2]
                                      },
                                      edu.institution ? {
                                        text: edu.institution,
                                        style: 'body',
                                        margin: [0, 0, 0, 2]
                                      } : null,
                                      edu.period ? {
                                        text: edu.period,
                                        style: 'itemSubtitle',
                                        margin: [0, 0, 0, 2]
                                      } : null,
                                      edu.specialization ? {
                                        text: edu.specialization,
                                        style: 'bodyItalic',
                                        margin: [0, 0, 0, 15]
                                      } : { text: '', margin: [0, 0, 0, 15] }
                                    ].filter(Boolean)
                                  }
                                ],
                                margin: [0, 0, 0, 12]
                              }
                            ])
                          ] : [])
                        ].filter(Boolean),
                        margin: [40, 10, 20, 30]
                      },
                      
                      // COLUMNA DERECHA CON TÍTULOS CON BACKDROP AJUSTADO
                      {
                        width: '40%',
                        stack: [
                          // Idiomas CON BACKDROP AJUSTADO
                          ...(this.formData.languages.filter(lang => lang.name).length > 0 ? [
                            {
                              stack: [
                                // Fondo cuadrado ajustado para el título
                                {
                                  canvas: [
                                    {
                                      type: 'rect',
                                      x: 0,
                                      y: 0,
                                      w: 200, // Ancho ajustado para columna derecha
                                      h: 20,
                                      color: '#34495e'
                                    }
                                  ]
                                },
                                // Título sobre el fondo
                                {
                                  text: 'IDIOMAS',
                                  style: 'sectionTitleWithBackdrop',
                                  margin: [10, -15, 0, 12]
                                }
                              ],
                              margin: [0, 25, 0, 12]
                            },
                            {
                              stack: this.formData.languages
                                .filter(lang => lang.name)
                                .map(lang => ({
                                  columns: [
                                    {
                                      width: 20,
                                      text: '✅',
                                      style: 'icon',
                                      margin: [0, 2, 5, 0]
                                    },
                                    {
                                      width: '*',
                                      text: lang.name,
                                      style: 'body'
                                    }
                                  ],
                                  margin: [0, 0, 0, 8]
                                }))
                            }
                          ] : []),
                          
                          // Competencias CON BACKDROP AJUSTADO
                          ...(this.formData.competences.filter(comp => comp.name).length > 0 ? [
                            {
                              stack: [
                                // Fondo cuadrado ajustado para el título
                                {
                                  canvas: [
                                    {
                                      type: 'rect',
                                      x: 0,
                                      y: 0,
                                      w: 200, // Ancho ajustado para columna derecha
                                      h: 20,
                                      color: '#34495e'
                                    }
                                  ]
                                },
                                // Título sobre el fondo
                                {
                                  text: 'COMPETENCIAS',
                                  style: 'sectionTitleWithBackdrop',
                                  margin: [10, -15, 0, 12]
                                }
                              ],
                              margin: [0, 20, 0, 12]
                            },
                            {
                              ul: this.formData.competences
                                .filter(comp => comp.name)
                                .map(comp => ({
                                  text: comp.name,
                                  style: 'body',
                                  margin: [0, 0, 0, 4]
                                })),
                              style: 'body',
                              margin: [0, 0, 0, 15]
                            }
                          ] : []),
                          
                          // Habilidades CON BACKDROP AJUSTADO
                          ...(this.formData.skills.filter(skill => skill.name).length > 0 ? [
                            {
                              stack: [
                                // Fondo cuadrado ajustado para el título
                                {
                                  canvas: [
                                    {
                                      type: 'rect',
                                      x: 0,
                                      y: 0,
                                      w: 200, // Ancho ajustado para columna derecha
                                      h: 20,
                                      color: '#34495e'
                                    }
                                  ]
                                },
                                // Título sobre el fondo
                                {
                                  text: 'HABILIDADES',
                                  style: 'sectionTitleWithBackdrop',
                                  margin: [10, -15, 0, 12]
                                }
                              ],
                              margin: [0, 20, 0, 12]
                            },
                            {
                              stack: this.formData.skills
                                .filter(skill => skill.name)
                                .map(skill => ({
                                  columns: [
                                    {
                                      width: '60%',
                                      text: skill.name,
                                      style: 'body'
                                    },
                                    {
                                      width: '40%',
                                      text: `${'★'.repeat(skill.rating)}${'☆'.repeat(5 - skill.rating)}`,
                                      style: 'stars'
                                    }
                                  ],
                                  margin: [0, 0, 0, 6]
                                }))
                            }
                          ] : [])
                        ].filter(Boolean),
                        margin: [20, 10, 40, 30]
                      }
                    ]
                  }
                ],
                margin: [0, -20, 0, 0]
              }
            ]
          }
        ].filter(Boolean),
        
        styles: {
          // Estilos para texto sobre fondo oscuro
          header: {
            fontSize: 24,
            bold: true,
            color: '#ffffff'
          },
          subheader: {
            fontSize: 16,
            bold: true,
            color: '#e74c3c'
          },
          sectionTitleLight: {
            fontSize: 14,
            bold: true,
            color: '#ffffff',
            margin: [0, 0, 0, 8]
          },
          profileText: {
            fontSize: 10,
            color: '#ecf0f1',
            lineHeight: 1.4
          },
          contactInfo: {
            fontSize: 10,
            color: '#ffffff',
            lineHeight: 1.3
          },
          
          // NUEVO ESTILO: Títulos con backdrop cuadrado
          sectionTitleWithBackdrop: {
            fontSize: 14,
            bold: true,
            color: '#ffffff',
            margin: [0, 2, 0, 0]
          },
          
          // Estilos para contenido sobre fondo blanco
          itemTitle: {
            fontSize: 12,
            bold: true,
            color: '#2c3e50'
          },
          itemSubtitle: {
            fontSize: 10,
            color: '#7f8c8d',
            italics: true
          },
          body: {
            fontSize: 10,
            color: '#34495e',
            lineHeight: 1.4
          },
          bodyItalic: {
            fontSize: 10,
            color: '#34495e',
            lineHeight: 1.4,
            italics: true
          },
          icon: {
            fontSize: 8,
            color: '#27ae60'
          },
          stars: {
            fontSize: 10,
            color: '#f39c12',
            bold: true
          }
        },
        
        defaultStyle: {
          font: 'Roboto',
          fontSize: 10,
          lineHeight: 1.4
        }
      };

      return docDefinition;
    }
  }
}
</script>

<style scoped>
.user-cv-container {
  min-height: 100vh;
  background: var(--background, #ecf0f1);
}
.cv-template-dark {
  background: #fff;
  color: #232323;
  padding: 2rem;
  border-radius: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.5;
}
:root {
  --background: #ecf0f1;
  --secondary: #e74c3c;
}
.cv-header-dark {
  background: var(--background, #ecf0f1);
  color: #fff;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--secondary, #e74c3c);
  padding-bottom: 1.5rem;
  border-radius: 8px 8px 0 0;
  padding-top: 1.2rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.cv-header-dark *, .cv-header-dark .header-main *, .cv-header-dark .header-left, .cv-header-dark .header-right { color: #fff !important; }
.header-main h1 {
  color: #111;
  font-weight: 800;
}
.header-main p, .cv-title-dark {
  color: #232323;
  font-weight: 600;
}
.cv-header-dark .cv-title-dark {
  color: var(--secondary, #e74c3c) !important;
}
.section-title-dark {
  color: #222;
  font-weight: 700;
}
.profile-section, .profile-section *, .header-left, .header-right, .header-main, .cv-header-dark, .skill-name, .language-name-dark {
  color: #232323;
}
.cv-section-dark, .experience-item-dark, .education-item-dark, .language-item-dark, .competence-item-dark, .skill-item-dark, .profile-text {
  color: #232323;
}
.header-right span {
  color: #222;
}
.header-grid {
  gap: 2rem;
}
.header-left, .header-right {
  font-size: 1rem;
}
.profile-section .profile-text, .profile-text {
  font-size: 1rem;
}
.cv-section-dark {
  margin-bottom: 1.5rem !important;
}
.experience-item-dark, .education-item-dark, .language-item-dark, .competence-item-dark, .skill-item-dark {
  padding: 1.2rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}
.cv-content-dark {
  gap: 2rem;
}
.languages-list-dark, .competences-list-dark, .skills-list-dark {
  gap: 0.8rem !important;
}
.cv-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
  grid-auto-rows: min-content;
}
.form-column {
  margin-bottom: 0;
}
.preview-column {
  margin-top: 0;
}
@media (max-width: 768px) {
  .header-grid { grid-template-columns: 1fr; }
  .header-right { align-items: flex-start; }
}

/* Header */
header {
  background-color: var(--primary, #2c3e50);
  padding: 1rem 0;
  box-shadow: var(--shadow, 0 2px 10px rgba(0, 0, 0, 0.3));
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--text, #ffffff);
  text-decoration: none;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: var(--text, #ffffff);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
  font-size: var(--paragraph-size, 16px);
}

.nav-links a:hover {
  color: var(--secondary, #e74c3c);
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-greeting {
  color: var(--text, #ffffff);
  font-size: 0.9rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.logout-btn {
  background: transparent;
  border: 1px solid var(--text, #ffffff);
  color: var(--text, #ffffff);
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.logout-btn:hover {
  background: var(--secondary, #e74c3c);
  border-color: var(--secondary, #e74c3c);
  color: var(--accent, #ffffff);
}

/* Header del builder */
.builder-header {
  background: var(--accent, #ffffff);
  border-radius: var(--border-radius, 12px);
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: var(--shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
}

.builder-header h1 {
  color: var(--primary, #2c3e50);
  margin: 0 0 0.5rem 0;
  font-size: var(--title-size, 24px);
  font-weight: 700;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.builder-header p {
  color: var(--text, #666666);
  margin: 0 0 1.5rem 0;
  font-size: var(--paragraph-size, 16px);
  font-family: var(--secondary-font, Arial, sans-serif);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius, 8px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.action-btn.primary {
  background: var(--primary, #2c3e50);
  color: var(--accent, #ffffff);
}

.action-btn.primary:hover:not(:disabled) {
  background: var(--secondary, #e74c3c);
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: var(--background, #ecf0f1);
  color: var(--text, #2c3e50);
  border: 1px solid var(--primary, #2c3e50);
}

.action-btn.secondary:hover {
  background: var(--primary, #2c3e50);
  color: var(--accent, #ffffff);
  transform: translateY(-2px);
}

.action-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* Layout principal */
.cv-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
  margin-bottom: 2rem;
  grid-auto-rows: min-content;
}

/* Columna del formulario */
.form-column {
  background: var(--accent, #ffffff);
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
  overflow: hidden;
}

.steps-navigation {
  display: flex;
  background: var(--background, #ecf0f1);
  border-bottom: 1px solid var(--primary, #2c3e50);
  overflow-x: auto;
}

.step-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.step-tab:hover {
  background: var(--accent, #ffffff);
}

.step-tab.active {
  background: var(--accent, #ffffff);
  border-bottom-color: var(--secondary, #e74c3c);
  color: var(--primary, #2c3e50);
  font-weight: 600;
}

.step-icon {
  font-size: 1.1rem;
}

.step-text {
  font-size: 0.9rem;
}

/* Contenido del formulario */
.form-content {
  padding: 2rem;
  max-height: 600px;
  overflow-y: auto;
}

.form-section h2 {
  color: var(--primary, #2c3e50);
  margin: 0 0 1.5rem 0;
  font-size: calc(var(--title-size, 24px) * 0.9);
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
}

.add-btn {
  background: var(--secondary, #e74c3c);
  color: var(--accent, #ffffff);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius, 6px);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.add-btn:hover {
  background: var(--primary, #2c3e50);
  transform: translateY(-1px);
}

/* Grid del formulario */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: var(--primary, #2c3e50);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid var(--background, #ecf0f1);
  border-radius: var(--border-radius, 6px);
  font-size: var(--paragraph-size, 16px);
  transition: all 0.3s;
  font-family: var(--secondary-font, Arial, sans-serif);
  background: var(--accent, #ffffff);
  color: var(--text, #2c3e50);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--secondary, #e74c3c);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: var(--text, #666666);
  margin-top: 0.25rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

/* Items de lista */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-item {
  background: var(--background, #ecf0f1);
  border-radius: var(--border-radius, 8px);
  padding: 1.5rem;
  border: 1px solid var(--primary, #2c3e50);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.item-header h3 {
  color: var(--primary, #2c3e50);
  margin: 0;
  font-size: 1.1rem;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.remove-btn {
  background: var(--secondary, #e74c3c);
  color: var(--accent, #ffffff);
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius, 6px);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.remove-btn:hover {
  background: var(--primary, #2c3e50);
}

/* Checkbox */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--text, #666666);
  cursor: pointer;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.checkbox-label input {
  margin: 0;
}

/* Navegación */
.form-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--background, #ecf0f1);
}

.nav-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius, 6px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.nav-btn.prev {
  background: var(--background, #ecf0f1);
  color: var(--text, #2c3e50);
  border: 1px solid var(--primary, #2c3e50);
}

.nav-btn.prev:hover {
  background: var(--primary, #2c3e50);
  color: var(--accent, #ffffff);
}

.nav-btn.next,
.nav-btn.save {
  background: var(--primary, #2c3e50);
  color: var(--accent, #ffffff);
}

.nav-btn.next:hover,
.nav-btn.save:hover {
  background: var(--secondary, #e74c3c);
}

/* Columna de vista previa */
.preview-column {
  background: var(--accent, #ffffff);
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
  overflow: visible;
}

.preview-container {
  min-height: fit-content;
  display: flex;
  flex-direction: column;
}

.preview-header {
  background: var(--background, #ecf0f1);
  padding: 1.5rem;
  border-bottom: 1px solid var(--primary, #2c3e50);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-header h2 {
  color: var(--primary, #2c3e50);
  margin: 0;
  font-size: 1.3rem;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.preview-btn {
  background: var(--primary, #2c3e50);
  color: var(--accent, #ffffff);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius, 6px);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.preview-btn:hover:not(:disabled) {
  background: var(--secondary, #e74c3c);
  transform: translateY(-1px);
}

.preview-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.preview-content {
  flex: 1;
  padding: 2rem;
  overflow-y: visible;
  background: var(--background, #ecf0f1);
  min-height: fit-content;
}

/* Template del CV */
.cv-template {
  background: var(--accent, #ffffff);
  padding: 2rem;
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
  color: var(--text, #2c3e50);
  line-height: 1.6;
}

.cv-header-preview {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--primary, #2c3e50);
}

.cv-header-preview h1 {
  color: var(--primary, #2c3e50);
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.cv-title {
  color: var(--secondary, #e74c3c);
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0 0 1rem 0;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: var(--text, #666666);
  font-family: var(--secondary-font, Arial, sans-serif);
}

.cv-section {
  margin-bottom: 1.5rem;
}

.cv-section h2 {
  color: var(--primary, #2c3e50);
  border-bottom: 1px solid var(--background, #ecf0f1);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.experience-item,
.education-item {
  margin-bottom: 1.5rem;
}

.exp-header,
.edu-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.25rem;
}

.exp-header h3,
.edu-header h3 {
  color: var(--text, #2c3e50);
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.exp-dates,
.edu-year {
  color: var(--text, #666666);
  font-size: 0.9rem;
  white-space: nowrap;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.company,
.institution {
  color: var(--secondary, #e74c3c);
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.description {
  color: var(--text, #555555);
  margin: 0;
  line-height: 1.5;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: var(--background, #ecf0f1);
  border: 1px solid var(--primary, #2c3e50);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.languages-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.language-item {
  display: flex;
  justify-content: space-between;
}

.language-name {
  font-weight: 500;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.language-level {
  color: var(--text, #666666);
  font-family: var(--secondary-font, Arial, sans-serif);
}

/* Responsive */
@media (max-width: 1024px) {
  .cv-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .builder-header {
    padding: 1.5rem;
  }
  
  .header-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    text-align: center;
  }
  
  .steps-navigation {
    flex-wrap: wrap;
  }
  
  .step-tab {
    flex: 1;
    min-width: 120px;
    justify-content: center;
  }
  
  .form-content {
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .form-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-btn {
    width: 100%;
    text-align: center;
  }
  
  .preview-content {
    padding: 1.5rem;
  }
  
  .cv-template {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .builder-header h1 {
    font-size: calc(var(--title-size, 24px) * 0.9);
  }
  
  .form-section h2 {
    font-size: calc(var(--title-size, 24px) * 0.8);
  }
  
  .form-item {
    padding: 1rem;
  }
  
  .item-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .contact-info {
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

@media print {
  body, html, #app, .user-cv-container {
    background: #fff !important;
    color: #000 !important;
  }
  .user-cv-container {
    min-height: unset;
    padding: 0!important;
  }
  header, .builder-header, .steps-navigation, .form-column, .header-actions, .action-btn, .form-navigation, .preview-btn, .add-btn, .remove-btn, .form-section:not(.preview-column) {
    display: none !important;
    visibility: hidden !important;
  }
  .preview-column, .preview-container, .preview-content, .cv-template-dark {
    box-shadow: none !important;
    background: #fff !important;
    color: #000 !important;
    border-radius: 0 !important;
    padding: 0 !important;
  }
  .cv-content-dark {
    display: block !important;
  }
  .cv-section-dark, .section-title-dark, .experience-item-dark, .education-item-dark, .skill-item-dark, .competence-item-dark, .language-item-dark {
    background: none !important;
    color: #000 !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  .star-rating span {
    color: #eab308 !important;
    font-size: 1.2em !important;
  }
  @page {
    size: A4 portrait;
    margin: 1.1cm !important;
  }
}
/* CSS para nueva estructura de cabecera */
.header-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}
.header-left {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.header-right {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  gap: 0.7rem;
  font-size: 1rem;
}
@media (max-width: 768px) {
  .header-grid { grid-template-columns: 1fr; }
  .header-right { align-items: flex-start; }
}

/* CSS para columnas */
.cv-content-dark {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}
.cv-left-column, .cv-right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
@media (max-width: 768px) {
  .cv-content-dark {
    grid-template-columns: 1fr;
  }
}

.rating-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-dropdown {
  padding: 0.75rem;
  border: 2px solid var(--background, #ecf0f1);
  border-radius: var(--border-radius, 6px);
  font-size: var(--paragraph-size, 16px);
  background: var(--accent, #ffffff);
  color: var(--text, #2c3e50);
  font-family: var(--secondary-font, Arial, sans-serif);
  cursor: pointer;
  transition: all 0.3s;
}

.rating-dropdown:focus {
  outline: none;
  border-color: var(--secondary, #e74c3c);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.rating-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--background, #f8f9fa);
  border-radius: var(--border-radius, 4px);
  font-size: 0.9rem;
}

.stars-preview {
  color: #f39c12;
  font-size: 1.1rem;
}

.rating-text {
  color: var(--text, #666666);
  font-size: 0.8rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

@media (max-width: 768px) {
  .rating-selector {
    gap: 0.3rem;
  }
  
  .rating-dropdown {
    font-size: 14px;
  }
  
  .rating-preview {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
}

/* ESTILOS PARA MEJORAR LA LEGIBILIDAD DE TEXTOS LARGOS EN PREVIEW */
.preview-content {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Texto del perfil profesional */
.profile-text {
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.6;
  text-align: justify;
  font-size: 0.95rem;
}

/* Descripciones de experiencia laboral */
.exp-description {
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.6;
  text-align: justify;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding-left: 1.5rem;
}

/* Textos de formación académica */
.edu-institution,
.edu-specialization {
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.5;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  padding-left: 1.5rem;
}

/* Ajustes específicos para la estructura de columnas */
.cv-left-column {
  min-width: 0; /* Permite que el contenido se ajuste */
}

.cv-right-column {
  min-width: 0; /* Permite que el contenido se ajuste */
}

/* Mejoras en los contenedores de texto */
.cv-section-dark p,
.cv-section-dark span:not(.star-rating) {
  max-width: 100%;
  word-wrap: break-word;
}

/* Ajustes para los items de experiencia y educación */
.experience-item-dark,
.education-item-dark {
  break-inside: avoid;
  page-break-inside: avoid;
}

/* Mejoras en la cabecera */
.header-left {
  min-width: 0;
  overflow-wrap: break-word;
}

.header-right {
  min-width: 0;
  overflow-wrap: break-word;
}

/* Ajustes para textos muy largos en datos de contacto */
.header-right span {
  word-break: break-all;
  font-size: 0.9rem;
}

/* Estilos para mejorar la legibilidad en móviles */
@media (max-width: 768px) {
  .profile-text {
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  .exp-description {
    font-size: 0.85rem;
    padding-left: 1rem;
  }
  
  .header-right span {
    font-size: 0.85rem;
    word-break: break-word;
  }
  
  .cv-content-dark {
    gap: 1rem;
  }
}

/* Estilos para la vista previa del CV */
.cv-template-dark {
  max-width: 100%;
  overflow: hidden;
}

/* Asegurar que los textos no se desborden */
.cv-header-dark *,
.cv-content-dark * {
  max-width: 100%;
}

/* Estilos específicos para listas */
.competences-list-dark {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.competence-item-dark {
  background: #f8f9fa;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  word-break: break-word;
  border: 1px solid #e9ecef;
}

/* Mejoras para habilidades con estrellas */
.skills-list-dark {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.skill-item-dark {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.skill-name {
  word-break: break-word;
  flex: 1;
  margin-right: 1rem;
}

/* Ajustes para la grid de cabecera en móviles */
@media (max-width: 768px) {
  .header-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .header-right {
    align-items: flex-start;
  }
  
  .competence-item-dark {
    flex: 1 1 calc(50% - 0.5rem);
    min-width: 0;
  }
}

/* Mejoras para la estructura general */
.cv-content-dark {
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .cv-content-dark {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Asegurar que los textos no se salgan en impresión */
@media print {
  .profile-text,
  .exp-description,
  .edu-institution,
  .edu-specialization {
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
}

.char-count {
  text-align: right;
  font-size: 0.8rem;
  color: var(--text, #666666);
  margin-top: 0.25rem;
  font-family: var(--secondary-font, Arial, sans-serif);
  transition: color 0.3s;
}

.char-limit-warning {
  border-color: #f39c12 !important;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.1) !important;
}

.char-limit-exceeded {
  color: #e74c3c !important;
  font-weight: bold;
}

.char-error {
  color: #e74c3c;
  font-weight: bold;
}

/* Estilo cuando se acerca al límite */
.char-count.warning {
  color: #f39c12;
  font-weight: 600;
}

/* Estilo cuando excede el límite */
.char-count.error {
  color: #e74c3c;
  font-weight: bold;
}

/* Mejora visual para el textarea cuando está cerca del límite */
.form-group textarea.char-limit-warning {
  border-color: #f39c12;
  background-color: #fffaf0;
}

.form-group textarea:invalid {
  border-color: #e74c3c;
}

.char-counter-container {
  margin-top: 0.5rem;
}

/* Barra de progreso */
.char-progress-bar {
  width: 100%;
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.char-progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.progress-safe {
  background: linear-gradient(90deg, #27ae60, #2ecc71);
}

.progress-warning {
  background: linear-gradient(90deg, #f39c12, #f1c40f);
  animation: pulse-warning 1.5s infinite;
}

.progress-danger {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
  animation: pulse-danger 1s infinite;
}
.photo-upload-container {
  border: 2px dashed var(--background, #ecf0f1);
  border-radius: var(--border-radius, 8px);
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.photo-upload-container:hover {
  border-color: var(--secondary, #e74c3c);
}

.photo-preview {
  position: relative;
  display: inline-block;
}

.photo-preview-img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--secondary, #e74c3c);
}

.remove-photo-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--secondary, #e74c3c);
  color: white;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  cursor: pointer;
  font-size: 0.8rem;
}

.photo-input {
  display: none;
}

.photo-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 1rem;
}

.upload-icon {
  font-size: 2rem;
}

.upload-text {
  font-weight: 600;
  color: var(--primary, #2c3e50);
}

.upload-hint {
  font-size: 0.8rem;
  color: var(--text, #666666);
}

/* Vista previa - Foto de perfil */
.header-main-with-photo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.photo-container {
  flex-shrink: 0;
}

.profile-photo {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--secondary, #e74c3c);
}

.header-text-center {
  flex: 1;
  text-align: center;
}

.photo-placeholder {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

/* Responsive para la foto */
@media (max-width: 768px) {
  .header-main-with-photo {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .profile-photo {
    width: 60px;
    height: 60px;
  }
  
  .photo-placeholder {
    display: none;
  }
  
  .photo-preview-img {
    width: 120px;
    height: 120px;
  }
}

/* Contador de caracteres */
.char-count {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.count-safe {
  background-color: #d5f4e6;
  color: #27ae60;
  border: 1px solid #27ae60;
}

.count-warning {
  background-color: #fef5e7;
  color: #f39c12;
  border: 1px solid #f39c12;
  animation: subtle-pulse 2s infinite;
}

.count-danger {
  background-color: #fdeaea;
  color: #e74c3c;
  border: 1px solid #e74c3c;
  animation: shake 0.5s ease-in-out;
}

.char-number {
  font-weight: bold;
  font-size: 0.9rem;
}

.char-message {
  font-size: 0.8rem;
  font-weight: 600;
}

/* ESTILOS DEL TEXTFIELD - SIN FONDO, SOLO BORDES */
.char-limit-safe {
  border-color: #27ae60 !important;
  box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.1) !important;
  /* Sin cambio de fondo - se mantiene el original */
}

.char-limit-warning {
  border-color: #f39c12 !important;
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.2) !important;
  animation: border-pulse 2s infinite;
  /* Sin cambio de fondo - se mantiene el original */
}

.char-limit-danger {
  border-color: #e74c3c !important;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.3) !important;
  animation: border-shake 0.5s ease-in-out;
  /* Sin cambio de fondo - se mantiene el original */
}

/* Animaciones */
@keyframes pulse-warning {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes pulse-danger {
  0%, 100% { 
    transform: scaleX(1);
    opacity: 1;
  }
  50% { 
    transform: scaleX(1.02);
    opacity: 0.8;
  }
}

@keyframes subtle-pulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(243, 156, 18, 0.1);
  }
  50% { 
    transform: scale(1.01);
    box-shadow: 0 0 0 4px rgba(243, 156, 18, 0.1);
  }
}

@keyframes border-pulse {
  0%, 100% { 
    box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.2);
  }
  50% { 
    box-shadow: 0 0 0 4px rgba(243, 156, 18, 0.3);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes border-shake {
  0%, 100% { 
    transform: translateX(0);
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.3);
  }
  25% { 
    transform: translateX(-2px);
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.4);
  }
  75% { 
    transform: translateX(2px);
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.4);
  }
}

/* Estilos para estados de enfoque mejorados */
.form-group textarea:focus.char-limit-safe {
  border-color: #27ae60 !important;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.2) !important;
}

.form-group textarea:focus.char-limit-warning {
  border-color: #f39c12 !important;
  box-shadow: 0 0 0 4px rgba(243, 156, 18, 0.3) !important;
}

.form-group textarea:focus.char-limit-danger {
  border-color: #e74c3c !important;
  box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.4) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .char-count {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
  
  .char-progress-bar {
    height: 4px;
  }
}
</style>