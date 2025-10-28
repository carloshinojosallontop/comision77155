/**
 * Utilidades para manejo de UI y elementos DOM
 */

/**
 * Muestra una alerta Bootstrap
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de alerta (success, danger, warning, info)
 * @param {HTMLElement} container - Contenedor donde insertar la alerta
 * @param {number} duration - Duración en milisegundos (default: 5000)
 */
function showAlert(message, type = 'info', container = null, duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Si no se especifica contenedor, usar el primer formulario encontrado
    if (!container) {
        const form = document.querySelector('form');
        if (form) {
            container = form.parentNode;
        } else {
            container = document.querySelector('.container') || document.body;
        }
    }
    
    // Insertar al principio del contenedor
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-remover después del tiempo especificado
    if (duration > 0) {
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, duration);
    }

    return alertDiv;
}

/**
 * Actualiza el contenido de la navegación según el estado de autenticación
 * @param {object|null} user - Datos del usuario autenticado o null
 */
function updateNavbar(user = null) {
    const navbarContent = document.getElementById('navbarContent');
    if (!navbarContent) return;
    
    if (user) {
        // Usuario autenticado
        navbarContent.innerHTML = `
            <span class="navbar-text me-3">
                Hola, ${user.first_name}!
            </span>
            <a class="nav-link" href="/profile">Mi Perfil</a>
            <a class="nav-link" href="#" onclick="AppAuth.logout()">Cerrar Sesión</a>
        `;
    } else {
        // Usuario no autenticado
        navbarContent.innerHTML = `
            <a class="nav-link" href="/login">Iniciar Sesión</a>
            <a class="nav-link" href="/register">Registrarse</a>
        `;
    }
}

/**
 * Redirige a una página después de un delay
 * @param {string} url - URL a la que redirigir
 * @param {number} delay - Delay en milisegundos (default: 1500)
 */
function redirectTo(url, delay = 1500) {
    setTimeout(() => {
        window.location.href = url;
    }, delay);
}

/**
 * Muestra/oculta elementos basado en condición
 * @param {string} elementId - ID del elemento
 * @param {boolean} show - Si debe mostrar o ocultar
 */
function toggleElement(elementId, show) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

/**
 * Actualiza el contenido de texto de un elemento
 * @param {string} elementId - ID del elemento
 * @param {string} content - Contenido a insertar
 */
function updateElementContent(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;
    }
}

/**
 * Actualiza el HTML de un elemento
 * @param {string} elementId - ID del elemento
 * @param {string} html - HTML a insertar
 */
function updateElementHTML(elementId, html) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = html;
    }
}

/**
 * Obtiene los datos de un formulario como un objeto
 * @param {HTMLFormElement} form - Formulario del que extraer datos
 * @returns {object} - Objeto con los datos del formulario
 */
function getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        // Convertir números
        if (form.querySelector(`[name="${key}"]`).type === 'number') {
            data[key] = parseInt(value);
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

/**
 * Valida que las contraseñas coincidan
 * @param {string} password - Contraseña
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {boolean} - True si coinciden
 */
function validatePasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

// Exportar funciones para uso global
window.UIUtils = {
    showAlert,
    updateNavbar,
    redirectTo,
    toggleElement,
    updateElementContent,
    updateElementHTML,
    getFormData,
    validatePasswordMatch
};