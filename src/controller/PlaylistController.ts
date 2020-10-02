import { PlaylistBusiness } from "../business/PlaylistBusiness";
import { PlaylistFeedInputDTO, PlaylistInputDTO } from "../model/Playlist";
import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import moment from "moment";
import { UserDatabase } from "../data/UserDatabase";
import { MusicDatabase } from "../data/MusicDatabase";
import { MusicBusiness } from "../business/MusicBusiness";

export class PlaylistController {
  async insertPlaylist(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;

      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);

      const userDB = new UserDatabase();
      const user: any = await userDB.getUserById(authenticationData.id);
      const playlistBusiness = new PlaylistBusiness();

      const input: PlaylistInputDTO = {
        title: req.body.title,
        subtitle: req.body.subtitle,
        image: req.body.image || null,
        creator_id: user.id,
      };

      await playlistBusiness.insertPlaylist(input);

      res.status(200).send({
        message: "New playlist added successfully!",
      });
    } catch (error) {
      res.status(401).send({ error: error.message });
    }
  }

  async insertSongIntoPlaylist(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;
      const songId = req.params.id;
      const playlistId = req.body.playlist_id;

      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);

      const userDB = new UserDatabase();
      const user = await userDB.getUserById(authenticationData.id);

      const musicDB = new MusicDatabase();
      const song = await musicDB.getSongById(songId);

      const playlistBusiness = new PlaylistBusiness();
      await playlistBusiness.insertSongIntoPlaylist(song, playlistId);

      res.status(200).send({
        message: "New song added successfully in the playlist!",
      });
    } catch (error) {
      res.status(401).send({ error: error.message });
    }
  }

  async getAllPlaylistsByUserId(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;

      const playlistBusiness = new PlaylistBusiness();
      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);
      const userDB = new UserDatabase();
      const user: any = await userDB.getUserById(authenticationData.id);
      const playlists: any[] = await playlistBusiness.getAllPlaylistsByUserId(
        user.id
      );

      const result = {
        playlists,
      };

      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }

  async deletePlaylistById(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;
      const playlistId = req.params.id;

      const playlistBusiness = new PlaylistBusiness();

      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);

      const userDB = new UserDatabase();
      const user: any = await userDB.getUserById(authenticationData.id);
      const userPlaylists: any[] = await playlistBusiness.getAllPlaylistsByUserId(
        user.id
      );

      for (let playlist of userPlaylists) {
        if (playlist.id === playlistId) {
          await playlistBusiness.deletePlaylistById(playlistId);
        }
      }

      res.status(200).send({
        message: "Playlist deleted successfully!",
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }

  async deleteSongFromPlaylistById(req: Request, res: Response) {
    try {
      const token = req.headers.auth as string;
      const songId = req.params.id;
      const playlistId = req.params.playlistId;

      const playlistBusiness = new PlaylistBusiness();

      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);

      const userDB = new UserDatabase();
      const user: any = await userDB.getUserById(authenticationData.id);
      const playlistsSongs = await playlistBusiness.getPlaylistsSongsIds(
        songId
      );

      if (playlistsSongs.length === 0) {
        throw new Error("Error upon trying to find the song.");
      }

      for (let song of playlistsSongs) {
        if (songId === song.id) {
          await playlistBusiness.deleteSongFromPlaylistById(
            song.music_id,
            playlistId
          );
        } else {
          throw new Error("Error upon trying to delete the song");
        }
      }

      res.status(200).send({
        message: "Song deleted successfully!",
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }

  async getAllPlaylistSongs(req: Request, res: Response) {
    const playlistBusiness = new PlaylistBusiness();
    const musicBusiness = new MusicBusiness();
    try {
      const token = req.headers.auth as string;

      const authenticator = new Authenticator();
      const authenticationData = authenticator.getData(token);
      const userDB = new UserDatabase();
      const user: any = await userDB.getUserById(authenticationData.id);

      const title = req.query.title as string;
      const genre = req.query.genre as string;
      const orderBy = req.query.orderBy as string;
      const orderType = req.query.orderType as string;
      const page = req.query.page as string;
      const playlist_id = req.params.id;

      const feedInput: PlaylistFeedInputDTO = {
        title: title,
        genre: genre,
        orderBy: orderBy,
        orderType: orderType,
        page: Number(page),
      };

      const music: any[] = await playlistBusiness.getAllPlaylistSongsFiltered(
        playlist_id,
        feedInput
      );
      const songs = [];

      for (const item of music) {
        const musicGenres = await musicBusiness.getMusicGenres(item.id);
        const convertedDate = moment(item.date).format("DD-MM-YYYY");
        item.date = convertedDate;
        item.genre = musicGenres;
        songs.push(item);
      }

      const result = {
        songs,
      };

      res.status(200).send(result);
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
}
