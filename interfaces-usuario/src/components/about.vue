<template>
  <div id="app">
      <TangramLoader 
        v-if="isLoading"
        :loading-text="loaderText"
        :animation-speed="2000"
        :tangram-colors="currentTangramColors"
      />
    <div v-if="!isLoading">
    <header>
      <div class="container">
        <nav>
          <a href="#" class="logo">JDM TUNING</a>
          <div class="nav-links">
            <a href="#" @click="setActiveView('home')" :class="{ active: activeView === 'home' }">Inicio</a>
            <a href="#" @click="setActiveView('about')" :class="{ active: activeView === 'about' }">Acerca de</a>
            <a href="#" @click="setActiveView('gallery')" :class="{ active: activeView === 'gallery' }">Galería</a>
            <a href="#" @click="setActiveView('events')" :class="{ active: activeView === 'events' }">Eventos</a>
            <a href="#" @click="setActiveView('contact')" :class="{ active: activeView === 'contact' }">Contacto</a>
            
            <!-- Enlace al panel de administrador -->
            <a 
              v-if="user && user.isAdmin" 
              href="#" 
              @click="setActiveView('admin')" 
              :class="{ active: activeView === 'admin' }"
              class="admin-nav-link"
            >
              🛠️ Panel Admin
            </a>
            
            <!-- Panel de usuario -->
            <div class="user-panel" v-if="user">
              <span class="user-greeting">
                Hola, {{ user.email }}
                <span v-if="user.isAdmin" class="admin-badge">Admin</span>
              </span>
              
              <!-- Enlace al creador de CV para usuarios normales -->
              <a 
                v-if="user && !user.isAdmin" 
                href="#" 
                @click="setActiveView('usercv')" 
                :class="{ active: activeView === 'usercv' }"
                class="cv-nav-link"
              >
                📄 Mi Currículum
              </a>
              
              <button class="logout-btn" @click="handleLogout">Cerrar Sesión</button>
            </div>
            
            <!-- Botones de login/registro -->
            <div class="auth-buttons" v-else>
              <button class="login-btn" @click="showLoginModal = true">
                Iniciar Sesión
              </button>
              <button class="register-btn" @click="showRegisterModal = true">
                Registrarse
              </button>
            </div>
          </div>
          <button class="mobile-menu-btn" @click="toggleMobileMenu">
            ☰
          </button>
        </nav>
      </div>
    </header>

    <!-- Menú móvil -->
    <div class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
      <a href="#" @click="setActiveView('home'); mobileMenuOpen = false;" :class="{ active: activeView === 'home' }">Inicio</a>
      <a href="#" @click="setActiveView('about'); mobileMenuOpen = false;" :class="{ active: activeView === 'about' }">Acerca de</a>
      <a href="#" @click="setActiveView('gallery'); mobileMenuOpen = false;" :class="{ active: activeView === 'gallery' }">Galería</a>
      <a href="#" @click="setActiveView('events'); mobileMenuOpen = false;" :class="{ active: activeView === 'events' }">Eventos</a>
      <a href="#" @click="setActiveView('contact'); mobileMenuOpen = false;" :class="{ active: activeView === 'contact' }">Contacto</a>
      
      <!-- Enlace al panel de administrador móvil -->
      <a 
        v-if="user && user.isAdmin" 
        href="#"
        @click="setActiveView('admin'); mobileMenuOpen = false;" 
        :class="{ active: activeView === 'admin' }"
        class="admin-nav-link"
      >
        🛠️ Panel Admin
      </a>
      
      <!-- Panel de usuario móvil -->
      <div class="mobile-user-panel" v-if="user">
        <div class="user-info">
          <strong>{{ user.email }}</strong>
          <span v-if="user.isAdmin" class="admin-badge">Admin</span>
        </div>
        
        <!-- Enlace al creador de CV móvil -->
        <a 
          v-if="user && !user.isAdmin" 
          href="#"
          @click="setActiveView('usercv'); mobileMenuOpen = false;" 
          :class="{ active: activeView === 'usercv' }"
          class="cv-nav-link"
        >
          📄 Mi Currículum
        </a>
        
        <button class="logout-btn" @click="handleLogout">Cerrar Sesión</button>
      </div>
      
      <!-- Botones de auth móvil -->
      <div class="mobile-auth-buttons" v-else>
        <button class="login-btn" @click="showLoginModal = true; mobileMenuOpen = false;">
          Iniciar Sesión
        </button>
        <button class="register-btn" @click="showRegisterModal = true; mobileMenuOpen = false;">
          Registrarse
        </button>
      </div>
    </div>

    <!-- Modales de Login y Registro -->
    <div class="login-modal" v-if="showLoginModal" @click.self="closeLoginModal">
      <div class="login-content">
        <button class="close-btn" @click="closeLoginModal">×</button>
        <h2>Iniciar Sesión</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="loginEmail">Email:</label>
            <input
              type="email"
              id="loginEmail"
              v-model="loginForm.email"
              required
              placeholder="tu@email.com"
            >
          </div>
          <div class="form-group">
            <label for="loginPassword">Contraseña:</label>
            <input
              type="password"
              id="loginPassword"
              v-model="loginForm.password"
              required
              placeholder="••••••••"
            >
          </div>
          <button type="submit" class="submit-btn" :disabled="loginLoading">
            {{ loginLoading ? 'Iniciando Sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>
        <div class="switch-mode">
          <p>¿No tienes cuenta? <a href="#" @click.prevent="switchToRegister">Regístrate</a></p>
        </div>
        <div v-if="loginError" class="error-message">{{ loginError }}</div>
      </div>
    </div>

    <div class="login-modal" v-if="showRegisterModal" @click.self="closeRegisterModal">
      <div class="login-content">
        <button class="close-btn" @click="closeRegisterModal">×</button>
        <h2>Registrarse</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="registerEmail">Email:</label>
            <input
              type="email"
              id="registerEmail"
              v-model="registerForm.email"
              required
              placeholder="tu@email.com"
            >
          </div>
          <div class="form-group">
            <label for="registerPassword">Contraseña:</label>
            <input
              type="password"
              id="registerPassword"
              v-model="registerForm.password"
              required
              placeholder="••••••••"
            >
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="registerForm.confirmPassword"
              required
              placeholder="••••••••"
            >
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="registerForm.isAdmin"> 
              Registrarse como Administrador
            </label>
          </div>
          <button type="submit" class="submit-btn" :disabled="registerLoading">
            {{ registerLoading ? 'Registrando...' : 'Registrarse' }}
          </button>
        </form>
        <div class="switch-mode">
          <p>¿Ya tienes cuenta? <a href="#" @click.prevent="switchToLogin">Inicia Sesión</a></p>
        </div>
        <div v-if="registerError" class="error-message">{{ registerError }}</div>
      </div>
    </div>

    <!-- Componente Admin importado -->
    <ConfigAdmin 
      v-if="activeView === 'admin' && user && user.isAdmin" 
      :user="user"
      @back-to-main="setActiveView('about')"
    />

    <!-- Componente UserCV importado -->
    <UserCV 
      v-if="activeView === 'usercv' && user && !user.isAdmin" 
      :user="user"
      @back-to-main="setActiveView('about')"
    />

    <!-- Vista Principal (About) -->
    <section v-if="activeView === 'about'" class="hero">
      <div class="hero-content">
        <h1>Cultura JDM Tuning</h1>
        <p>Explora el fascinante mundo del tuning japonés, donde la ingeniería se encuentra con el arte y la pasión por los automóviles.</p>
      </div>
    </section>

    <section v-if="activeView === 'about'" class="section">
      <div class="container">
        <div class="section-title">
          <h2>Acerca del Tuning Japonés</h2>
        </div>
        <div class="about-content">
          <div class="about-text">
            <h3>La Filosofía JDM</h3>
            <p>El tuning japonés, conocido mundialmente como JDM (Japanese Domestic Market), es mucho más que modificar coches. Es una cultura que combina la precisión de la ingeniería japonesa con la expresión personal y la búsqueda del rendimiento máximo.</p>
            <p>Desde los años 80, esta cultura ha evolucionado desde simples modificaciones estéticas hasta complejas transformaciones de rendimiento, creando auténticas obras de arte sobre ruedas que dominan tanto las calles como los circuitos.</p>
            <p>Lo que diferencia al tuning japonés es su enfoque en el equilibrio: potencia manejable, estética funcional y un profundo respeto por la ingeniería original del vehículo.</p>
            
            <div class="stats">
              <div class="stat-item" v-for="stat in stats" :key="stat.id">
                <h4>{{ stat.value }}</h4>
                <p>{{ stat.label }}</p>
              </div>
            </div>
          </div>
          <div class="about-image">
            <!-- Reproductor de video local -->
            <div class="video-player-section">
              <div class="video-player-container">
                <video 
                  v-if="localVideoUrl"
                  ref="videoPlayer"
                  :src="localVideoUrl"
                  controls
                  class="jdm-video-player"
                  :poster="uploadedVideoInfo?.thumbnail || 'https://via.placeholder.com/400x300/2c3e50/ecf0f1?text=JDM+Tuning+Video'"
                  @timeupdate="updateVideoProgress"
                  @loadedmetadata="updateVideoDuration"
                  @play="isPlaying = true"
                  @pause="isPlaying = false"
                  @ended="isPlaying = false"
                >
                  Tu navegador no soporta el elemento de video.
                </video>
                <div v-else class="video-placeholder">
                  <div class="video-placeholder-content">
                    <span class="video-icon">🎬</span>
                    <p>Reproductor JDM Tuning</p>
                    <small>No hay videos para reproducir, en configadmin</small>
                  </div>
                </div>
              </div>
              
              <!-- Controles adicionales -->
              <div class="video-controls" v-if="localVideoUrl">
                <div class="control-buttons">
                  <button @click="togglePlayPause" class="video-control-btn">
                    {{ isPlaying ? '⏸️ Pausar' : '▶️ Reproducir' }}
                  </button>
                  <button @click="stopVideo" class="video-control-btn">
                    ⏹️ Detener
                  </button>
                  <button @click="toggleMute" class="video-control-btn">
                    {{ isMuted ? '🔇 Silenciado' : '🔊 Sonido' }}
                  </button>
                  <!-- Guardar/Eliminar deshabilitados en vista pública -->
                </div>
                <div class="track-controls" style="display:flex;gap:0.75rem;justify-content:center;margin-bottom:1rem;">
                  <label style="color:var(--accent);font-family:var(--secondary-font);">
                    Audio:
                    <select v-model.number="activeAudioIndex" @change="onAudioChange" style="margin-left:0.5rem;padding:0.25rem;border-radius:6px;">
                      <option :value="-1">Usar audio del video</option>
                      <option v-for="opt in availableAudioOptions" :key="opt.index" :value="opt.index">{{ opt.label }}</option>
                    </select>
                  </label>
                  <label style="color:var(--accent);font-family:var(--secondary-font);">
                    Subtítulos:
                    <select v-model.number="activeSubtitleIndex" @change="onSubtitleChange" style="margin-left:0.5rem;padding:0.25rem;border-radius:6px;">
                      <option :value="-1">Sin subtítulos</option>
                      <option v-for="opt in availableSubtitleOptions" :key="opt.index" :value="opt.index">{{ opt.label }}</option>
                    </select>
                  </label>
                </div>
                <div class="video-progress">
                  <input 
                    type="range" 
                    v-model="videoProgress"
                    min="0"
                    max="100"
                    step="0.1"
                    @input="seekVideo"
                    @change="seekVideo"
                    class="video-progress-bar"
                  >
                  <div class="video-time-display">
                    <span class="video-time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
                    <span class="video-volume">Volumen: {{ Math.round(volume * 100) }}%</span>
                  </div>
                  <div class="volume-control">
                    <span class="volume-icon">{{ isMuted ? '🔇' : '🔊' }}</span>
                    <input 
                      type="range" 
                      v-model="volume"
                      min="0"
                      max="1"
                      step="0.1"
                      @input="changeVolume"
                      class="volume-slider"
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Otras vistas -->
    <section v-if="activeView === 'home'" class="hero">
      <div class="hero-content">
        <h1>Bienvenido a JDM Tuning</h1>
        <p>El destino definitivo para los amantes del tuning japonés.</p>
      </div>
    </section>

    <section v-if="activeView === 'gallery'" class="section">
      <div class="container">
        <div class="section-title">
          <h2>Galería JDM</h2>
        </div>
        <div class="gallery-content">
          <CarouselPreview />
        </div>
      </div>
    </section>

    <section v-if="activeView === 'events'" class="section">
      <div class="container">
        <div class="section-title">
          <h2>Eventos JDM</h2>
          <p>Próximamente: Calendario de eventos, meetups y competencias de tuning.</p>
        </div>
      </div>
    </section>

    <section v-if="activeView === 'contact'" class="section">
      <div class="container">
        <div class="section-title">
          <h2>Contacto</h2>
          <p>Próximamente: Formulario de contacto y información de la comunidad.</p>
        </div>
      </div>
    </section>

    <!-- Secciones comunes -->
    <section v-if="activeView === 'about'" class="section features">
      <div class="container">
        <div class="section-title">
          <h2>Estilos de Tuning</h2>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="style in tuningStyles" :key="style.id">
            <div class="feature-icon">{{ style.icon }}</div>
            <h3>{{ style.name }}</h3>
            <p>{{ style.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="activeView === 'about'" class="section brands">
      <div class="container">
        <div class="section-title">
          <h2>Marcas Legendarias</h2>
        </div>
        <div class="brands-grid">
          <button class="brand-btn" @click="selectBrand('Nissan')">
            <span class="brand-name">Nissan</span>
          </button>
          <button class="brand-btn" @click="selectBrand('Toyota')">
            <span class="brand-name">Toyota</span>
          </button>
          <button class="brand-btn" @click="selectBrand('Honda')">
            <span class="brand-name">Honda</span>
          </button>
          <button class="brand-btn" @click="selectBrand('Mazda')">
            <span class="brand-name">Mazda</span>
          </button>
          <button class="brand-btn" @click="selectBrand('Subaru')">
            <span class="brand-name">Subaru</span>
          </button>
          <button class="brand-btn" @click="selectBrand('Mitsubishi')">
            <span class="brand-name">Mitsubishi</span>
          </button>
        </div>
      </div>
    </section>

    <section v-if="activeView === 'about'" class="section timeline-section">
      <div class="container">
        <div class="section-title">
          <h2>Evolución del Tuning JDM</h2>
        </div>
        <div class="timeline">
          <div class="timeline-item" v-for="era in timeline" :key="era.id">
            <div class="timeline-year">{{ era.year }}</div>
            <div class="timeline-content">
              <h3>{{ era.title }}</h3>
              <p>{{ era.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer>
      <div class="container">
        <div class="footer-content">
          <p>&copy; 2023 JDM Tuning Culture. Todos los derechos reservados.</p>
          <div class="social-links">
            <a href="#">FB</a>
            <a href="#">IG</a>
            <a href="#">YT</a>
            <a href="#">TW</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
  </div>
</template>

<script>
// Importar el componente Loader
import TangramLoader from './TangramLoader.vue';
// Importar el componente Admin
import ConfigAdmin from './assets/configadmin.vue';
// Importar el componente UserCV
import UserCV from './UserCV.vue';
// Preview carousel
import CarouselPreview from './CarouselPreviewFixed.vue';

export default {
  name: 'AboutJdmTuning',
  components: {
    TangramLoader,
    ConfigAdmin,
    UserCV,
    CarouselPreview
  },
  data() {
    return {
      isLoading: true,
      loaderText: 'Cargando JDM Tuning...',
      loaderDuration: 13000, // 3 segundos de loader
      mobileMenuOpen: false,
      showLoginModal: false,
      showRegisterModal: false,
      loginLoading: false,
      registerLoading: false,
      loginError: '',
      registerError: '',
      user: null,
      activeView: 'about',
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false
      },
      stats: [
        { id: 1, value: '40+', label: 'Años de Historia' },
        { id: 2, value: '1000+', label: 'Eventos Anuales' },
        { id: 3, value: '50K+', label: 'Enthusiasts' }
      ],
      tuningStyles: [
        {
          id: 1,
          name: "Bosozoku",
          icon: "⚡",
          description: "Estilo extremo con escapes largos, carrocerías muy bajas y modificaciones exageradas que desafían las convenciones."
        },
        {
          id: 2,
          name: "Kaido Racer",
          icon: "🏁",
          description: "Inspirado en los corredores de montaña, con alerones prominentes y un enfoque en el rendimiento en curvas."
        },
        {
          id: 3,
          name: "VIP Style",
          icon: "👑",
          description: "Lujo y elegancia aplicados a sedanes de alta gama, con llantas de gran tamaño y interiores personalizados."
        },
        {
          id: 4,
          name: "Shakotan",
          icon: "🔧",
          description: "Caracterizado por su altura extremadamente baja, llantas con mucho offset y un aspecto agresivo pero limpio."
        },
        {
          id: 5,
          name: "Time Attack",
          icon: "⏱️",
          description: "Enfocado puramente en el rendimiento en circuito, con aerodinámica funcional y reducción de peso."
        },
        {
          id: 6,
          name: "Drift Style",
          icon: "🌀",
          description: "Preparado específicamente para derrapes, con ángulos de dirección extremos y suspensiones especializadas."
        }
      ],
      timeline: [
        {
          id: 1,
          year: "1980s",
          title: "Nacimiento de la Cultura",
          description: "Surgimiento de las primeras comunidades de tuning inspiradas en las carreras callejeras y el Wangan Midnight."
        },
        {
          id: 2,
          year: "1990s",
          title: "La Era Dorada",
          description: "Popularización global gracias a películas como Fast and Furious y videojuegos como Gran Turismo."
        },
        {
          id: 3,
          year: "2000s",
          title: "Especialización",
          description: "Desarrollo de estilos específicos como Drift, Time Attack y la profesionalización de las modificaciones."
        },
        {
          id: 4,
          year: "2010s+",
          title: "Cultura Global",
          description: "El JDM se convierte en un fenómeno mundial con eventos internacionales y una comunidad online masiva."
        }
      ],
      // Datos para el reproductor de video
      localVideoUrl: null,
      videoUrlInput: '',
      uploadedVideoInfo: null,
      currentVideoObj: null,
      audioTracks: [],
      subtitleTracks: [],
      activeAudioIndex: -1,
      activeSubtitleIndex: -1,
      audioElements: [],
      isPlaying: false,
      isMuted: false,
      currentTime: 0,
      duration: 0,
      videoProgress: 0,
      volume: 1,
      savedVideos: [],
      currentVideoId: null
    }
  },
  computed: {
    allUsers() {
      return this.getStoredUsers();
    },
    totalUsers() {
      return this.allUsers.length;
    },
    adminUsers() {
      return this.allUsers.filter(user => user.isAdmin).length;
    },
    currentTangramColors() {
    return [
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--background').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--text').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--accent').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
      getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim()
    ];
  },
    availableAudioOptions() {
      const res = [];
      (this.audioTracks || []).forEach((t, i) => {
        if (t) res.push({ index: i, label: `Pista ${i + 1}` });
      });
      return res;
    },
    
    availableSubtitleOptions() {
      const res = [];
      (this.subtitleTracks || []).forEach((t, i) => {
        if (t) res.push({ index: i, label: `Sub ${i + 1}` });
      });
      return res;
    }
    
  },
  mounted() {
    setTimeout(() => {
      this.isLoading = false;
    }, this.loaderDuration);
    this.initializeSampleUsers();
    this.checkStoredAuth();
    this.loadGlobalStyles(); // Cargar estilos guardados al iniciar
    
    // Escuchar actualizaciones de videos desde el admin
    window.addEventListener('videos-updated', this.loadVideosFromAdmin);
    window.addEventListener('default-video-updated', this.applyDefaultVideo);
    // Cargar videos subidos desde el admin
    this.loadVideosFromAdmin();
    // Aplicar video por defecto (si existe)
    this.applyDefaultVideo();
    // Inicializar el reproductor de video
    this.initializeVideoPlayer();
  },
  watch: {
    localVideoUrl(newVal) {
      if (newVal) {
        // small delay to ensure DOM updated
        setTimeout(() => { try { this.setupTracks(); } catch(e){ console.error('setupTracks watcher error', e); } }, 250);
      }
    }
  },
  beforeUnmount() {
    window.removeEventListener('videos-updated', this.loadVideosFromAdmin);
    window.removeEventListener('default-video-updated', this.applyDefaultVideo);
    try {
      this.cleanupTracks();
    } catch (e) {}
  },
  methods: {
    setActiveView(view) {
      this.activeView = view;
      this.mobileMenuOpen = false;
    },
    
    // Métodos de autenticación
    getStoredUsers() {
      const users = localStorage.getItem('jdmUsers');
      return users ? JSON.parse(users) : [];
    },

    saveUser(userData) {
      const users = this.getStoredUsers();
      users.push(userData);
      localStorage.setItem('jdmUsers', JSON.stringify(users));
    },

    findUserByEmail(email) {
      const users = this.getStoredUsers();
      return users.find(user => user.email === email);
    },

    validateUser(email, password) {
      const user = this.findUserByEmail(email);
      if (!user) return null;
      
      if (user.password === password) {
        return user;
      }
      return null;
    },

    // Métodos de la UI
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    
    closeLoginModal() {
      this.showLoginModal = false;
      this.loginError = '';
      this.loginForm = { email: '', password: '' };
    },
    
    closeRegisterModal() {
      this.showRegisterModal = false;
      this.registerError = '';
      this.registerForm = { email: '', password: '', confirmPassword: '', isAdmin: false };
    },
    
    switchToRegister() {
      this.showLoginModal = false;
      this.showRegisterModal = true;
    },
    
    switchToLogin() {
      this.showRegisterModal = false;
      this.showLoginModal = true;
    },
    
    async handleLogin() {
      this.loginLoading = true;
      this.loginError = '';
      
      try {
        if (!this.loginForm.email || !this.loginForm.password) {
          throw new Error('Por favor completa todos los campos');
        }

        const validatedUser = this.validateUser(this.loginForm.email, this.loginForm.password);
        
        if (!validatedUser) {
          throw new Error('Email o contraseña incorrectos');
        }

        this.user = {
          email: validatedUser.email,
          isAdmin: validatedUser.isAdmin,
          id: validatedUser.id
        };
        
        localStorage.setItem('jdmCurrentUser', JSON.stringify(this.user));
        
        this.closeLoginModal();
        
        const userType = this.user.isAdmin ? 'Administrador' : 'Usuario';
        alert(`¡Bienvenido de nuevo! Has iniciado sesión como ${userType}.`);
        
      } catch (err) {
        this.loginError = err.message;
      } finally {
        this.loginLoading = false;
      }
    },
    
    async handleRegister() {
      this.registerLoading = true;
      this.registerError = '';
      
      try {
        if (!this.registerForm.email || !this.registerForm.password) {
          throw new Error('Por favor completa todos los campos');
        }

        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }
        
        if (this.registerForm.password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        const existingUser = this.findUserByEmail(this.registerForm.email);
        if (existingUser) {
          throw new Error('El email ya está registrado');
        }

        const newUser = {
          id: Date.now().toString(),
          email: this.registerForm.email,
          password: this.registerForm.password,
          isAdmin: this.registerForm.isAdmin,
          createdAt: new Date().toISOString()
        };

        this.saveUser(newUser);

        this.user = {
          email: newUser.email,
          isAdmin: newUser.isAdmin,
          id: newUser.id
        };
        
        localStorage.setItem('jdmCurrentUser', JSON.stringify(this.user));
        
        this.closeRegisterModal();
        
        const userType = this.user.isAdmin ? 'Administrador' : 'Usuario';
        alert(`¡Bienvenido! Te has registrado correctamente como ${userType}.`);
        
      } catch (err) {
        this.registerError = err.message;
      } finally {
        this.registerLoading = false;
      }
    },
    
    handleLogout() {
      this.user = null;
      localStorage.removeItem('jdmCurrentUser');
      this.mobileMenuOpen = false;
      this.setActiveView('about');
      alert('¡Hasta pronto! Has cerrado sesión correctamente.');
    },
    
    checkStoredAuth() {
      const storedUser = localStorage.getItem('jdmCurrentUser');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }
    },

    initializeSampleUsers() {
      const users = this.getStoredUsers();
      if (users.length === 0) {
        const sampleUsers = [
          {
            id: '1',
            email: 'admin@jdmtuning.com',
            password: 'admin123',
            isAdmin: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            email: 'user@jdmtuning.com',
            password: 'user123',
            isAdmin: false,
            createdAt: new Date().toISOString()
          }
        ];
        
        localStorage.setItem('jdmUsers', JSON.stringify(sampleUsers));
      }
    },
    
    selectBrand(brandName) {
      console.log(`Marca seleccionada: ${brandName}`);
      alert(`Has seleccionado: ${brandName}`);
    },

    // Método para cargar estilos globales
    loadGlobalStyles() {
      const saved = localStorage.getItem('jdmGlobalStyles');
      if (saved) {
        try {
          const { styles } = JSON.parse(saved);
          
          // Aplicar estilos al documento
          let styleElement = document.getElementById('jdm-global-styles');
          if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'jdm-global-styles';
            document.head.appendChild(styleElement);
          }
          
          let css = ':root {\n';
          Object.entries(styles).forEach(([key, value]) => {
            css += `  ${key}: ${value};\n`;
          });
          css += '}\n';
          
          styleElement.textContent = css;
          
        } catch (e) {
          console.error('Error al cargar estilos globales:', e);
        }
      }
    },

    // Métodos para el reproductor de video
    initializeVideoPlayer() {
      this.loadSavedVideosList();
      
      // Cargar el último video visto
      const lastVideo = localStorage.getItem('jdmLastVideo');
      if (lastVideo) {
        try {
          const videoData = JSON.parse(lastVideo);
          if (videoData.type === 'local' && videoData.dataUrl) {
            this.localVideoUrl = videoData.dataUrl;
            this.uploadedVideoInfo = {
              name: videoData.name || 'Video guardado',
              size: videoData.size || 0,
              lastLoaded: new Date().toISOString()
            };
            this.currentVideoId = videoData.id;
            
            // Cargar después de que el DOM se actualice
            this.$nextTick(() => {
              const videoElement = this.$refs.videoPlayer;
              if (videoElement) {
                videoElement.volume = this.volume;
              }
            });
          } else if (videoData.type === 'url') {
            this.localVideoUrl = videoData.url;
            this.uploadedVideoInfo = {
              name: videoData.name || 'Video desde URL',
              lastLoaded: new Date().toISOString()
            };
          }
        } catch (e) {
          console.error('Error al cargar el último video:', e);
        }
      }
    },

    handleVideoUpload(event) {
      // Subida desde la vista pública deshabilitada — usar panel admin
      alert('La subida de videos solo está permitida desde el Panel de Administración (Admin → Gestión de Videos).');
      // Si existe un input, limpiarlo
      try { if (event && event.target) event.target.value = ''; } catch(e) {}
    },

    loadVideoFromUrl() {
      // Carga por URL deshabilitada en la vista pública
      alert('La carga de videos por URL solo está permitida desde el Panel de Administración (Admin → Gestión de Videos).');
      this.videoUrlInput = '';
    },

    togglePlayPause() {
      const videoElement = this.$refs.videoPlayer;
      if (!videoElement) return;
      
      if (videoElement.paused) {
        videoElement.play();
        this.isPlaying = true;
      } else {
        videoElement.pause();
        this.isPlaying = false;
      }
    },

    stopVideo() {
      const videoElement = this.$refs.videoPlayer;
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
        this.isPlaying = false;
        this.currentTime = 0;
        this.videoProgress = 0;
      }
    },

    toggleMute() {
      const videoElement = this.$refs.videoPlayer;
      if (videoElement) {
        videoElement.muted = !videoElement.muted;
        this.isMuted = videoElement.muted;
      }
    },

    changeVolume() {
      const videoElement = this.$refs.videoPlayer;
      if (videoElement) {
        videoElement.volume = this.volume;
        this.isMuted = this.volume === 0;
      }
    },

    updateVideoProgress() {
      const videoElement = this.$refs.videoPlayer;
      if (videoElement) {
        this.currentTime = videoElement.currentTime;
        this.duration = videoElement.duration;
        
        if (this.duration > 0) {
          this.videoProgress = (this.currentTime / this.duration) * 100;
        }
      }
    },

    updateVideoDuration() {
      const videoElement = this.$refs.videoPlayer;
      if (videoElement) {
        this.duration = videoElement.duration;
      }
    },

    seekVideo() {
      const videoElement = this.$refs.videoPlayer;
      if (videoElement && this.duration > 0) {
        const seekTime = (this.duration * this.videoProgress) / 100;
        videoElement.currentTime = seekTime;
      }
    },

    // --- Audio/Subtitles support ---
    setupTracks() {
      console.debug('setupTracks called', 'audioTracks.len=', (this.audioTracks||[]).length, 'subtitleTracks.len=', (this.subtitleTracks||[]).length);
      this.cleanupTracks();
      const videoElement = this.$refs.videoPlayer;
      if (!videoElement) return;

      // Add subtitle <track> elements
      try {
        // remove any existing track elements
        const existing = videoElement.querySelectorAll('track');
        existing.forEach(t => t.remove());

        (this.subtitleTracks || []).forEach((subSrc, idx) => {
          if (!subSrc) return;
          const track = document.createElement('track');
          track.kind = 'subtitles';
          track.label = `Sub ${idx + 1}`;
          track.srclang = 'es';
          const real = this.getBlobUrlIfNeeded(subSrc);
          track.src = real;
          if (real !== subSrc) this._createdObjectUrls.push(real);
          track.default = false;
          track.mode = 'disabled';
          videoElement.appendChild(track);
          track.addEventListener && track.addEventListener('load', () => {
            console.debug('track loaded', idx, track.src);
          });
        });
      } catch (e) {
        console.error('Error al configurar subtítulos:', e);
      }
      // Force the browser to load newly appended tracks and poll for textTracks
      try {
        videoElement.load();
        const maxRetries = 15;
        let attempts = 0;
        const poll = () => {
          const tt = videoElement.textTracks || [];
          if (tt && tt.length > 0) {
            console.debug('textTracks populated, count=', tt.length);
            for (let i = 0; i < tt.length; i++) {
              try { tt[i].mode = 'disabled'; } catch(e) {}
            }
            return;
          }
          attempts++;
          if (attempts < maxRetries) {
            setTimeout(poll, 200);
          } else {
            console.warn('textTracks did not populate after polling');
          }
        };
        setTimeout(poll, 200);
      } catch (e) {
        console.warn('Unable to reload video for tracks:', e);
      }

      // Setup audio elements for external audio tracks
      try {
        this.audioElements = (this.audioTracks || []).map(src => {
          if (!src) return null;
          const realSrc = this.getBlobUrlIfNeeded(src);
          if (realSrc !== src) this._createdObjectUrls.push(realSrc);
          const a = new Audio(realSrc);
          a.preload = 'auto';
          a.crossOrigin = 'anonymous';
          a.addEventListener && a.addEventListener('canplaythrough', () => { console.debug('audio canplaythrough', realSrc); });
          a.addEventListener && a.addEventListener('error', (ev) => { console.error('audio element error', realSrc, ev); });
          return a;
        });
        console.debug('audioElements created count=', (this.audioElements||[]).filter(Boolean).length);
        console.debug('createdObjectUrls=', this._createdObjectUrls);
      } catch (e) {
        console.error('Error al crear pistas de audio:', e);
        this.audioElements = [];
      }

      // Sync handlers
      const onPlay = () => {
        console.debug('video play event, activeAudioIndex=', this.activeAudioIndex);
        if (this.activeAudioIndex !== -1 && this.audioElements[this.activeAudioIndex]) {
          const a = this.audioElements[this.activeAudioIndex];
          try { a.currentTime = videoElement.currentTime; } catch(e){}
          if (videoElement.paused === false) {
            a.play().then(() => {
              console.debug('external audio playing');
              videoElement.muted = true;
              this.isMuted = true;
            }).catch(err => {
              console.error('external audio play failed', err);
              // fallback: unmute video
              videoElement.muted = false;
              this.isMuted = false;
            });
          }
        }
      };

      const onPause = () => {
        console.debug('video pause event');
        if (this.activeAudioIndex !== -1 && this.audioElements[this.activeAudioIndex]) {
          const a = this.audioElements[this.activeAudioIndex];
          a.pause();
        }
      };

      const onSeeked = () => {
        if (this.activeAudioIndex !== -1 && this.audioElements[this.activeAudioIndex]) {
          const a = this.audioElements[this.activeAudioIndex];
          try { a.currentTime = videoElement.currentTime; } catch(e){}
        }
      };

      const onTime = () => {
        const idx = this.activeAudioIndex;
        if (idx !== -1 && this.audioElements[idx]) {
          const a = this.audioElements[idx];
          const diff = Math.abs((a.currentTime || 0) - (videoElement.currentTime || 0));
          if (diff > 0.3) {
            try { a.currentTime = videoElement.currentTime; } catch(e){}
          }
        }
      };

      const onEnded = () => {
        console.debug('video ended event');
        if (this.activeAudioIndex !== -1 && this.audioElements[this.activeAudioIndex]) {
          try { this.audioElements[this.activeAudioIndex].pause(); } catch(e){}
        }
        this.isPlaying = false;
      };

      // Store handlers to remove later
      this._videoSyncHandlers = { onPlay, onPause, onSeeked, onTime };
      videoElement.addEventListener('play', onPlay);
      videoElement.addEventListener('pause', onPause);
      videoElement.addEventListener('seeked', onSeeked);
      videoElement.addEventListener('timeupdate', onTime);
      videoElement.addEventListener('ended', onEnded);
      // include ended handler in stored handlers for cleanup
      this._videoSyncHandlers.onEnded = onEnded;
    },

    cleanupTracks() {
      const videoElement = this.$refs.videoPlayer;
      if (videoElement && this._videoSyncHandlers) {
        try {
          videoElement.removeEventListener('play', this._videoSyncHandlers.onPlay);
          videoElement.removeEventListener('pause', this._videoSyncHandlers.onPause);
          videoElement.removeEventListener('seeked', this._videoSyncHandlers.onSeeked);
          videoElement.removeEventListener('timeupdate', this._videoSyncHandlers.onTime);
          if (this._videoSyncHandlers.onEnded) videoElement.removeEventListener('ended', this._videoSyncHandlers.onEnded);
        } catch (e) {}
        this._videoSyncHandlers = null;
      }

      (this.audioElements || []).forEach(a => {
        try { a.pause(); a.src = ''; } catch(e){}
      });
      this.audioElements = [];
      // remove track elements
      if (videoElement) {
        const existing = videoElement.querySelectorAll('track');
        existing.forEach(t => t.remove());
      }
      // revoke any created object URLs
      if (this._createdObjectUrls && this._createdObjectUrls.length) {
        this._createdObjectUrls.forEach(u => { try { URL.revokeObjectURL(u); } catch(e){} });
      }
      this._createdObjectUrls = [];
    },

    onAudioChange() {
      console.debug('onAudioChange ->', this.activeAudioIndex);
      this.changeAudioTrack(this.activeAudioIndex);
    },

    onSubtitleChange() {
      console.debug('onSubtitleChange ->', this.activeSubtitleIndex);
      this.changeSubtitleTrack(this.activeSubtitleIndex);
    },

    changeAudioTrack(index) {
      console.debug('changeAudioTrack requested', index, 'audioTracks length', (this.audioTracks||[]).length);
      const videoElement = this.$refs.videoPlayer;
      // stop previous
      (this.audioElements || []).forEach((a, idx) => {
        if (!a) return;
        try { if (idx !== index) a.pause(); } catch(e){}
      });

      if (index === -1) {
        // use video's internal audio
        if (videoElement) { videoElement.muted = false; this.isMuted = false; }
        this.activeAudioIndex = -1;
        return;
      }

      const chosen = this.audioElements[index];
      if (!chosen) { console.warn('chosen audio element not found for index', index); return; }
      this.activeAudioIndex = index;
      if (videoElement) {
        try { chosen.currentTime = videoElement.currentTime; } catch(e){}
        chosen.play().then(() => {
          console.debug('chosen audio playing');
          try { videoElement.muted = true; this.isMuted = true; } catch(e){}
        }).catch(err => {
          console.error('chosen audio play error', err);
          // fallback
          try { videoElement.muted = false; this.isMuted = false; } catch(e){}
        });
      }
    },

    changeSubtitleTrack(index) {
      const videoElement = this.$refs.videoPlayer;
      if (!videoElement) return;
      const applyMode = () => {
        const textTracks = videoElement.textTracks || [];
        if (!textTracks || textTracks.length === 0) return false;
        for (let i = 0; i < textTracks.length; i++) {
          try {
            textTracks[i].mode = (i === index) ? 'showing' : 'disabled';
          } catch (e) {}
        }
        console.debug('applyMode set textTracks modes, count=', textTracks.length, 'active=', index);
        return true;
      };

      // try immediate, otherwise retry shortly after load
      if (!applyMode()) {
        console.debug('textTracks empty, will retry shortly');
        setTimeout(() => { const ok = applyMode(); console.debug('retry applyMode ok=', ok); }, 300);
      }
      this.activeSubtitleIndex = index;
    },

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
        if (isBase64) {
          byteString = atob(data);
        } else {
          byteString = decodeURIComponent(data);
        }
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
        const blob = new Blob([ia], { type: mime });
        const url = URL.createObjectURL(blob);
        return url;
      } catch (e) {
        console.error('getBlobUrlIfNeeded failed', e);
        return src;
      }
    },

    formatTime(seconds) {
      if (isNaN(seconds)) return '00:00';
      
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    removeVideo() {
      this.localVideoUrl = null;
      this.uploadedVideoInfo = null;
      this.isPlaying = false;
      this.currentTime = 0;
      this.duration = 0;
      this.videoProgress = 0;
      this.currentVideoId = null;
      
      // Remover del localStorage
      localStorage.removeItem('jdmLastVideo');
    },

    saveCurrentVideo() {
      // Guardado desde la vista pública está deshabilitado. Usar ConfigAdmin.
      alert('Guardar videos está deshabilitado en la vista pública. Usa Admin → Gestión de Videos.');
    },

    saveVideoToLocalStorage(videoData) {
      localStorage.setItem('jdmLastVideo', JSON.stringify(videoData));
      this.currentVideoId = videoData.id;
    },

    saveVideoToList(videoData) {
      // Cargar lista existente
      this.loadSavedVideosList();
      
      // Evitar duplicados
      const existingIndex = this.savedVideos.findIndex(v => v.id === videoData.id);
      if (existingIndex !== -1) {
        this.savedVideos[existingIndex] = videoData;
      } else {
        this.savedVideos.unshift(videoData);
      }
      
      // Guardar lista actualizada
      localStorage.setItem('jdmSavedVideos', JSON.stringify(this.savedVideos));
      
      // Limitar a 10 videos
      if (this.savedVideos.length > 10) {
        this.savedVideos = this.savedVideos.slice(0, 10);
        localStorage.setItem('jdmSavedVideos', JSON.stringify(this.savedVideos));
      }
    },

    loadSavedVideosList() {
      const saved = localStorage.getItem('jdmSavedVideos');
      if (saved) {
        try {
          this.savedVideos = JSON.parse(saved);
        } catch (e) {
          console.error('Error al cargar videos guardados:', e);
          this.savedVideos = [];
        }
      }
    },

    applyDefaultVideo() {
      const defId = localStorage.getItem('jdmDefaultVideoId');
      if (!defId) return;
      const all = localStorage.getItem('jdmTuningVideos');
      if (!all) return;
      try {
        const videos = JSON.parse(all);
        const found = videos.find(v => v.id === defId);
        if (found) {
          // Preferir videoUrl/dataUrl/url
          const url = found.videoUrl || found.url || found.dataUrl || null;
          if (url) {
            this.currentVideoObj = found;
            console.debug('applyDefaultVideo loaded video', found.id, 'audioTracks', (found.audioTracks||[]).length, 'subtitles', (found.subtitles||[]).length);
            this.localVideoUrl = url;
            this.uploadedVideoInfo = { name: found.title || found.name || 'Video predeterminado', size: found.size || 0, lastLoaded: new Date().toISOString() };
            this.currentVideoId = found.id;
            this.audioTracks = found.audioTracks || [];
            this.subtitleTracks = found.subtitles || [];
            this.activeAudioIndex = -1;
            this.activeSubtitleIndex = -1;
            this.$nextTick(() => {
              const videoElement = this.$refs.videoPlayer;
              if (videoElement) videoElement.volume = this.volume;
              this.setupTracks();
            });
          }
        }
      } catch (e) {
        console.error('Error al aplicar video por defecto:', e);
      }
    },

    loadVideosFromAdmin() {
      // Cargar videos subidos desde el panel de admin (configadmin.vue)
      const saved = localStorage.getItem('jdmTuningVideos');
      if (saved) {
        try {
          const videos = JSON.parse(saved);
          // Mantener la misma estructura local usada por about.vue
          this.savedVideos = videos.map(v => ({
            id: v.id,
            name: v.title || v.name || 'Video',
            type: v.type || (v.videoUrl ? 'local' : 'url'),
            url: v.url || v.videoUrl || v.dataUrl || null,
            size: v.size || 0,
            timestamp: v.uploadDate || v.timestamp || new Date().toISOString()
          }));
        } catch (e) {
          console.error('Error al cargar videos desde admin:', e);
          this.savedVideos = [];
        }
      } else {
        // Si no hay videos desde admin, no modificar lista local existente
        // pero aseguramos que savedVideos esté inicializado
        this.savedVideos = this.savedVideos || [];
      }
    },

    loadSavedVideoItem(video) {
      // Buscar objeto completo en jdmTuningVideos (guardado por admin)
      const all = localStorage.getItem('jdmTuningVideos');
      let foundFull = null;
      if (all) {
        try {
          const vids = JSON.parse(all);
          foundFull = vids.find(v => v.id === video.id) || null;
        } catch (e) {
          console.error('Error al buscar video completo:', e);
        }
      }

      if (foundFull) {
        const url = foundFull.videoUrl || foundFull.url || foundFull.dataUrl || null;
        if (url) {
          this.currentVideoObj = foundFull;
          this.localVideoUrl = url;
          this.uploadedVideoInfo = { name: foundFull.title || foundFull.name || video.name, size: foundFull.size || 0, lastLoaded: new Date().toISOString() };
          this.audioTracks = foundFull.audioTracks || [];
          this.subtitleTracks = foundFull.subtitles || [];
          this.activeAudioIndex = -1;
          this.activeSubtitleIndex = -1;
          this.currentVideoId = foundFull.id;
          localStorage.setItem('jdmLastVideo', JSON.stringify(foundFull));
          this.$nextTick(() => {
            const videoElement = this.$refs.videoPlayer;
            if (videoElement) videoElement.volume = this.volume;
            this.setupTracks();
          });
          return;
        }
      }

      // Fallback si no está en jdmTuningVideos
      if (video.type === 'local' && video.dataUrl) {
        this.localVideoUrl = video.dataUrl;
        this.uploadedVideoInfo = { name: video.name, size: video.size || 0, lastLoaded: new Date().toISOString() };
      } else if (video.type === 'url' && video.url) {
        this.localVideoUrl = video.url;
        this.uploadedVideoInfo = { name: video.name, lastLoaded: new Date().toISOString() };
      }

      this.currentVideoId = video.id;
      localStorage.setItem('jdmLastVideo', JSON.stringify(video));

      this.$nextTick(() => {
        const videoElement = this.$refs.videoPlayer;
        if (videoElement) {
          videoElement.volume = this.volume;
        }
      });
    },

    deleteSavedVideo(videoId) {
      // Eliminación desde la vista pública está deshabilitada. Usar ConfigAdmin.
      alert('Eliminar videos está deshabilitado en la vista pública. Usa Admin → Gestión de Videos.');
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
    }

    ,availableAudioOptions() {
      const res = [];
      (this.audioTracks || []).forEach((t, i) => {
        if (t) res.push({ index: i, label: `Pista ${i + 1}` });
      });
      return res;
    },

    availableSubtitleOptions() {
      const res = [];
      (this.subtitleTracks || []).forEach((t, i) => {
        if (t) res.push({ index: i, label: `Sub ${i + 1}` });
      });
      return res;
    }
  }
}
</script>

