const dotenv = require("dotenv");
dotenv.config();
const prisma = require("./utils/database");
const Socket = require("./socket");
const app = require("./app");
const server = require("http").createServer(app);

const socket = new Socket(server);

app.set("socket", socket);

const port = 3000;

server.listen(port, () => {
  console.log(`App Started at port: ${port}`);
});
