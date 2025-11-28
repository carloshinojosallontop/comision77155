import { toUserDTO } from "../dtos/user.dto.js";

export const getAdminArea = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Acceso a área de administración",
    user: toUserDTO(req.user),
  });
};
