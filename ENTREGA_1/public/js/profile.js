/**
 * Módulo específico para la página de perfil
 */

class ProfilePage {
    constructor() {
        this.userInfo = null;
        this.adminSection = null;
        this.isLoading = false;
    }

    /**
     * Inicializa la página de perfil
     */
    init() {
        this.userInfo = document.getElementById('userInfo');
        this.adminSection = document.getElementById('adminSection');
        
        if (!this.userInfo) {
            console.error('Elementos de perfil no encontrados');
            return;
        }

        this.loadUserProfile();
        this.bindEvents();
    }

    /**
     * Vincula eventos de la página
     */
    bindEvents() {
        // Event listener para botones de admin
        const adminButton = document.querySelector('[onclick="testAdminAccess()"]');
        if (adminButton) {
            adminButton.onclick = () => this.testAdminAccess();
        }
    }

    /**
     * Carga la información del perfil del usuario
     */
    async loadUserProfile() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        
        try {
            const user = await ApiUtils.getCurrentUser();
            
            if (!user) {
                // Si no está autenticado, redirigir al login
                UIUtils.redirectTo('/login', 0);
                return;
            }

            this.displayUserInfo(user);
            this.handleAdminSection(user);
            
        } catch (error) {
            console.error('Error al cargar el perfil:', error);
            UIUtils.showAlert('Error al cargar la información del perfil', 'danger');
            UIUtils.redirectTo('/login', 2000);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Muestra la información del usuario en la página
     * @param {object} user - Datos del usuario
     */
    displayUserInfo(user) {
        // Actualizar información básica
        UIUtils.updateElementContent('userName', `${user.first_name} ${user.last_name}`);
        UIUtils.updateElementContent('userEmail', user.email);
        UIUtils.updateElementContent('userAge', `${user.age} años`);
        
        // Actualizar rol con badge apropiado
        const roleElement = document.getElementById('userRole');
        if (roleElement) {
            roleElement.textContent = user.role;
            roleElement.className = `badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`;
        }
        
        // Actualizar fecha de registro (placeholder por ahora)
        UIUtils.updateElementContent('userSince', 'Información no disponible');
    }

    /**
     * Maneja la sección de administración
     * @param {object} user - Datos del usuario
     */
    handleAdminSection(user) {
        if (!this.adminSection) return;
        
        if (user.role === 'admin') {
            UIUtils.toggleElement('adminSection', true);
        } else {
            UIUtils.toggleElement('adminSection', false);
        }
    }

    /**
     * Prueba el acceso de administrador
     */
    async testAdminAccess() {
        const resultDiv = document.getElementById('adminResult');
        if (!resultDiv) return;
        
        try {
            // Mostrar loading
            UIUtils.updateElementHTML('adminResult', 
                '<div class="alert alert-info">🔄 Verificando acceso...</div>'
            );
            
            const result = await ApiUtils.testAdminAccess();
            
            if (result.success) {
                UIUtils.updateElementHTML('adminResult', 
                    '<div class="alert alert-success">✅ Acceso de administrador confirmado</div>'
                );
            } else {
                UIUtils.updateElementHTML('adminResult', 
                    '<div class="alert alert-danger">❌ Acceso denegado</div>'
                );
            }
        } catch (error) {
            console.error('Error al probar acceso admin:', error);
            UIUtils.updateElementHTML('adminResult', 
                '<div class="alert alert-danger">❌ Error de conexión</div>'
            );
        }
    }

    /**
     * Maneja el logout desde la página de perfil
     */
    async handleLogout() {
        try {
            const result = await ApiUtils.logoutUser();
            
            if (result.success) {
                UIUtils.showAlert('Sesión cerrada exitosamente', 'success');
                UIUtils.redirectTo('/', 1000);
            } else {
                UIUtils.showAlert('Error al cerrar sesión', 'danger');
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            UIUtils.showAlert('Error al cerrar sesión', 'danger');
        }
    }

    /**
     * Actualiza la información del perfil
     */
    async refreshProfile() {
        await this.loadUserProfile();
        UIUtils.showAlert('Perfil actualizado', 'success');
    }
}

// Funciones globales para uso desde HTML
window.logout = async function() {
    if (window.profilePage) {
        await window.profilePage.handleLogout();
    }
};

window.testAdminAccess = async function() {
    if (window.profilePage) {
        await window.profilePage.testAdminAccess();
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.profilePage = new ProfilePage();
    window.profilePage.init();
});