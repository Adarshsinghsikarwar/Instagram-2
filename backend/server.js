import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import dns from "dns";
import { Server } from "socket.io";
import { createServer } from "http";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const httpServer = createServer(app);
const io = new Server(httpServer, {});

io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  socket.on("disconnect", () => {
    console.log("A user disconnected: " + socket.id);
  });
});

connectDB();

httpServer.listen(3000, () => {
  console.log("Server is running on port 3000");
});
