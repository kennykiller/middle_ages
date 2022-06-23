import { Film } from "../interfaces/models";

class scheduleCreator {
  start: Date;
  end: Date;
  constructor(public scheduleArr: string[]) {
    this.scheduleArr = scheduleArr;
  }
  setSchedule(el: string) {
    const scheduleDate = el.split("-")[2];
    this.start = new Date(el);
    this.start.setUTCDate(+scheduleDate);
    this.start.setUTCHours(5, 0, 0, 0);
    this.end = new Date(el);
    this.end.setUTCDate(+scheduleDate);
    this.end.setUTCHours(23, 59, 59, 999);
  }
}

export class oneFilmScheduleCreator extends scheduleCreator {
  hDur: string;
  mDur: string;
  sDur: string;
  constructor(
    public scheduleArr: string[],
    public film: Film,
    public filmEndsBeforeSchedule: Boolean = false
  ) {
    super(scheduleArr);
    this.film = film;
    this.filmEndsBeforeSchedule = filmEndsBeforeSchedule;
  }

  durationCount(film: Film) {
    [this.hDur, this.mDur, this.sDur] = film.filmDuration.split(":");
  }
  postponeStart() {
    this.start.setUTCHours(this.start.getUTCHours() + +this.hDur);
    this.start.setUTCMinutes(this.start.getUTCMinutes() + +this.mDur + 15);
    this.start.setUTCSeconds(this.start.getUTCSeconds() + +this.sDur);
  }
}

export class multipleFilmsScheduleCreator extends oneFilmScheduleCreator {
  constructor(
    public scheduleArr: string[],
    public film: Film,
    public filmEndsBeforeSchedule: Boolean = false,
    public films: Film[]
  ) {
    super(scheduleArr, film, filmEndsBeforeSchedule);
    this.films = films;
  }
}
