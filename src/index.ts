import { AppDataSource } from "./data-source";
const dotenv = require("dotenv");
const https = require("https");
const fs = require("fs");
import "./index";

dotenv.config();

const app = require("./app");

const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
};

AppDataSource.initialize()
  .then(async () => {
    const port = process.env.PORT || 3000;
    const server = https.createServer(options, app);

    server.listen(port, () => {
      console.log("Listening on port: ", port);
    });

    process.on("unhandledRejection", (err) => {
      console.log(err);
      console.log("SHUTTING DOWN!!!");
      server.close(() => {
        process.exit(1);
      });
    });

    process.on("uncaughtException", (err) => {
      console.log(err);
      console.log("SHUTTING DOWN!!!");
      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((error) => console.log(error));
