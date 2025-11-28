import userDAO from "../daos/user.dao.js";

class UserRepository {
  async getByEmail(email) {
    return userDAO.findByEmail(email);
  }

  async getById(id) {
    return userDAO.findById(id);
  }

  async createUser(data) {
    return userDAO.create(data);
  }

  async changePassword(userId, hashedPassword) {
    return userDAO.updatePassword(userId, hashedPassword);
  }

  async setResetToken(userId, token, expiresAt) {
    return userDAO.setResetToken(userId, token, expiresAt);
  }

  async getByResetToken(token) {
    return userDAO.findByResetToken(token);
  }
}

export default new UserRepository();
