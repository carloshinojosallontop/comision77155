/**
 * Middleware de validación para datos de entrada
 */

// Validar datos de registro
export const validateRegisterData = (req, res, next) => {
  const { first_name, last_name, email, age, password, role } = req.body;
  const errors = [];

  // Validar campos requeridos
  if (!first_name?.trim()) errors.push("El nombre es requerido");
  if (!last_name?.trim()) errors.push("El apellido es requerido");
  if (!email?.trim()) errors.push("El email es requerido");
  if (!age) errors.push("La edad es requerida");
  if (!password) errors.push("La contraseña es requerida");

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push("El formato del email no es válido");
  }

  // Validar edad mínima
  if (age && (isNaN(age) || parseInt(age) < 18)) {
    errors.push("Debes ser mayor de 18 años");
  }

  // Validar longitud de contraseña
  if (password && password.length < 6) {
    errors.push("La contraseña debe tener al menos 6 caracteres");
  }

  // Validar rol si se proporciona
  const allowedRoles = ["user", "admin"];
  if (role && !allowedRoles.includes(role)) {
    errors.push("El rol seleccionado no es válido");
  }

  // Si hay errores, devolver respuesta de error
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Datos de registro inválidos",
      errors,
    });
  }

  // Si todo está bien, continuar
  next();
};

// Validar datos de login
export const validateLoginData = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  // Validar campos requeridos
  if (!email?.trim()) errors.push("El email es requerido");
  if (!password) errors.push("La contraseña es requerida");

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push("El formato del email no es válido");
  }

  // Si hay errores, devolver respuesta de error
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Datos de login inválidos",
      errors,
    });
  }

  // Si todo está bien, continuar
  next();
};