<style scoped>
#app {
  position: relative;
}

.content-enter-active {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:root {
  --primary: #2c3e50;
  --secondary: #e74c3c;
  --background: #ecf0f1;
  --text: #2c3e50;
  --accent: #ffffff;
  --paragraph-size: 16px;
  --title-size: 24px;
  --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  --secondary-font: Arial, sans-serif;
  --border-radius: 8px;
  --shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* HEADER - Texto con Color 4 */
header {
  background-color: var(--primary);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--text);
  text-decoration: none;
  font-family: var(--font-family);
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  font-family: var(--font-family);
  font-size: var(--paragraph-size);
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--secondary);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text);
  font-size: 1.5rem;
  cursor: pointer;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  background-color: var(--primary);
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 99;
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.mobile-menu.active {
  transform: translateY(0);
  opacity: 1;
}

.mobile-menu a {
  color: var(--text);
  text-decoration: none;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s;
  font-family: var(--font-family);
}

.mobile-menu a:hover,
.mobile-menu a.active {
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--secondary);
}

/* Panel de usuario - Texto con Color 4 */
.user-panel {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 2rem;
}

.user-greeting {
  color: var(--text);
  font-size: 0.9rem;
  font-family: var(--secondary-font);
}

.admin-badge {
  background: var(--secondary);
  color: var(--accent);
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 0.5rem;
}

