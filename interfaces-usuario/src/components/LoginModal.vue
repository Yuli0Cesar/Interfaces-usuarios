<template>
  <div class="login-modal" v-if="showModal" @click.self="closeModal">
    <div class="login-content">
      <button class="close-btn" @click="closeModal">×</button>
      
      <h2>{{ isLoginMode ? 'Iniciar Sesión' : 'Registrarse' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            required
            placeholder="tu@email.com"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            required
            placeholder="••••••••"
          >
        </div>
        
        <div v-if="!isLoginMode" class="form-group">
          <label for="confirmPassword">Confirmar Contraseña:</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            required
            placeholder="••••••••"
          >
        </div>
        
        <div class="form-group">
          <label>
            <input type="checkbox" v-model="form.isAdmin"> 
            Acceso como Administrador
          </label>
        </div>
        
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Procesando...' : (isLoginMode ? 'Iniciar Sesión' : 'Registrarse') }}
        </button>
      </form>
      
      <div class="switch-mode">
        <p>
          {{ isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
          <a href="#" @click.prevent="toggleMode">
            {{ isLoginMode ? 'Regístrate' : 'Inicia Sesión' }}
          </a>
        </p>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginModal',
  props: {
    showModal: Boolean
  },
  data() {
    return {
      isLoginMode: true,
      loading: false,
      error: '',
      form: {
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    
    toggleMode() {
      this.isLoginMode = !this.isLoginMode;
      this.error = '';
      this.resetForm();
    },
    
    resetForm() {
      this.form = {
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false
      };
    },
    
    async handleSubmit() {
      this.loading = true;
      this.error = '';
      
      try {
        // Validaciones básicas
        if (!this.isLoginMode && this.form.password !== this.form.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }
        
        if (this.form.password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        
        // Simular autenticación (en un caso real, aquí iría la llamada a la API)
        await this.simulateAuth();
        
        // Emitir evento de éxito
        this.$emit('auth-success', {
          email: this.form.email,
          isAdmin: this.form.isAdmin,
          isLogin: this.isLoginMode
        });
        
        this.closeModal();
        
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    
    simulateAuth() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simular verificación de credenciales
          const testUsers = {
            'admin@jdmtuning.com': { password: 'admin123', isAdmin: true },
            'user@jdmtuning.com': { password: 'user123', isAdmin: false }
          };
          
          const user = testUsers[this.form.email];
          
          if (this.isLoginMode) {
            if (user && user.password === this.form.password) {
              if (user.isAdmin !== this.form.isAdmin) {
                reject(new Error('Tipo de acceso incorrecto'));
              } else {
                resolve(user);
              }
            } else {
              reject(new Error('Credenciales incorrectas'));
            }
          } else {
            // Registro - simular que el email no existe
            if (testUsers[this.form.email]) {
              reject(new Error('El email ya está registrado'));
            } else {
              resolve({ email: this.form.email, isAdmin: this.form.isAdmin });
            }
          }
        }, 1000);
      });
    }
  },
  
  watch: {
    showModal(newVal) {
      if (!newVal) {
        this.resetForm();
        this.error = '';
      }
    }
  }
}
</script>

<style scoped>
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
  background: var(--accent, var(--secondary, #ffffff));
  padding: 2rem;
  border-radius: var(--border-radius, 12px);
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: var(--shadow, 0 10px 30px rgba(0, 0, 0, 0.3));
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text, #333333);
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: var(--secondary, #FFD600);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--text, #333333);
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
  font-size: var(--title-size, 24px);
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text, #333333);
  font-weight: 500;
  font-family: var(--secondary-font, Arial, sans-serif);
  font-size: var(--paragraph-size, 16px);
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--accent, #e0e0e0);
  border-radius: var(--border-radius, 6px);
  background: var(--accent, #ffffff);
  color: var(--text, #333333);
  font-size: var(--paragraph-size, 16px);
  font-family: var(--secondary-font, Arial, sans-serif);
  transition: border-color 0.3s;
}

input[type="email"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: var(--secondary, #FFD600);
}

input[type="checkbox"] {
  margin-right: 0.5rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary, #D50000);
  color: white;
  border: none;
  border-radius: var(--border-radius, 6px);
  font-size: var(--paragraph-size, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 1rem;
  font-family: var(--font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
}

.submit-btn:hover:not(:disabled) {
  background: var(--secondary, #FFD600);
}

.submit-btn:disabled {
  background: #666;
  cursor: not-allowed;
}

.switch-mode {
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--accent, #e0e0e0);
}

.switch-mode p {
  color: var(--text, #333333);
  font-family: var(--secondary-font, Arial, sans-serif);
  font-size: var(--paragraph-size, 16px);
}

.switch-mode a {
  color: var(--secondary, #FFD600);
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
  border-radius: var(--border-radius, 6px);
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  font-family: var(--secondary-font, Arial, sans-serif);
}

@media (max-width: 480px) {
  .login-content {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>