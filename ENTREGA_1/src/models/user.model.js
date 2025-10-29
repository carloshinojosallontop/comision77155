import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 1
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carts'
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  }
}, {
  timestamps: true
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  // Solo hashear la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified('password')) return next();
  
  try {
    // Encriptar la contraseña usando bcrypt.hash
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener el usuario sin la contraseña
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;