.logout-btn {
  background: transparent;
  border: 1px solid var(--text);
  color: var(--text);
  padding: 0.4rem 0.8rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s;
  font-family: var(--secondary-font);
}

.logout-btn:hover {
  background: var(--text);
  color: var(--primary);
}

.auth-buttons {
  display: flex;
  gap: 0.5rem;
  margin-left: 2rem;
}

.login-btn,
.register-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s;
  font-family: var(--font-family);
}

.login-btn {
  background: transparent;
  border: 1px solid var(--text);
  color: var(--text);
}

.login-btn:hover {
  background: var(--text);
  color: var(--primary);
}

.register-btn {
  background: var(--secondary);
  color: var(--accent);
}

.register-btn:hover {
  background: var(--primary);
  color: var(--accent);
}

/* Estilos para móvil */
.mobile-user-panel {
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.mobile-user-panel .user-info {
  color: var(--text);
  margin-bottom: 0.5rem;
  font-family: var(--secondary-font);
}

.mobile-user-panel .logout-btn {
  width: 100%;
  text-align: center;
}

.mobile-auth-buttons {
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-auth-buttons .login-btn,
.mobile-auth-buttons .register-btn {
  width: 100%;
  text-align: center;
  padding: 0.75rem;
}

/* Estilos para los modales de login */
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-content {
  background: var(--accent);
  padding: 2rem;
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: var(--shadow);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--secondary);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text);
  font-family: var(--font-family);
  font-size: var(--title-size);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text);
  font-weight: 500;
  font-family: var(--secondary-font);
  font-size: var(--paragraph-size);
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--accent);
  border-radius: var(--border-radius);
  background: var(--accent);
  color: var(--text);
  font-size: var(--paragraph-size);
  font-family: var(--secondary-font);
  transition: border-color 0.3s;
}

