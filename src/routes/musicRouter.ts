import { MusicController } from "../controller/MusicController";
import express from "express";

export const musicRouter = express.Router();

const musicController = new MusicController();

musicRouter.post("/register", musicController.insertSong);
musicRouter.get("/get/:id", musicController.getSongById);
musicRouter.get("/get-albums", musicController.getAllAlbums);
musicRouter.get("/get/", musicController.getSongByUserId);
musicRouter.get("/get-songs", musicController.getAllSongs);
musicRouter.delete("/delete/:id", musicController.deleteSongById);
