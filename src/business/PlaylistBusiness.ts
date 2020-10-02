import { PlaylistDatabase } from "../data/PlaylistDatabase";
import { IdGenerator } from "../services/IdGenerator";
import { PlaylistFeedInputDTO, PlaylistInputDTO } from "../model/Playlist";

export class PlaylistBusiness {
  async insertPlaylist(playlist: PlaylistInputDTO) {
    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();

    const playlistDB = new PlaylistDatabase();

    await playlistDB.insertPlaylist(
      id,
      playlist.title,
      playlist.subtitle,
      playlist.image,
      playlist.creator_id
    );
  }

  async insertSongIntoPlaylist(song: any, playlist_id: any) {
    const idGenerator = new IdGenerator();
    const id = idGenerator.generate();
    const playlistDB = new PlaylistDatabase();
    await playlistDB.insertSongIntoPlaylist(id, song.id, playlist_id);
  }

  async getAllPlaylistsByUserId(id: string) {
    const playlistDB = new PlaylistDatabase();
    const playlists = await playlistDB.getAllPlaylistsByUserId(id);

    return playlists;
  }

  async getPlaylistsSongsIds(playlist_id: string) {
    const playlistDB = new PlaylistDatabase();
    const playlistSongsIdsFromDB = await playlistDB.getPlaylistSongsIds(
      playlist_id
    );

    return playlistSongsIdsFromDB;
  }

  async deletePlaylistById(playlist_id: string) {
    const playlistDB = new PlaylistDatabase();
    const playlistToDelete = await playlistDB.deletePlaylistById(playlist_id);

    return playlistToDelete;
  }
  async deleteSongFromPlaylistById(music_id: string, playlist_id: string) {
    const playlistDatabase = new PlaylistDatabase();
    const songToDelete = await playlistDatabase.deleteSongFromPlaylistById(
      music_id,
      playlist_id
    );

    return songToDelete;
  }

  async getAllPlaylistSongsFiltered(
    playlist_id: string,
    feedInput: PlaylistFeedInputDTO
  ): Promise<PlaylistFeedInputDTO[]> {
    if (!feedInput.page || feedInput.page < 1 || Number.isNaN(feedInput.page)) {
      feedInput.page = 1;
    }

    const songsPerPage = 20;

    const offset = songsPerPage * (feedInput.page - 1);

    if (!feedInput.genre) {
      feedInput.genre = "";
    }

    if (!feedInput.title) {
      feedInput.title = "";
    }

    if (feedInput.orderBy !== "title" && feedInput.orderBy !== "createdAt") {
      feedInput.orderBy = "title";
    }

    if (feedInput.orderType !== "ASC" && feedInput.orderType !== "DESC") {
      feedInput.orderType = "ASC";
    }

    const playlistDatabase = new PlaylistDatabase();
    const playlistSongsFromDB = await playlistDatabase.getAllPlaylistSongsFiltered(
      feedInput,
      playlist_id,
      songsPerPage,
      offset
    );

    return playlistSongsFromDB;
  }
}
