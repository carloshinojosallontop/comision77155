import User from "../models/user.model.js";

class UserDAO {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findById(id) {
    return User.findById(id);
  }

  async create(userData) {
    const user = new User(userData);
    return user.save();
  }

  async updatePassword(userId, hashedPassword) {
    return User.findByIdAndUpdate(
      userId,
      { password: hashedPassword, resetPasswordToken: undefined, resetPasswordExpires: undefined },
      { new: true }
    );
  }

  async setResetToken(userId, token, expiresAt) {
    return User.findByIdAndUpdate(
      userId,
      {
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt,
      },
      { new: true }
    );
  }

  async findByResetToken(token) {
    const now = new Date();
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: now },
    });
  }
}

export default new UserDAO();
