import { MusicDatabase } from "../data/MusicDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { MusicFeedInputDTO, MusicInputDTO } from "../model/Music";

export class MusicBusiness {
  async insertSong(music: MusicInputDTO, genres: string[]) {
    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();

    const musicDatabase = new MusicDatabase();
    const AllSongs = await this.getAllSongs();

    let songExistAlready = false;
    for (const song of AllSongs) {
      if (
        song.title === music.title &&
        song.author === music.author &&
        song.album === music.album
      ) {
        songExistAlready = true;
        throw new Error("This song is already registered in the database!");
      }
    }

    if (!songExistAlready) {
      await musicDatabase.insertSong(
        id,
        music.title,
        music.author,
        music.date,
        music.file,
        music.album,
        music.added_by
      );
    }

    const albums: any[] = await musicDatabase.getAllAlbums();
    let count = 0;

    for (let item of albums) {
      count++;
      if (music.album === item.album && music.author === item.author) {
        break;
      } else if (
        music.album !== item.album &&
        music.author !== item.author &&
        count === albums.length
      ) {
        const albumId = idGenerator.generate();
        await musicDatabase.insertAlbum(
          albumId,
          music.album,
          music.author,
          music.album_img
        );
      }
    }

    const receivedGenres: string[] = [];
    for (let genre of genres) {
      receivedGenres.push(genre);
    }

    for (const genre of receivedGenres) {
      const musicGenreId = idGenerator.generate();
      await musicDatabase.insertMusicGenre(musicGenreId, id, genre);
    }
  }

  async getSongById(id: any) {
    const musicDatabase = new MusicDatabase();
    const musicFromDB = await musicDatabase.getSongById(id);

    return musicFromDB;
  }

  async getSongByUserId(id: any) {
    const musicDatabase = new MusicDatabase();
    const musicFromDB = await musicDatabase.getSongByUserId(id);

    return musicFromDB;
  }

  async getMusicGenres(music_id: string) {
    const musicDatabase = new MusicDatabase();
    const musicGenreFromDB = await musicDatabase.getMusicGenres(music_id);

    return musicGenreFromDB;
  }

  async getAlbums(album: string, author: string) {
    const musicDatabase = new MusicDatabase();
    const albumsFromDB = await musicDatabase.getAlbums(album, author);

    return albumsFromDB;
  }

  async deleteSongById(id: string) {
    const musicDatabase = new MusicDatabase();
    const songToDelete = await musicDatabase.deleteSongById(id);
    const musicGenresToDelete = await musicDatabase.deleteMusicGenresById(id);

    return songToDelete;
  }

  async getAllSongs() {
    const musicDatabase = new MusicDatabase();
    const musicFromDB = await musicDatabase.getAllSongs();

    return musicFromDB;
  }

  async getAllAlbums() {
    const musicDatabase = new MusicDatabase();
    const albumsFromDB = await musicDatabase.getAllAlbums();

    return albumsFromDB;
  }

  async getAllSongsFiltered(
    token: string,
    feedInput: MusicFeedInputDTO
  ): Promise<MusicFeedInputDTO[]> {
    if (!feedInput.page || feedInput.page < 1 || Number.isNaN(feedInput.page)) {
      feedInput.page = 1;
    }

    const songsPerPage = 20;

    const offset = songsPerPage * (feedInput.page - 1);

    if (!feedInput.genre) {
      feedInput.genre = "";
      //throw new Error("Envie um nome de usuário válido");
    }

    if (!feedInput.title) {
      feedInput.title = "";
      //throw new Error("Envie um nome de usuário válido");
    }

    if (feedInput.orderBy !== "title" && feedInput.orderBy !== "createdAt") {
      // throw new Error("Passe um parâmetro de ordenação válido")
      feedInput.orderBy = "title";
    }

    if (feedInput.orderType !== "ASC" && feedInput.orderType !== "DESC") {
      feedInput.orderType = "ASC";
    }

    if (!feedInput.userSongs) {
      feedInput.userSongs = "";
    } else if ((feedInput.userSongs = "yes")) {
      feedInput.userSongs = token;
    }

    const musicDatabase = new MusicDatabase();
    const musicFromDB = await musicDatabase.getAllSongsFiltered(
      feedInput,
      songsPerPage,
      offset
    );

    return musicFromDB;
  }
}
