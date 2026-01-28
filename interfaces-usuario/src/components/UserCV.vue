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
          <p>Crea tu currículum profesional con tu color personalizado</p>
          
          <!-- Selector de plantilla -->
          <div class="template-selector">
            <label>Selecciona una plantilla:</label>
            <div class="template-options">
              <button 
                class="template-option" 
                :class="{ active: selectedTemplate === 1 }"
                @click="selectedTemplate = 1"
              >
                <span class="template-icon">📄</span>
                <span>Plantilla Clásica</span>
              </button>
              <button 
                class="template-option" 
                :class="{ active: selectedTemplate === 2 }"
                @click="selectedTemplate = 2"
              >
                <span class="template-icon">🎨</span>
                <span>Plantilla Moderna</span>
              </button>
            </div>
          </div>

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
                  
                  <!-- Selector de color para el CV -->
                  <div class="form-group full-width">
                    <label>Color del CV *</label>
                    <div class="color-selector-container">
                      <div 
                        v-for="color in availableColors" 
                        :key="color.name"
                        class="color-option"
                        :class="{ selected: formData.selectedColor === color.value }"
                        @click="selectColor(color.value)"
                        :style="{ backgroundColor: color.value }"
                        :title="color.name"
                      >
                        <span v-if="formData.selectedColor === color.value" class="color-check">✓</span>
                      </div>
                    </div>
                    <div class="color-description">
                      Selecciona el color principal para tu CV
                    </div>
                  </div>

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
                      <label>Nombre *</label>
                      <input
                        type="text"
                        v-model="formData.personalInfo.firstName"
                        placeholder="Ej: Juan"
                        required
                      >
                    </div>

                    <div class="form-group">
                      <label>Apellido *</label>
                      <input
                        type="text"
                        v-model="formData.personalInfo.lastName"
                        placeholder="Ej: Torres"
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
                          <div class="date-range">
                            <input
                              type="number"
                              v-model.number="exp.startYear"
                              :min="1900"
                              :max="currentYear"
                              @change="exp.periodError = ''; validateExpPeriod(index)"
                              placeholder="Ej: 2019"
                              required
                            />
                            <span class="date-sep">—</span>
                            <input
                              type="number"
                              v-model.number="exp.endYear"
                              :min="1900"
                              :max="currentYear"
                              @change="exp.periodError = ''; validateExpPeriod(index)"
                              placeholder="(Opcional)"
                            />
                          </div>
                          <small v-if="exp.periodError" style="color: #c0392b; display:block; margin-top:6px;">{{ exp.periodError }}</small>
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
                          <div class="date-range">
                            <input
                              type="number"
                              v-model.number="edu.startYear"
                              :min="1900"
                              :max="currentYear"
                              @change="edu.periodError = ''; validateEduPeriod(index)"
                              placeholder="Ej: 2018"
                            />
                            <span class="date-sep">—</span>
                            <input
                              type="number"
                              v-model.number="edu.endYear"
                              :min="1900"
                              :max="currentYear"
                              @change="edu.periodError = ''; validateEduPeriod(index)"
                              placeholder="(Opcional)"
                            />
                          </div>
                          <small v-if="edu.periodError" style="color: #c0392b; display:block; margin-top:6px;">{{ edu.periodError }}</small>
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
                            <!-- rating preview removed per user request -->
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
                <!-- Título removido para dar más espacio a la barra WYSIWYG -->
                <div class="cv-format-toolbar">
                  <div class="format-buttons" role="toolbar" aria-label="Formato CV">
                    <button type="button" class="fmt-btn" title="Negrita" @click.prevent="toggleBoldAll">B</button>
                    <button type="button" class="fmt-btn" title="Cursiva" @click.prevent="toggleItalicAll">I</button>
                    <button type="button" class="fmt-btn" title="Subrayado" @click.prevent="toggleUnderlineAll">U</button>
                    <button type="button" class="fmt-btn" title="Lista ordenada" @click.prevent="toggleOrderedList">1.</button>
                    <button type="button" class="fmt-btn" title="Lista con viñetas" @click.prevent="toggleBulletList">•</button>
                  </div>
                  <div class="format-controls">
                    <label>Interlineado: <select @change="setPreviewLineHeight($event)"><option value="1.2">1.2</option><option value="1.4" selected>1.4</option><option value="1.6">1.6</option><option value="1.8">1.8</option></select></label>
                  </div>
                </div>
                <div class="preview-actions">
                  <button class="preview-btn" @click="downloadCV" :disabled="!isFormValid">
                    📄 Descargar PDF
                  </button>
                </div>
              </div>
              
              <div class="preview-content" ref="cvPreview" contenteditable="true">
                <!-- Plantilla 1: Clásica -->
                <div v-if="selectedTemplate === 1" class="cv-template-custom" :style="cvStyles">
                  <!-- CABECERA CON PERFIL Y DATOS PERSONALES -->
                  <div class="cv-header-custom">
                    <div class="header-main-with-photo">
                      <!-- Foto de perfil a la izquierda -->
                      <div class="photo-container" v-if="formData.personalInfo.photo">
                        <img :src="formData.personalInfo.photo" alt="Foto de perfil" class="profile-photo">
                      </div>
                      <!-- Nombre y título centrados -->
                      <div class="header-text-center">
                        <h1>{{ (formData.personalInfo.firstName || '') + ' ' + (formData.personalInfo.lastName || '') || formData.personalInfo.fullName || 'Tu Nombre Completo' }}</h1>
                        <p class="cv-title-custom">{{ formData.personalInfo.title || 'Tu Profesión' }}</p>
                      </div>
                      <!-- Espacio vacío a la derecha para balance -->
                      <div class="photo-placeholder" v-if="!formData.personalInfo.photo"></div>
                    </div>
                    <div class="header-grid">
                      <!-- Izquierda: Perfil -->
                      <div class="header-left">
                        <div class="profile-section" v-if="formData.profile">
                          <h2 class="section-title-custom">Mi Perfil</h2>
                          <p class="profile-text" v-html="formData.profile"></p>
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

                  <div class="cv-content-custom">
                    <!-- COLUMNA IZQUIERDA: Experiencia Laboral y Formación Académica -->
                    <div class="cv-left-column">
                      <!-- Experiencia laboral -->
                      <div class="cv-section-custom" v-if="formData.experience.some(exp => exp.company)">
                        <h2 class="section-title-custom">Experiencia Laboral</h2>
                        <div class="experience-list-custom">
                          <div class="experience-item-custom" v-for="(exp, index) in formData.experience.filter(exp => exp.company)" :key="index">
                            <div class="exp-header-custom">
                              <span class="exp-check">✅</span>
                              <div class="exp-info">
                                <h3 class="company-name">{{ exp.company }}</h3>
                                <p class="exp-period">{{ periodDisplay(exp) }}</p>
                              </div>
                            </div>
                            <p class="exp-description" v-if="exp.description">{{ exp.description }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Formación académica -->
                      <div class="cv-section-custom" v-if="formData.education.some(edu => edu.degree)">
                        <h2 class="section-title-custom">Formación Académica</h2>
                        <div class="education-list-custom">
                          <div class="education-item-custom" v-for="(edu, index) in formData.education.filter(edu => edu.degree)" :key="index">
                            <div class="edu-header-custom">
                              <span class="edu-check">✅</span>
                              <div class="edu-info">
                                <h3 class="edu-degree">{{ edu.degree }}</h3>
                                <p class="edu-period" v-if="periodDisplay(edu)">{{ periodDisplay(edu) }}</p>
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
                      <div class="cv-section-custom" v-if="formData.languages.some(lang => lang.name)">
                        <h2 class="section-title-custom">Idiomas</h2>
                        <div class="languages-list-custom">
                          <div class="language-item-custom" v-for="(lang, index) in formData.languages.filter(lang => lang.name)" :key="index">
                            <span class="language-check">✅</span>
                            <span class="language-name-custom">{{ lang.name }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Competencias -->
                      <div class="cv-section-custom" v-if="formData.competences.some(comp => comp.name)">
                        <h2 class="section-title-custom">Competencias</h2>
                        <div class="competences-list-custom">
                          <div class="competence-item-custom" v-for="(comp, index) in formData.competences.filter(comp => comp.name)" :key="index">
                            {{ comp.name }}
                          </div>
                        </div>
                      </div>

                      <!-- Paso visualización de habilidades en el preview (en la vista previa del CV) -->
                      <div class="cv-section-custom" v-if="formData.skills && formData.skills.some(skill => skill.name)">
                        <h2 class="section-title-custom">Habilidades</h2>
                        <div class="skills-list-custom">
                          <div class="skill-item-custom" v-for="(skill, index) in formData.skills.filter(skill => skill.name)" :key="index">
                            <span class="skill-name">{{ skill.name }}</span>
                            <StarRating :rating="skill.rating" :editable="false" :max="5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Plantilla 2: Moderna -->
                <div v-else-if="selectedTemplate === 2" class="cv-template-two" :style="cvStyles">
                  <!-- Encabezado con cuadro CV -->
                  <div class="cv-header-two">
                    <div class="header-main-two">
                      <div class="cv-box" :style="{ backgroundColor: formData.selectedColor }">CV</div>
                      <div class="header-text-two">
                        <h1>{{ (formData.personalInfo.firstName || '') + ' ' + (formData.personalInfo.lastName || '') || formData.personalInfo.fullName || 'Tu Nombre Completo' }}</h1>
                        <p class="cv-title-two">{{ formData.personalInfo.title || 'Tu Profesión' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="cv-content-two">
                    <!-- Sección de Datos Personales -->
                    <section class="cv-section-two" v-if="hasPersonalInfo">
                      <h2 class="section-title-two">Datos personales</h2>
                      <hr class="section-divider" />
                      <div class="personal-info-list">
                        <p v-if="formData.personalInfo.firstName || formData.personalInfo.lastName || formData.personalInfo.fullName">
                          <strong>Nombre</strong> {{ (formData.personalInfo.firstName || '') + ' ' + (formData.personalInfo.lastName || '') || formData.personalInfo.fullName }}
                        </p>
                        <p v-if="formData.personalInfo.email">
                          <strong>Correo electrónico</strong> {{ formData.personalInfo.email }}
                        </p>
                        <p v-if="formData.personalInfo.phone">
                          <strong>Teléfono</strong> {{ formData.personalInfo.phone }}
                        </p>
                        <p v-if="formData.personalInfo.location">
                          <strong>Dirección</strong> {{ formData.personalInfo.location }}
                        </p>
                        <p v-if="formData.personalInfo.website">
                          <strong>Sitio web</strong> {{ formData.personalInfo.website }}
                        </p>
                      </div>
                    </section>

                    <!-- Sección de Perfil Profesional -->
                    <section class="cv-section-two" v-if="formData.profile">
                      <h2 class="section-title-two">Perfil Profesional</h2>
                      <hr class="section-divider" />
                      <p class="profile-text-two">{{ formData.profile }}</p>
                    </section>

                    <!-- Sección de Experiencia Laboral -->
                    <section class="cv-section-two" v-if="formData.experience.some(exp => exp.company)">
                      <h2 class="section-title-two">Experiencia Laboral</h2>
                      <hr class="section-divider" />
                      <div class="experience-list-two">
                        <div class="experience-item-two" v-for="(exp, index) in formData.experience.filter(exp => exp.company)" :key="index">
                          <h3 class="company-name-two">{{ exp.company }}</h3>
                          <p class="exp-period-two" v-if="exp.period">{{ exp.period }}</p>
                          <p class="exp-description-two" v-if="exp.description">{{ exp.description }}</p>
                        </div>
                      </div>
                    </section>

                    <!-- Sección de Formación Académica -->
                    <section class="cv-section-two" v-if="formData.education.some(edu => edu.degree)">
                      <h2 class="section-title-two">Formación Académica</h2>
                      <hr class="section-divider" />
                      <div class="education-list-two">
                        <div class="education-item-two" v-for="(edu, index) in formData.education.filter(edu => edu.degree)" :key="index">
                          <h3 class="edu-degree-two">{{ edu.degree }}</h3>
                          <p class="edu-institution-two" v-if="edu.institution">{{ edu.institution }}</p>
                          <p class="edu-period-two" v-if="edu.period">{{ edu.period }}</p>
                          <p class="edu-specialization-two" v-if="edu.specialization">{{ edu.specialization }}</p>
                        </div>
                      </div>
                    </section>

                    <!-- Sección de Idiomas -->
                    <section class="cv-section-two" v-if="formData.languages.some(lang => lang.name)">
                      <h2 class="section-title-two">Idiomas</h2>
                      <hr class="section-divider" />
                      <ul class="languages-list-two">
                        <li v-for="(lang, index) in formData.languages.filter(lang => lang.name)" :key="index">
                          {{ lang.name }}
                        </li>
                      </ul>
                    </section>

                    <!-- Sección de Competencias -->
                    <section class="cv-section-two" v-if="formData.competences.some(comp => comp.name)">
                      <h2 class="section-title-two">Competencias</h2>
                      <hr class="section-divider" />
                      <ul class="competences-list-two">
                        <li v-for="(comp, index) in formData.competences.filter(comp => comp.name)" :key="index">
                          {{ comp.name }}
                        </li>
                      </ul>
                    </section>

                    <!-- Sección de Habilidades -->
                    <section class="cv-section-two" v-if="formData.skills && formData.skills.some(skill => skill.name)">
                      <h2 class="section-title-two">Habilidades</h2>
                      <hr class="section-divider" />
                      <div class="skills-list-two">
                        <div class="skill-item-two" v-for="(skill, index) in formData.skills.filter(skill => skill.name)" :key="index">
                          <span class="skill-name-two">{{ skill.name }}</span>
                          <span class="skill-rating-two">{{ '★'.repeat(skill.rating) }}{{ '☆'.repeat(5 - skill.rating) }}</span>
                        </div>
                      </div>
                    </section>
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
    syncNamesFromStorageOrFields() {
      try {
        // If formData already has first/last, ensure fullName updated
        const p = this.formData.personalInfo || {};
        if ((p.firstName || p.lastName) && !p.fullName) {
          p.fullName = ((p.firstName || '') + ' ' + (p.lastName || '')).trim();
        }
        // If only fullName exists (loading old data), split it
        if (!p.firstName && p.fullName) {
          const parts = p.fullName.trim().split(/\s+/);
          p.firstName = parts.shift() || '';
          p.lastName = parts.join(' ') || '';
        }
      } catch (e) {
        console.warn('syncNames error', e);
      }
    },
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
      availablePreviewFonts: [],
      selectedPreviewFont: '',
      user: null,
      currentStep: 1,
      selectedTemplate: 1, // 1: Clásica, 2: Moderna
      steps: [
        { id: 1, icon: '👤', title: 'Personal' },
        { id: 2, icon: '📝', title: 'Perfil' },
        { id: 3, icon: '💼', title: 'Experiencia' },
        { id: 4, icon: '🎓', title: 'Formación' },
        { id: 5, icon: '⚡', title: 'Competencias' },
        { id: 6, icon: '⭐', title: 'Habilidades' },
        { id: 7, icon: '🌐', title: 'Idiomas' }
      ],
      availableColors: [], // Se cargará desde localStorage
      formData: {
        selectedColor: '#2c3e50', // Color por defecto
        personalInfo: {
          fullName: '',
          firstName: '',
          lastName: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          photo: null
        },
        profile: '',
        experience: [
          {
            company: '',
            startYear: '',
            endYear: '',
            periodError: '',
            description: ''
          }
        ],
        education: [
          {
            degree: '',
            institution: '',
            startYear: '',
            endYear: '',
            periodError: '',
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
      // Nombre para mostrar en el PDF (asegurarse de que sea string antes de usar toUpperCase())
      const displayName = ((personalInfo.fullName || personalInfo.displayName || ((personalInfo.firstName || '') + ' ' + (personalInfo.lastName || ''))).trim()) || '';
      return (personalInfo.firstName || personalInfo.lastName || personalInfo.fullName) && personalInfo.title && personalInfo.email && this.formData.selectedColor;
    },
    
    cvStyles() {
      return {
        '--cv-primary-color': this.formData.selectedColor,
        '--cv-secondary-color': this.lightenColor(this.formData.selectedColor, 20),
        '--cv-accent-color': this.darkenColor(this.formData.selectedColor, 10)
      };
    },
    
    hasPersonalInfo() {
      const info = this.formData.personalInfo;
        return (info.firstName || info.lastName || info.fullName) || info.email || info.phone || info.location || info.website;
    }
    ,
    currentYear() {
      return new Date().getFullYear();
    }
  },
  async mounted() {
    // Cargar colores primero para que el selector siempre tenga opciones
    this.loadAvailableColors();
    this.checkAuthentication();
    this.loadSavedCV();
    // Precargar fuentes al montar el componente
    await loadPdfFonts();
    // Cargar fuentes configuradas desde el admin para el selector
    this.loadPreviewFonts();
    // Inicializar interlineado por defecto
    if (this.$refs.cvPreview) this.$refs.cvPreview.style.setProperty('--cv-line-height', '1.4');
    // Mantener fullName sincronizado con first/last
    this.syncNamesFromStorageOrFields();
  },
  methods: {
    loadPreviewFonts() {
      try {
        const saved = localStorage.getItem('jdmGlobalStyles');
        const fonts = [];
        // opción predeterminada (usar la fuente de la página/admin)
        fonts.push({ label: '(predeterminada)', value: '' });
        if (saved) {
          const parsed = JSON.parse(saved);
          const styles = parsed.styles || {};
          const custom = parsed.customFonts || [];
          if (styles['--font-family']) {
            fonts.push({ label: 'Fuente principal', value: styles['--font-family'] });
          }
          if (styles['--secondary-font']) {
            fonts.push({ label: 'Fuente secundaria', value: styles['--secondary-font'] });
          }
          if (Array.isArray(custom)) {
            custom.forEach(f => {
              // f.name
              fonts.push({ label: f.name, value: `'${f.name}', sans-serif` });
            });
          }
        }
        // genéricos
        fonts.push({ label: 'Sans-serif', value: 'Helvetica, Arial, sans-serif' });
        fonts.push({ label: 'Serif', value: 'Georgia, serif' });
        this.availablePreviewFonts = fonts;
      } catch (e) {
        console.warn('Error cargando fuentes para preview:', e);
      }
    },
    // Formato global del preview
    setPreviewLineHeight(e) {
      const val = e.target.value;
      if (this.$refs.cvPreview) this.$refs.cvPreview.style.setProperty('--cv-line-height', val);
    },
    
    toggleClassOnPreview(cls) {
      if (!this.$refs.cvPreview) return;
      this.$refs.cvPreview.classList.toggle(cls);
    },
    toggleBoldAll() { this.toggleClassOnPreview('cv-bold'); },
    toggleItalicAll() { this.toggleClassOnPreview('cv-italic'); },
    toggleUnderlineAll() { this.toggleClassOnPreview('cv-underline'); },
    toggleOrderedList() { document.execCommand('insertOrderedList'); },
    toggleBulletList() { document.execCommand('insertUnorderedList'); },

    // Period parsing and validation helpers
    parsePeriodString(str) {
      // Keep for migration: parse legacy "2019 - 2023" strings
      if (!str || typeof str !== 'string') return null;
      const s = str.trim();
      const m = s.match(/(\d{4})\s*[\-–—]\s*([a-zA-Z0-9]+)/);
      if (m) {
        const start = parseInt(m[1], 10);
        let endRaw = m[2];
        let end = null;
        if (/^present$/i.test(endRaw) || /^actual$/i.test(endRaw)) {
          end = new Date().getFullYear();
        } else if (/^\d{4}$/.test(endRaw)) {
          end = parseInt(endRaw, 10);
        }
        return { start, end };
      }
      const m2 = s.match(/^(\d{4})$/);
      if (m2) return { start: parseInt(m2[1], 10), end: parseInt(m2[1], 10) };
      return null;
    },

    periodDisplay(item) {
      if (!item) return '';
      // Prefer explicit year fields
      if (item.startYear) {
        const sy = Number(item.startYear);
        if (item.endYear) {
          const ey = Number(item.endYear);
          return `${sy} - ${ey}`;
        }
        return `${sy} - Present`;
      }
      // Fallback: try legacy startDate/endDate or period string
      if (item.startDate) {
        try {
          const s = new Date(item.startDate);
          const sy = s.getFullYear();
          if (item.endDate) {
            const e = new Date(item.endDate);
            const ey = e.getFullYear();
            return `${sy} - ${ey}`;
          }
          return `${sy} - Present`;
        } catch (e) {
          return item.period || '';
        }
      }
      return item.period || '';
    },

    validateExpPeriod(index) {
      const exp = this.formData.experience[index];
      if (!exp) return true;
      const cy = new Date().getFullYear();
      if (!exp.startYear && exp.startYear !== 0) {
        exp.periodError = 'Selecciona el año de inicio.';
        return false;
      }
      const s = Number(exp.startYear);
      if (!Number.isInteger(s) || s < 1900 || s > cy) {
        exp.periodError = `El año de inicio debe ser entre 1900 y ${cy}.`;
        return false;
      }
      if (exp.endYear) {
        const e = Number(exp.endYear);
        if (!Number.isInteger(e) || e < 1900 || e > cy) {
          exp.periodError = `El año final debe ser entre 1900 y ${cy}.`;
          return false;
        }
        if (s > e) {
          exp.periodError = 'El año inicial no puede ser posterior al año final.';
          return false;
        }
      }
      exp.periodError = '';
      return true;
    },

    validateEduPeriod(index) {
      const edu = this.formData.education[index];
      if (!edu) return true;
      const cy = new Date().getFullYear();
      if (!edu.startYear && edu.startYear !== 0) {
        edu.periodError = 'Selecciona el año de inicio.';
        return false;
      }
      const s = Number(edu.startYear);
      if (!Number.isInteger(s) || s < 1900 || s > cy) {
        edu.periodError = `El año de inicio debe ser entre 1900 y ${cy}.`;
        return false;
      }
      if (edu.endYear) {
        const e = Number(edu.endYear);
        if (!Number.isInteger(e) || e < 1900 || e > cy) {
          edu.periodError = `El año final debe ser entre 1900 y ${cy}.`;
          return false;
        }
        if (s > e) {
          edu.periodError = 'El año inicial no puede ser posterior al año final.';
          return false;
        }
      }
      edu.periodError = '';
      return true;
    },
  
    // Cargar colores disponibles desde la configuración del admin
    loadAvailableColors() {
      try {
        const globalStyles = localStorage.getItem('jdmGlobalStyles');
        if (globalStyles) {
          const { styles } = JSON.parse(globalStyles);
          this.availableColors = [
            { name: 'Color Principal', value: styles['--primary'] || '#2c3e50' },
            { name: 'Color Secundario', value: styles['--secondary'] || '#e74c3c' },
            { name: 'Color de Fondo', value: styles['--background'] || '#ecf0f1' },
            { name: 'Color de Texto', value: styles['--text'] || '#2c3e50' },
            { name: 'Color de Acento', value: styles['--accent'] || '#ffffff' }
          ];
        } else {
          // Colores por defecto si no hay configuración
          this.availableColors = [
            { name: 'Color Principal', value: '#2c3e50' },
            { name: 'Color Secundario', value: '#e74c3c' },
            { name: 'Color de Fondo', value: '#ecf0f1' },
            { name: 'Color de Texto', value: '#2c3e50' },
            { name: 'Color de Acento', value: '#ffffff' }
          ];
        }
        
        // Asegurar que el color seleccionado pertenezca a los colores disponibles.
        // Si el color guardado no está en la lista, usar el primero disponible.
        const availableValues = this.availableColors.map(c => c.value);
        if (!this.formData.selectedColor || !availableValues.includes(this.formData.selectedColor)) {
          this.formData.selectedColor = this.availableColors[0].value;
        }
      } catch (error) {
        console.error('Error al cargar colores disponibles:', error);
        // Colores de respaldo
        this.availableColors = [
          { name: 'Azul Oscuro', value: '#2c3e50' },
          { name: 'Rojo', value: '#e74c3c' },
          { name: 'Verde', value: '#27ae60' },
          { name: 'Naranja', value: '#f39c12' },
          { name: 'Morado', value: '#8e44ad' }
        ];
        // Si por alguna razón el selectedColor no está definido, asignar el primero de respaldo
        if (!this.formData.selectedColor) {
          this.formData.selectedColor = this.availableColors[0].value;
        }
      }
    },
    
    // Método para seleccionar color
    selectColor(color) {
      this.formData.selectedColor = color;
    },
    
    // Métodos auxiliares para manipular colores
    lightenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
      return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    },
    
    darkenColor(color, percent) {
      const num = parseInt(color.replace("#", ""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) - amt,
        G = (num >> 8 & 0x00FF) - amt,
        B = (num & 0x0000FF) - amt;
      return "#" + (0x1000000 + (R > 0 ? R : 0) * 0x10000 +
        (G > 0 ? G : 0) * 0x100 +
        (B > 0 ? B : 0)).toString(16).slice(1);
    },

    checkAuthentication() {
      const storedUser = localStorage.getItem('jdmCurrentUser');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        if (this.user.email && !this.formData.personalInfo.email) {
          this.formData.personalInfo.email = this.user.email;
        }
      } else {
        // No redirigir si no hay usuario: permitir usar el editor sin autenticación
        this.user = null;
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
        startYear: '',
        endYear: '',
        periodError: '',
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
        startYear: '',
        endYear: '',
        periodError: '',
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
        alert('Por favor completa los campos obligatorios (Nombre, Título, Email y Color)');
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
        selectedTemplate: this.selectedTemplate,
        userId: this.user.id,
        lastUpdated: new Date().toISOString()
      };

      // Ensure fullName is synchronized before saving
      try {
        const p = cvData.personalInfo || {};
        p.fullName = ((p.firstName || '') + ' ' + (p.lastName || '')).trim();
      } catch (e) { /* ignore */ }

      // Validate all periods before saving
      const expInvalid = this.formData.experience.some((e, idx) => !this.validateExpPeriod(idx));
      const eduInvalid = this.formData.education.some((e, idx) => !this.validateEduPeriod(idx));
      if (expInvalid || eduInvalid) {
        alert('Hay errores en los periodos. Corrige los campos marcados antes de guardar.');
        return;
      }

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
      // Si no hay usuario autenticado, no intentar cargar CVs (evita errores en mounted)
      if (!this.user) return;

      const userCVs = this.getStoredCVs();
      const userCV = userCVs.find(cv => cv.userId === this.user.id);

      if (userCV) {
        this.formData = { ...userCV };
        if (userCV.selectedTemplate) {
          this.selectedTemplate = userCV.selectedTemplate;
        }
        // migrate legacy period strings to startDate/endDate where needed
        try {
          if (Array.isArray(this.formData.experience)) {
            this.formData.experience = this.formData.experience.map(exp => {
              // migrate legacy period string
              if (exp && !exp.startYear && exp.period) {
                const parsed = this.parsePeriodString(exp.period);
                if (parsed && parsed.start) {
                  exp.startYear = parsed.start;
                  exp.endYear = parsed.end || '';
                }
              }
              // migrate startDate -> year
              if (exp && !exp.startYear && exp.startDate) {
                try { exp.startYear = new Date(exp.startDate).getFullYear(); } catch (e) {}
              }
              if (exp && !exp.endYear && exp.endDate) {
                try { exp.endYear = new Date(exp.endDate).getFullYear(); } catch (e) {}
              }
              return exp;
            });
          }
          if (Array.isArray(this.formData.education)) {
            this.formData.education = this.formData.education.map(edu => {
              if (edu && !edu.startYear && edu.period) {
                const parsed = this.parsePeriodString(edu.period);
                if (parsed && parsed.start) {
                  edu.startYear = parsed.start;
                  edu.endYear = parsed.end || '';
                }
              }
              if (edu && !edu.startYear && edu.startDate) {
                try { edu.startYear = new Date(edu.startDate).getFullYear(); } catch (e) {}
              }
              if (edu && !edu.endYear && edu.endDate) {
                try { edu.endYear = new Date(edu.endDate).getFullYear(); } catch (e) {}
              }
              return edu;
            });
          }
        } catch (e) {
          console.warn('Error migrating periods on loadSavedCV', e);
        }
        // ensure name fields are normalized
        this.syncNamesFromStorageOrFields();
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
          selectedColor: '#2c3e50',
          personalInfo: {
            fullName: '',
            firstName: '',
            lastName: '',
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
              startYear: '',
              endYear: '',
              description: ''
            }
          ],
          education: [
            {
              degree: '',
              institution: '',
              startYear: '',
              endYear: '',
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
        this.selectedTemplate = 1;
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
        const docDefinition = this.selectedTemplate === 1 ? this.buildPDFDocumentTemplate1() : this.buildPDFDocumentTemplate2();
        const safeName = ((this.formData.personalInfo.firstName || '') + ' ' + (this.formData.personalInfo.lastName || '')).trim() || this.formData.personalInfo.fullName || 'Curriculum';
        const filename = `CV_${safeName.replace(/\s+/g, '_')}.pdf`;
        
        // Crear y descargar el PDF
        pdfMake.createPdf(docDefinition).download(filename);
        console.log('PDF generado exitosamente');
        
      } catch (error) {
        console.error('Error detallado al generar PDF:', error);
        alert(`Error al generar el PDF: ${error.message}. Por favor, intenta nuevamente.`);
      }
    },

    buildPDFDocumentTemplate1() {
      // Implementación existente para la plantilla 1
      const primaryColor = this.formData.selectedColor;
      const secondaryColor = this.lightenColor(primaryColor, 20);
      const backgroundColor = '#ffffff';
      const accentColor = '#ffffff';
      const textColor = '#2c3e50';
      
      // Colores derivados para mejor contraste en PDF
      const headerBgColor = primaryColor;
      const headerTextColor = accentColor;
      const sectionTitleColor = primaryColor;
      const bodyTextColor = textColor;
      const highlightColor = secondaryColor;

      const personalInfo = this.formData.personalInfo;

      // Nombre para mostrar en el PDF (asegurarse de que sea string antes de usar toUpperCase())
      const displayName = ((personalInfo.fullName || personalInfo.displayName || ((personalInfo.firstName || '') + ' ' + (personalInfo.lastName || ''))).trim()) || '';
      
      // Función para crear secciones con títulos con fondo
      const createSection = (title, content, columnWidth) => {
        return [
          {
            stack: [
              {
                canvas: [
                  {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: columnWidth,
                    h: 20,
                    color: headerBgColor
                  }
                ]
              },
              {
                text: title,
                style: 'sectionTitleWithBackdrop',
                margin: [10, -15, 0, 8]
              }
            ],
            margin: [0, 10, 0, 8]
          },
          content
        ];
      };

      // Construir experiencia laboral
      const experienceContent = this.formData.experience
        .filter(exp => exp.company && exp.company.trim() !== '')
        .flatMap((exp, index) => [
          {
            columns: [
              {
                width: 20,
                text: '•',
                style: 'bullet',
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
                  this.periodDisplay(exp) ? {
                    text: this.periodDisplay(exp),
                    style: 'itemSubtitle',
                    margin: [0, 0, 0, 2]
                  } : null,
                  exp.description ? {
                    text: exp.description,
                    style: 'body',
                    margin: [0, 0, 0, 6]
                  } : null
                ].filter(Boolean)
              }
            ],
            margin: [0, 0, 0, 6]
          }
        ]);

      // Construir formación académica
      const educationContent = this.formData.education
        .filter(edu => edu.degree && edu.degree.trim() !== '')
        .flatMap((edu, index) => [
          {
            columns: [
              {
                width: 20,
                text: '•',
                style: 'bullet',
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
                  this.periodDisplay(edu) ? {
                    text: this.periodDisplay(edu),
                    style: 'itemSubtitle',
                    margin: [0, 0, 0, 2]
                  } : null,
                  edu.specialization ? {
                    text: `Especialización: ${edu.specialization}`,
                    style: 'bodyItalic',
                    margin: [0, 0, 0, 6]
                  } : null
                ].filter(Boolean)
              }
            ],
            margin: [0, 0, 0, 6]
          }
        ]);

      // Construir idiomas
      const languagesContent = {
        stack: this.formData.languages
          .filter(lang => lang.name && lang.name.trim() !== '')
          .map(lang => ({
            columns: [
              {
                width: 20,
                text: '•',
                style: 'bullet',
                margin: [0, 2, 5, 0]
              },
              {
                width: '*',
                text: lang.name,
                style: 'body'
              }
            ],
            margin: [0, 0, 0, 4]
          }))
      };

      // Construir competencias
      const competencesContent = {
        ul: this.formData.competences
          .filter(comp => comp.name && comp.name.trim() !== '')
          .map(comp => ({
            text: comp.name,
            style: 'body',
            margin: [0, 0, 0, 2]
          })),
        style: 'body',
        margin: [0, 0, 0, 8]
      };

      // Construir habilidades
      const skillsContent = {
        stack: this.formData.skills
          .filter(skill => skill.name && skill.name.trim() !== '')
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
            margin: [0, 0, 0, 3]
          }))
      };

      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [0, 0, 0, 20],
        background: [
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 0,
                w: 595.28,
                h: 160,
                color: headerBgColor
              }
            ]
          }
        ],
        content: [
          // CONTENIDO SOBRE EL HEADER
          {
            stack: [
              // PRIMERA FILA: Imagen, Nombre/Título, Datos contacto
              {
                columns: [
                  // IMAGEN A LA IZQUIERDA
                  {
                    width: '20%',
                    stack: [
                      this.formData.personalInfo.photo ? {
                        image: this.formData.personalInfo.photo,
                        width: 70,
                        height: 70,
                        margin: [40, 25, 0, 0]
                      } : {
                        text: '',
                        width: 70,
                        height: 70,
                        margin: [40, 25, 0, 0]
                      }
                    ]
                  },
                  
                  // NOMBRE Y TÍTULO AL CENTRO
                  {
                    width: '50%',
                    stack: [
                      {
                        text: (displayName.toUpperCase() || 'NOMBRE COMPLETO'),
                        style: 'headerName',
                        alignment: 'center',
                        margin: [0, 30, 0, 3]
                      },
                      {
                        text: personalInfo.title || 'TÍTULO PROFESIONAL',
                        style: 'headerTitle',
                        alignment: 'center',
                        margin: [0, 0, 0, 0]
                      }
                    ]
                  },
                  
                  // DATOS CONTACTO A LA DERECHA
                  {
                    width: '30%',
                    stack: [
                      personalInfo.email ? {
                        text: `📧 ${personalInfo.email}`,
                        style: 'contactInfo',
                        margin: [0, 45, 40, 2]
                      } : null,
                      
                      personalInfo.phone ? {
                        text: `📞 ${personalInfo.phone}`,
                        style: 'contactInfo',
                        margin: [0, 0, 40, 2]
                      } : null,
                      
                      personalInfo.location ? {
                        text: `📍 ${personalInfo.location}`,
                        style: 'contactInfo',
                        margin: [0, 0, 40, 2]
                      } : null,
                      
                      personalInfo.website ? {
                        text: `🌐 ${personalInfo.website}`,
                        style: 'contactInfo',
                        margin: [0, 0, 40, 2]
                      } : null
                    ].filter(Boolean)
                  }
                ]
              },
              
              // PERFIL PROFESIONAL
              this.formData.profile ? {
                stack: [
                  {
                    text: 'PERFIL PROFESIONAL',
                    style: 'profileSectionTitle',
                    margin: [40, 10, 40, 4]
                  },
                  {
                    text: this.formData.profile,
                    style: 'profileText',
                    alignment: 'justify',
                    margin: [40, 0, 40, 0]
                  }
                ]
              } : null
            ],
            margin: [0, 0, 0, 0]
          },

          // CONTENIDO PRINCIPAL DEL CV - MUY CERCA DEL HEADER
          {
            stack: [
              {
                columns: [
                  // COLUMNA IZQUIERDA (60%)
                  {
                    width: '60%',
                    stack: [
                      ...(experienceContent.length > 0 ? 
                        createSection('EXPERIENCIA LABORAL', experienceContent, 320) : 
                        []
                      ),
                      
                      ...(educationContent.length > 0 ? 
                        createSection('FORMACIÓN ACADÉMICA', educationContent, 320) : 
                        []
                      )
                    ].filter(Boolean),
                    margin: [40, 0, 20, 0]
                  },
                  
                  // COLUMNA DERECHA (40%)
                  {
                    width: '40%',
                    stack: [
                      ...(this.formData.languages.filter(lang => lang.name && lang.name.trim() !== '').length > 0 ? 
                        createSection('IDIOMAS', languagesContent, 180) : 
                        []
                      ),
                      
                      ...(this.formData.competences.filter(comp => comp.name && comp.name.trim() !== '').length > 0 ? 
                        createSection('COMPETENCIAS', competencesContent, 180) : 
                        []
                      ),
                      
                      ...(this.formData.skills.filter(skill => skill.name && skill.name.trim() !== '').length > 0 ? 
                        createSection('HABILIDADES', skillsContent, 180) : 
                        []
                      )
                    ].filter(Boolean),
                    margin: [20, 0, 40, 0]
                  }
                ]
              }
            ],
            margin: [0, 165, 0, 0]
          }
        ],
        
        styles: {
          headerName: {
            fontSize: 20,
            bold: true,
            color: headerTextColor,
            margin: [0, 0, 0, 0]
          },
          headerTitle: {
            fontSize: 14,
            bold: true,
            color: highlightColor,
            margin: [0, 0, 0, 0]
          },
          contactInfo: {
            fontSize: 9,
            color: headerTextColor,
            lineHeight: 1.2,
            margin: [0, 0, 0, 0]
          },
          profileSectionTitle: {
            fontSize: 12,
            bold: true,
            color: headerTextColor,
            margin: [0, 0, 0, 0]
          },
          profileText: {
            fontSize: 9,
            color: headerTextColor,
            lineHeight: 1.3,
            margin: [0, 0, 0, 0]
          },
          sectionTitleWithBackdrop: {
            fontSize: 11,
            bold: true,
            color: headerTextColor,
            margin: [0, 2, 0, 0]
          },
          itemTitle: {
            fontSize: 10,
            bold: true,
            color: sectionTitleColor,
            margin: [0, 0, 0, 0]
          },
          itemSubtitle: {
            fontSize: 8,
            color: '#7f8c8d',
            italics: true,
            margin: [0, 0, 0, 0]
          },
          body: {
            fontSize: 8,
            color: bodyTextColor,
            lineHeight: 1.3,
            margin: [0, 0, 0, 0]
          },
          bodyItalic: {
            fontSize: 8,
            color: bodyTextColor,
            lineHeight: 1.3,
            italics: true,
            margin: [0, 0, 0, 0]
          },
          bullet: {
            fontSize: 10,
            color: highlightColor,
            bold: true,
            margin: [0, 0, 0, 0]
          },
          stars: {
            fontSize: 8,
            color: '#f39c12',
            bold: true,
            margin: [0, 0, 0, 0]
          }
        },
        
        defaultStyle: {
          font: 'Roboto',
          fontSize: 9,
          lineHeight: 1.2,
          margin: [0, 0, 0, 0]
        }
      };

      return docDefinition;
    },

    buildPDFDocumentTemplate2() {
      // Implementación para la plantilla 2 (moderna)
      const primaryColor = this.formData.selectedColor;
      const textColor = '#2c3e50';
      const lightBgColor = '#fdfbf9';
      
      const personalInfo = this.formData.personalInfo;

      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],
        background: function(currentPage, pageSize) {
          return [
            {
              canvas: [
                {
                  type: 'rect',
                  x: 0,
                  y: 0,
                  w: pageSize.width,
                  h: 120,
                  color: primaryColor
                }
              ]
            }
          ];
        },
        content: [
          // Header con cuadro CV
          {
            stack: [
              {
                columns: [
                  {
                    width: 80,
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 70,
                            h: 70,
                            color: primaryColor
                          }
                        ]
                      },
                      {
                        text: 'CV',
                        absolutePosition: { x: 55, y: 25 },
                        fontSize: 18,
                        bold: true,
                        color: '#ffffff'
                      }
                    ]
                  },
                  {
                    width: '*',
                    stack: [
                      {
                        text: (displayName.toUpperCase() || 'NOMBRE COMPLETO'),
                        style: 'headerName',
                        alignment: 'center',
                        margin: [0, 20, 0, 5]
                      },
                      {
                        text: personalInfo.title || 'TÍTULO PROFESIONAL',
                        style: 'headerTitle',
                        alignment: 'center',
                        margin: [0, 0, 0, 0]
                      }
                    ]
                  }
                ]
              }
            ],
            margin: [0, 0, 0, 30]
          },

          // Contenido principal
          {
            stack: [
              // Datos personales
              ...(this.hasPersonalInfo ? [
                {
                  text: 'DATOS PERSONALES',
                  style: 'sectionTitle',
                  margin: [0, 0, 0, 10]
                },
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0, y1: 0,
                      x2: 515, y2: 0,
                      lineWidth: 1,
                      lineColor: '#cccccc'
                    }
                  ],
                  margin: [0, 0, 0, 10]
                },
                {
                  columns: [
                    {
                      width: '50%',
                      stack: [
                        displayName ? {
                          text: [
                            { text: 'Nombre: ', style: 'label' },
                            displayName
                          ],
                          margin: [0, 0, 0, 5]
                        } : null,
                        personalInfo.email ? {
                          text: [
                            { text: 'Correo electrónico: ', style: 'label' },
                            personalInfo.email
                          ],
                          margin: [0, 0, 0, 5]
                        } : null
                      ].filter(Boolean)
                    },
                    {
                      width: '50%',
                      stack: [
                        personalInfo.phone ? {
                          text: [
                            { text: 'Teléfono: ', style: 'label' },
                            personalInfo.phone
                          ],
                          margin: [0, 0, 0, 5]
                        } : null,
                        personalInfo.location ? {
                          text: [
                            { text: 'Dirección: ', style: 'label' },
                            personalInfo.location
                          ],
                          margin: [0, 0, 0, 5]
                        } : null
                      ].filter(Boolean)
                    }
                  ].filter(Boolean),
                  margin: [0, 0, 0, 15]
                }
              ] : []),

              // Perfil profesional
              ...(this.formData.profile ? [
                {
                  text: 'PERFIL PROFESIONAL',
                  style: 'sectionTitle',
                  margin: [0, 20, 0, 10]
                },
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0, y1: 0,
                      x2: 515, y2: 0,
                      lineWidth: 1,
                      lineColor: '#cccccc'
                    }
                  ],
                  margin: [0, 0, 0, 10]
                },
                {
                  text: this.formData.profile,
                  style: 'body',
                  margin: [0, 0, 0, 15]
                }
              ] : []),

              // Experiencia laboral
              ...(this.formData.experience.some(exp => exp.company) ? [
                {
                  text: 'EXPERIENCIA LABORAL',
                  style: 'sectionTitle',
                  margin: [0, 20, 0, 10]
                },
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0, y1: 0,
                      x2: 515, y2: 0,
                      lineWidth: 1,
                      lineColor: '#cccccc'
                    }
                  ],
                  margin: [0, 0, 0, 10]
                },
                {
                  stack: this.formData.experience
                    .filter(exp => exp.company && exp.company.trim() !== '')
                    .map(exp => ({
                      stack: [
                        {
                          text: exp.company,
                          style: 'itemTitle',
                          margin: [0, 0, 0, 2]
                        },
                        exp.period ? {
                          text: exp.period,
                          style: 'itemSubtitle',
                          margin: [0, 0, 0, 2]
                        } : null,
                        exp.description ? {
                          text: exp.description,
                          style: 'body',
                          margin: [0, 0, 0, 10]
                        } : null
                      ].filter(Boolean)
                    }))
                }
              ] : []),

              // Formación académica
              ...(this.formData.education.some(edu => edu.degree) ? [
                {
                  text: 'FORMACIÓN ACADÉMICA',
                  style: 'sectionTitle',
                  margin: [0, 20, 0, 10]
                },
                {
                  canvas: [
                    {
                      type: 'line',
                      x1: 0, y1: 0,
                      x2: 515, y2: 0,
                      lineWidth: 1,
                      lineColor: '#cccccc'
                    }
                  ],
                  margin: [0, 0, 0, 10]
                },
                {
                  stack: this.formData.education
                    .filter(edu => edu.degree && edu.degree.trim() !== '')
                    .map(edu => ({
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
                          text: `Especialización: ${edu.specialization}`,
                          style: 'bodyItalic',
                          margin: [0, 0, 0, 10]
                        } : null
                      ].filter(Boolean)
                    }))
                }
              ] : []),

              // Columnas para idiomas, competencias y habilidades
              {
                columns: [
                  // Columna izquierda
                  {
                    width: '50%',
                    stack: [
                      // Idiomas
                      ...(this.formData.languages.some(lang => lang.name) ? [
                        {
                          text: 'IDIOMAS',
                          style: 'sectionTitle',
                          margin: [0, 20, 0, 10]
                        },
                        {
                          canvas: [
                            {
                              type: 'line',
                              x1: 0, y1: 0,
                              x2: 235, y2: 0,
                              lineWidth: 1,
                              lineColor: '#cccccc'
                            }
                          ],
                          margin: [0, 0, 0, 10]
                        },
                        {
                          ul: this.formData.languages
                            .filter(lang => lang.name && lang.name.trim() !== '')
                            .map(lang => lang.name),
                          style: 'body',
                          margin: [0, 0, 0, 15]
                        }
                      ] : []),

                      // Competencias
                      ...(this.formData.competences.some(comp => comp.name) ? [
                        {
                          text: 'COMPETENCIAS',
                          style: 'sectionTitle',
                          margin: [0, 20, 0, 10]
                        },
                        {
                          canvas: [
                            {
                              type: 'line',
                              x1: 0, y1: 0,
                              x2: 235, y2: 0,
                              lineWidth: 1,
                              lineColor: '#cccccc'
                            }
                          ],
                          margin: [0, 0, 0, 10]
                        },
                        {
                          ul: this.formData.competences
                            .filter(comp => comp.name && comp.name.trim() !== '')
                            .map(comp => comp.name),
                          style: 'body',
                          margin: [0, 0, 0, 15]
                        }
                      ] : [])
                    ]
                  },

                  // Columna derecha
                  {
                    width: '50%',
                    stack: [
                      // Habilidades
                      ...(this.formData.skills && this.formData.skills.some(skill => skill.name) ? [
                        {
                          text: 'HABILIDADES',
                          style: 'sectionTitle',
                          margin: [0, 20, 0, 10]
                        },
                        {
                          canvas: [
                            {
                              type: 'line',
                              x1: 0, y1: 0,
                              x2: 235, y2: 0,
                              lineWidth: 1,
                              lineColor: '#cccccc'
                            }
                          ],
                          margin: [0, 0, 0, 10]
                        },
                        {
                          stack: this.formData.skills
                            .filter(skill => skill.name && skill.name.trim() !== '')
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
                              margin: [0, 0, 0, 3]
                            }))
                        }
                      ] : [])
                    ]
                  }
                ]
              }
            ]
          }
        ],
        
        styles: {
          headerName: {
            fontSize: 20,
            bold: true,
            color: '#ffffff',
            margin: [0, 0, 0, 0]
          },
          headerTitle: {
            fontSize: 14,
            bold: true,
            color: '#ffffff',
            opacity: 0.9,
            margin: [0, 0, 0, 0]
          },
          sectionTitle: {
            fontSize: 12,
            bold: true,
            color: primaryColor,
            margin: [0, 0, 0, 0]
          },
          label: {
            fontSize: 9,
            bold: true,
            color: primaryColor
          },
          itemTitle: {
            fontSize: 10,
            bold: true,
            color: textColor,
            margin: [0, 0, 0, 0]
          },
          itemSubtitle: {
            fontSize: 8,
            color: '#7f8c8d',
            italics: true,
            margin: [0, 0, 0, 0]
          },
          body: {
            fontSize: 9,
            color: textColor,
            lineHeight: 1.3,
            margin: [0, 0, 0, 0]
          },
          bodyItalic: {
            fontSize: 9,
            color: textColor,
            lineHeight: 1.3,
            italics: true,
            margin: [0, 0, 0, 0]
          },
          stars: {
            fontSize: 8,
            color: '#f39c12',
            bold: true,
            margin: [0, 0, 0, 0]
          }
        },
        
        defaultStyle: {
          font: 'Roboto',
          fontSize: 9,
          lineHeight: 1.2,
          color: textColor
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

/* Selector de plantilla */
.template-selector {
  margin-bottom: 1.5rem;
}

.template-selector label {
  display: block;
  font-weight: 600;
  color: var(--primary, #2c3e50);
  margin-bottom: 0.5rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.template-options {
  display: flex;
  gap: 1rem;
}

.template-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--background, #ecf0f1);
  border: 2px solid var(--background, #ecf0f1);
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  transition: all 0.3s;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.template-option:hover {
  border-color: var(--primary, #2c3e50);
  transform: translateY(-2px);
}

.template-option.active {
  border-color: var(--secondary, #e74c3c);
  background: var(--accent, #ffffff);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.2);
}

.template-icon {
  font-size: 2rem;
}

.template-option span:last-child {
  font-weight: 600;
  color: var(--primary, #2c3e50);
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

/* Selector de colores */
.color-selector-container {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #333;
  transform: scale(1.15);
}

.color-check {
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.color-description {
  font-size: 0.85rem;
  color: var(--text, #666666);
  margin-top: 5px;
  font-style: italic;
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

/* Dentro de cada item, asegurar que los inputs respeten el margen interno
   y que la columna de nivel sea de ancho fijo mientras el nombre ocupa el resto. */
.form-item .form-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
}
.form-item .form-group { margin: 0; display: flex; flex-direction: column; justify-content: center; }
.rating-selector { align-items: flex-end; }
.rating-dropdown { min-width: 160px; max-width: 220px; }

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
  min-height: 800px;
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

/* ===== PLANTILLA 1: CLÁSICA ===== */
.cv-template-custom {
  background: #fff;
  color: #232323;
  padding: 2rem;
  border-radius: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.5;
  min-height: 1000px;
}

.cv-header-custom {
  background: var(--cv-primary-color, #2c3e50);
  color: #fff;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--cv-accent-color, #e74c3c);
  padding: 1.5rem;
  border-radius: 8px 8px 0 0;
}

.header-main-with-photo {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  min-height: 120px;
}

.photo-container {
  flex-shrink: 0;
  align-self: center;
}

.profile-photo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--cv-secondary-color, #e74c3c);
}

.header-text-center {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-top: 10px;
}

.header-text-center h1 {
  margin: 0 0 5px 0;
  line-height: 1.2;
  color: #fff;
  font-size: 2rem;
}

.header-text-center .cv-title-custom {
  margin: 0;
  line-height: 1.2;
  color: var(--cv-secondary-color, #e74c3c);
  font-size: 1.2rem;
}

.photo-placeholder {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

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
  color: #fff;
}

.profile-section h2.section-title-custom {
  color: #fff;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
}

.profile-text {
  white-space: pre-line;
  word-break: break-word;
  line-height: var(--cv-line-height, 1.4);
  text-align: justify;
  font-size: 0.95rem;
  color: #ecf0f1;
}

.cv-content-custom {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.cv-left-column,
.cv-right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cv-section-custom {
  margin-bottom: 1.5rem;
}

.section-title-custom {
  color: var(--cv-primary-color, #2c3e50);
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--cv-accent-color, #e74c3c);
}

.experience-list-custom,
.education-list-custom {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.experience-item-custom,
.education-item-custom {
  background: #f8f9fa;
  padding: 1.2rem;
  border-radius: 6px;
  border-left: 4px solid var(--cv-primary-color, #e74c3c);
}

.exp-header-custom,
.edu-header-custom {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.exp-check,
.edu-check {
  font-size: 0.9rem;
  margin-top: 0.2rem;
}

.exp-info,
.edu-info {
  flex: 1;
}

.company-name,
.edu-degree {
  color: var(--cv-primary-color, #2c3e50);
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0 0 0.25rem 0;
}

.exp-period,
.edu-period {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

.exp-description {
  white-space: pre-line;
  word-break: break-word;
  line-height: var(--cv-line-height, 1.4);
  color: #34495e;
  margin-top: 0.5rem;
  padding-left: 1.5rem;
}

.edu-institution,
.edu-specialization {
  white-space: pre-line;
  word-break: break-word;
  line-height: var(--cv-line-height, 1.4);
  color: #34495e;
  margin-top: 0.25rem;
  padding-left: 1.5rem;
}

.languages-list-custom,
.competences-list-custom,
.skills-list-custom {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.language-item-custom {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid var(--cv-primary-color, #2c3e50);
}

.language-check {
  font-size: 0.9rem;
}

.language-name-custom {
  color: var(--cv-primary-color, #2c3e50);
  font-weight: 500;
}

.competences-list-custom {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.competence-item-custom {
  background: var(--cv-primary-color, #e74c3c);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  border: 1px solid #e9ecef;
}

.skills-list-custom {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.skill-item-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid var(--cv-primary-color, #2c3e50);
}

.skill-name {
  color: var(--cv-primary-color, #2c3e50);
  font-weight: 500;
  flex: 1;
}

/* ===== PLANTILLA 2: MODERNA ===== */
.cv-template-two {
  background-color: #fdfbf9;
  color: #333;
  padding: 2rem;
  border-radius: 8px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: var(--cv-line-height, 1.4);
  min-height: 1000px;
}

.cv-header-two {
  margin-bottom: 2rem;
}

.header-main-two {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 2rem;
}

.cv-box {
  position: absolute;
  left: 0;
  top: 0;
  width: 110px;
  height: 110px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 24px;
  border-radius: 4px;
}

.header-text-two {
  text-align: center;
  margin: 0 auto;
}

.header-text-two h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--cv-primary-color, #2c3e50);
}

.cv-title-two {
  margin: 0;
  font-size: 1.2rem;
  color: var(--cv-primary-color, #2c3e50);
  opacity: 0.8;
}

.cv-content-two {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cv-section-two {
  margin-bottom: 1.5rem;
}

.section-title-two {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--cv-primary-color, #2c3e50);
}

.section-divider {
  border: none;
  border-top: 1px solid #ccc;
  margin-bottom: 1rem;
}

.personal-info-list p {
  margin: 0.5rem 0;
  display: flex;
}

.personal-info-list strong {
  color: var(--cv-primary-color, #2c3e50);
  margin-right: 0.5rem;
  min-width: 150px;
}

.profile-text-two {
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.6;
  text-align: justify;
}

.experience-list-two,
.education-list-two {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.experience-item-two,
.education-item-two {
  padding: 0.5rem 0;
}

.company-name-two,
.edu-degree-two {
  color: var(--cv-primary-color, #2c3e50);
  font-weight: 600;
  font-size: 1.1rem;
  margin: 0 0 0.25rem 0;
}

.exp-period-two,
.edu-period-two {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
}

.exp-description-two,
.edu-institution-two,
.edu-specialization-two {
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.5;
  color: #34495e;
  margin-top: 0.25rem;
}

.languages-list-two,
.competences-list-two {
  list-style-type: none;
  padding-left: 0;
}

.languages-list-two li,
.competences-list-two li {
  margin: 0.5rem 0;
  padding-left: 1rem;
  position: relative;
}

.languages-list-two li::before,
.competences-list-two li::before {
  content: "•";
  color: var(--cv-primary-color, #2c3e50);
  font-weight: bold;
  position: absolute;
  left: 0;
}

.skills-list-two {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.skill-item-two {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.skill-name-two {
  color: var(--cv-primary-color, #2c3e50);
  font-weight: 500;
}

.skill-rating-two {
  color: #f39c12;
  font-size: 1.1rem;
}

/* Rating Selector */
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

/* rating preview styles removed */

/* Photo Upload */
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
  width: 180px;
  height: 180px;
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
  font-size: 2.5rem;
}

.upload-text {
  font-weight: 600;
  color: var(--primary, #2c3e50);
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.upload-hint {
  font-size: 0.9rem;
  color: var(--text, #666666);
}

/* Character Counter */
.char-counter-container {
  margin-top: 0.5rem;
}

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

.char-limit-safe {
  border-color: #27ae60 !important;
  box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.1) !important;
}

.char-limit-warning {
  border-color: #f39c12 !important;
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.2) !important;
  animation: border-pulse 2s infinite;
}

.char-limit-danger {
  border-color: #e74c3c !important;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.3) !important;
  animation: border-shake 0.5s ease-in-out;
}

/* Animations */
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

/* Responsive */
@media (max-width: 1024px) {
  .cv-layout {
    grid-template-columns: 1fr;
  }
  
  .cv-content-custom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .builder-header {
    padding: 1.5rem;
  }
  
  .template-options {
    flex-direction: column;
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
  
  .cv-template-custom,
  .cv-template-two {
    padding: 1.5rem;
  }
  
  .header-grid {
    grid-template-columns: 1fr;
  }
  
  .header-right {
    align-items: flex-start;
  }
  
  .header-main-with-photo {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    min-height: auto;
  }
  
  .profile-photo {
    width: 80px;
    height: 80px;
  }
  
  .header-text-center {
    height: auto;
    margin-top: 0;
  }
  
  .photo-placeholder {
    display: none;
  }
  
  .photo-preview-img {
    width: 140px;
    height: 140px;
  }
  
  .char-count {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
  
  .char-progress-bar {
    height: 4px;
  }
  
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
  
  .competence-item-custom {
    flex: 1 1 calc(50% - 0.5rem);
    min-width: 0;
  }
  
  /* Responsive para la segunda plantilla */
  .header-main-two {
    flex-direction: column;
    text-align: center;
  }
  
  .cv-box {
    position: relative;
    margin-bottom: 1rem;
  }
  
  .personal-info-list p {
    flex-direction: column;
  }
  
  .personal-info-list strong {
    min-width: auto;
    margin-bottom: 0.25rem;
  }
  
  .skill-item-two {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
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
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Date range inputs */
.date-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.date-range input[type="date"] {
  padding: 0.5rem 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.date-sep {
  color: #666;
  font-weight: 600;
}

/* Prevent inputs from overflowing their container in experience/education sections */
.items-list,
.form-item,
.form-grid {
  box-sizing: border-box;
}

.form-item {
  overflow: hidden;
}

.form-grid input,
.form-grid select,
.form-grid textarea,
.form-item input,
.form-item select,
.form-item textarea {
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
}

.items-list {
  overflow: visible;
}

/* Preview adjustments: make preview layout match PDF-like constraints and avoid overflow */
.preview-content {
  overflow: auto;
  background: #fff;
  padding: 1rem;
}

.cv-template-custom,
.cv-template-two {
  box-sizing: border-box;
  max-width: 760px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem 1.25rem;
}

.header-main-with-photo {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-text-center,
.header-main-two .header-text-two {
  min-width: 0;
}

.header-text-center h1,
.header-text-two h1 {
  word-break: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.exp-info,
.edu-info,
.personal-info-list {
  min-width: 0;
}

.exp-info .company-name,
.edu-info .edu-degree,
.company-name-two,
.edu-degree-two {
  white-space: normal;
  word-break: break-word;
  overflow-wrap: break-word;
}

.exp-period,
.edu-period,
.exp-period-two,
.edu-period-two {
  white-space: normal;
  overflow-wrap: break-word;
  font-size: 0.95rem;
  color: #7f8c8d;
}

.cv-left-column,
.cv-right-column {
  min-width: 0;
}

/* Ensure images scale inside preview */
.profile-photo {
  max-width: 140px;
  width: 100%;
  height: auto;
}

/* Print Styles */
@media print {
  body, html, #app, .user-cv-container {
    background: #fff !important;
    color: #000 !important;
  }
  .user-cv-container {
    min-height: unset;
    padding: 0!important;
  }
  header, .builder-header, .steps-navigation, .form-column, .header-actions, .action-btn, .form-navigation, .preview-btn, .add-btn, .remove-btn {
    display: none !important;
    visibility: hidden !important;
  }
  .preview-column, .preview-container, .preview-content, .cv-template-custom, .cv-template-two {
    box-shadow: none !important;
    background: #fff !important;
    color: #000 !important;
    border-radius: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
  }
  .cv-content-custom {
    display: block !important;
  }
  .cv-section-custom, .section-title-custom, .experience-item-custom, .education-item-custom, .skill-item-custom, .competence-item-custom, .language-item-custom,
  .cv-section-two, .section-title-two, .experience-item-two, .education-item-two, .skill-item-two {
    background: none !important;
    color: #000 !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    page-break-inside: avoid;
  }
  .star-rating span {
    color: #eab308 !important;
    font-size: 1.2em !important;
  }
  @page {
    size: A4 portrait;
    margin: 1cm !important;
  }
}


</style>
<style>
.quill-container {
  margin: 0.5rem 0;
}
.quill-editor {
  min-height: 120px;
  background: #fff;
}
</style>
<style>
.cv-format-toolbar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
  background: transparent;
  padding: 6px;
  border-radius: 6px;
  flex-wrap: nowrap;
  overflow: hidden;
}
.format-buttons { display:flex; gap:0.4rem; flex-wrap:nowrap; overflow:auto; -webkit-overflow-scrolling:touch; }
.format-buttons .fmt-btn {
  padding: 6px 10px;
  border: none;
  background: var(--primary, #2c3e50);
  color: var(--accent, #ffffff);
  cursor: pointer;
  border-radius: 4px;
  font-weight: 600;
  white-space: nowrap;
}
.format-controls { margin-left: auto; display:flex; gap:0.6rem; align-items:center; }
.format-controls label { font-size: 0.9rem; }
.preview-content { font-size: var(--cv-font-size, 14px); line-height: var(--cv-line-height, 1.4); font-family: var(--cv-font-family, var(--font-family, inherit)); }
.preview-content.cv-bold { font-weight: 700; }
.preview-content.cv-italic { font-style: italic; }
.preview-content.cv-underline { text-decoration: underline; }
</style>