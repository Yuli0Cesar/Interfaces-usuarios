<!-- TangramLoader.vue - Versión simplificada -->
<template>
  <div class="tangram-loader" v-if="showLoader">
    <canvas ref="canvas"></canvas>
    <div class="loader-text">{{ loadingText }}</div>
  </div>
</template>

<script>
export default {
  name: 'TangramLoader',
  props: {
    showLoader: {
      type: Boolean,
      default: true
    },
    loadingText: {
      type: String,
      default: 'Cargando JDM Tuning...'
    },
    animationSpeed: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      canvas: null,
      context: null,
      animationFrameId: null,
      points: [],
      figuras: {},
      animacionActiva: false,
      figuraActual: 'cuadrado',
      progresoAnimacion: 0,
      duracionAnimacion: 2000,
      tiempoEntreFiguras: 1000,
      figurasDisponibles: ['cuadrado', 'figura1', 'figura2', 'figura3', 'figura4'],
      indiceFiguraActual: 0,
      checkInterval: null
    }
  },
  mounted() {
    this.initCanvas();
    this.startAnimation();
    
    // Verificar cambios en colores cada 500ms
    this.checkInterval = setInterval(() => {
      this.updateTangramColors();
    }, 500);
  },
  beforeUnmount() {
    this.stopAnimation();
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.canvas;
      if (!this.canvas) return;
      
      this.context = this.canvas.getContext('2d');
      this.canvas.width = 400;
      this.canvas.height = 400;

      // Inicializar puntos con colores del CSS
      this.points = [
        {
          p: [{x: 0, y: 0}, {x: 200, y: 0}, {x: 100, y: 100}], 
          color: this.getCSSColor('--primary'),
          transform: { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 }
        },
        {
          p: [{x: 0, y: 0}, {x: 100, y: 100}, {x: 0, y: 200}], 
          color: this.getCSSColor('--secondary'),
          transform: { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 }
        },
        {
          p: [{x: 200, y: 0}, {x: 200, y: 100}, {x: 150, y: 150}, {x: 150, y: 50}],
          color: this.getCSSColor('--background'),
          transform: { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 }
        },
        {
          p: [{x: 150, y: 50}, {x: 150, y: 150}, {x: 100, y: 100}],
          color: this.getCSSColor('--text'),
          transform: { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 }
        },
        {
          p: [{x: 100, y: 100}, {x: 150, y: 150}, {x: 100, y: 200}, {x: 50, y: 150}],
          color: this.getCSSColor('--accent'),
          transform: { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 }
        },
        {
          p: [{x: 50, y: 150}, {x: 100, y: 200}, {x: 0, y: 200}],
          color: this.getCSSColor('--primary'), // Repetido primary
          transform: { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 }
        },
        {
          p: [{x: 200, y: 100}, {x: 200, y: 200}, {x: 100, y: 200}],
          color: this.getCSSColor('--secondary'), // Repetido secondary
          transform: { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 }
        }
      ];

      // Configuraciones para diferentes figuras
      this.figuras = {
        cuadrado: [
          { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 },
          { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 },
          { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 },
          { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 },
          { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 },
          { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 },
          { translateX: 0, translateY: 0, rotation: 0, scaleX: 1, scaleY: 1 }
        ],
        
        figura1: [
            { translateX: 120, translateY: 50, rotation: 45, scaleX: 1, scaleY: 1 },
            { translateX: 45, translateY: 50, rotation: 45, scaleX: 1, scaleY: 1 },
            { translateX: 214, translateY: 341, rotation: -90, scaleX: 1, scaleY: 1 },
            { translateX: -95, translateY: 118, rotation: -45, scaleX: 1, scaleY: 1 },
            { translateX: 118, translateY: -21, rotation: 45, scaleX: 1, scaleY: 1 },
            { translateX: 263, translateY: -91, rotation: 45, scaleX: 1, scaleY: 1 },
            { translateX: 331, translateY: 46, rotation: 135, scaleX: 1, scaleY: 1 }
        ],

        figura2: [
            { translateX: 150, translateY: 152, rotation: -90, scaleX: 1, scaleY: 1 },
            { translateX: 45, translateY: 152, rotation: -180, scaleX: 1, scaleY: 1 },
            { translateX: -18, translateY: 11, rotation: 45, scaleX: 1, scaleY: 1 },
            { translateX: -2, translateY: 1, rotation: 0, scaleX: 1, scaleY: 1 },
            { translateX: -53, translateY: 150, rotation: -90, scaleX: 1, scaleY: 1 },
            { translateX: 247, translateY: 50, rotation: 90, scaleX: 1, scaleY: 1 },
            { translateX: 135, translateY: 435, rotation: -135, scaleX: 1, scaleY: 1 }
        ],

        figura3: [
            { translateX: 282, translateY: 73, rotation: 135, scaleX: 1, scaleY: 1 },
            { translateX: 65, translateY: 0, rotation: 45, scaleX: 1, scaleY: 1 },
            { translateX: 280, translateY: 0, rotation: 135, scaleX: 1, scaleY: 1 },
            { translateX: -75, translateY: 141.5, rotation: 315, scaleX: 1, scaleY: 1 },
            { translateX: 138, translateY: 3, rotation: 45, scaleX: 1, scaleY: 1 },
            { translateX: 206, translateY: 285, rotation: 135, scaleX: 1, scaleY: 1 },
            { translateX: 140, translateY: -213, rotation: 45, scaleX: 1, scaleY: 1 }
        ],

        figura4: [
            { translateX: 170, translateY: 150, rotation: 135, scaleX: 1, scaleY: 1 },
            { translateX: 170, translateY: 150, rotation: 45, scaleX: 1, scaleY: 1 },
            { translateX: -5, translateY: -210, rotation: 45, scaleX: 1, scaleY: 1 },
            { translateX: 279, translateY: 77, rotation: 135, scaleX: 1, scaleY: 1 },
            { translateX: 137, translateY: -137, rotation: 45, scaleX: 1, scaleY: 1 },
            { translateX: -5, translateY: 290, rotation: 225, scaleX: 1, scaleY: 1 },
            { translateX: 137, translateY: 215, rotation: -135, scaleX: 1, scaleY: 1 }
        ]
      };

      this.duracionAnimacion = this.animationSpeed;
    },

    getCSSColor(variableName) {
      const rootStyles = getComputedStyle(document.documentElement);
      const color = rootStyles.getPropertyValue(variableName).trim();
      
      console.log(`Variable ${variableName}: "${color}"`);
      return color || 'transparent';
    },

    updateTangramColors() {
      // Actualizar colores de todas las piezas
      this.points[0].color = this.getCSSColor('--primary');
      this.points[1].color = this.getCSSColor('--secondary');
      this.points[2].color = this.getCSSColor('--background');
      this.points[3].color = this.getCSSColor('--text');
      this.points[4].color = this.getCSSColor('--accent');
      this.points[5].color = this.getCSSColor('--primary');
      this.points[6].color = this.getCSSColor('--secondary');
      
      // Redibujar con los nuevos colores
      if (this.context && this.canvas) {
        this.draw();
      }
    },

    drawFigure(figure) {
      this.context.save();
      
      // Centrar el tangram en el canvas
      this.context.translate(this.canvas.width / 4, this.canvas.height / 4);
      
      // Aplicar transformaciones individuales de cada figura
      this.context.translate(figure.transform.translateX, figure.transform.translateY);
      this.context.rotate(figure.transform.rotation * Math.PI / 180);
      this.context.scale(figure.transform.scaleX, figure.transform.scaleY);
      
      // Dibujar la figura
      this.context.beginPath();
      this.context.moveTo(figure.p[0].x, figure.p[0].y);
      for (let j = 0; j < figure.p.length; j++) {
        this.context.lineTo(figure.p[j].x, figure.p[j].y);
      }
      this.context.lineTo(figure.p[0].x, figure.p[0].y);
      this.context.strokeStyle = "#2c3e50";
      this.context.lineWidth = "2";
      this.context.fillStyle = figure.color;
      this.context.stroke();
      this.context.fill();
      this.context.closePath();
      
      this.context.restore();
    },

    interpolarTransformaciones(inicio, fin, progreso) {
      return {
        translateX: inicio.translateX + (fin.translateX - inicio.translateX) * progreso,
        translateY: inicio.translateY + (fin.translateY - inicio.translateY) * progreso,
        rotation: inicio.rotation + (fin.rotation - inicio.rotation) * progreso,
        scaleX: inicio.scaleX + (fin.scaleX - inicio.scaleX) * progreso,
        scaleY: inicio.scaleY + (fin.scaleY - inicio.scaleY) * progreso
      };
    },

    startAnimation() {
      const cicloAnimacion = () => {
        if (!this.showLoader) return;
        
        // Calcular siguiente figura
        const siguienteIndice = (this.indiceFiguraActual + 1) % this.figurasDisponibles.length;
        const siguienteFigura = this.figurasDisponibles[siguienteIndice];
        
        this.animarHaciaFigura(siguienteFigura, () => {
          if (!this.showLoader) return;
          
          // Cuando termina la animación, esperar y pasar a la siguiente
          this.indiceFiguraActual = siguienteIndice;
          setTimeout(cicloAnimacion, this.tiempoEntreFiguras);
        });
      };
      
      // Iniciar el ciclo
      cicloAnimacion();
    },

    animarHaciaFigura(nuevaFigura, onComplete) {
      if (this.animacionActiva) return;
      
      this.animacionActiva = true;
      this.figuraActual = nuevaFigura;
      this.progresoAnimacion = 0;
      
      const inicioTiempo = Date.now();
      
      const pasoAnimacion = () => {
        if (!this.showLoader) {
          this.animacionActiva = false;
          return;
        }
        
        const tiempoActual = Date.now();
        this.progresoAnimacion = (tiempoActual - inicioTiempo) / this.duracionAnimacion;
        
        if (this.progresoAnimacion >= 1) {
          this.progresoAnimacion = 1;
          this.animacionActiva = false;
          
          // Aplicar transformación final exacta
          for (let i = 0; i < this.points.length; i++) {
            this.points[i].transform = {...this.figuras[nuevaFigura][i]};
          }
          
          this.draw();
          
          if (onComplete) onComplete();
          return;
        }
        
        // Aplicar interpolación a cada pieza
        for (let i = 0; i < this.points.length; i++) {
          const inicio = this.points[i].transform;
          const fin = this.figuras[nuevaFigura][i];
          this.points[i].transform = this.interpolarTransformaciones(inicio, fin, this.progresoAnimacion);
        }
        
        this.draw();
        this.animationFrameId = requestAnimationFrame(pasoAnimacion);
      };
      
      this.animationFrameId = requestAnimationFrame(pasoAnimacion);
    },

    draw() {
      if (!this.context || !this.canvas) return;
      
      // Limpiar el lienzo
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Dibujar cada figura con sus transformaciones individuales
      for (let i = 0; i < this.points.length; i++) {
        this.drawFigure(this.points[i]);
      }
    },

    stopAnimation() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    }
  },
  watch: {
    showLoader(newVal) {
      if (newVal) {
        this.startAnimation();
      } else {
        this.stopAnimation();
      }
    }
  }
}
</script>

<style scoped>
.tangram-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--background) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
}

.tangram-loader canvas {
  width: 300px;
  height: 300px;
  max-width: 90vw;
  max-height: 50vh;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
}

.loader-text {
  margin-top: 2rem;
  color: var(--text);
  font-family: var(--font-family);
  font-size: var(--title-size);
  text-align: center;
  animation: pulse 2s infinite;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes pulse {
  0% {
    opacity: 0.6;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.6;
    transform: scale(0.98);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .tangram-loader canvas {
    width: 250px;
    height: 250px;
  }
  
  .loader-text {
    font-size: calc(var(--title-size) * 0.9);
    margin-top: 1.5rem;
  }
}

@media (max-width: 480px) {
  .tangram-loader canvas {
    width: 200px;
    height: 200px;
  }
  
  .loader-text {
    font-size: calc(var(--title-size) * 0.8);
    margin-top: 1rem;
  }
}
</style>