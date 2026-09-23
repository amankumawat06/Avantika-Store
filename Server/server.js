import app from "./src/app.js";
import { config } from "./config/config.js";
import { ConnectToDB } from "./config/db.js";

ConnectToDB();

const startServer = () => {
  app.listen(config.port, () => {
    console.log(`Server is running on PORT ${config.port}`);
  });
};

startServer();
