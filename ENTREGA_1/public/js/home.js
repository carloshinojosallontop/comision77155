/**
 * Módulo específico para la página de inicio (home)
 */

class HomePage {
    constructor() {
        this.guestContent = null;
        this.userContent = null;
        this.userWelcome = null;
    }

    /**
     * Inicializa la página de inicio
     */
    init() {
        this.guestContent = document.getElementById('guestContent');
        this.userContent = document.getElementById('userContent');
        this.userWelcome = document.getElementById('userWelcome');
        
        if (!this.guestContent || !this.userContent) {
            console.error('Elementos de contenido no encontrados en home');
            return;
        }

        this.bindEvents();
        this.updateContent();
    }

    /**
     * Vincula eventos de la página
     */
    bindEvents() {
        // Escuchar cambios en el estado de autenticación
        document.addEventListener('authStateChanged', () => {
            this.updateContent();
        });
    }

    /**
     * Actualiza el contenido basado en el estado de autenticación
     */
    async updateContent() {
        try {
            // Esperar un poco para asegurar que AppAuth esté inicializado
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const user = AppAuth ? AppAuth.getCurrentUser() : null;
            
            if (user) {
                this.showUserContent(user);
            } else {
                this.showGuestContent();
            }
        } catch (error) {
            console.error('Error al actualizar contenido de home:', error);
            this.showGuestContent();
        }
    }

    /**
     * Muestra contenido para usuarios autenticados
     * @param {object} user - Datos del usuario
     */
    showUserContent(user) {
        UIUtils.toggleElement('guestContent', false);
        UIUtils.toggleElement('userContent', true);
        
        if (this.userWelcome) {
            const welcomeHTML = `
                <div class="alert alert-info">
                    <strong>Sesión activa:</strong> ${user.first_name} ${user.last_name}
                    <br><small>Rol: ${user.role} | Email: ${user.email}</small>
                </div>
            `;
            UIUtils.updateElementHTML('userWelcome', welcomeHTML);
        }
    }

    /**
     * Muestra contenido para invitados
     */
    showGuestContent() {
        UIUtils.toggleElement('guestContent', true);
        UIUtils.toggleElement('userContent', false);
        
        if (this.userWelcome) {
            UIUtils.updateElementHTML('userWelcome', '');
        }
    }

    /**
     * Maneja el logout desde la página de inicio
     */
    async handleLogout() {
        try {
            await AppAuth.logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            UIUtils.showAlert('Error al cerrar sesión', 'danger');
        }
    }
}

// Función global para logout (llamada desde el HTML)
window.logout = async function() {
    if (window.homePage) {
        await window.homePage.handleLogout();
    } else if (window.AppAuth) {
        await AppAuth.logout();
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.homePage = new HomePage();
    window.homePage.init();
});