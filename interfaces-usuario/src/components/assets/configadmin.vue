<template>
  <section class="admin-section">
    <div class="container">
      <div class="admin-header">
        <h1>🛠️ Panel de Administración</h1>
        <p class="admin-subtitle">Gestiona usuarios y personaliza la apariencia de tu sitio JDM Tuning</p>
        <button @click="$emit('back-to-main')" class="back-btn">← Volver al sitio principal</button>
      </div>

      <!-- Navegación entre secciones del admin -->
      <div class="admin-navigation">
        <button 
          class="admin-nav-btn" 
          :class="{ active: currentAdminSection === 'users' }"
          @click="currentAdminSection = 'users'"
        >
          👥 Gestión de Usuarios
        </button>
        <button 
          class="admin-nav-btn" 
          :class="{ active: currentAdminSection === 'config' }"
          @click="currentAdminSection = 'config'"
        >
          🎨 Configuración
        </button>
        <button 
          class="admin-nav-btn"
          :class="{ active: currentAdminSection === 'carousel' }"
          @click="currentAdminSection = 'carousel'"
        >
          🖼️ Carousel
        </button>
        <button 
          class="admin-nav-btn" 
          :class="{ active: currentAdminSection === 'videos' }"
          @click="currentAdminSection = 'videos'"
        >
          🎬 Gestión de Videos
        </button>
      </div>

      <!-- Sección de Gestión de Usuarios con DataTable -->
      <div v-if="currentAdminSection === 'users'" class="users-management-section">
        <div class="users-header">
          <h2>👥 Gestión de Usuarios</h2>
          <div class="users-stats">
            <div class="stat-card">
              <div class="stat-number">{{ totalUsers }}</div>
              <div class="stat-label">Usuarios Totales</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ adminUsers }}</div>
              <div class="stat-label">Administradores</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ usersWithCVs }}</div>
              <div class="stat-label">CVs Creados</div>
            </div>
          </div>
        </div>

        <div class="users-content">
          <!-- Controles de DataTable -->
          <div class="datatable-controls">
            <div class="control-group">
              <button class="control-btn refresh-btn" @click="refreshUsersTable" title="Actualizar tabla">
                🔄 Actualizar
              </button>
              <button class="control-btn export-btn" @click="exportToCSV" title="Exportar a CSV">
                📊 Exportar CSV
              </button>
            </div>
            <div class="control-group">
              <select v-model="tablePageSize" @change="updatePageSize" class="page-size-select">
                <option value="10">10 registros</option>
                <option value="25">25 registros</option>
                <option value="50">50 registros</option>
                <option value="100">100 registros</option>
              </select>
            </div>
          </div>

          <!-- DataTable Container -->
          <div class="datatable-container">
            <table id="usersDatatable" class="display" style="width:100%">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Tipo</th>
                  <th>CV</th>
                  <th>Fecha Registro</th>
                  <th>Última Actividad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <!-- Los datos se cargarán dinámicamente -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Sección de Gestión del Carousel -->
      <div v-if="currentAdminSection === 'carousel'" class="carousel-management-section">
        <div class="users-header">
          <h2>🖼️ Gestión del Carousel</h2>
        </div>
        <div class="users-content">
          <CarouselManager />
        </div>
      </div>

      <!-- Sección de Gestión de Videos -->
      <div v-if="currentAdminSection === 'videos'" class="videos-management-section">
        <div class="users-header">
          <h2>🎬 Gestión de Videos</h2>
          <div class="users-stats">
            <div class="stat-card">
              <div class="stat-number">{{ totalVideos }}</div>
              <div class="stat-label">Videos Totales</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ videosWithAllTracks }}</div>
              <div class="stat-label">Completos</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ totalStorage }}</div>
              <div class="stat-label">Espacio Usado</div>
            </div>
          </div>
        </div>

        <div class="users-content">
          <!-- Controles de subida -->
          <div class="upload-section">
            <h3>Subir Nuevo Video</h3>
            <div class="upload-form">
              <div class="form-group">
                <label for="videoTitle">Título del Video</label>
                <input type="text" id="videoTitle" v-model="newVideo.title" placeholder="Ej: Tutorial de tuning" class="form-input">
              </div>
              
              <div class="form-group">
                <label for="videoDescription">Descripción</label>
                <textarea id="videoDescription" v-model="newVideo.description" placeholder="Descripción del video..." class="form-textarea" rows="3"></textarea>
              </div>
              
              <!-- Selector de categoría -->
              <div class="form-group">
                <label for="videoCategory">Categoría</label>
                <select id="videoCategory" v-model="newVideo.category" class="form-select">
                  <option value="tutorial">Tutorial</option>
                  <option value="review">Review</option>
                  <option value="evento">Evento</option>
                  <option value="entrevista">Entrevista</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              <div class="form-group">
                <label style="display:flex; align-items:center; gap:10px; user-select:none;">
                  <input type="checkbox" v-model="newVideo.addToCarousel">
                  Mostrar este video en el carrusel de videos (Galería)
                </label>
                <small style="opacity:0.8; display:block; margin-top:6px;">
                  Nota: solo se puede agregar si el video queda guardado con URL reproducible.
                </small>
              </div>

              <!-- Archivo principal del video -->
              <div class="file-upload-group">
                <label class="file-label">
                  <span class="file-icon">🎥</span>
                  <span class="file-text">Video Principal (MP4)</span>
                  <input type="file" @change="handleVideoUpload" accept="video/mp4" class="file-input">
                </label>
                <div v-if="newVideo.videoFile" class="file-info">
                  {{ newVideo.videoFile.name }} ({{ formatFileSize(newVideo.videoFile.size) }})
                </div>
              </div>

              <!-- Pistas de audio (requeridas: 2) -->
              <div class="audio-tracks-section">
                <h4>Pistas de Audio (2 requeridas)</h4>
                <div class="audio-track-group">
                  <div class="file-upload-group">
                    <label class="file-label">
                      <span class="file-icon">🔊</span>
                      <span class="file-text">Pista de Audio 1 (ES)</span>
                      <input type="file" @change="handleAudioUpload($event, 0)" accept="audio/mpeg,audio/wav,audio/ogg" class="file-input">
                    </label>
                    <div v-if="newVideo.audioTracks[0]" class="file-info">
                      {{ newVideo.audioTracks[0].name }} ({{ formatFileSize(newVideo.audioTracks[0].size) }})
                    </div>
                  </div>

                  <div class="file-upload-group">
                    <label class="file-label">
                      <span class="file-icon">🔊</span>
                      <span class="file-text">Pista de Audio 2 (EN)</span>
                      <input type="file" @change="handleAudioUpload($event, 1)" accept="audio/mpeg,audio/wav,audio/ogg" class="file-input">
                    </label>
                    <div v-if="newVideo.audioTracks[1]" class="file-info">
                      {{ newVideo.audioTracks[1].name }} ({{ formatFileSize(newVideo.audioTracks[1].size) }})
                    </div>
                  </div>
                </div>
              </div>

              <!-- Subtítulos DTT (requeridos: 2) -->
              <div class="subtitles-section">
                <h4>Archivos de Subtítulos DTT (2 requeridos)</h4>
                <div class="subtitles-group">
                  <div class="file-upload-group">
                    <label class="file-label">
                      <span class="file-icon">📄</span>
                      <span class="file-text">Subtítulos Español (.dtt)</span>
                      <input type="file" @change="handleSubtitleUpload($event, 0)" accept=".dtt,.srt,.vtt" class="file-input">
                    </label>
                    <div v-if="newVideo.subtitles[0]" class="file-info">
                      {{ newVideo.subtitles[0].name }} ({{ formatFileSize(newVideo.subtitles[0].size) }})
                    </div>
                  </div>

                  <div class="file-upload-group">
                    <label class="file-label">
                      <span class="file-icon">📄</span>
                      <span class="file-text">Subtítulos Inglés (.dtt)</span>
                      <input type="file" @change="handleSubtitleUpload($event, 1)" accept=".dtt,.srt,.vtt" class="file-input">
                    </label>
                    <div v-if="newVideo.subtitles[1]" class="file-info">
                      {{ newVideo.subtitles[1].name }} ({{ formatFileSize(newVideo.subtitles[1].size) }})
                    </div>
                  </div>
                </div>
              </div>

              <!-- Validación de archivos -->
              <div class="validation-status" :class="{ 'valid': isUploadValid, 'invalid': !isUploadValid }">
                <div v-if="!isUploadValid" class="validation-error">
                  <span>⚠️ Para subir el video necesitas:</span>
                  <ul>
                    <li v-if="newVideo.title.trim() === ''">- Título del video</li>
                    <li v-if="!newVideo.videoFile && !editingVideoId">- Archivo de video principal</li>
                  </ul>
                </div>
                <div v-else class="validation-success">
                  ✅ Datos listos para {{ editingVideoId ? 'guardar cambios' : 'subir el video' }}
                </div>
              </div>

              <!-- Botón de subida -->
              <button 
                @click="uploadVideo" 
                :disabled="!isUploadValid || isUploading" 
                class="upload-btn"
                :class="{ 'loading': isUploading }"
              >
                <span v-if="!isUploading">{{ isEditingVideo ? '💾 Guardar cambios' : '⬆️ Subir Video' }}</span>
                <span v-else>⏳ Subiendo...</span>
              </button>
            </div>
          </div>

          <!-- Lista de videos existentes -->
          <div class="videos-list-section">
            <h3>Videos Subidos</h3>
            <div class="videos-table-container">
              <table class="videos-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Categoría</th>
                    <th>Pistas de Audio</th>
                    <th>Subtítulos</th>
                    <th>Tamaño</th>
                    <th>Fecha</th>
                    <th>Carrusel</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="video in storedVideos" :key="video.id">
                    <td>{{ video.title }}</td>
                    <td><span class="category-badge" :class="video.category">{{ video.category }}</span></td>
                    <td>
                      <div class="tracks-status">
                        <span v-for="(track, index) in video.audioTracks" :key="index" 
                              class="track-indicator" :class="{ 'has-track': track }">
                          {{ index + 1 }}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="subtitles-status">
                        <span v-for="(subtitle, index) in video.subtitles" :key="index" 
                              class="subtitle-indicator" :class="{ 'has-subtitle': subtitle }">
                          {{ index + 1 }}
                        </span>
                      </div>
                    </td>
                    <td>{{ formatFileSize(video.size) }}</td>
                    <td>{{ formatDate(video.uploadDate) }}</td>
                    <td>
                      <input
                        type="checkbox"
                        :checked="isInVideoCarousel(video.id)"
                        @change="toggleVideoCarousel(video)"
                        :disabled="!getPlayableVideoUrl(video)"
                        :title="getPlayableVideoUrl(video) ? 'Mostrar en carrusel de videos' : 'No se puede: el video no tiene URL reproducible (demasiado grande)'"
                      >
                    </td>
                    <td>
                      <div class="video-actions">
                        <button @click="previewVideo(video)" class="action-btn preview-btn" title="Previsualizar">
                          👁️
                        </button>
                        <button @click="editVideo(video)" class="action-btn edit-btn" title="Editar">
                          ✏️
                        </button>
                        <button @click="deleteVideo(video.id)" class="action-btn delete-btn" title="Eliminar">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="storedVideos.length === 0" class="empty-videos">
                No hay videos subidos aún
              </div>
            </div>
          </div>

          <!-- Configuración del carrusel de videos (Galería) -->
          <div class="default-video-section color-sidebar" style="margin-top: 1.5rem;">
            <h3>🎞️ Carrusel de Videos (Galería)</h3>
            <p style="margin: 0.25rem 0 1rem 0; opacity: 0.85;">
              Activa la casilla “Carrusel” en la tabla y ordena aquí.
            </p>

            <div v-if="carouselVideoItems.length === 0" class="empty-videos">
              No hay videos seleccionados para el carrusel.
            </div>

            <div v-else style="display:flex; flex-direction:column; gap:10px;">
              <div
                v-for="(v, idx) in carouselVideoItems"
                :key="v.id"
                style="display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px; border:1px solid rgba(0,0,0,0.1); border-radius: var(--border-radius);"
              >
                <div style="display:flex; align-items:center; gap:12px; min-width:0;">
                  <img v-if="v.thumbnail" :src="v.thumbnail" alt="thumb" style="width:64px; height:40px; object-fit:cover; border-radius:6px;" />
                  <div style="min-width:0;">
                    <div style="font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{{ v.title }}</div>
                    <small style="opacity:0.75;">{{ formatFileSize(v.size || 0) }}</small>
                  </div>
                </div>
                <div style="display:flex; gap:6px;">
                  <button class="action-btn" @click="moveVideoInCarousel(v.id, -1)" :disabled="idx === 0" title="Subir">⬆️</button>
                  <button class="action-btn" @click="moveVideoInCarousel(v.id, 1)" :disabled="idx === carouselVideoItems.length - 1" title="Bajar">⬇️</button>
                  <button class="action-btn delete-btn" @click="removeVideoFromCarousel(v.id)" title="Quitar del carrusel">🗑️</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal de previsualización -->
          <div v-if="showPreviewModal" class="modal-overlay" @click="closePreviewModal">
            <div class="modal-content video-preview-modal" @click.stop>
              <h3 class="modal-title">{{ previewVideo.title }}</h3>
              <div class="video-preview-container">
                <!-- Reproductor de video -->
                <div class="player-container">
                  <video 
                    :id="'previewVideo-' + previewVideo.id" 
                    :poster="previewVideo.thumbnail || 'https://via.placeholder.com/800x450/000000/FFFFFF/?text=Video+Player'"
                    controls
                  >
                    <source :src="previewVideo.videoUrl" type="video/mp4">
                    Tu navegador no soporta video HTML5.
                  </video>
                  
                  <!-- Controles personalizados -->
                  <div class="controls">
                    <button @click="togglePlayPause(previewVideo.id)" class="control-btn" title="Reproducir/Pausar">
                      {{ isPlaying(previewVideo.id) ? '⏸️' : '▶️' }}
                    </button>
                    <button @click="stopVideo(previewVideo.id)" class="control-btn" title="Detener">⏹️</button>
                    
                    <div class="progress-container">
                      <input 
                        type="range" 
                        :id="'progressBar-' + previewVideo.id" 
                        class="progress-bar" 
                        min="0" 
                        max="100" 
                        step="0.1"
                        @input="seekVideo(previewVideo.id, $event)"
                      >
                      <div class="time-display">
                        <span :id="'currentTime-' + previewVideo.id">00:00</span> / 
                        <span :id="'duration-' + previewVideo.id">00:00</span>
                      </div>
                    </div>

                    <!-- Selector de pista de audio -->
                    <select @change="changeAudioTrack(previewVideo.id, $event)" class="audio-track-select">
                      <option value="0">Audio Español</option>
                      <option value="1">Audio Inglés</option>
                    </select>

                    <!-- Selector de subtítulos -->
                    <select @change="changeSubtitle(previewVideo.id, $event)" class="subtitle-select">
                      <option value="none">Sin subtítulos</option>
                      <option value="0">Subtítulos Español</option>
                      <option value="1">Subtítulos Inglés</option>
                    </select>

                    <button @click="toggleMute(previewVideo.id)" class="control-btn" title="Silenciar">
                      {{ isMuted(previewVideo.id) ? '🔇' : '🔊' }}
                    </button>
                    <input 
                      type="range" 
                      :id="'volBar-' + previewVideo.id" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value="1"
                      @input="changeVolume(previewVideo.id, $event)"
                      class="volume-bar"
                      title="Volumen"
                    >
                  </div>
                </div>
              </div>
              <div class="modal-actions">
                <button class="modal-btn secondary" @click="closePreviewModal">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de Configuración (existente) -->
      <div v-if="currentAdminSection === 'config'" class="config-layout">
        <!-- Sidebar izquierdo (Personalización) -->
        <div class="color-sidebar">
          <h4 class="sidebar-title">Personalizar Colores</h4>
          
          <div class="color-control">
            <div class="color-label">
              <span class="color-sample" :style="{backgroundColor: color1}"></span>
              Color 1
            </div>
            <input type="color" class="color-input" id="color1" v-model="color1">
            <div class="color-preview">
              <div class="color-preview-box" :style="{backgroundColor: color1}"></div>
              <div class="color-hex">{{ color1 }}</div>
            </div>
            <div class="color-description">Header, Footer, Títulos principales</div>
          </div>

          <div class="color-control">
            <div class="color-label">
              <span class="color-sample" :style="{backgroundColor: color2}"></span>
              Color 2
            </div>
            <input type="color" class="color-input" id="color2" v-model="color2">
            <div class="color-preview">
              <div class="color-preview-box" :style="{backgroundColor: color2}"></div>
              <div class="color-hex">{{ color2 }}</div>
            </div>
            <div class="color-description">Botones, Enlaces, Elementos destacados</div>
          </div>

          <div class="color-control">
            <div class="color-label">
              <span class="color-sample" :style="{backgroundColor: color3}"></span>
              Color 3
            </div>
            <input type="color" class="color-input" id="color3" v-model="color3">
            <div class="color-preview">
              <div class="color-preview-box" :style="{backgroundColor: color3}"></div>
              <div class="color-hex">{{ color3 }}</div>
            </div>
            <div class="color-description">Fondo principal de la página</div>
          </div>

          <div class="color-control">
            <div class="color-label">
              <span class="color-sample" :style="{backgroundColor: color4}"></span>
              Color 4
            </div>
            <input type="color" class="color-input" id="color4" v-model="color4">
            <div class="color-preview">
              <div class="color-preview-box" :style="{backgroundColor: color4}"></div>
              <div class="color-hex">{{ color4 }}</div>
            </div>
            <div class="color-description">Texto de párrafos, contenido y header</div>
          </div>

          <div class="color-control">
            <div class="color-label">
              <span class="color-sample" :style="{backgroundColor: color5}"></span>
              Color 5
            </div>
            <input type="color" class="color-input" id="color5" v-model="color5">
            <div class="color-preview">
              <div class="color-preview-box" :style="{backgroundColor: color5}"></div>
              <div class="color-hex">{{ color5 }}</div>
            </div>
            <div class="color-description">Fondos secundarios, Tarjetas, Estadísticas</div>
          </div>

          <h4 class="sidebar-title mt-4">Personalizar Texto</h4>
          <div class="additional-options">
            <div class="option-group">
              <label class="option-label">Tamaño de Texto (12-24px)</label>
              <input type="range" class="form-range" id="paragraphFontSizeRange" min="12" max="24" v-model="paragraphSize">
              <span id="paragraphFontSizeValue">{{ paragraphSize }}px</span>
            </div>
            
            <div class="option-group">
              <label class="option-label">Tamaño de Títulos (18-36px)</label>
              <input type="range" class="form-range" id="titleFontSizeRange" min="18" max="36" v-model="titleSize">
              <span id="titleFontSizeValue">{{ titleSize }}px</span>
            </div>
            
            <div class="option-group">
              <label class="option-label">Fuente Principal</label>
              <select class="option-select" id="primaryFontSelect" v-model="selectedFont">
                <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option v-for="f in customFonts" :key="'p-'+f.name" :value="`'${f.name}', sans-serif`">{{ f.name }}</option>
              </select>
            </div>

            <div class="option-group">
              <label class="option-label">Fuente Secundaria</label>
              <select class="option-select" id="secondaryFontSelect" v-model="selectedSecondaryFont">
                <option value="Arial, sans-serif">Arial</option>
                <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">Segoe UI</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Courier New', monospace">Courier New</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option v-for="f in customFonts" :key="'s-'+f.name" :value="`'${f.name}', sans-serif`">{{ f.name }}</option>
              </select>
            </div>
            <!-- Cargar fuentes personalizadas -->
            <div class="option-group">
              <label class="option-label">Cargar Fuente (woff/woff2/ttf/otf)</label>
              <label class="file-label">
                <span class="file-icon">📁</span>
                <span class="file-text">Seleccionar archivo de fuente</span>
                <input type="file" accept=".woff,.woff2,.ttf,.otf" @change="handleFontUpload($event, 'primary')" class="file-input">
              </label>
              <small>La fuente cargada quedará disponible en el listado para asignarla como principal o secundaria.</small>
            </div>

            <div class="option-group">
              <label class="option-label">Fuentes Cargadas</label>
              <ul class="custom-font-list">
                <li v-for="(f, idx) in customFonts" :key="f.name">
                  <span>{{ f.name }}</span>
                  <button class="remove-font-btn" @click="removeCustomFont(idx)">Eliminar</button>
                </li>
                <li v-if="customFonts.length === 0"><small>No hay fuentes cargadas</small></li>
              </ul>
            </div>
          </div>

          <h4 class="sidebar-title mt-4">Accesibilidad</h4>
          <div class="additional-options">
            <div class="option-group">
              <label class="option-label">Simular Daltonismo</label>
              <select class="option-select" id="colorBlindMode" v-model="colorBlindMode">
                <option value="none">Visión Normal</option>
                <option value="protanopia">Protanopia (Rojo)</option>
                <option value="deuteranopia">Deuteranopia (Verde)</option>
                <option value="tritanopia">Tritanopia (Azul)</option>
                <option value="achromatopsia">Achromatopsia (Monocromático)</option>
              </select>
              <div class="mode-description" v-if="colorBlindMode !== 'none'">
                <small>Vista simulada: {{ getColorBlindModeDescription() }}</small>
              </div>
            </div>
            
            <div class="option-group">
              <label class="option-label">Contraste Alto</label>
              <div class="toggle-switch">
                <input type="checkbox" id="highContrast" v-model="highContrast">
                <label for="highContrast" class="toggle-label">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="option-group">
              <label class="option-label">Tamaño de Texto Grande</label>
              <div class="toggle-switch">
                <input type="checkbox" id="largeText" v-model="largeText">
                <label for="largeText" class="toggle-label">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          <button class="reset-btn" id="resetAll" @click="resetAll">
            <i class="fas fa-undo"></i> Restablecer Todo
          </button>
        </div>

        <!-- Vista Previa Central -->
        <div class="preview-container">
          <div class="preview-site" :style="previewStyles">
            <!-- Filtros SVG para simular daltonismo -->
            <svg style="position: absolute; width: 0; height: 0;" aria-hidden="true">
              <defs>
                <filter id="protanopia">
                  <feColorMatrix type="matrix" values="0.567, 0.433, 0,     0, 0
                                                       0.558, 0.442, 0,     0, 0
                                                       0,     0.242, 0.758, 0, 0
                                                       0,     0,     0,     1, 0"/>
                </filter>
                
                <filter id="deuteranopia">
                  <feColorMatrix type="matrix" values="0.625, 0.375, 0,   0, 0
                                                       0.7,   0.3,   0,   0, 0
                                                       0,     0.3,   0.7, 0, 0
                                                       0,     0,     0,   1, 0"/>
                </filter>
                
                <filter id="tritanopia">
                  <feColorMatrix type="matrix" values="0.95, 0.05,  0,     0, 0
                                                       0,    0.433, 0.567, 0, 0
                                                       0,    0.475, 0.525, 0, 0
                                                       0,    0,     0,     1, 0"/>
                </filter>
              </defs>
            </svg>

            <!-- Header de ejemplo -->
            <header class="preview-header">
              <nav class="preview-nav">
                <a href="#" class="preview-logo">JDM TUNING</a>
                <div class="preview-nav-links">
                  <a href="#" class="preview-nav-link active">Inicio</a>
                  <a href="#" class="preview-nav-link">Acerca de</a>
                  <a href="#" class="preview-nav-link">Galería</a>
                  <a href="#" class="preview-nav-link">Contacto</a>
                </div>
              </nav>
            </header>

            <!-- Hero Section -->
            <section class="preview-hero">
              <div class="preview-hero-content">
                <h1 class="preview-hero-title">Cultura JDM Tuning</h1>
                <p class="preview-hero-subtitle">Explora el fascinante mundo del tuning japonés</p>
              </div>
            </section>

            <!-- Contenido Principal -->
            <main class="preview-main">
              <!-- Sección About -->
              <section class="preview-section">
                <div class="preview-container-section">
                  <h2 class="preview-section-title">Acerca del Tuning Japonés</h2>
                  <div class="preview-about-content">
                    <div class="preview-about-text">
                      <p class="preview-paragraph">El tuning japonés, conocido mundialmente como JDM, es mucho más que modificar coches. Es una cultura que combina la precisión de la ingeniería japonesa con la expresión personal.</p>
                      
                      <div class="preview-stats">
                        <div class="preview-stat-item">
                          <h4>40+</h4>
                          <p>Años de Historia</p>
                        </div>
                        <div class="preview-stat-item">
                          <h4>1000+</h4>
                          <p>Eventos Anuales</p>
                        </div>
                        <div class="preview-stat-item">
                          <h4>50K+</h4>
                          <p>Enthusiasts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Sección Features -->
              <section class="preview-section preview-features">
                <div class="preview-container-section">
                  <h2 class="preview-section-title">Estilos de Tuning</h2>
                  <div class="preview-features-grid">
                    <div class="preview-feature-card">
                      <div class="preview-feature-icon">⚡</div>
                      <h3>Bosozoku</h3>
                      <p>Estilo extremo con modificaciones exageradas</p>
                    </div>
                    <div class="preview-feature-card">
                      <div class="preview-feature-icon">🏁</div>
                      <h3>Kaido Racer</h3>
                      <p>Inspirado en corredores de montaña</p>
                    </div>
                    <div class="preview-feature-card">
                      <div class="preview-feature-icon">👑</div>
                      <h3>VIP Style</h3>
                      <p>Lujo y elegancia aplicados</p>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Sección Brands -->
              <section class="preview-section">
                <div class="preview-container-section">
                  <h2 class="preview-section-title">Marcas Legendarias</h2>
                  <div class="preview-brands-grid">
                    <button class="preview-brand-btn">
                      <span class="preview-brand-name">Nissan</span>
                    </button>
                    <button class="preview-brand-btn">
                      <span class="preview-brand-name">Toyota</span>
                    </button>
                    <button class="preview-brand-btn">
                      <span class="preview-brand-name">Honda</span>
                    </button>
                    <button class="preview-brand-btn">
                      <span class="preview-brand-name">Mazda</span>
                    </button>
                  </div>
                </div>
              </section>

              <!-- Botones de autenticación -->
              <section class="preview-section">
                <div class="preview-container-section">
                  <h3 class="preview-section-subtitle">Interacción de Usuario</h3>
                  <div class="preview-auth-buttons">
                    <button class="preview-login-btn">Iniciar Sesión</button>
                    <button class="preview-register-btn">Registrarse</button>
                  </div>
                </div>
              </section>
            </main>

            <!-- Footer -->
            <footer class="preview-footer">
              <div class="preview-footer-content">
                <p>&copy; 2023 JDM Tuning Culture. Todos los derechos reservados.</p>
                <div class="preview-social-links">
                  <a href="#">FB</a>
                  <a href="#">IG</a>
                  <a href="#">YT</a>
                </div>
              </div>
            </footer>
          </div>
        </div>

        <!-- Sidebar Derecho (Configuraciones Guardadas) -->
        <div class="config-sidebar">
          <h4 class="sidebar-title">Configuraciones Guardadas</h4>
          
          <div class="config-management">
            <div class="config-management-buttons">
              <button class="config-management-btn success" @click="openSaveModal">
                <i class="fas fa-save"></i> Guardar Como...
              </button>
            </div>
            
            <div class="configs-header">
              <h6 class="configs-title">Mis Configuraciones</h6>
              <span class="configs-count">{{ savedConfigs.length }} guardada{{ savedConfigs.length !== 1 ? 's' : '' }}</span>
            </div>
            
            <div class="search-box">
              <input type="text" class="search-input" v-model="searchTerm" placeholder="Buscar configuraciones...">
            </div>
            
            <div class="configs-list">
              <div v-if="filteredConfigs.length === 0" class="empty-configs">
                No hay configuraciones guardadas
              </div>
              <div v-else>
                 <div v-for="config in filteredConfigs" :key="config.id" 
                   class="config-item" @click="loadConfig(config.id)" @contextmenu.prevent="showConfigContextMenu(config, $event)">
                  <div class="config-item-info">
                    <div class="config-item-colors">
                      <div v-for="color in Object.values(config.colors).slice(0, 5)" :key="color" 
                           class="color-dot" :style="{backgroundColor: color}"></div>
                    </div>
                    <div class="config-item-content">
                      <div class="config-item-name">{{ config.name }}</div>
                      <div class="config-item-date">{{ formatDate(config.timestamp) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Menú contextual para editar/eliminar configuraciones -->
            <div v-if="configContextMenu.visible" class="context-menu" :style="{ left: configContextMenu.x + 'px', top: configContextMenu.y + 'px' }" @click.stop>
              <button class="context-menu-btn" @click="editConfig(configContextMenu.configId)">✏️ Editar</button>
              <button class="context-menu-btn" @click="deleteConfig(configContextMenu.configId)">🗑️ Eliminar</button>
            </div>
          </div>

          <div class="quick-actions">
            <h4 class="sidebar-title">Acciones Rápidas</h4>
            <div class="quick-buttons">
              <button class="quick-btn" @click="generateRandomTheme">
                <i class="fas fa-palette"></i> Tema Aleatorio
              </button>
              <button class="quick-btn" @click="applyAccessibilityPreset">
                <i class="fas fa-universal-access"></i> Accesibilidad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de guardar -->
    <div class="modal-overlay" v-if="showSaveModal" @click="closeSaveModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">{{ editMode ? 'Editar Configuración' : 'Guardar Configuración' }}</h3>
        <input type="text" class="modal-input" v-model="configName" placeholder="Nombre de la configuración" maxlength="30" @keypress.enter="saveCurrentConfig">
        <div class="modal-actions">
          <button class="modal-btn secondary" @click="closeSaveModal">Cancelar</button>
          <button class="modal-btn primary" @click="saveCurrentConfig">{{ editMode ? 'Guardar cambios' : 'Guardar' }}</button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación para acciones -->
    <div class="modal-overlay" v-if="showActionModal" @click="closeActionModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">{{ actionModalTitle }}</h3>
        <p class="modal-message">{{ actionModalMessage }}</p>
        <div class="modal-actions">
          <button class="modal-btn secondary" @click="closeActionModal">Cancelar</button>
          <button class="modal-btn danger" @click="confirmAction">Confirmar</button>
        </div>
      </div>
    </div>

    <div id="notification" class="notification" :class="notificationClass" v-if="notificationVisible">
      {{ notificationMessage }}
    </div>
  </section>
</template>

<script>
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt';
import CarouselManager from '../CarouselManager.vue';
import * as VideoStore from '../../videoIndexedDB';

export default {
  name: 'ConfigAdmin',
  components: {
    CarouselManager
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // Nueva sección de gestión de usuarios
      currentAdminSection: 'users',
      usersDataTable: null,
      tablePageSize: '10',
      showActionModal: false,
      actionModalTitle: '',
      actionModalMessage: '',
      pendingAction: null,
      selectedUser: null,
      
      // Colores configurables
      color1: '#D50000',
      color2: '#FFD600',
      color3: '#1C1C1C',
      color4: '#FFFFFF',
      color5: '#2B2B2B',
      
      // Configuración de texto
      paragraphSize: 16,
      titleSize: 24,
      selectedFont: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      selectedSecondaryFont: "Arial, sans-serif",
      // Fuentes personalizadas cargadas por el admin
      customFonts: [],
      
      // Accesibilidad
      colorBlindMode: 'none',
      highContrast: false,
      largeText: false,
      
      // Efectos y bordes
      borderRadius: 8,
      shadowIntensity: 5,
      
      // Gestión de configuraciones
      savedConfigs: [],
      searchTerm: '',
      showSaveModal: false,
      configName: '',
      
      // Notificaciones
      notificationVisible: false,
      notificationMessage: '',
      notificationClass: 'success',
      // Context menu for configs
      configContextMenu: {
        visible: false,
        x: 0,
        y: 0,
        configId: null
      },
      // Edit mode for saving configs
      editMode: false,
      editTargetId: null,

      // Sección de videos
      newVideo: {
        title: '',
        description: '',
        category: 'tutorial',
        addToCarousel: false,
        videoFile: null,
        audioTracks: [null, null], // 2 pistas requeridas
        subtitles: [null, null]    // 2 subtítulos requeridos
      },
      isUploading: false,
      showPreviewModal: false,
      previewVideo: null,
      activeVideos: {}, // Para rastrear estado de reproducción
      storedVideos: []  // Videos almacenados en localStorage
      ,

      // Estado de edición de videos
      editingVideoId: null,
      isEditingVideo: false,

      // Carrusel de videos (Galería)
      carouselVideoIds: []
    }
  },
  computed: {
    // Estilos para la vista previa
    previewStyles() {
      return {
        '--preview-primary': this.color1,
        '--preview-secondary': this.color2,
        '--preview-background': this.color3,
        '--preview-text': this.color4,
        '--preview-accent': this.color5,
        '--preview-paragraph-size': this.paragraphSize + 'px',
        '--preview-text-font-size': this.paragraphSize + 'px',
        '--preview-title-size': this.titleSize + 'px',
        '--preview-font-family': this.selectedFont,
        '--preview-secondary-font': this.selectedSecondaryFont,
        '--preview-border-radius': this.borderRadius + 'px',
        '--preview-shadow': `0 ${this.shadowIntensity}px ${this.shadowIntensity * 2}px rgba(0,0,0,0.1)`,
        '--preview-high-contrast': this.highContrast ? '1' : '0',
        '--preview-large-text': this.largeText ? '1.2' : '1',
        '--preview-color-blind-filter': this.getColorBlindFilter()
      }
    },
    
    // Filtro de configuraciones
    filteredConfigs() {
      if (!this.searchTerm) return this.savedConfigs;
      return this.savedConfigs.filter(config =>
        config.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },

    // Gestión de usuarios
    allUsers() {
      const users = localStorage.getItem('jdmUsers');
      return users ? JSON.parse(users) : [];
    },

    totalUsers() {
      return this.allUsers.length;
    },

    adminUsers() {
      return this.allUsers.filter(user => user.isAdmin).length;
    },

    usersWithCVs() {
      const cvs = this.getStoredCVs();
      const userIdsWithCVs = [...new Set(cvs.map(cv => cv.userId))];
      return userIdsWithCVs.length;
    },

    currentUser() {
      return this.user;
    },
    
    totalVideos() {
      return this.storedVideos.length;
    },
    
    videosWithAllTracks() {
      return this.storedVideos.filter(video => 
        video.audioTracks.every(track => track) && 
        video.subtitles.every(sub => sub)
      ).length;
    },
    
    totalStorage() {
      const totalBytes = this.storedVideos.reduce((sum, video) => sum + video.size, 0);
      return this.formatFileSize(totalBytes);
    },

    carouselVideoItems() {
      const byId = new Map((this.storedVideos || []).map(v => [v.id, v]));
      return (this.carouselVideoIds || [])
        .map(id => byId.get(id))
        .filter(Boolean);
    },
    
    isUploadValid() {
      // Solo obligamos título y archivo de video en nuevas subidas.
      // En modo edición permitimos guardar sin volver a subir el archivo.
      const hasTitle = this.newVideo.title.trim() !== '';
      const hasVideoFile = !!this.newVideo.videoFile;
      const isEditing = !!this.editingVideoId;
      return hasTitle && (hasVideoFile || isEditing);
    }
  },
  mounted() {
    this.loadConfigsFromStorage();
    this.loadGlobalStyles();
    this.applyStylesToGlobal();
    this.loadVideosFromStorage();
    this.loadVideoCarouselFromStorage();
    this.$nextTick(() => {
      this.initializeDataTable();
    });
  },
  watch: {
    // Observar cambios en todas las propiedades de configuración
    color1: 'applyStylesToGlobal',
    color2: 'applyStylesToGlobal',
    color3: 'applyStylesToGlobal',
    color4: 'applyStylesToGlobal',
    color5: 'applyStylesToGlobal',
    paragraphSize: 'applyStylesToGlobal',
    titleSize: 'applyStylesToGlobal',
    selectedFont: 'applyStylesToGlobal',
    selectedSecondaryFont: 'applyStylesToGlobal',
    colorBlindMode: 'applyStylesToGlobal',
    highContrast: 'applyStylesToGlobal',
    largeText: 'applyStylesToGlobal',
    borderRadius: 'applyStylesToGlobal',
    shadowIntensity: 'applyStylesToGlobal'
  },
  methods: {
    // ===== MÉTODOS DE DATATABLE =====
    initializeDataTable() {
      const self = this;
      
      // Destruir DataTable existente si hay uno
      if ($.fn.DataTable.isDataTable('#usersDatatable')) {
        this.usersDataTable.destroy();
        $('#usersDatatable').empty();
      }

      this.usersDataTable = $('#usersDatatable').DataTable({
        data: this.formatUsersForDataTable(),
        columns: [
          { 
            data: 'id',
            className: 'dt-body-center',
            width: '80px'
          },
          { 
            data: 'email',
            className: 'dt-body-left'
          },
          { 
            data: 'type',
            className: 'dt-body-center',
            render: function(data, type, row) {
              const badgeClass = row.isAdmin ? 'admin' : 'user';
              const badgeText = row.isAdmin ? 'Administrador' : 'Usuario';
              return `<span class="user-type-badge ${badgeClass}">${badgeText}</span>`;
            }
          },
          { 
            data: 'hasCV',
            className: 'dt-body-center',
            render: function(data, type, row) {
              if (data) {
                return '<span class="cv-status has-cv">✅ Disponible</span>';
              } else {
                return '<span class="cv-status no-cv">❌ Sin CV</span>';
              }
            }
          },
          { 
            data: 'createdAt',
            className: 'dt-body-center',
            render: function(data) {
              return self.formatDate(data);
            }
          },
          { 
            data: 'lastActivity',
            className: 'dt-body-center',
            render: function(data) {
              return data ? self.formatDate(data) : 'Nunca';
            }
          },
          { 
            data: 'actions',
            className: 'dt-body-center',
            orderable: false,
            render: function(data, type, row) {
              return `
                <div class="datatable-actions">
                  ${row.hasCV ? `
                    <button class="dt-action-btn download-btn" title="Descargar CV" data-user-id="${row.id}">
                      📄
                    </button>
                  ` : `
                    <button class="dt-action-btn disabled-btn" title="Sin CV" disabled>
                      📄
                    </button>
                  `}
                  
                  ${!row.isAdmin ? `
                    <button class="dt-action-btn promote-btn" title="Hacer Administrador" data-user-id="${row.id}">
                      ⬆️
                    </button>
                  ` : ''}
                  
                  ${row.id !== self.currentUser.id ? `
                    <button class="dt-action-btn delete-btn" title="Eliminar Usuario" data-user-id="${row.id}">
                      🗑️
                    </button>
                  ` : ''}
                </div>
              `;
            }
          }
        ],
        language: {
          decimal: ',',
          thousands: '.',
          processing: 'Procesando...',
          search: 'Buscar:',
          lengthMenu: 'Mostrar _MENU_ registros',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ usuarios',
          infoEmpty: 'Mostrando 0 a 0 de 0 usuarios',
          infoFiltered: '(filtrado de _MAX_ usuarios totales)',
          loadingRecords: 'Cargando...',
          zeroRecords: 'No se encontraron usuarios',
          emptyTable: 'No hay usuarios registrados',
          paginate: {
            first: 'Primero',
            previous: 'Anterior',
            next: 'Siguiente',
            last: 'Último'
          }
        },
        pageLength: parseInt(this.tablePageSize),
        responsive: true,
        order: [[4, 'desc']], // Ordenar por fecha de registro descendente
        dom: '<"datatable-header"fl>rt<"datatable-footer"ip>',
        initComplete: function() {
          // Agregar eventos a los botones después de inicializar
          self.attachTableEvents();
        }
      });
    },

    formatUsersForDataTable() {
      const cvs = this.getStoredCVs();
      const userIdsWithCVs = new Set(cvs.map(cv => cv.userId));
      
      return this.allUsers.map(user => ({
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        type: user.isAdmin ? 'admin' : 'user',
        hasCV: userIdsWithCVs.has(user.id),
        createdAt: user.createdAt,
        lastActivity: user.lastActivity || null,
        actions: user.id
      }));
    },

    attachTableEvents() {
      const self = this;
      
      // Delegación de eventos para los botones de acción
      $('#usersDatatable').on('click', '.download-btn', function() {
        const userId = $(this).data('user-id');
        const user = self.allUsers.find(u => u.id === userId);
        if (user) self.downloadUserCV(user);
      });

      $('#usersDatatable').on('click', '.promote-btn', function() {
        const userId = $(this).data('user-id');
        const user = self.allUsers.find(u => u.id === userId);
        if (user) self.promoteToAdmin(user);
      });

      $('#usersDatatable').on('click', '.delete-btn', function() {
        const userId = $(this).data('user-id');
        const user = self.allUsers.find(u => u.id === userId);
        if (user) self.showDeleteConfirmation(user);
      });
    },

    // Context menu handlers for configs
    showConfigContextMenu(config, event) {
      // posicionar el menú y mostrar
      this.configContextMenu.visible = true;
      // ajustar para viewport
      const padding = 8;
      const x = event.clientX + window.scrollX;
      const y = event.clientY + window.scrollY;
      const maxX = window.innerWidth - 160; // menu width estimate
      const maxY = window.innerHeight - 80;
      this.configContextMenu.x = Math.min(x, maxX) + padding;
      this.configContextMenu.y = Math.min(y, maxY) + padding;
      this.configContextMenu.configId = config.id;

      // cerrar al hacer clic fuera
      const onDocClick = (e) => {
        this.configContextMenu.visible = false;
        document.removeEventListener('click', onDocClick);
      };
      document.addEventListener('click', onDocClick);
    },

    editConfig(configId) {
      // Abrir modal de edición para permitir cambiar el nombre antes de sobrescribir
      const cfg = this.savedConfigs.find(c => c.id === configId);
      if (!cfg) return;
      this.editMode = true;
      this.editTargetId = configId;
      this.configName = cfg.name || '';
      this.showSaveModal = true;
      this.configContextMenu.visible = false;
    },

    refreshUsersTable() {
      if (this.usersDataTable) {
        this.usersDataTable.clear();
        this.usersDataTable.rows.add(this.formatUsersForDataTable());
        this.usersDataTable.draw();
        this.showNotification('Tabla de usuarios actualizada', 'success');
      }
    },

    updatePageSize() {
      if (this.usersDataTable) {
        this.usersDataTable.page.len(parseInt(this.tablePageSize)).draw();
      }
    },

    exportToCSV() {
      const users = this.formatUsersForDataTable();
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Encabezados
      csvContent += "ID,Email,Tipo,CV,Fecha Registro,Última Actividad\n";
      
      // Datos
      users.forEach(user => {
        const row = [
          user.id,
          `"${user.email}"`,
          user.isAdmin ? 'Administrador' : 'Usuario',
          user.hasCV ? 'Sí' : 'No',
          this.formatDate(user.createdAt),
          user.lastActivity ? this.formatDate(user.lastActivity) : 'Nunca'
        ].join(',');
        csvContent += row + "\n";
      });
      
      // Descargar
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `usuarios_jdm_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.showNotification('Datos exportados a CSV', 'success');
    },

    // ===== MÉTODOS DE ACCIÓN MODAL =====
    showDeleteConfirmation(user) {
      this.selectedUser = user;
      this.actionModalTitle = 'Confirmar Eliminación';
      this.actionModalMessage = `¿Estás seguro de que quieres eliminar al usuario "${user.email}"? Esta acción no se puede deshacer.`;
      this.pendingAction = 'delete';
      this.showActionModal = true;
    },

    closeActionModal() {
      this.showActionModal = false;
      this.selectedUser = null;
      this.pendingAction = null;
      this.actionModalTitle = '';
      this.actionModalMessage = '';
    },

    confirmAction() {
      if (this.pendingAction === 'delete' && this.selectedUser) {
        this.deleteUser(this.selectedUser);
      }
      this.closeActionModal();
    },

    // ===== MÉTODOS DE GESTIÓN DE USUARIOS =====
    hasCV(userId) {
      const cvs = this.getStoredCVs();
      return cvs.some(cv => cv.userId === userId);
    },

    getStoredCVs() {
      const cvs = localStorage.getItem('jdmUserCVs');
      return cvs ? JSON.parse(cvs) : [];
    },

    async downloadUserCV(user) {
      const cvs = this.getStoredCVs();
      const userCV = cvs.find(cv => cv.userId === user.id);
      
      if (!userCV) {
        this.showNotification('El usuario no tiene un CV guardado', 'error');
        return;
      }

      try {
        // Crear elemento temporal para generar el PDF
        const tempElement = document.createElement('div');
        tempElement.innerHTML = this.generateCVHTML(userCV);
        
        const opt = {
          margin: 10,
          filename: `CV_${user.email.replace(/[@.]/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Usar html2pdf para generar el PDF
        const html2pdf = (await import('html2pdf.js')).default;
        await html2pdf().set(opt).from(tempElement).save();
        
        this.showNotification(`CV de ${user.email} descargado correctamente`, 'success');
      } catch (error) {
        console.error('Error al descargar CV:', error);
        this.showNotification('Error al descargar el CV', 'error');
      }
    },

    generateCVHTML(cvData) {
      return `
        <div class="cv-template-dark" style="font-family: 'Segoe UI', sans-serif; color: #232323; padding: 2rem; background: #fff;">
          <div class="cv-header-dark" style="background: #2c3e50; color: white; padding: 2rem; margin-bottom: 2rem; border-radius: 8px;">
            <div class="header-main" style="text-align: center; margin-bottom: 1.5rem;">
              <h1 style="margin: 0; font-size: 2.5rem; font-weight: 800;">${cvData.personalInfo.fullName || 'Nombre no especificado'}</h1>
              <p class="cv-title-dark" style="margin: 0.5rem 0 0 0; font-size: 1.3rem; color: #e74c3c; font-weight: 600;">${cvData.personalInfo.title || 'Profesión no especificada'}</p>
            </div>
            <div class="header-grid" style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
              <div class="header-left">
                ${cvData.profile ? `
                  <div class="profile-section">
                    <h2 class="section-title-dark" style="color: white; border-bottom: 2px solid #e74c3c; padding-bottom: 0.5rem; margin-bottom: 1rem;">Mi Perfil</h2>
                    <p class="profile-text" style="color: white; line-height: 1.6;">${cvData.profile}</p>
                  </div>
                ` : ''}
              </div>
              <div class="header-right" style="display: flex; flex-direction: column; gap: 0.7rem;">
                ${cvData.personalInfo.phone ? `<span>📞 ${cvData.personalInfo.phone}</span>` : ''}
                ${cvData.personalInfo.email ? `<span>✉️ ${cvData.personalInfo.email}</span>` : ''}
                ${cvData.personalInfo.website ? `<span>🌐 ${cvData.personalInfo.website}</span>` : ''}
                ${cvData.personalInfo.location ? `<span>📍 ${cvData.personalInfo.location}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="cv-content-dark" style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
            <!-- Columna Izquierda -->
            <div class="cv-left-column">
              ${cvData.experience && cvData.experience.some(exp => exp.company) ? `
                <div class="cv-section-dark" style="margin-bottom: 2rem;">
                  <h2 class="section-title-dark" style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 0.5rem; margin-bottom: 1rem;">Experiencia Laboral</h2>
                  <div class="experience-list-dark">
                    ${cvData.experience.filter(exp => exp.company).map(exp => `
                      <div class="experience-item-dark" style="background: #f8f9fa; padding: 1.2rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #e74c3c;">
                        <div class="exp-header-dark" style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 0.5rem;">
                          <span style="color: #e74c3c; font-size: 1.2rem;">✅</span>
                          <div class="exp-info" style="flex: 1;">
                            <h3 class="company-name" style="margin: 0; color: #2c3e50; font-size: 1.2rem;">${exp.company}</h3>
                            <p class="exp-period" style="margin: 0.25rem 0 0 0; color: #666; font-size: 0.9rem;">${exp.period || ''}</p>
                          </div>
                        </div>
                        ${exp.description ? `<p class="exp-description" style="margin: 0.5rem 0 0 0; color: #555; line-height: 1.5;">${exp.description}</p>` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              ${cvData.education && cvData.education.some(edu => edu.degree) ? `
                <div class="cv-section-dark" style="margin-bottom: 2rem;">
                  <h2 class="section-title-dark" style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 0.5rem; margin-bottom: 1rem;">Formación Académica</h2>
                  <div class="education-list-dark">
                    ${cvData.education.filter(edu => edu.degree).map(edu => `
                      <div class="education-item-dark" style="background: #f8f9fa; padding: 1.2rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid #3498db;">
                        <div class="edu-header-dark" style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 0.5rem;">
                          <span style="color: #3498db; font-size: 1.2rem;">✅</span>
                          <div class="edu-info" style="flex: 1;">
                            <h3 class="edu-degree" style="margin: 0; color: #2c3e50; font-size: 1.2rem;">${edu.degree}</h3>
                            ${edu.period ? `<p class="edu-period" style="margin: 0.25rem 0 0 0; color: #666; font-size: 0.9rem;">${edu.period}</p>` : ''}
                          </div>
                        </div>
                        ${edu.institution ? `<p class="edu-institution" style="margin: 0.5rem 0 0 0; color: #555; font-weight: 600;">${edu.institution}</p>` : ''}
                        ${edu.specialization ? `<p class="edu-specialization" style="margin: 0.25rem 0 0 0; color: #666; font-style: italic;">${edu.specialization}</p>` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>

            <!-- Columna Derecha -->
            <div class="cv-right-column">
              ${cvData.languages && cvData.languages.some(lang => lang.name) ? `
                <div class="cv-section-dark" style="margin-bottom: 2rem;">
                  <h2 class="section-title-dark" style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 0.5rem; margin-bottom: 1rem;">Idiomas</h2>
                  <div class="languages-list-dark" style="display: flex; flex-direction: column; gap: 0.8rem;">
                    ${cvData.languages.filter(lang => lang.name).map(lang => `
                      <div class="language-item-dark" style="display: flex; align-items: center; gap: 0.8rem; padding: 0.8rem; background: #f8f9fa; border-radius: 6px;">
                        <span style="color: #27ae60;">✅</span>
                        <span class="language-name-dark" style="color: #2c3e50; font-weight: 600;">${lang.name}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              ${cvData.competences && cvData.competences.some(comp => comp.name) ? `
                <div class="cv-section-dark" style="margin-bottom: 2rem;">
                  <h2 class="section-title-dark" style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 0.5rem; margin-bottom: 1rem;">Competencias</h2>
                  <div class="competences-list-dark" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${cvData.competences.filter(comp => comp.name).map(comp => `
                      <div class="competence-item-dark" style="background: #e74c3c; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
                        ${comp.name}
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              ${cvData.skills && cvData.skills.some(skill => skill.name) ? `
                <div class="cv-section-dark" style="margin-bottom: 2rem;">
                  <h2 class="section-title-dark" style="color: #2c3e50; border-bottom: 2px solid #e74c3c; padding-bottom: 0.5rem; margin-bottom: 1rem;">Habilidades</h2>
                  <div class="skills-list-dark" style="display: flex; flex-direction: column; gap: 1rem;">
                    ${cvData.skills.filter(skill => skill.name).map(skill => `
                      <div class="skill-item-dark" style="display: flex; justify-content: space-between; align-items: center; padding: 0.8rem; background: #f8f9fa; border-radius: 6px;">
                        <span class="skill-name" style="color: #2c3e50; font-weight: 600;">${skill.name}</span>
                        <div class="star-rating">
                          ${'★'.repeat(skill.rating || 3)}${'☆'.repeat(5 - (skill.rating || 3))}
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    },

    promoteToAdmin(user) {
      if (confirm(`¿Estás seguro de que quieres hacer administrador a ${user.email}?`)) {
        const users = this.allUsers;
        const userIndex = users.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
          users[userIndex].isAdmin = true;
          users[userIndex].lastActivity = new Date().toISOString();
          localStorage.setItem('jdmUsers', JSON.stringify(users));
          this.refreshUsersTable();
          this.showNotification(`${user.email} ahora es administrador`, 'success');
        }
      }
    },

    deleteUser(user) {
      const users = this.allUsers;
      const updatedUsers = users.filter(u => u.id !== user.id);
      localStorage.setItem('jdmUsers', JSON.stringify(updatedUsers));
      
      // Eliminar también el CV si existe
      const cvs = this.getStoredCVs();
      const updatedCVs = cvs.filter(cv => cv.userId !== user.id);
      localStorage.setItem('jdmUserCVs', JSON.stringify(updatedCVs));
      
      this.refreshUsersTable();
      this.showNotification(`Usuario ${user.email} eliminado correctamente`, 'success');
    },

    // ===== MÉTODOS DE CONFIGURACIÓN DE COLORES Y TIPOGRAFÍA =====
    applyStylesToGlobal() {
      const styles = this.getGlobalStyles();
      this.updateGlobalCSS(styles);
      this.saveGlobalStyles(styles);
    },
    
    getGlobalStyles() {
      return {
        '--primary': this.color1,
        '--secondary': this.color2,
        '--background': this.color3,
        '--text': this.color4,
        '--accent': this.color5,
        '--paragraph-size': this.paragraphSize + 'px',
        '--text-font-size': this.paragraphSize + 'px',
        '--title-size': this.titleSize + 'px',
        '--font-family': this.selectedFont,
        '--secondary-font': this.selectedSecondaryFont,
        '--border-radius': this.borderRadius + 'px',
        '--shadow': `0 ${this.shadowIntensity}px ${this.shadowIntensity * 2}px rgba(0,0,0,0.1)`,
        '--high-contrast': this.highContrast ? '1' : '0',
        '--large-text': this.largeText ? '1.2' : '1',
        '--color-blind-filter': this.getColorBlindFilter()
      };
    },
    
    updateGlobalCSS(styles) {
      let styleElement = document.getElementById('jdm-global-styles');
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'jdm-global-styles';
        document.head.appendChild(styleElement);
      }
      
      // Incluir @font-face para fuentes personalizadas cargadas
      let fontCss = '';
      if (this.customFonts && this.customFonts.length) {
        this.customFonts.forEach(f => {
          // f: { name, dataUrl, format }
          fontCss += `@font-face { font-family: '${f.name}'; src: url(${f.dataUrl}) format('${f.format}'); font-weight: normal; font-style: normal; }\n`;
        });
      }

      let css = fontCss + ':root {\n';
      Object.entries(styles).forEach(([key, value]) => {
        css += `  ${key}: ${value};\n`;
      });
      css += '}\n\n';
      
      if (this.colorBlindMode !== 'none') {
        css += `body { filter: ${this.getColorBlindFilter()}; }\n`;
      } else {
        css += `body { filter: none; }\n`;
      }
      
      if (this.highContrast) {
        css += `
          * {
            contrast: calc(1 + var(--high-contrast) * 10);
          }
        `;
      }
      
      styleElement.textContent = css;
    },
    
    saveGlobalStyles(styles) {
      localStorage.setItem('jdmGlobalStyles', JSON.stringify({
        styles,
        customFonts: this.customFonts || [],
        timestamp: new Date().toISOString()
      }));
    },
    
    loadGlobalStyles() {
      const saved = localStorage.getItem('jdmGlobalStyles');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const styles = parsed.styles || {};
          const fonts = parsed.customFonts || [];

          this.customFonts = Array.isArray(fonts) ? fonts : [];

          this.color1 = styles['--primary'] || this.color1;
          this.color2 = styles['--secondary'] || this.color2;
          this.color3 = styles['--background'] || this.color3;
          this.color4 = styles['--text'] || this.color4;
          this.color5 = styles['--accent'] || this.color5;
          this.paragraphSize = parseInt(styles['--paragraph-size']) || this.paragraphSize;
          this.titleSize = parseInt(styles['--title-size']) || this.titleSize;
          this.selectedFont = styles['--font-family'] || this.selectedFont;
          this.selectedSecondaryFont = styles['--secondary-font'] || this.selectedSecondaryFont;
          this.borderRadius = parseInt(styles['--border-radius']) || this.borderRadius;
          this.highContrast = styles['--high-contrast'] === '1';
          this.largeText = styles['--large-text'] === '1.2';

          this.applyStylesToGlobal();

        } catch (e) {
          console.error('Error al cargar estilos globales:', e);
        }
      }
    },

    // Manejo de fuentes personalizadas
    handleFontUpload(event, target) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const ext = (file.name.match(/\.([^.]+)$/) || [])[1] || '';
      let format = 'truetype';
      const t = file.type || ext.toLowerCase();
      if (t.includes('woff2') || ext === 'woff2') format = 'woff2';
      else if (t.includes('woff') || ext === 'woff') format = 'woff';
      else if (t.includes('ttf') || ext === 'ttf') format = 'truetype';
      else if (t.includes('otf') || ext === 'otf') format = 'opentype';

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9\-]/g, '_');
        const fontObj = { name: baseName, dataUrl, format };
        this.customFonts = this.customFonts || [];
        // evitar duplicados por nombre
        const exists = this.customFonts.find(f => f.name === baseName);
        if (!exists) this.customFonts.push(fontObj);

        // asignar automáticamente según target
        if (target === 'primary') {
          this.selectedFont = `'${baseName}', sans-serif`;
        } else if (target === 'secondary') {
          this.selectedSecondaryFont = `'${baseName}', sans-serif`;
        }

        this.applyStylesToGlobal();
      };
      reader.readAsDataURL(file);
      // limpiar input
      event.target.value = '';
    },

    removeCustomFont(idx) {
      if (!confirm('Eliminar esta fuente personalizada?')) return;
      this.customFonts.splice(idx, 1);
      this.applyStylesToGlobal();
    },
    
    getCurrentConfig() {
      return {
        id: Date.now().toString(),
        name: this.configName || `Configuración ${new Date().toLocaleDateString()}`,
        colors: {
          color1: this.color1,
          color2: this.color2,
          color3: this.color3,
          color4: this.color4,
          color5: this.color5
        },
        text: {
          paragraphFontSize: this.paragraphSize,
          titleFontSize: this.titleSize,
          primaryFontFamily: this.selectedFont,
          secondaryFontFamily: this.selectedSecondaryFont
        },
        accessibility: {
          colorBlindMode: this.colorBlindMode,
          highContrast: this.highContrast,
          largeText: this.largeText
        },
        effects: {
          borderRadius: this.borderRadius,
          shadowIntensity: this.shadowIntensity
        },
        timestamp: new Date().toISOString()
      };
    },
    
    saveCurrentConfig() {
      if (!this.configName.trim()) {
        this.showNotification('Por favor, ingresa un nombre para la configuración', 'error');
        return;
      }
      
      const config = this.getCurrentConfig();
      if (this.editMode && this.editTargetId) {
        // sobrescribir la configuración existente
        const idx = this.savedConfigs.findIndex(c => c.id === this.editTargetId);
        if (idx !== -1) {
          config.id = this.editTargetId;
          config.timestamp = new Date().toISOString();
          this.savedConfigs.splice(idx, 1, config);
          this.saveConfigsToStorage();
          this.showNotification('Configuración actualizada correctamente', 'success');
        } else {
          // fallback: agregar nueva
          this.savedConfigs.unshift(config);
          this.saveConfigsToStorage();
          this.showNotification('Configuración guardada correctamente', 'success');
        }
        this.editMode = false;
        this.editTargetId = null;
      } else {
        this.savedConfigs.unshift(config);
        this.saveConfigsToStorage();
        this.showNotification('Configuración guardada correctamente', 'success');
      }

      this.closeSaveModal();
    },
    
    loadConfig(configId) {
      const config = this.savedConfigs.find(c => c.id === configId);
      if (config) {
        this.color1 = config.colors.color1;
        this.color2 = config.colors.color2;
        this.color3 = config.colors.color3;
        this.color4 = config.colors.color4;
        this.color5 = config.colors.color5;
        this.paragraphSize = config.text.paragraphFontSize;
        this.titleSize = config.text.titleFontSize;
        this.selectedFont = config.text.primaryFontFamily;
        this.selectedSecondaryFont = config.text.secondaryFontFamily || "Arial, sans-serif";
        this.colorBlindMode = config.accessibility?.colorBlindMode || 'none';
        this.highContrast = config.accessibility?.highContrast || false;
        this.largeText = config.accessibility?.largeText || false;
        this.borderRadius = config.effects?.borderRadius || 8;
        this.shadowIntensity = config.effects?.shadowIntensity || 5;
        
        this.applyStylesToGlobal();
        this.showNotification(`Configuración "${config.name}" cargada`, 'success');
      }
    },
    
    deleteConfig(configId) {
      if (confirm('¿Estás seguro de que quieres eliminar esta configuración?')) {
        this.savedConfigs = this.savedConfigs.filter(c => c.id !== configId);
        this.saveConfigsToStorage();
        this.showNotification('Configuración eliminada', 'info');
      }
    },
    
    openSaveModal() {
      this.showSaveModal = true;
      this.configName = '';
      this.editMode = false;
      this.editTargetId = null;
    },
    
    closeSaveModal() {
      this.showSaveModal = false;
      this.configName = '';
    },
    
    resetAll() {
      if (confirm('¿Restablecer todos los valores a los predeterminados?')) {
        this.color1 = '#D50000';
        this.color2 = '#FFD600';
        this.color3 = '#1C1C1C';
        this.color4 = '#FFFFFF';
        this.color5 = '#2B2B2B';
        this.paragraphSize = 16;
        this.titleSize = 24;
        this.selectedFont = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        this.selectedSecondaryFont = "Arial, sans-serif";
        this.colorBlindMode = 'none';
        this.highContrast = false;
        this.largeText = false;
        this.borderRadius = 8;
        this.shadowIntensity = 5;
        
        this.applyStylesToGlobal();
        this.showNotification('Configuración restablecida', 'info');
      }
    },

    // Métodos de accesibilidad
    getColorBlindFilter() {
      switch (this.colorBlindMode) {
        case 'protanopia': return 'url(#protanopia)';
        case 'deuteranopia': return 'url(#deuteranopia)';
        case 'tritanopia': return 'url(#tritanopia)';
        case 'achromatopsia': return 'grayscale(100%)';
        default: return 'none';
      }
    },

    getColorBlindModeDescription() {
      const descriptions = {
        'protanopia': 'Protanopia (dificultad para distinguir rojos)',
        'deuteranopia': 'Deuteranopia (dificultad para distinguir verdes)',
        'tritanopia': 'Tritanopia (dificultad para distinguir azules)',
        'achromatopsia': 'Achromatopsia (visión monocromática)'
      };
      return descriptions[this.colorBlindMode] || 'Visión Normal';
    },

    applyAccessibilityPreset() {
      this.highContrast = true;
      this.largeText = true;
      this.showNotification('Configuración de accesibilidad aplicada', 'success');
    },

    generateRandomTheme() {
      const colors = [
        '#2c3e50', '#34495e', '#16a085', '#27ae60', '#2980b9',
        '#8e44ad', '#2c3e50', '#f39c12', '#d35400', '#c0392b',
        '#7f8c8d', '#1abc9c', '#3498db', '#9b59b6', '#e74c3c'
      ];
      
      this.color1 = colors[Math.floor(Math.random() * colors.length)];
      this.color2 = colors[Math.floor(Math.random() * colors.length)];
      this.color3 = colors[Math.floor(Math.random() * colors.length)];
      this.color4 = colors[Math.floor(Math.random() * colors.length)];
      this.color5 = colors[Math.floor(Math.random() * colors.length)];
      
      this.showNotification('Tema aleatorio generado', 'success');
    },
    
    showNotification(message, type = 'success') {
      this.notificationMessage = message;
      this.notificationClass = type;
      this.notificationVisible = true;
      
      setTimeout(() => {
        this.notificationVisible = false;
      }, 3000);
    },
    
    saveConfigsToStorage() {
      localStorage.setItem('jdmTuningConfigs', JSON.stringify(this.savedConfigs));
    },
    
    loadConfigsFromStorage() {
      const saved = localStorage.getItem('jdmTuningConfigs');
      if (saved) {
        try {
          this.savedConfigs = JSON.parse(saved);
        } catch (e) {
          console.error('Error al cargar configuraciones:', e);
          this.savedConfigs = [];
        }
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    // Métodos para subida de archivos
    handleVideoUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('video/')) {
        this.newVideo.videoFile = file;
      } else {
        this.showNotification('Por favor, selecciona un archivo de video válido (MP4)', 'error');
      }
    },
    
    handleAudioUpload(event, index) {
      const file = event.target.files[0];
      if (file && file.type.startsWith('audio/')) {
        this.newVideo.audioTracks[index] = file;
      } else {
        this.showNotification('Por favor, selecciona un archivo de audio válido', 'error');
      }
    },
    
    handleSubtitleUpload(event, index) {
      const file = event.target.files[0];
      const validExtensions = ['.dtt', '.srt', '.vtt'];
      const fileName = file.name.toLowerCase();
      
      if (file && validExtensions.some(ext => fileName.endsWith(ext))) {
        this.newVideo.subtitles[index] = file;
      } else {
        this.showNotification('Por favor, selecciona un archivo de subtítulos válido (.dtt, .srt, .vtt)', 'error');
      }
    },
    
    async uploadVideo() {
      if (!this.isUploadValid) {
        this.showNotification('Por favor, completa todos los campos requeridos', 'error');
        return;
      }
      
      this.isUploading = true;
      
      try {
        const addToCarousel = !!this.newVideo.addToCarousel;
        const isEditing = !!this.editingVideoId;

        // Determinar ID y video existente (en caso de edición)
        let videoId = this.editingVideoId || Date.now().toString();
        let existingVideo = null;
        let existingIndex = -1;

        if (isEditing) {
          existingIndex = this.storedVideos.findIndex(v => v.id === this.editingVideoId);
          if (existingIndex !== -1) {
            existingVideo = this.storedVideos[existingIndex];
          } else {
            // Si por alguna razón no encontramos el video, caemos a flujo de nueva subida
            videoId = Date.now().toString();
          }
        }

        // 1) Guardar el archivo de video en IndexedDB
        //    - En nueva subida: siempre
        //    - En edición: solo si se seleccionó un nuevo archivo
        if (!isEditing || this.newVideo.videoFile) {
          try {
            await VideoStore.saveVideoFile(videoId, this.newVideo.videoFile);
          } catch (e) {
            console.error('Error guardando video en IndexedDB:', e);
            this.showNotification('No se pudo guardar el archivo de video en el navegador (IndexedDB).', 'error');
          }
        }

        // 2) En localStorage solo guardamos metadatos + assets ligeros
        const MAX_ASSET_STORE = 2 * 1024 * 1024; // 2MB para pistas/subs como dataURL si son pequeñas

        let audioUrls;
        let subtitleUrls;

        if (!isEditing || !existingVideo) {
          // Alta nueva: usamos solo los archivos seleccionados
          audioUrls = await Promise.all(
            this.newVideo.audioTracks.map(track =>
              track && track.size <= MAX_ASSET_STORE ? this.fileToDataURL(track) : null
            )
          );
          subtitleUrls = await Promise.all(
            this.newVideo.subtitles.map(sub =>
              sub && sub.size <= MAX_ASSET_STORE ? this.fileToDataURL(sub) : null
            )
          );
        } else {
          // Edición: mezclamos pistas nuevas con las existentes
          const existingAudios = Array.isArray(existingVideo.audioTracks) ? existingVideo.audioTracks : [];
          const existingSubs = Array.isArray(existingVideo.subtitles) ? existingVideo.subtitles : [];

          audioUrls = await Promise.all(
            [0, 1].map(async (index) => {
              const file = this.newVideo.audioTracks[index];
              if (file) {
                if (file.size <= MAX_ASSET_STORE) {
                  return this.fileToDataURL(file);
                }
                // Si es demasiado grande, conservar lo que hubiera antes
                return existingAudios[index] || null;
              }
              return existingAudios[index] || null;
            })
          );

          subtitleUrls = await Promise.all(
            [0, 1].map(async (index) => {
              const file = this.newVideo.subtitles[index];
              if (file) {
                if (file.size <= MAX_ASSET_STORE) {
                  return this.fileToDataURL(file);
                }
                return existingSubs[index] || null;
              }
              return existingSubs[index] || null;
            })
          );
        }

        // Tamaño aproximado: para ediciones sin nuevo archivo mantenemos el existente
        let size = existingVideo?.size || 0;
        if (!isEditing) {
          size = this.newVideo.videoFile.size +
            this.newVideo.audioTracks.reduce((sum, track) => sum + (track?.size || 0), 0) +
            this.newVideo.subtitles.reduce((sum, sub) => sum + (sub?.size || 0), 0);
        } else if (this.newVideo.videoFile) {
          size = this.newVideo.videoFile.size +
            this.newVideo.audioTracks.reduce((sum, track) => sum + (track?.size || 0), 0) +
            this.newVideo.subtitles.reduce((sum, sub) => sum + (sub?.size || 0), 0);
        }

        const videoData = {
          id: videoId,
          title: this.newVideo.title,
          description: this.newVideo.description,
          category: this.newVideo.category,
          // El archivo de video completo se guarda en IndexedDB; aquí solo marcamos que existe
          storage: existingVideo?.storage || 'indexeddb',
          videoUrl: existingVideo?.videoUrl || null,
          audioTracks: audioUrls,
          subtitles: subtitleUrls,
          size,
          uploadDate: existingVideo?.uploadDate || new Date().toISOString(),
          uploader: existingVideo?.uploader || this.user.email,
          thumbnail: existingVideo?.thumbnail || null
        };
        
        // Guardar en localStorage (insertar o actualizar)
        if (isEditing && existingIndex !== -1) {
          this.storedVideos.splice(existingIndex, 1, videoData);
        } else {
          this.storedVideos.unshift(videoData);
        }
        this.saveVideosToStorage();

        // Gestionar pertenencia al carrusel de videos
        if (addToCarousel) {
          this.addVideoIdToCarousel(videoId);
        } else if (this.isInVideoCarousel(videoId)) {
          this.removeVideoFromCarousel(videoId);
        }

        // Generar miniatura desde el video (solo cuando hay archivo nuevo)
        if (this.newVideo.videoFile) {
          try {
            const blobUrl = URL.createObjectURL(this.newVideo.videoFile);
            const thumbnail = await this.generateVideoThumbnail(blobUrl);
            URL.revokeObjectURL(blobUrl);

            const idx = this.storedVideos.findIndex(v => v.id === videoId);
            if (idx !== -1) {
              this.storedVideos[idx].thumbnail = thumbnail;
              this.saveVideosToStorage();
            }
          } catch (e) {
            console.error('Error al generar miniatura del video:', e);
          }
        }

        // Resetear formulario / estado de edición
        this.resetUploadForm();

        this.showNotification(isEditing ? 'Video actualizado exitosamente' : 'Video subido exitosamente', 'success');
        
      } catch (error) {
        console.error('Error al subir video:', error);
        this.showNotification('Error al subir el video', 'error');
      } finally {
        this.isUploading = false;
      }
    },
    
    async fileToDataURL(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    
    resetUploadForm() {
      this.newVideo = {
        title: '',
        description: '',
        category: 'tutorial',
        addToCarousel: false,
        videoFile: null,
        audioTracks: [null, null],
        subtitles: [null, null]
      };
      this.editingVideoId = null;
      this.isEditingVideo = false;
      
      // Limpiar inputs de archivos
      const fileInputs = document.querySelectorAll('.file-input');
      fileInputs.forEach(input => {
        if (input) input.value = '';
      });
    },
    
    loadVideosFromStorage() {
      const saved = localStorage.getItem('jdmTuningVideos');
      if (saved) {
        try {
          this.storedVideos = JSON.parse(saved);
        } catch (e) {
          console.error('Error al cargar videos:', e);
          this.storedVideos = [];
        }
      }

      // Mantener carrusel sincronizado con los videos existentes
      this.loadVideoCarouselFromStorage();
    },

    // ===== Carrusel de videos (Galería) =====
    getPlayableVideoUrl(video) {
      if (!video) return null;
      // Si el video está marcado como almacenado en IndexedDB,
      // lo consideramos siempre reproducible desde el navegador.
      if (video.storage === 'indexeddb') return 'indexeddb:' + video.id;
      return video.videoUrl || video.url || video.dataUrl || null;
    },

    loadVideoCarouselFromStorage() {
      try {
        const stored = localStorage.getItem('admin_carousel_videos');
        const ids = stored ? JSON.parse(stored) : [];
        const existing = new Set((this.storedVideos || []).map(v => v.id));
        this.carouselVideoIds = Array.isArray(ids) ? ids.filter(id => existing.has(id)) : [];
      } catch (e) {
        this.carouselVideoIds = [];
      }
    },

    saveVideoCarouselToStorage() {
      localStorage.setItem('admin_carousel_videos', JSON.stringify(this.carouselVideoIds || []));
      window.dispatchEvent(new Event('video-carousel-updated'));
    },

    isInVideoCarousel(videoId) {
      return (this.carouselVideoIds || []).includes(videoId);
    },

    addVideoIdToCarousel(videoId) {
      if (!videoId) return;
      if (!this.carouselVideoIds) this.carouselVideoIds = [];
      if (!this.carouselVideoIds.includes(videoId)) {
        this.carouselVideoIds.push(videoId);
        this.saveVideoCarouselToStorage();
      }
    },

    toggleVideoCarousel(video) {
      const id = video?.id;
      if (!id) return;

      if (this.isInVideoCarousel(id)) {
        this.removeVideoFromCarousel(id);
        return;
      }

      this.addVideoIdToCarousel(id);
    },

    removeVideoFromCarousel(videoId) {
      this.carouselVideoIds = (this.carouselVideoIds || []).filter(id => id !== videoId);
      this.saveVideoCarouselToStorage();
    },

    moveVideoInCarousel(videoId, dir) {
      const ids = this.carouselVideoIds || [];
      const from = ids.indexOf(videoId);
      if (from === -1) return;
      const to = from + dir;
      if (to < 0 || to >= ids.length) return;
      const next = [...ids];
      const tmp = next[from];
      next[from] = next[to];
      next[to] = tmp;
      this.carouselVideoIds = next;
      this.saveVideoCarouselToStorage();
    },
    
    saveVideosToStorage() {
      try {
        localStorage.setItem('jdmTuningVideos', JSON.stringify(this.storedVideos));
        // Notificar a otras partes de la app que la lista de videos cambió
        window.dispatchEvent(new Event('videos-updated'));
      } catch (e) {
        console.error('Error al guardar videos en localStorage:', e);
        this.showNotification('No se pudieron guardar más videos en este navegador (límite de almacenamiento).', 'error');
      }
    },

    async generateVideoThumbnail(dataUrl) {
      return new Promise((resolve, reject) => {
        try {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.muted = true;
          video.src = dataUrl;
          video.crossOrigin = 'anonymous';

          const cleanup = () => {
            try { video.removeAttribute('src'); video.load(); } catch(e) {}
          };

          const onLoaded = () => {
            try { video.currentTime = 0; } catch (err) {}
          };

          const onSeeked = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth || 640;
              canvas.height = video.videoHeight || 360;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imgData = canvas.toDataURL('image/jpeg', 0.75);
              cleanup();
              resolve(imgData);
            } catch (err) {
              cleanup();
              reject(err);
            }
          };

          video.addEventListener('loadeddata', onLoaded, { once: true });
          video.addEventListener('seeked', onSeeked, { once: true });
          video.addEventListener('error', (e) => { cleanup(); reject(e); }, { once: true });
        } catch (e) {
          reject(e);
        }
      });
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // Métodos para el reproductor
    previewVideo(video) {
      this.previewVideo = video;
      this.showPreviewModal = true;
      
      // Inicializar reproductor después de que el modal se muestre
      this.$nextTick(() => {
        this.initializeVideoPlayer(video.id);
      });
    },
    
    initializeVideoPlayer(videoId) {
      const videoElement = document.getElementById(`previewVideo-${videoId}`);
      if (!videoElement) return;
      
      // Inicializar estado del video
      this.activeVideos[videoId] = {
        isPlaying: false,
        isMuted: false,
        currentTime: 0,
        duration: 0
      };
      
      // Configurar eventos
      videoElement.addEventListener('timeupdate', () => {
        this.updateProgress(videoId);
      });
      
      videoElement.addEventListener('loadedmetadata', () => {
        this.updateDuration(videoId);
      });
    },
    
    togglePlayPause(videoId) {
      const videoElement = document.getElementById(`previewVideo-${videoId}`);
      if (!videoElement) return;
      
      if (videoElement.paused) {
        videoElement.play();
        this.activeVideos[videoId].isPlaying = true;
      } else {
        videoElement.pause();
        this.activeVideos[videoId].isPlaying = false;
      }
    },
    
    isPlaying(videoId) {
      return this.activeVideos[videoId]?.isPlaying || false;
    },
    
    stopVideo(videoId) {
      const videoElement = document.getElementById(`previewVideo-${videoId}`);
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
        this.activeVideos[videoId].isPlaying = false;
      }
    },
    
    toggleMute(videoId) {
      const videoElement = document.getElementById(`previewVideo-${videoId}`);
      if (videoElement) {
        videoElement.muted = !videoElement.muted;
        this.activeVideos[videoId].isMuted = videoElement.muted;
      }
    },
    
    isMuted(videoId) {
      return this.activeVideos[videoId]?.isMuted || false;
    },
    
    changeVolume(videoId, event) {
      const videoElement = document.getElementById(`previewVideo-${videoId}`);
      if (videoElement) {
        videoElement.volume = event.target.value;
      }
    },
    
    seekVideo(videoId, event) {
      const videoElement = document.getElementById(`previewVideo-${videoId}`);
      if (videoElement) {
        const seekTime = (videoElement.duration / 100) * event.target.value;
        videoElement.currentTime = seekTime;
      }
    },
    
    updateProgress(videoId) {
      const videoElement = document.getElementById(`previewVideo-${videoId}`);
      if (!videoElement) return;
      
      const progressBar = document.getElementById(`progressBar-${videoId}`);
      const currentTimeEl = document.getElementById(`currentTime-${videoId}`);
      
      if (progressBar) {
        progressBar.value = (videoElement.currentTime / videoElement.duration) * 100;
      }
      
      if (currentTimeEl) {
        currentTimeEl.textContent = this.formatTime(videoElement.currentTime);
      }
    },
    
    updateDuration(videoId) {
      const videoElement = document.getElementById(`previewVideo-${videoId}`);
      const durationEl = document.getElementById(`duration-${videoId}`);
      
      if (videoElement && durationEl) {
        durationEl.textContent = this.formatTime(videoElement.duration);
      }
    },
    
    changeAudioTrack(videoId, event) {
      // En una implementación real, cambiaría la pista de audio del video
      const trackIndex = parseInt(event.target.value);
      this.showNotification(`Cambiando a pista de audio ${trackIndex === 0 ? 'Español' : 'Inglés'}`, 'info');
    },
    
    changeSubtitle(videoId, event) {
      const subtitleIndex = event.target.value;
      if (subtitleIndex === 'none') {
        this.showNotification('Subtítulos desactivados', 'info');
      } else {
        const lang = subtitleIndex === '0' ? 'Español' : 'Inglés';
        this.showNotification(`Subtítulos en ${lang} activados`, 'info');
      }
    },
    
    closePreviewModal() {
      this.showPreviewModal = false;
      this.previewVideo = null;
      
      // Detener todos los videos
      Object.keys(this.activeVideos).forEach(videoId => {
        const videoElement = document.getElementById(`previewVideo-${videoId}`);
        if (videoElement) {
          videoElement.pause();
        }
      });
      this.activeVideos = {};
    },
    
    editVideo(video) {
      if (!video) return;

      this.editingVideoId = video.id;
      this.isEditingVideo = true;

      this.newVideo = {
        title: video.title || '',
        description: video.description || '',
        category: video.category || 'tutorial',
        // Sincronizamos con el estado actual del carrusel
        addToCarousel: this.isInVideoCarousel(video.id),
        // No podemos rellenar inputs de archivo por seguridad del navegador
        videoFile: null,
        audioTracks: [null, null],
        subtitles: [null, null]
      };

      this.showNotification(`Editando video: ${video.title}`, 'info');
    },
    
    deleteVideo(videoId) {
      if (confirm('¿Estás seguro de que quieres eliminar este video? Esta acción no se puede deshacer.')) {
        this.storedVideos = this.storedVideos.filter(video => video.id !== videoId);
        this.saveVideosToStorage();
        if (this.isInVideoCarousel(videoId)) {
          this.removeVideoFromCarousel(videoId);
        }
        if (this.editingVideoId === videoId) {
          this.resetUploadForm();
        }
        this.showNotification('Video eliminado exitosamente', 'success');
      }
    },
    
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
  }
}
</script>

<style scoped>
/* ===== ESTILOS PARA GESTIÓN DE USUARIOS ===== */
.admin-navigation {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: var(--accent, #ffffff);
  padding: 1rem;
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
}

.admin-nav-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid var(--primary, #2c3e50);
  background: transparent;
  color: var(--primary, #2c3e50);
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.admin-nav-btn:hover {
  background: var(--primary, #2c3e50);
  color: var(--accent, #ffffff);
  transform: translateY(-2px);
}

.admin-nav-btn.active {
  background: var(--secondary, #e74c3c);
  border-color: var(--secondary, #e74c3c);
  color: var(--accent, #ffffff);
}

.users-management-section {
  background: var(--accent, #ffffff);
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
  overflow: hidden;
}

.users-header {
  background: var(--primary, #2c3e50);
  color: var(--accent, #ffffff);
  padding: 2rem;
}

.users-header h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.8rem;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.users-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: var(--border-radius, 8px);
  text-align: center;
  backdrop-filter: blur(10px);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.users-content {
  padding: 2rem;
}

/* ===== ESTILOS PARA DATATABLE ===== */
.datatable-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--accent, #ffffff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--shadow, 0 2px 4px rgba(0,0,0,0.1));
}

.control-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.control-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--border-radius, 6px);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.refresh-btn {
  background: var(--primary, #2c3e50);
  color: var(--accent, #ffffff);
}

.refresh-btn:hover {
  background: var(--secondary, #e74c3c);
  transform: translateY(-1px);
}

.export-btn {
  background: #27ae60;
  color: white;
}

.export-btn:hover {
  background: #219a52;
  transform: translateY(-1px);
}

.page-size-select {
  padding: 0.5rem;
  border: 1px solid var(--background, #ecf0f1);
  border-radius: var(--border-radius, 6px);
  background: var(--accent, #ffffff);
  color: var(--text, #2c3e50);
  font-family: var(--secondary-font, Arial, sans-serif);
}

.datatable-container {
  background: var(--accent, #ffffff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--shadow, 0 2px 10px rgba(0,0,0,0.1));
  overflow: hidden;
}

/* Estilos para DataTables */
:deep(.dataTables_wrapper) {
  padding: 1rem;
}

:deep(.dataTables_length),
:deep(.dataTables_filter) {
  margin-bottom: 1rem;
}

:deep(.dataTables_length select),
:deep(.dataTables_filter input) {
  padding: 0.5rem;
  border: 1px solid var(--background, #ecf0f1);
  border-radius: var(--border-radius, 6px);
  background: var(--accent, #ffffff);
  color: var(--text, #2c3e50);
}

:deep(.dataTables_info) {
  color: var(--text, #666666);
  font-family: var(--secondary-font, Arial, sans-serif);
}

:deep(.paginate_button) {
  padding: 0.5rem 0.75rem;
  margin: 0 0.25rem;
  border: 1px solid var(--background, #ecf0f1);
  border-radius: var(--border-radius, 6px);
  background: var(--accent, #ffffff);
  color: var(--text, #2c3e50);
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.paginate_button:hover) {
  background: var(--secondary, #e74c3c);
  color: var(--accent, #ffffff);
  border-color: var(--secondary, #e74c3c);
}

:deep(.paginate_button.current) {
  background: var(--primary, #2c3e50);
  color: var(--accent, #ffffff);
  border-color: var(--primary, #2c3e50);
}

/* Botones de acción en la tabla */
.datatable-actions {
  display: flex;
  gap: 0.25rem;
  justify-content: center;
}

.dt-action-btn {
  padding: 0.4rem;
  border: none;
  border-radius: var(--border-radius, 4px);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  background: transparent;
}

.dt-action-btn:hover:not(:disabled) {
  transform: scale(1.1);
}

.download-btn:hover {
  background: #28a745;
  color: white;
}

.promote-btn:hover {
  background: #ffc107;
  color: #212529;
}

.delete-btn:hover {
  background: #dc3545;
  color: white;
}

.disabled-btn {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Badges en la tabla */
.user-type-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.user-type-badge.user {
  background: var(--background, #ecf0f1);
  color: var(--text, #666666);
}

.user-type-badge.admin {
  background: var(--secondary, #e74c3c);
  color: var(--accent, #ffffff);
}

.cv-status {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.cv-status.has-cv {
  background: #d4edda;
  color: #155724;
}

.cv-status.no-cv {
  background: #f8d7da;
  color: #721c24;
}

/* ===== ESTILOS EXISTENTES DE CONFIGURACIÓN ===== */
.admin-section {
  padding: 2rem 0;
  background: var(--background, #ecf0f1);
  min-height: 100vh;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
  color: var(--text, #2c3e50);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.admin-header {
  text-align: center;
  margin-bottom: 2rem;
}

.admin-header h1 {
  color: var(--primary, #2c3e50);
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.admin-subtitle {
  color: var(--text, #2c3e50);
  margin-bottom: 1rem;
  font-size: 1.1rem;
  opacity: 0.8;
}

.back-btn {
  background: var(--secondary, #e74c3c);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-weight: 600;
  font-size: 1rem;
}

.back-btn:hover {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.config-layout {
  display: grid;
  grid-template-columns: 320px 1fr 320px;
  gap: 25px;
  align-items: start;
}

/* ===== SIDEBARS CON ESTILO ===== */
.color-sidebar,
.config-sidebar {
  background: var(--accent, #ffffff);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  height: fit-content;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(0,0,0,0.05);
}

.sidebar-title {
  color: var(--primary, #2c3e50);
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  border-bottom: 3px solid var(--secondary, #e74c3c);
  padding-bottom: 0.75rem;
  font-family: inherit;
}

/* ===== CONTROLES DE COLOR ===== */
.color-control {
  margin-bottom: 1.5rem;
  padding: 1.25rem;
  background: var(--background, #f8f9fa);
  border-radius: 10px;
  border-left: 5px solid var(--secondary, #e74c3c);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
}

.color-control:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.color-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--primary, #2c3e50);
  font-size: 1rem;
  font-family: inherit;
}

.color-sample {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid #ddd;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.color-input {
  width: 100%;
  height: 45px;
  border: 2px solid var(--accent, #ddd);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-input:hover {
  border-color: var(--secondary, #e74c3c);
  transform: scale(1.02);
}

.color-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.75rem 0;
}

.color-preview-box {
  width: 35px;
  height: 35px;
  border-radius: 6px;
  border: 2px solid #ddd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.color-hex {
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  color: var(--text, #7f8c8d);
  font-weight: 600;
}

.color-description {
  font-size: 0.85rem;
  color: var(--text, #7f8c8d);
  margin-top: 0.5rem;
  opacity: 0.8;
  font-style: italic;
}

/* ===== OPCIONES ADICIONALES ===== */
.additional-options {
  margin-top: 1.5rem;
}

.option-group {
  margin-bottom: 1.25rem;
  padding: 1rem;
  background: var(--background, #f8f9fa);
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.05);
}

.option-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--primary, #2c3e50);
  font-size: 0.95rem;
  font-family: inherit;
}

.form-range {
  width: 100%;
  margin-bottom: 0.75rem;
  height: 6px;
  border-radius: 3px;
  background: var(--accent, #ddd);
  outline: none;
}

.form-range::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--secondary, #e74c3c);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.option-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--accent, #ddd);
  border-radius: 6px;
  background: var(--accent, #ffffff);
  color: var(--text, #2c3e50);
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.option-select:focus {
  border-color: var(--secondary, #e74c3c);
  outline: none;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

/* ===== TOGGLE SWITCHES ===== */
.toggle-switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggle-label {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 28px;
}

.toggle-label input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 28px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input:checked + .toggle-slider {
  background-color: var(--secondary, #e74c3c);
}

input:checked + .toggle-slider:before {
  transform: translateX(32px);
}

.mode-description {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: rgba(33, 150, 243, 0.1);
  border-radius: 6px;
  border-left: 4px solid #2196f3;
}

.mode-description small {
  color: #1976d2;
  font-style: italic;
  font-size: 0.85rem;
}

/* ===== BOTONES ===== */
.reset-btn {
  width: 100%;
  background: var(--secondary, #e74c3c);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
  font-family: inherit;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.reset-btn:hover {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
}

/* ===== VISTA PREVIA ===== */
.preview-container {
  background: var(--accent, #ffffff);
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
  transform: scale(0.7);
  transform-origin: top center;
  width: 142.857%;
  margin-left: -21.4285%;
  max-height: 80vh;
  overflow-y: auto;
}

.preview-site {
  /* Variables CSS para la vista previa */
  --preview-primary: #2c3e50;
  --preview-secondary: #e74c3c;
  --preview-background: #ecf0f1;
  --preview-text: #2c3e50;
  --preview-accent: #ffffff;
  --preview-paragraph-size: 16px;
  --preview-title-size: 24px;
  --preview-font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --preview-secondary-font: Arial, sans-serif;
  --preview-border-radius: 8px;
  --preview-shadow: 0 5px 10px rgba(0,0,0,0.1);
  --preview-high-contrast: 0;
  --preview-large-text: 1;
  --preview-color-blind-filter: none;
  
  /* Aplicar filtro de daltonismo a toda la vista previa */
  filter: var(--preview-color-blind-filter);
}

/* ===== GESTIÓN DE CONFIGURACIONES ===== */
.config-management {
  margin-bottom: 2rem;
}

.config-management-buttons {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.config-management-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-family: inherit;
  font-weight: 600;
}

.config-management-btn.success {
  background: var(--secondary, #e74c3c);
  color: white;
}

.config-management-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.configs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--background, #ecf0f1);
}

.configs-title {
  margin: 0;
  color: var(--primary, #2c3e50);
  font-weight: 700;
  font-size: 1.1rem;
}

.configs-count {
  background: var(--background, #ecf0f1);
  color: var(--text, #7f8c8d);
  padding: 0.3rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}

.search-box {
  position: relative;
  margin-bottom: 1.25rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--accent, #ddd);
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  background: var(--accent, #ffffff);
  color: var(--text, #2c3e50);
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--secondary, #e74c3c);
  outline: none;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.configs-list {
  max-height: 300px;
  overflow-y: auto;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--background, #ecf0f1);
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--accent, #ffffff);
}

.config-item:hover {
  background: var(--background, #f8f9fa);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: var(--secondary, #e74c3c);
}

.config-item-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.config-item-colors {
  display: flex;
  gap: 0.3rem;
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.config-item-content {
  flex: 1;
}

.config-item-name {
  font-weight: 600;
  color: var(--primary, #2c3e50);
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.config-item-date {
  font-size: 0.8rem;
  color: var(--text, #7f8c8d);
  opacity: 0.7;
}

.empty-configs {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text, #7f8c8d);
  font-style: italic;
}

/* ===== ACCIONES RÁPIDAS ===== */
.quick-actions {
  margin-top: 2rem;
}

.quick-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quick-btn {
  padding: 0.85rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  background: var(--secondary, #e74c3c);
  color: white;
  font-family: inherit;
  font-weight: 600;
}

.quick-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
  background: #c0392b;
}

/* ===== MODALES ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--accent, #ffffff);
  padding: 2.5rem;
  border-radius: 12px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0,0,0,0.05);
}

.modal-title {
  margin-bottom: 1.5rem;
  color: var(--primary, #2c3e50);
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.modal-message {
  color: var(--text, #2c3e50);
  margin-bottom: 1.5rem;
  font-family: var(--secondary-font, Arial, sans-serif);
  text-align: center;
  line-height: 1.5;
}

.modal-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--accent, #ddd);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-family: inherit;
  font-size: 1rem;
  background: var(--accent, #ffffff);
  color: var(--text, #2c3e50);
  transition: all 0.3s ease;
}

.modal-input:focus {
  border-color: var(--secondary, #e74c3c);
  outline: none;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.modal-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  font-weight: 600;
  font-size: 1rem;
  min-width: 120px;
}

.modal-btn.primary {
  background: var(--secondary, #e74c3c);
  color: white;
}

.modal-btn.secondary {
  background: var(--text, #7f8c8d);
  color: white;
}

.modal-btn.danger {
  background: #dc3545;
  color: white;
}

.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.modal-btn.danger:hover {
  background: #c82333;
}

/* ===== NOTIFICACIÓN ===== */
.notification {
  position: fixed;
  top: 25px;
  right: 25px;
  padding: 1.25rem 1.75rem;
  border-radius: 8px;
  color: white;
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  font-family: inherit;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.notification.success {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
}

.notification.error {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.notification.info {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.notification.warning {
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

/* ===== ESTILOS DE LA VISTA PREVIA ===== */
.preview-header {
  background-color: var(--preview-primary);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: var(--preview-shadow);
  filter: contrast(calc(1 + var(--preview-high-contrast) * 10));
}

.preview-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
}

.preview-logo {
  font-size: calc(1.5rem * var(--preview-large-text));
  font-weight: bold;
  color: var(--preview-text);
  text-decoration: none;
  font-family: var(--preview-font-family);
}

.preview-nav-links {
  display: flex;
  gap: 1.5rem;
}

.preview-nav-link {
  color: var(--preview-text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  font-family: var(--preview-secondary-font);
  font-size: calc(var(--preview-paragraph-size) * var(--preview-large-text));
}

.preview-nav-link:hover,
.preview-nav-link.active {
  color: var(--preview-secondary);
}

.preview-hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url('https://www.motor1.com/news/661782/2000-nissan-r34-skyline-gt-r-auction-paul-walker-driven-fast-and-furious/');
  background-size: cover;
  background-position: center;
  height: 30vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
  filter: contrast(calc(1 + var(--preview-high-contrast) * 10));
}

.preview-hero-title {
  color: white;
  font-family: var(--preview-font-family);
  font-size: calc(var(--preview-title-size) * var(--preview-large-text));
  font-weight: 700;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.preview-hero-subtitle {
  color: white;
  font-family: var(--preview-secondary-font);
  font-size: calc(var(--preview-paragraph-size) * var(--preview-large-text));
  opacity: 0.9;
}

.preview-main {
  background: var(--preview-background);
  filter: contrast(calc(1 + var(--preview-high-contrast) * 10));
}

.preview-section {
  padding: 2rem 0;
}

.preview-container-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.preview-section-title {
  color: var(--preview-primary);
  font-family: var(--preview-font-family);
  font-size: calc(var(--preview-title-size) * var(--preview-large-text));
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--preview-secondary);
  padding-bottom: 0.5rem;
}

.preview-section-subtitle {
  color: var(--preview-primary);
  font-family: var(--preview-secondary-font);
  font-size: calc(var(--preview-title-size) * 0.8 * var(--preview-large-text));
  margin-bottom: 1rem;
}

.preview-paragraph {
  color: var(--preview-text);
  font-family: var(--preview-secondary-font);
  font-size: calc(var(--preview-paragraph-size) * var(--preview-large-text));
  line-height: 1.6;
  margin-bottom: 1rem;
}

.preview-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
}

.preview-stat-item {
  text-align: center;
  padding: 1rem;
  background-color: var(--preview-accent);
  border-radius: var(--preview-border-radius);
  box-shadow: var(--preview-shadow);
  border: 1px solid rgba(0,0,0,0.1);
}

.preview-stat-item h4 {
  color: var(--preview-secondary);
  font-family: var(--preview-font-family);
  font-size: calc(var(--preview-title-size) * 0.9 * var(--preview-large-text));
  margin-bottom: 0.5rem;
}

.preview-stat-item p {
  color: var(--preview-text);
  font-family: var(--preview-secondary-font);
  font-size: calc(var(--preview-paragraph-size) * 0.9 * var(--preview-large-text));
}

.preview-features {
  background-color: var(--preview-accent);
}

.preview-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.preview-feature-card {
  background-color: var(--preview-background);
  padding: 1.5rem;
  border-radius: var(--preview-border-radius);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  border-left: 4px solid var(--preview-primary);
  box-shadow: var(--preview-shadow);
}

.preview-feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.preview-feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.preview-feature-card h3 {
  color: var(--preview-primary);
  font-family: var(--preview-font-family);
  font-size: calc(var(--preview-title-size) * 0.8 * var(--preview-large-text));
  margin-bottom: 0.5rem;
}

.preview-feature-card p {
  color: var(--preview-text);
  font-family: var(--preview-secondary-font);
  font-size: calc(var(--preview-paragraph-size) * var(--preview-large-text));
}

.preview-brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.preview-brand-btn {
  background-color: var(--preview-accent);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--preview-border-radius);
  color: var(--preview-text);
  cursor: pointer;
  font-weight: bold;
  padding: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--preview-shadow);
  font-family: var(--preview-secondary-font);
  font-size: calc(1rem * var(--preview-large-text));
}

.preview-brand-btn:hover {
  transform: translateY(-3px);
  background-color: var(--preview-primary);
  color: var(--preview-text);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.preview-auth-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.preview-login-btn {
  background: transparent;
  border: 1px solid var(--preview-primary);
  color: var(--preview-primary);
  padding: 0.5rem 1rem;
  border-radius: var(--preview-border-radius);
  cursor: pointer;
  font-family: var(--preview-secondary-font);
  font-size: calc(var(--preview-paragraph-size) * var(--preview-large-text));
  transition: all 0.3s;
}

.preview-register-btn {
  background: var(--preview-secondary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--preview-border-radius);
  cursor: pointer;
  font-family: var(--preview-secondary-font);
  font-size: calc(var(--preview-paragraph-size) * var(--preview-large-text));
  transition: all 0.3s;
}

.preview-login-btn:hover,
.preview-register-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.preview-footer {
  background-color: var(--preview-primary);
  padding: 2rem 0;
  text-align: center;
  filter: contrast(calc(1 + var(--preview-high-contrast) * 10));
}

.preview-footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.preview-footer-content p {
  color: var(--preview-text);
  font-family: var(--preview-secondary-font);
  font-size: calc(var(--preview-paragraph-size) * var(--preview-large-text));
}

.preview-social-links {
  display: flex;
  gap: 1rem;
}

.preview-social-links a {
  color: var(--preview-text);
  font-size: calc(1.2rem * var(--preview-large-text));
  transition: color 0.3s;
  font-family: var(--preview-secondary-font);
}

.preview-social-links a:hover {
  color: var(--preview-secondary);
}

.videos-management-section {
  background: var(--accent, #ffffff);
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 2px 10px rgba(0, 0, 0, 0.1));
  overflow: hidden;
}

.upload-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--background, #f8f9fa);
  border-radius: var(--border-radius, 8px);
  border: 2px dashed var(--primary, #2c3e50);
}

.upload-section h3 {
  color: var(--primary, #2c3e50);
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: var(--primary, #2c3e50);
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.form-input,
.form-textarea,
.form-select {
  padding: 0.75rem;
  border: 2px solid var(--accent, #ddd);
  border-radius: var(--border-radius, 6px);
  font-family: var(--secondary-font, Arial, sans-serif);
  font-size: 1rem;
  background: var(--accent, #ffffff);
  color: var(--text, #2c3e50);
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  border-color: var(--secondary, #e74c3c);
  outline: none;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.file-upload-group {
  margin-bottom: 1rem;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--accent, #ffffff);
  border: 2px dashed var(--primary, #2c3e50);
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.file-label:hover {
  background: var(--background, #f8f9fa);
  border-color: var(--secondary, #e74c3c);
}

.file-icon {
  font-size: 1.2rem;
}

.file-text {
  font-weight: 600;
  color: var(--primary, #2c3e50);
}

.file-input {
  display: none;
}

.file-info {
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--background, #f8f9fa);
  border-radius: var(--border-radius, 6px);
  font-size: 0.9rem;
  color: var(--text, #666666);
  font-family: var(--secondary-font, Arial, sans-serif);
}

.audio-tracks-section,
.subtitles-section {
  padding: 1.5rem;
  background: var(--background, #f8f9fa);
  border-radius: var(--border-radius, 8px);
  border: 1px solid rgba(0,0,0,0.05);
}

.audio-tracks-section h4,
.subtitles-section h4 {
  color: var(--primary, #2c3e50);
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.audio-track-group,
.subtitles-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.validation-status {
  padding: 1rem;
  border-radius: var(--border-radius, 8px);
  margin: 1rem 0;
}

.validation-status.valid {
  background: rgba(46, 204, 113, 0.1);
  border: 2px solid #2ecc71;
}

.validation-status.invalid {
  background: rgba(231, 76, 60, 0.1);
  border: 2px solid #e74c3c;
}

.validation-error span {
  font-weight: 600;
  color: #e74c3c;
  display: block;
  margin-bottom: 0.5rem;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.validation-error ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #e74c3c;
}

.validation-error li {
  margin-bottom: 0.25rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.validation-success {
  color: #2ecc71;
  font-weight: 600;
  text-align: center;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.upload-btn {
  padding: 1rem;
  background: var(--secondary, #e74c3c);
  color: white;
  border: none;
  border-radius: var(--border-radius, 8px);
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.upload-btn:hover:not(:disabled) {
  background: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
}

.upload-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-btn.loading {
  opacity: 0.8;
}

/* Estilos para el submenú de Video por defecto */
.default-video-section {
  margin-top: 20px;
  background: var(--accent, #ffffff);
  padding: 16px;
  border-radius: var(--border-radius, 12px);
  box-shadow: var(--shadow, 0 6px 20px rgba(0,0,0,0.08));
  border: 1px solid rgba(0,0,0,0.06);
}

.default-video-section h3 {
  margin: 0 0 12px 0;
  color: var(--primary, #2c3e50);
  font-size: 1.2rem;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
  border-bottom: 2px solid var(--background, #f8f9fa);
  padding-bottom: 8px;
}

.default-list-container {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 18px;
  align-items: start;
}

.default-list {
  max-height: 280px;
  overflow-y: auto;
  padding: 8px;
  border-radius: 8px;
  background: var(--background, #f8f9fa);
  border: 1px solid rgba(0,0,0,0.03);
}

.default-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.default-item input[type="radio"] {
  accent-color: var(--secondary, #e74c3c);
}

.default-item:hover {
  background: rgba(0,0,0,0.03);
}

.default-preview {
  background: var(--accent, #ffffff);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.04);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.default-preview h4 { margin: 0 0 8px 0; color: var(--primary); }

.default-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.default-actions .action-btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: var(--primary);
  color: var(--accent);
}

.default-actions .action-btn.secondary {
  background: transparent;
  border: 1px solid rgba(0,0,0,0.08);
  color: var(--text);
}

/* ===== LISTA DE VIDEOS ===== */
.videos-list-section {
  margin-top: 2rem;
}

.videos-list-section h3 {
  color: var(--primary, #2c3e50);
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.videos-table-container {
  background: var(--accent, #ffffff);
  border-radius: var(--border-radius, 8px);
  box-shadow: var(--shadow, 0 2px 10px rgba(0,0,0,0.1));
  overflow: hidden;
}

.videos-table {
  width: 100%;
  border-collapse: collapse;
}

.videos-table thead {
  background: var(--primary, #2c3e50);
  color: var(--accent, #ffffff);
}

.videos-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-family: var(--font-family, 'Segoe UI', sans-serif);
}

.videos-table tbody tr {
  border-bottom: 1px solid var(--background, #ecf0f1);
  transition: background 0.3s ease;
}

.videos-table tbody tr:hover {
  background: var(--background, #f8f9fa);
}

.videos-table td {
  padding: 1rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.category-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.category-badge.tutorial {
  background: #3498db;
  color: white;
}

.category-badge.review {
  background: #9b59b6;
  color: white;
}

.category-badge.evento {
  background: #e67e22;
  color: white;
}

.category-badge.entrevista {
  background: #1abc9c;
  color: white;
}

.category-badge.otros {
  background: #95a5a6;
  color: white;
}

.tracks-status,
.subtitles-status {
  display: flex;
  gap: 0.5rem;
}

.track-indicator,
.subtitle-indicator {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 600;
  background: #e74c3c;
  color: white;
}

.track-indicator.has-track,
.subtitle-indicator.has-subtitle {
  background: #27ae60;
}

.video-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: none;
  border-radius: var(--border-radius, 4px);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: transparent;
}

.action-btn:hover {
  transform: scale(1.1);
}

.preview-btn:hover {
  background: #3498db;
  color: white;
}

.edit-btn:hover {
  background: #f39c12;
  color: white;
}

.delete-btn:hover {
  background: #e74c3c;
  color: white;
}

.empty-videos {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--text, #7f8c8d);
  font-style: italic;
  font-family: var(--secondary-font, Arial, sans-serif);
}

/* ===== MODAL DE PREVISUALIZACIÓN ===== */
.video-preview-modal {
  max-width: 900px;
  width: 90%;
}

.video-preview-container {
  margin: 1.5rem 0;
}

.player-container {
  width: 100%;
  background: #000;
  border-radius: var(--border-radius, 12px);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.player-container video {
  width: 100%;
  display: block;
}

.player-container .controls {
  padding: 15px;
  background: #333;
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.control-btn {
  background: none;
  border: 1px solid #555;
  color: white;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
  font-size: 1rem;
}

.control-btn:hover {
  background: #555;
}

.progress-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.progress-bar {
  width: 100%;
  cursor: pointer;
}

.time-display {
  font-size: 0.8rem;
  color: #aaa;
  margin-top: 5px;
  text-align: right;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.audio-track-select,
.subtitle-select,
.volume-bar {
  padding: 0.5rem;
  border: 1px solid #555;
  border-radius: 5px;
  background: #222;
  color: white;
  cursor: pointer;
  font-family: var(--secondary-font, Arial, sans-serif);
}

.audio-track-select:focus,
.subtitle-select:focus {
  outline: none;
  border-color: var(--secondary, #e74c3c);
}

/* ===== RESPONSIVE PARA VIDEOS ===== */
@media (max-width: 768px) {
  .audio-track-group,
  .subtitles-group {
    grid-template-columns: 1fr;
  }
  
  .videos-table {
    display: block;
    overflow-x: auto;
  }
  
  .player-container .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .audio-track-select,
  .subtitle-select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .upload-section {
    padding: 1rem;
  }
  
  .videos-table th,
  .videos-table td {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  .video-actions {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .action-btn {
    padding: 0.4rem;
    font-size: 0.8rem;
  }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .config-layout {
    grid-template-columns: 300px 1fr 300px;
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .config-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .color-sidebar,
  .config-sidebar {
    max-height: none;
  }
  
  .preview-container {
    transform: scale(1);
    width: 100%;
    margin-left: 0;
  }
  
  .datatable-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .control-group {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .admin-header h1 {
    font-size: 2rem;
  }
  
  .admin-navigation {
    flex-direction: column;
  }
  
  .config-layout {
    gap: 15px;
  }
  
  :deep(.dataTables_wrapper) {
    padding: 0.5rem;
  }
  
  .datatable-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .dt-action-btn {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
  
  .preview-stats,
  .preview-features-grid,
  .preview-brands-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-auth-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .preview-nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .preview-nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .modal-content {
    padding: 2rem;
    margin: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-btn {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .users-stats {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .preview-hero-title {
    font-size: calc(var(--title-size) * 1.2);
  }
}
</style>

  <style>
    .context-menu {
      position: absolute;
      z-index: 2000;
      background: var(--accent, #fff);
      border: 1px solid rgba(0,0,0,0.08);
      box-shadow: 0 6px 18px rgba(0,0,0,0.12);
      border-radius: 6px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 140px;
    }

    .context-menu-btn {
      background: transparent;
      border: none;
      text-align: left;
      padding: 8px 10px;
      cursor: pointer;
      font-family: var(--font-family, Arial, sans-serif);
      color: var(--text, #222);
    }

    .context-menu-btn:hover { background: rgba(0,0,0,0.04); }
  </style>