<template>
  <div id="app">
    <header>
      <div class="container">
        <nav>
          <a href="#" class="logo">JDM TUNING</a>
          <div class="nav-links">
            <a href="#">Inicio</a>
            <a href="#" class="active">Acerca de</a>
            <a href="#">Galería</a>
            <a href="#">Eventos</a>
            <a href="#">Contacto</a>
          </div>
          <button class="mobile-menu-btn" @click="toggleMobileMenu">
            ☰
          </button>
        </nav>
      </div>
    </header>

    <!-- Menú móvil -->
    <div class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
      <a href="#">Inicio</a>
      <a href="#" class="active">Acerca de</a>
      <a href="#">Galería</a>
      <a href="#">Eventos</a>
      <a href="#">Contacto</a>
    </div>

    <section class="hero">
      <div class="hero-content">
        <h1>Cultura JDM Tuning</h1>
        <p>Explora el fascinante mundo del tuning japonés, donde la ingeniería se encuentra con el arte y la pasión por los automóviles.</p>
      </div>
    </section>

    <section class="section">
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
            <img src="data:image/jpeg;base64,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" alt="Colección de coches JDM tuning incluyendo Nissan Skyline, Toyota Supra y Mazda RX-7">
          </div>
        </div>
      </div>
    </section>

    <section class="section features">
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

    <section class="section brands">
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

    <section class="section timeline-section">
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
</template>

<script>
export default {
  name: 'AboutJdmTuning',
  data() {
    return {
      mobileMenuOpen: false,
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
      ]
    }
  },
  methods: {
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    selectBrand(brandName) {
      console.log(`Marca seleccionada: ${brandName}`);
      alert(`Has seleccionado: ${brandName}`);
    }
  }
}
</script>

<style scoped>
/* Estilos específicos del componente About */
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
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  color: var(--highlight);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  color: white;
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
  color: white;
  text-decoration: none;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s;
}

.mobile-menu a:hover,
.mobile-menu a.active {
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--highlight);
}

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
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.about-text h3 {
  color: var(--highlight);
}

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
  border-radius: 8px;
}

.stat-item h4 {
  color: var(--highlight);
}

.about-image img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.about-image img:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
}

.features {
  background-color: var(--accent);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background-color: var(--secondary);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  border-left: 4px solid var(--primary);
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

/* Estilos para los botones rectangulares de marcas */
.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.brand-btn {
  background-color: var(--accent);
  border: none;
  border-radius: 12px;
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
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.brand-btn:hover {
  transform: translateY(-5px);
  background-color: var(--primary);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.brand-btn:active {
  transform: translateY(-2px);
}

.brand-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

.brand-btn:hover::before {
  left: 100%;
}

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
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: bold;
  min-width: 100px;
  text-align: center;
  z-index: 1;
}

.timeline-content {
  background-color: var(--secondary);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 0 2rem;
  flex: 1;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.timeline-content h3 {
  color: var(--highlight);
}

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

.social-links {
  display: flex;
  gap: 1.5rem;
}

.social-links a {
  color: white;
  font-size: 1.5rem;
  transition: color 0.3s;
}

.social-links a:hover {
  color: var(--highlight);
}

/* Responsive Design específico del componente */
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
}
</style>