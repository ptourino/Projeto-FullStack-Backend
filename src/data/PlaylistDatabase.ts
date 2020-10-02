import { PlaylistFeedInputDTO } from "../model/Playlist";
import { BaseDatabase } from "./BaseDatabase";

export class PlaylistDatabase extends BaseDatabase {
  private static TABLE_NAME = "MC_Playlist";

  public async insertPlaylist(
    id: string,
    title: string,
    subtitle: string,
    image: string,
    creator_id: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id,
          title,
          subtitle,
          image,
          creator_id,
        })
        .into(PlaylistDatabase.TABLE_NAME);
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async insertSongIntoPlaylist(
    id: string,
    music_id: string,
    playlist_id: string
  ): Promise<any> {
    try {
      await this.getConnection()
        .insert({
          id,
          music_id,
          playlist_id,
        })
        .into("MC_PlaylistSongs");
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllPlaylistsByUserId(creator_id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from(PlaylistDatabase.TABLE_NAME)
        .where({ creator_id });

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

  public async getPlaylistSongsIds(id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from("MC_PlaylistSongs")
        .where({ id });
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

  public async deletePlaylistById(playlist_id: string): Promise<any[]> {
    try {
      const firstQuery = await this.getConnection().raw(
        `DELETE FROM MC_PlaylistSongs WHERE playlist_id = "${playlist_id}";`
      );
      const secondQuery = await this.getConnection().raw(
        `DELETE FROM MC_Playlist WHERE id = "${playlist_id}";`
      );
      const result = [firstQuery, secondQuery];

      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteSongFromPlaylistById(
    music_id: string,
    playlist_id: string
  ): Promise<any> {
    try {
      const result = await this.getConnection().raw(`
        DELETE FROM MC_PlaylistSongs WHERE 
        (music_id = '${music_id}' AND playlist_id = '${playlist_id}')
      `);

      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteSongFromPlaylistByMusicId(music_id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .delete()
        .from("MC_PlaylistSongs")
        .where({ music_id });

      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getSongToDeleteByMusicId(music_id: string): Promise<any[]> {
    try {
      const result = await this.getConnection()
        .select("*")
        .from("MC_PlaylistSongs")
        .where({ music_id });

      return result;
    } catch (error) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllPlaylistSongsFiltered(
    feedInput: PlaylistFeedInputDTO,
    playlist_id: string,
    musicPerPage: number,
    offset: number
  ): Promise<any> {
    try {
      // Slices para remover as aspas da string
      const genre = feedInput.genre.slice(1, -1);
      const title = feedInput.title.slice(1, -1);
      const playlistId = playlist_id.slice(1, -1);

      const result = await this.getConnection().raw(`
        SELECT m.*, p.id AS playlistId, g.genre, a.album_img from MC_Music m 
        INNER JOIN MC_MusicGenres g 
        INNER JOIN MC_PlaylistSongs p 
        INNER JOIN MC_Albums a
        ON (m.id = g.music_id AND m.id = p.music_id)
        WHERE (g.genre LIKE "%${genre}%" AND m.title LIKE "%${title}%" AND p.playlist_id LIKE "%${playlistId}%")
        ORDER BY ${feedInput.orderBy} ${feedInput.orderType}  
      `);

      // Para eliminar valores duplicados por causa dos gêneros
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
