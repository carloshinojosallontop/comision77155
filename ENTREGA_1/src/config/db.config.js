import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/db_entrega1";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Conectado a la base de datos MongoDB");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos MongoDB:", error);
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log("Conexión a MongoDB cerrada");
    process.exit(0);
  });


export default mongoose;
