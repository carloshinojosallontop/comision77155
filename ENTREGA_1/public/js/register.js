/**
 * Módulo específico para la página de registro
 */

class RegisterPage {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
    }

    /**
     * Inicializa la página de registro
     */
    init() {
        this.form = document.getElementById('registerForm');
        
        if (!this.form) {
            console.error('Formulario de registro no encontrado');
            return;
        }

        this.bindEvents();
    }

    /**
     * Vincula eventos del formulario
     */
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Validación en tiempo real de contraseñas
        const passwordField = this.form.querySelector('#password');
        const confirmPasswordField = this.form.querySelector('#confirmPassword');
        
        if (passwordField && confirmPasswordField) {
            confirmPasswordField.addEventListener('blur', () => {
                this.validatePasswordMatch();
            });
        }
    }

    /**
     * Valida que las contraseñas coincidan
     */
    validatePasswordMatch() {
        const password = this.form.querySelector('#password').value;
        const confirmPassword = this.form.querySelector('#confirmPassword').value;
        const confirmField = this.form.querySelector('#confirmPassword');
        
        if (confirmPassword && !UIUtils.validatePasswordMatch(password, confirmPassword)) {
            confirmField.classList.add('is-invalid');
            
            // Agregar mensaje de error si no existe
            let errorMsg = confirmField.parentNode.querySelector('.invalid-feedback');
            if (!errorMsg) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'invalid-feedback';
                errorMsg.textContent = 'Las contraseñas no coinciden';
                confirmField.parentNode.appendChild(errorMsg);
            }
            return false;
        } else {
            confirmField.classList.remove('is-invalid');
            const errorMsg = confirmField.parentNode.querySelector('.invalid-feedback');
            if (errorMsg) {
                errorMsg.remove();
            }
            return true;
        }
    }

    /**
     * Valida todos los campos del formulario
     * @param {object} data - Datos del formulario
     * @returns {object} - Resultado de validación
     */
    validateForm(data) {
        const errors = [];

        // Validar campos requeridos
        if (!data.first_name) errors.push('El nombre es requerido');
        if (!data.last_name) errors.push('El apellido es requerido');
        if (!data.email) errors.push('El email es requerido');
        if (!data.age) errors.push('La edad es requerida');
        if (!data.password) errors.push('La contraseña es requerida');
        if (!data.role) errors.push('El rol es requerido');

        // Validar edad mínima
        if (data.age && data.age < 18) {
            errors.push('Debes ser mayor de 18 años');
        }

        // Validar email básico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (data.email && !emailRegex.test(data.email)) {
            errors.push('El formato del email no es válido');
        }

        // Validar contraseña mínima
        if (data.password && data.password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }

        // Validar rol
        const allowedRoles = ['user', 'admin'];
        if (data.role && !allowedRoles.includes(data.role)) {
            errors.push('El rol seleccionado no es válido');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Maneja el envío del formulario de registro
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
            submitButton.textContent = 'Registrando...';
            submitButton.disabled = true;

            const formData = UIUtils.getFormData(this.form);
            
            // Validar contraseñas
            if (!this.validatePasswordMatch()) {
                UIUtils.showAlert('Las contraseñas no coinciden', 'danger');
                return;
            }

            // Validar formulario completo
            const validation = this.validateForm(formData);
            if (!validation.isValid) {
                UIUtils.showAlert(validation.errors.join('<br>'), 'danger');
                return;
            }

            // Preparar datos para envío (sin confirmPassword)
            const userData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                age: formData.age,
                password: formData.password,
                role: formData.role || 'user'
            };

            // Realizar registro
            const result = await ApiUtils.registerUser(userData);

            if (result.success) {
                UIUtils.showAlert('Registro exitoso. Redirigiendo...', 'success');
                
                // Actualizar estado de autenticación
                await AppAuth.checkAuthStatus();
                
                // Redirigir al perfil
                UIUtils.redirectTo('/profile', 2000);
            } else {
                UIUtils.showAlert(result.message || 'Error en el registro', 'danger');
            }

        } catch (error) {
            console.error('Error en registro:', error);
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
    const registerPage = new RegisterPage();
    registerPage.init();
});