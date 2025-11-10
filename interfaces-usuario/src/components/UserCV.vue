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
                    <label>Perfil *</label>
                    <textarea
                      v-model="formData.profile"
                      rows="6"
                      placeholder="Describe tu experiencia profesional, habilidades clave y objetivos de carrera..."
                      required
                    ></textarea>
                    <div class="char-count">{{ formData.profile.length }}/500</div>
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
                  </div>
                  <div class="items-list">
                    <div v-for="(skill, index) in formData.skills" :key="index" class="form-item">
                      <div class="item-header">
                        <h3>Habilidad {{ index + 1 }}</h3>
                        <button class="remove-btn" @click="removeSkill(index)" v-if="formData.skills.length > 1 && (skill.name || index < formData.skills.length - 1)">
                          🗑️ Eliminar
                        </button>
                      </div>
                      <div class="form-grid">
                        <div class="form-group">
                          <label>Nombre *</label>
                          <input
                            type="text"
                            v-model="skill.name"
                            @input="onSkillInput"
                            placeholder="Ej: Trabajo en equipo, Creatividad, Vue.js"
                            required/>
                        </div>
                        <div class="form-group">
                          <label>Nivel</label>
                          <StarRating v-model:rating="skill.rating" :editable="true" />
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
                    <div class="header-main">
                      <h1>{{ formData.personalInfo.fullName || 'Tu Nombre Completo' }}</h1>
                      <p class="cv-title-dark">{{ formData.personalInfo.title || 'Tu Profesión' }}</p>
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
import html2pdf from 'html2pdf.js';

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
          website: ''
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
  mounted() {
    this.checkAuthentication();
    this.loadSavedCV();
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
      this.formData.skills.push({ name: '', rating: 3 });
    },

    onSkillInput() {
      // Si NO hay ningún espacio vacío al final, agrega uno
      const skills = this.formData.skills;
      if (
        skills.length === 0 ||
        skills[skills.length - 1].name.trim() !== ''
      ) {
        skills.push({ name: '', rating: 3 });
      }
      // Eliminar líneas intermedias vacías que estén duplicadas (excepto la última)
      for (let i = skills.length - 2; i >= 0; i--) {
        if (!skills[i].name && !skills[i + 1].name) {
          skills.splice(i, 1);
        }
      }
    },
    removeSkill(index) {
      // Solo permite eliminar si hay más de 1, pero nunca elimina la última vacía
      if (this.formData.skills.length > 1) {
        this.formData.skills.splice(index, 1);
        // Si tras eliminar ya no hay ningún bloque vacío, asegurar uno
        this.onSkillInput();
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
            website: ''
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

      const element = this.$refs.cvPreview;
      const opt = {
        margin: 10,
        filename: `CV_${this.formData.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      try {
        await html2pdf().set(opt).from(element).save();
      } catch (error) {
        console.error('Error al generar PDF:', error);
        alert('Error al generar el PDF. Por favor, intenta nuevamente.');
      }
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
  display: block;
}
.form-column {
  margin-bottom: 3.5rem;
}
.preview-column {
  margin-top: 2.5rem;
}
@media (max-width: 768px) {
  .header-grid { grid-template-columns: 1fr; }
  .header-right { align-items: flex-start; }
}

/* Estilos específicos para el template gris oscuro */
/* CABECERA CON PERFIL Y DATOS PERSONALES */
/* Ajuste del CSS: header-main encima, luego header-grid */
/* LAYOUT PRINCIPAL DE 2 COLUMNAS */
/* ESTILOS GENERALES DE SECCIONES */
/* ESTILOS PARA LA COLUMNA IZQUIERDA (Experiencia y Formación) */
/* ESTILOS PARA LA COLUMNA DERECHA (Idiomas y Competencias) */
/* Responsive para el template */


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
  display: block;
  margin-bottom: 2rem;
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
  overflow: hidden;
}

.preview-container {
  height: 100%;
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
  overflow-y: auto;
  background: var(--background, #ecf0f1);
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
  
  .preview-column {
    order: -1;
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
</style>