input[type="email"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: var(--secondary);
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary);
  color: var(--accent);
  border: none;
  border-radius: var(--border-radius);
  font-size: var(--paragraph-size);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
  font-family: var(--font-family);
}

.submit-btn:hover:not(:disabled) {
  background: var(--secondary);
}

.submit-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.switch-mode {
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--accent);
}

.switch-mode p {
  color: var(--text);
  font-family: var(--secondary-font);
  font-size: var(--paragraph-size);
}

.switch-mode a {
  color: var(--secondary);
  text-decoration: none;
  font-weight: 600;
}

.switch-mode a:hover {
  text-decoration: underline;
}

.error-message {
  background: #ff4444;
  color: white;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  font-family: var(--secondary-font);
}

/* Estilos para el reproductor de video */
.video-player-section {
  width: 100%;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  background: var(--accent);
}

.video-player-container {
  position: relative;
  width: 100%;
  background: var(--background);
}

.jdm-video-player {
  width: 100%;
  height: 300px;
  display: block;
  background: #000;
}

.video-placeholder {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--background) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--primary);
}

.video-placeholder-content {
  text-align: center;
  color: var(--text);
  padding: 2rem;
  max-width: 90%;
}

.video-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  color: var(--secondary);
}

.video-placeholder-content p {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-family: var(--font-family);
}

