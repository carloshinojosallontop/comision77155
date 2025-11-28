import nodemailer from "nodemailer";

const {
  MAIL_USER,
  MAIL_PASS,
  MAIL_FROM = `Ecommerce Coder <${process.env.MAIL_USER || ""}>`,
} = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

class MailService {
  async sendPasswordResetEmail(to, resetUrl) {
    const mailOptions = {
      from: MAIL_FROM,
      to,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Recuperación de contraseña</h2>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón:</p>
        <p>
          <a href="${resetUrl}" style="background:#4f46e5;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
            Restablecer contraseña
          </a>
        </p>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}

export default new MailService();
