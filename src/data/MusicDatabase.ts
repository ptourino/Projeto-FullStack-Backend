import { BaseDatabase } from "./BaseDatabase";
import { MusicFeedInputDTO } from "../model/Music";

export class MusicDatabase extends BaseDatabase {
  private static TABLE_NAME = "MC_Music";

  public async insertSong(
    id: string,
    title: string,
    author: string,
    date: Date,
    file: string,
    album: string,
    added_by: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          title,
          author,
          date,
          file,
          album,
          added_by,
        })
        .into(MusicDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async insertMusicGenre(
    id: string,
    music_id: string,
    genre: string
  ): Promise<any> {
    try {
      await this.getConnection()
        .insert({
          id,
          music_id,
          genre,
        })
        .into("MC_MusicGenres");
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async insertAlbum(
    id: string,
    album: string,
    author: string,
    album_img: string
  ): Promise<any> {
    try {
      await this.getConnection()
        .insert({
          id,
          album,
          author,
          album_img,
        })
        .into("MC_Albums");
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getSongById(id: string): Promise<any> {
    try {
      const result = await this.getConnection().raw(`
      SELECT m.*, g.genre, a.album_img FROM MC_Music m
      INNER JOIN MC_Albums a
      INNER JOIN MC_MusicGenres g
      ON (m.album = a.album AND m.author = a.author AND g.music_id = m.id)
      WHERE m.id = "${id}"
      `);

      result[0] = result[0].filter(
        (el: any, index: any, self: any) =>
          index ===
          self.findIndex((e: any) => e.title === el.title && e.id === el.id)
      );

      return result[0][0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getSongByUserId(added_by: string): Promise<any> {
    try {
      const result = await this.getConnection().raw(`
      SELECT m.*, g.genre, a.album_img FROM MC_Music m
      INNER JOIN MC_Albums a
      INNER JOIN MC_MusicGenres g
      ON (m.album = a.album AND m.author = a.author AND g.music_id = m.id)
      WHERE m.added_by = "${added_by}"
      `);

      result[0] = result[0].filter(
        (el: any, index: any, self: any) =>
          index ===
          self.findIndex((e: any) => e.title === el.title && e.id === el.id)
      );
      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteSongById(id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .delete()
        .from(MusicDatabase.TABLE_NAME)
        .where({ id });

      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteMusicGenresById(id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .delete("")
        .from("MC_MusicGenres")
        .where({ music_id: id });

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getMusicGenres(music_id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select("genre")
        .from("MC_MusicGenres")
        .where({ music_id });
      let counter = -1;
      let newResult = [];
      for (const item of result) {
        counter++;
        newResult.push(result[counter].genre);
      }

      return newResult;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAlbums(album: string, author: string): Promise<any> {
    try {
      const result = await this.getConnection().raw(`
      SELECT a.album, a.author, a.album_img FROM MC_Albums a
      INNER JOIN MC_Albums m
      ON (m.album = a.album AND m.author = a.author)
      WHERE (a.album LIKE "%${album}%" AND a.author LIKE "%${author}%");
      `);

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllSongs(): Promise<any> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from(MusicDatabase.TABLE_NAME);

      let counter = -1;
      let newResult = [];
      for (const item of result) {
        counter++;
        newResult.push(result[counter]);
      }

      return newResult;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllAlbums(): Promise<any> {
    try {
      const result = await this.getConnection().raw(`
      SELECT album, author, album_img from MC_Albums
      `);

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllSongsFiltered(
    feedInput: MusicFeedInputDTO,
    musicPerPage: number,
    offset: number
  ): Promise<any> {
    try {
      // Slices para remover as aspas da string
      const genre = feedInput.genre.slice(1, -1);
      const title = feedInput.title.slice(1, -1);
      const userSongs = feedInput.userSongs.slice(1, -1);

      const result = await this.getConnection().raw(`
        SELECT m.*, g.genre, a.album_img from MC_Music m 
        INNER JOIN MC_Albums a
        INNER JOIN MC_MusicGenres g
        ON (m.album = a.album AND m.author = a.author AND g.music_id = m.id)
        WHERE (g.genre LIKE "%${genre}%" AND m.title LIKE "%${title}%" AND m.added_by LIKE "%${userSongs}%")
        ORDER BY ${feedInput.orderBy} ${feedInput.orderType}  
      `);

      result[0] = result[0].filter(
        (el: any, index: any, self: any) =>
          index ===
          self.findIndex((e: any) => e.title === el.title && e.id === el.id)
      );

      return result[0];
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}
