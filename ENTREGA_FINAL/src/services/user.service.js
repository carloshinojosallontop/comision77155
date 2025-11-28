import bcrypt from "bcrypt";
import crypto from "crypto";
import userRepository from "../repositories/user.repository.js";
import mailService from "./mail.service.js";

class UserService {
  async findByEmail(email) {
    return userRepository.getByEmail(email);
  }

  async findById(id) {
    return userRepository.getById(id);
  }

  async createUser(data) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    return userRepository.createUser({ ...data, password: hashedPassword });
  }

  async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }

  async updatePassword(userId, newPlainPassword, currentHashedPassword) {
    const isSame = await bcrypt.compare(newPlainPassword, currentHashedPassword);
    if (isSame) {
      throw new Error("La nueva contraseña no puede ser igual a la anterior");
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(newPlainPassword, saltRounds);
    return userRepository.changePassword(userId, hashed);
  }

  async startPasswordReset(email, baseUrl) {
    const user = await userRepository.getByEmail(email);
    if (!user) {
      // Por seguridad, no revelamos si el correo existe o no
      return;
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await userRepository.setResetToken(user._id, token, expiresAt);

    const resetUrl = `${baseUrl.replace(/\/$/, "")}/auth/reset-password/${token}`;

    await mailService.sendPasswordResetEmail(user.email, resetUrl);
  }

  async resetPassword(token, newPassword) {
    const user = await userRepository.getByResetToken(token);
    if (!user) {
      throw new Error("Token inválido o expirado");
    }

    return this.updatePassword(user._id, newPassword, user.password);
  }
}

export default new UserService();
