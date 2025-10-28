/**
 * Módulo específico para la página de login
 */

class LoginPage {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
    }

    /**
     * Inicializa la página de login
     */
    init() {
        this.form = document.getElementById('loginForm');
        
        if (!this.form) {
            console.error('Formulario de login no encontrado');
            return;
        }

        this.bindEvents();
    }

    /**
     * Vincula eventos del formulario
     */
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    /**
     * Maneja el envío del formulario de login
     * @param {Event} event - Evento de submit
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isSubmitting) return;
        
        this.isSubmitting = true;
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Cambiar texto del botón
            submitButton.textContent = 'Iniciando sesión...';
            submitButton.disabled = true;

            const formData = UIUtils.getFormData(this.form);
            const { email, password } = formData;

            // Validar campos básicos
            if (!email || !password) {
                UIUtils.showAlert('Por favor, completa todos los campos', 'danger');
                return;
            }

            // Realizar login
            const result = await ApiUtils.loginUser(email, password);

            if (result.success) {
                UIUtils.showAlert('Login exitoso. Redirigiendo...', 'success');
                
                // Actualizar estado de autenticación
                await AppAuth.checkAuthStatus();
                
                // Redirigir al perfil
                UIUtils.redirectTo('/profile');
            } else {
                UIUtils.showAlert(result.message || 'Credenciales inválidas', 'danger');
            }

        } catch (error) {
            console.error('Error en login:', error);
            UIUtils.showAlert('Error de conexión. Por favor, intenta nuevamente.', 'danger');
        } finally {
            // Restaurar botón
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            this.isSubmitting = false;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const loginPage = new LoginPage();
    loginPage.init();
});