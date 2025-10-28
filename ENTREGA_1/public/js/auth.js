/**
 * Módulo principal de autenticación
 * Maneja la verificación de estado y operaciones de auth globales
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isInitialized = false;
    }

    /**
     * Inicializa el sistema de autenticación
     */
    async init() {
        if (this.isInitialized) return;
        
        try {
            await this.checkAuthStatus();
            this.isInitialized = true;
        } catch (error) {
            console.error('Error al inicializar autenticación:', error);
        }
    }

    /**
     * Verifica el estado de autenticación actual
     */
    async checkAuthStatus() {
        try {
            this.currentUser = await ApiUtils.getCurrentUser();
            UIUtils.updateNavbar(this.currentUser);
            return this.currentUser;
        } catch (error) {
            this.currentUser = null;
            UIUtils.updateNavbar(null);
            return null;
        }
    }

    /**
     * Obtiene el usuario actual
     * @returns {object|null} - Usuario actual o null
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} - True si está autenticado
     */
    isAuthenticated() {
        return this.currentUser !== null;
    }

    /**
     * Verifica si el usuario tiene un rol específico
     * @param {string} role - Rol a verificar
     * @returns {boolean} - True si tiene el rol
     */
    hasRole(role) {
        return this.currentUser && this.currentUser.role === role;
    }

    /**
     * Cierra la sesión del usuario
     */
    async logout() {
        try {
            const result = await ApiUtils.logoutUser();
            
            if (result.success) {
                this.currentUser = null;
                UIUtils.updateNavbar(null);
                window.location.href = '/';
            } else {
                console.error('Error al cerrar sesión');
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    /**
     * Redirige a login si no está autenticado
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login';
            return false;
        }
        return true;
    }

    /**
     * Redirige a home si ya está autenticado
     */
    requireGuest() {
        if (this.isAuthenticated()) {
            window.location.href = '/';
            return false;
        }
        return true;
    }
}

// Crear instancia global
const authManager = new AuthManager();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async function() {
    await authManager.init();
});

// Exportar para uso global
window.AppAuth = authManager;