.video-placeholder-content small {
  opacity: 0.8;
  font-family: var(--secondary-font);
  display: block;
  margin-bottom: 1.5rem;
}

.video-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.video-upload-btn {
  background: var(--secondary);
  color: var(--accent);
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  font-family: var(--font-family);
  text-align: center;
  border: none;
}

.video-upload-btn:hover {
  background: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.url-upload-section {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.video-url-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid var(--primary);
  border-radius: var(--border-radius);
  background: var(--accent);
  color: var(--text);
  font-family: var(--secondary-font);
}

.url-load-btn {
  background: var(--primary);
  color: var(--accent);
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  font-family: var(--font-family);
}

.url-load-btn:hover {
  background: var(--secondary);
  transform: translateY(-2px);
}

.video-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(0,0,0,0.05);
  border-radius: var(--border-radius);
  text-align: left;
}

.video-info small {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
  color: var(--text);
  opacity: 0.9;
}

.saved-videos {
  margin-top: 1.5rem;
  text-align: left;
}

.saved-videos-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--primary);
  font-family: var(--font-family);
}

.saved-videos-list {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--border-radius);
  padding: 0.5rem;
}

.saved-video-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  background: var(--accent);
  border-radius: calc(var(--border-radius) - 2px);
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid var(--secondary);
}

