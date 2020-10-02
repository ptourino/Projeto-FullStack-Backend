import dotenv from "dotenv";
import cors from "cors";
import { AddressInfo } from "net";
import express from "express";
import { userRouter } from "./routes/userRouter";
import { musicRouter } from "./routes/musicRouter";
import { playlistRouter } from "./routes/playlistRouter";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRouter);
app.use("/music", musicRouter);
app.use("/playlist", playlistRouter);

const server = app.listen(3000, () => {
  if (server) {
    const address = server.address() as AddressInfo;
    console.log(`Server up and running on http://localhost:${address.port}`);
  } else {
    console.error(`Failure on running the server.`);
  }
});
