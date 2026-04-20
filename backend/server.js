import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import dns from "dns";
import { Server } from "socket.io";
import { createServer } from "http";
import initSocket from "./src/sockets/app.socket.js";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const httpServer = createServer(app);
initSocket(httpServer);
connectDB();

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