.saved-video-item:hover {
  background: var(--background);
  transform: translateX(5px);
}

.saved-video-icon {
  font-size: 1.2rem;
}

.saved-video-name {
  flex: 1;
  font-weight: 500;
  color: var(--text);
  font-family: var(--secondary-font);
  font-size: 0.9rem;
}

.saved-video-date {
  font-size: 0.75rem;
  color: var(--text);
  opacity: 0.7;
  font-family: var(--secondary-font);
}

.delete-video-btn {
  background: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 3px;
  transition: all 0.3s;
}

.delete-video-btn:hover {
  background: #e74c3c;
  color: white;
}

.video-controls {
  background: var(--primary);
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.control-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.video-control-btn {
  background: var(--accent);
  color: var(--text);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  font-family: var(--font-family);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.video-control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

.video-control-btn.save-btn {
  background: #27ae60;
  color: white;
}

.video-control-btn.remove-btn {
  background: #e74c3c;
  color: white;
}

.video-progress {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.video-progress-bar {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255,255,255,0.1);
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
}

.video-progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--secondary);
  cursor: pointer;
  border: 2px solid white;
}

.video-time-display {
  display: flex;
  justify-content: space-between;
  color: var(--accent);
  font-family: var(--secondary-font);
  font-size: 0.9rem;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volume-icon {
  color: var(--accent);
  font-size: 1rem;
}

.volume-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255,255,255,0.1);
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent);
  cursor: pointer;
}

