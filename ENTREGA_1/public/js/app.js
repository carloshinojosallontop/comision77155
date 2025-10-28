/**
 * Archivo principal de la aplicación
 * Orquesta la carga de módulos y funcionalidades globales
 */

(function() {
    'use strict';

    /**
     * Configuración global de la aplicación
     */
    const AppConfig = {
        name: 'Mi App JWT',
        version: '1.0.0',
        apiTimeout: 10000,
        redirectDelay: 1500
    };

    /**
     * Manejador global de errores no capturados
     */
    window.addEventListener('error', function(event) {
        console.error('Error no capturado:', event.error);
        
        // En producción, aquí se podría enviar el error a un servicio de logging
        if (window.UIUtils) {
            UIUtils.showAlert('Ha ocurrido un error inesperado', 'danger');
        }
    });

    /**
     * Manejador de promesas rechazadas no capturadas
     */
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Promesa rechazada no capturada:', event.reason);
        event.preventDefault();
        
        if (window.UIUtils) {
            UIUtils.showAlert('Error de conexión', 'danger');
        }
    });

    /**
     * Utilidades globales adicionales
     */
    window.App = {
        config: AppConfig,
        
        /**
         * Inicializa la aplicación
         */
        init: function() {
            console.log(`${AppConfig.name} v${AppConfig.version} iniciada`);
            
            // Configurar timeout global para fetch
            const originalFetch = window.fetch;
            window.fetch = function(url, options = {}) {
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), AppConfig.apiTimeout)
                );
                
                return Promise.race([
                    originalFetch(url, options),
                    timeoutPromise
                ]);
            };
        },

        /**
         * Utilidades de debug (solo en desarrollo)
         */
        debug: {
            getCurrentUser: () => window.AppAuth ? AppAuth.getCurrentUser() : null,
            forceLogout: () => window.AppAuth ? AppAuth.logout() : null,
            clearStorage: () => {
                localStorage.clear();
                sessionStorage.clear();
                console.log('Storage limpiado');
            }
        }
    };

    /**
     * Funciones de utilidad global
     */
    window.utils = {
        /**
         * Formatea una fecha
         * @param {Date|string} date - Fecha a formatear
         * @returns {string} - Fecha formateada
         */
        formatDate: function(date) {
            if (!date) return 'No disponible';
            
            const d = new Date(date);
            return d.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        /**
         * Capitaliza la primera letra de una cadena
         * @param {string} str - Cadena a capitalizar
         * @returns {string} - Cadena capitalizada
         */
        capitalize: function(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        /**
         * Valida un email
         * @param {string} email - Email a validar
         * @returns {boolean} - True si es válido
         */
        isValidEmail: function(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }
    };

    // Inicializar la aplicación cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        App.init();
    });

    // Exponer configuración globalmente
    window.AppConfig = AppConfig;

})();