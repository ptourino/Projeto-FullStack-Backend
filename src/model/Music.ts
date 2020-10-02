export class Music {
  constructor(
    private id: string,
    private title: string,
    private author: string,
    private date: Date,
    private file: string,
    private album: string,
    private added_by: string
  ) {}

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getAuthor() {
    return this.author;
  }

  getDate() {
    return this.date;
  }

  getFile() {
    return this.file;
  }

  getAlbum() {
    return this.album;
  }

  getAddedBy() {
    return this.added_by;
  }

  setId(id: string) {
    this.id = id;
  }

  setName(title: string) {
    this.title = title;
  }

  setAuthor(author: string) {
    this.author = author;
  }

  setDate(date: Date) {
    this.date = date;
  }

  setFile(file: string) {
    this.file = file;
  }

  setAlbum(album: string) {
    this.album = album;
  }

  setAddedBy(addedBy: string) {
    this.added_by = addedBy;
  }

  static toMusicModel(music: any): Music {
    return new Music(
      music.id,
      music.title,
      music.author,
      music.date,
      music.file,
      music.album,
      music.added_by
    );
  }
}

export interface MusicInputDTO {
  title: string;
  author: string;
  date: Date;
  file: string;
  album: string;
  album_img: string;
  added_by: string;
}

export interface MusicFeedInputDTO {
  title: string;
  genre: string;
  userSongs: string;
  orderBy: string;
  orderType: string;
  page: number;
}
