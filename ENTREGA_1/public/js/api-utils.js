/**
 * Utilidades para manejo de API y autenticación
 */

// Configuración base de la API
const API_BASE = '/api';

/**
 * Realiza una petición a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {object} options - Opciones de fetch
 * @returns {Promise<object>} - Respuesta de la API
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, config);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la petición API:', error);
        throw new Error('Error de conexión');
    }
}

/**
 * Obtiene el usuario actual autenticado
 * @returns {Promise<object|null>} - Datos del usuario o null si no está autenticado
 */
async function getCurrentUser() {
    try {
        const data = await apiRequest('/auth/current');
        return data.success ? data.user : null;
    } catch (error) {
        return null;
    }
}

/**
 * Realiza login del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<object>} - Respuesta del login
 */
async function loginUser(email, password) {
    return await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

/**
 * Registra un nuevo usuario
 * @param {object} userData - Datos del usuario
 * @returns {Promise<object>} - Respuesta del registro
 */
async function registerUser(userData) {
    return await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

/**
 * Cierra la sesión del usuario
 * @returns {Promise<object>} - Respuesta del logout
 */
async function logoutUser() {
    return await apiRequest('/auth/logout', {
        method: 'POST'
    });
}

/**
 * Prueba acceso de administrador
 * @returns {Promise<object>} - Respuesta del endpoint admin
 */
async function testAdminAccess() {
    return await apiRequest('/admin');
}

// Exportar funciones para uso global
window.ApiUtils = {
    apiRequest,
    getCurrentUser,
    loginUser,
    registerUser,
    logoutUser,
    testAdminAccess
};