export class Concert {
  constructor(
    private id: string,
    private weekDay: string,
    private startTime: string,
    private endTime: string,
    private bandId: string
  ) {}

  getId() {
    return this.id;
  }

  getWeekDay() {
    return this.weekDay;
  }

  getStartTime() {
    return this.startTime;
  }

  getEndTime() {
    return this.endTime;
  }

  getBandId() {
    return this.bandId;
  }

  setId(id: string) {
    this.id = id;
  }

  setWeekDay(weekDay: string) {
    this.weekDay = weekDay;
  }

  setStartTime(startTime: string) {
    this.startTime = startTime;
  }

  setEndTime(endTime: string) {
    this.endTime = endTime;
  }

  setBandId(bandId: string) {
    this.bandId = bandId;
  }

  static toConcertModel(concert: any): Concert {
    return new Concert(
      concert.id,
      concert.weekDay,
      concert.startTime,
      concert.endTime,
      concert.bandId
    );
  }
}

export interface ConcertInputDTO {
  weekDay: string;
  startTime: number;
  endTime: number;
  bandId: string;
}
