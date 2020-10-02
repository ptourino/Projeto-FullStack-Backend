export class Playlist {
  constructor(
    private id: string,
    private title: string,
    private subtitle: string,
    private image: string,
    private creator_id: string
  ) {}

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getSubtitle() {
    return this.subtitle;
  }

  getImage() {
    return this.image;
  }

  getCreatorId() {
    return this.creator_id;
  }

  setId(id: string) {
    this.id = id;
  }

  setTitle(title: string) {
    this.title = title;
  }

  setSubtitle(subtitle: string) {
    this.subtitle = subtitle;
  }

  setImage(image: string) {
    this.image = image;
  }

  setCreatorId(creator_id: string) {
    this.creator_id = creator_id;
  }

  static toPlaylistModel(playlist: any): Playlist {
    return new Playlist(
      playlist.id,
      playlist.title,
      playlist.subtitle,
      playlist.image,
      playlist.creator_id
    );
  }
}

export interface PlaylistInputDTO {
  title: string;
  subtitle: string;
  image: string;
  creator_id: string;
}

export interface PlaylistFeedInputDTO {
  title: string;
  genre: string;
  orderBy: string;
  orderType: string;
  page: number;
}
