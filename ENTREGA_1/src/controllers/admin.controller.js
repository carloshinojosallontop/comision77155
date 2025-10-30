export const getAdminArea = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Acceso autorizado a área de administración",
    user: req.user,
  });
};