/* HERO SECTION */
.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url('https://www.vividracing.com/blog/wp-content/uploads/2000-nissan-skyline-r34-gt-r-by-kaizo-industries-driven-by-paul-walker-in-fast-and-furious-bonham-s-auction-1536x864-1.jpg');
  background-size: cover;
  background-position: center;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
}

.hero-content h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  color: var(--accent);
  font-family: var(--font-family);
  font-size: calc(var(--title-size) * 1.5);
}

.hero-content p {
  color: var(--accent);
  font-family: var(--secondary-font);
  font-size: var(--paragraph-size);
}

/* ABOUT CONTENT */
.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.about-text h3 {
  color: var(--secondary);
  font-family: var(--font-family);
  font-size: calc(var(--title-size) * 1.2);
}

.about-text p {
  color: var(--text);
  font-family: var(--secondary-font);
  font-size: var(--paragraph-size);
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* STATS SECTION - Fondo con Color 3, Tarjetas con Color 5 */
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background-color: var(--accent);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.stat-item h4 {
  color: var(--secondary);
  font-family: var(--font-family);
  font-size: calc(var(--title-size) * 1.1);
  margin-bottom: 0.5rem;
}

.stat-item p {
  color: var(--text);
  font-family: var(--secondary-font);
  font-size: calc(var(--paragraph-size) * 0.9);
}

/* FEATURES SECTION - Fondo con Color 5, Tarjetas con Color 3 */
.features {
  background-color: var(--accent);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: var(--background);
  padding: 2rem;
  border-radius: var(--border-radius);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  border-left: 4px solid var(--primary);
  box-shadow: var(--shadow);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.feature-card h3 {
  color: var(--primary);
  font-family: var(--font-family);
  font-size: calc(var(--title-size) * 0.9);
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--text);
  font-family: var(--secondary-font);
  font-size: var(--paragraph-size);
  line-height: 1.6;
}

/* BRANDS SECTION - Fondo con Color 3, Botones con Color 5 */
.brands-section {
  background-color: var(--background);
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.brand-btn {
  background-color: var(--accent);
  border: 2px solid var(--primary);
  border-radius: var(--border-radius);
  color: var(--text);
  cursor: pointer;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 1.5rem 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  box-shadow: var(--shadow);
  font-family: var(--font-family);
}

.brand-btn:hover {
  transform: translateY(-5px);
  background-color: var(--primary);
  color: var(--accent);
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}

.brand-btn:active {
  transform: translateY(-2px);
}

/* TIMELINE SECTION - Fondo con Color 5, Tarjetas con Color 3 */
.timeline-section {
  background-color: var(--accent);
}

.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline:before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: var(--primary);
  transform: translateX(-50%);
}

.timeline-item {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
}

.timeline-item:nth-child(odd) {
  flex-direction: row-reverse;
}

.timeline-year {
  background-color: var(--primary);
  color: var(--accent);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  min-width: 100px;
  text-align: center;
  z-index: 1;
  font-family: var(--font-family);
}

.timeline-content {
  background-color: var(--background);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  margin: 0 2rem;
  flex: 1;
  box-shadow: var(--shadow);
}

.timeline-content h3 {
  color: var(--secondary);
  font-family: var(--font-family);
  font-size: calc(var(--title-size) * 0.9);
}

.timeline-content p {
  color: var(--text);
  font-family: var(--secondary-font);
  font-size: var(--paragraph-size);
  line-height: 1.6;
}

/* FOOTER - Fondo con Color 1, Texto con Color 4 */
footer {
  background-color: var(--primary);
  padding: 3rem 0;
  text-align: center;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.footer-content p {
  color: var(--text);
  font-family: var(--secondary-font);
  font-size: var(--paragraph-size);
}

.social-links {
  display: flex;
  gap: 1.5rem;
}

.social-links a {
  color: var(--text);
  font-size: 1.5rem;
  transition: color 0.3s;
  font-family: var(--secondary-font);
}

.social-links a:hover {
  color: var(--secondary);
}

.admin-nav-link {
  color: var(--secondary) !important;
  font-weight: bold;
  border: 1px solid var(--secondary);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  margin-left: 1rem;
}

.admin-nav-link:hover {
  background-color: var(--secondary);
  color: var(--primary) !important;
}

/* Enlace al creador de CV */
.cv-nav-link {
  color: var(--text) !important;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid var(--secondary);
  border-radius: var(--border-radius);
  margin-left: 1rem;
  transition: all 0.3s;
  font-family: var(--font-family);
}

.cv-nav-link:hover,
.cv-nav-link.active {
  background-color: var(--secondary);
  color: var(--primary) !important;
}

/* En móvil */
.mobile-user-panel .cv-nav-link {
  display: block;
  margin: 0.5rem 0;
  text-align: center;
}

/* Secciones comunes */
.section {
  padding: 4rem 0;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title h2 {
  color: var(--primary);
  font-family: var(--font-family);
  font-size: calc(var(--title-size) * 1.3);
  margin-bottom: 1rem;
}

.section-title p {
  color: var(--text);
  font-family: var(--secondary-font);
  font-size: var(--paragraph-size);
}

/* Títulos adaptativos para secciones con fondo oscuro */
.brands-section .section-title h2,
.brands-section .section-title p {
  color: var(--text);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .mobile-menu {
    display: flex;
  }
  
  .about-content {
    grid-template-columns: 1fr;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
  
  .timeline:before {
    left: 30px;
  }
  
  .timeline-item {
    flex-direction: row !important;
    align-items: flex-start;
  }
  
  .timeline-year {
    min-width: 80px;
    margin-right: 1rem;
  }
  
  .timeline-content {
    margin: 0;
    margin-left: 1rem;
  }
  
  .brands-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }
  
  .brand-btn {
    padding: 1.2rem 0.8rem;
    font-size: 1rem;
    min-height: 70px;
    border-radius: 10px;
  }
  
  .user-panel,
  .auth-buttons {
    display: none;
  }
  
  .login-content {
    margin: 1rem;
    padding: 1.5rem;
  }

  .hero-content h1 {
    font-size: calc(var(--title-size) * 1.2);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .section {
    padding: 2rem 0;
  }

  /* Responsive para reproductor de video */
  .jdm-video-player,
  .video-placeholder {
    height: 250px;
  }
  
  .control-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .video-control-btn {
    justify-content: center;
  }
  
  .url-upload-section {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .brands-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
  
  .brand-btn {
    padding: 1rem 0.5rem;
    font-size: 0.9rem;
    min-height: 60px;
    border-radius: 8px;
  }
  
  .stats {
    gap: 1rem;
  }

  .stat-item {
    padding: 1rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .mobile-menu a {
    padding: 0.75rem 1.5rem;
  }

  /* Responsive para reproductor de video */
  .jdm-video-player,
  .video-placeholder {
    height: 200px;
  }
  
  .video-placeholder-content {
    padding: 1rem;
  }
  
  .video-icon {
    font-size: 2rem;
  }
  
  .video-placeholder-content p {
    font-size: 1rem;
  }
}

@media (min-width: 769px) {
  .mobile-user-panel,
  .mobile-auth-buttons {
    display: none;
  }
}

/* Utilidades */
.mt-4 {
  margin-top: 1.5rem;
}

.text-center {
  text-align: center;
}

/* Ajustes de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .feature-card,
  .brand-btn,
  .timeline-item {
    transition: none;
  }
}

/* Alto contraste */
@media (prefers-contrast: high) {
  .feature-card,
  .stat-item,
  .timeline-content {
    border: 2px solid var(--primary);
  }
  
  .brand-btn {
    border-width: 3px;
  }
}
</style>