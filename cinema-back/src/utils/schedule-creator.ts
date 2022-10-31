import { Genre } from '../genre/genre.entity';
import { Film } from '../film/film.entity';
import { LocalTime, UTCTime } from './time-calculation';

type mode = 'local' | 'utc';
type condition =
  | 'new-or-old-same-age'
  | 'new-and-old-same-age'
  | 'new-or-old-dif-age'
  | 'new-and-old-dif-age';

interface adjustedFilm {
  totalDuration: string;
  isOld: boolean;
  fullDay: boolean;
  id?: number;
  name: string;
  ageRestriction: string;
  posterUrl: string;
  description: string;
  startDate: Date;
  filmDuration: string;
  basePrice: number;
  genres: Genre[];
  endDate: Date;
}

class scheduleCreator {
  start: Date;
  end: Date;
  constructor(public scheduleArr: string[]) {
    this.scheduleArr = scheduleArr;
  }

  setSchedule(el: string) {
    const scheduleDate = el.split('-')[2];
    this.start = new Date(el);
    this.start.setUTCDate(+scheduleDate);
    this.start.setUTCHours(5, 0, 0, 0);
    this.end = new Date(el);
    this.end.setUTCDate(+scheduleDate);
    this.end.setUTCHours(23, 59, 59, 999);
  }

  calculateTime(start: Date, mode: mode) {
    return mode === 'local'
      ? new LocalTime(start).timeOfStart
      : new UTCTime(start).timeOfStart;
  }
}

export class oneFilmScheduleCreator extends scheduleCreator {
  hDur: string;
  mDur: string;
  sDur: string;
  constructor(
    public scheduleArr: string[],
    private film: Film,
    private filmEndsBeforeSchedule: boolean = false,
  ) {
    super(scheduleArr);
  }

  durationCount(film: Film) {
    [this.hDur, this.mDur, this.sDur] = film.filmDuration.split(':');
  }
  postponeStart() {
    this.start.setUTCHours(this.start.getUTCHours() + +this.hDur);
    this.start.setUTCMinutes(this.start.getUTCMinutes() + +this.mDur + 15);
    this.start.setUTCSeconds(this.start.getUTCSeconds() + +this.sDur);
  }
}

export class multipleFilmsScheduleCreator extends scheduleCreator {
  adjustedFilms: adjustedFilm[];
  multipleFilmsSchedule: { [x: string]: any[] }[];
  condition: condition;
  constructor(public films: Film[], public scheduleArr: string[]) {
    super(scheduleArr);
    this.films = films;
  }

  setupBase() {
    return this.scheduleArr.map((el) => {
      const daySchedule = {
        [el]: [],
      };
      this.setSchedule(el);
      this.updateFilms();
      this.checkConditions();
      this.fillSchedule(el, daySchedule);
      return daySchedule;
    });
  }

  updateFilms() {
    this.adjustedFilms = this.films.map((film) => {
      const [hDur, mDur, sDur] = film.filmDuration.split(':');
      const d = new Date();
      d.setUTCHours(+hDur, +mDur + 15, +sDur);
      const totalDuration = this.calculateTime(d, 'utc');
      const dateForOldCheck = new Date(film.startDate);
      dateForOldCheck.setUTCDate(dateForOldCheck.getUTCDate() + 6);

      const fullDay = parseInt(film.ageRestriction, 10) > 11;
      return {
        ...film,
        totalDuration,
        isOld: dateForOldCheck <= this.start,
        fullDay,
      };
    });
  }

  checkConditions() {
    let isNew = false;
    let isOld = false;
    let isFullDay = false;
    let isPartDay = false;
    this.adjustedFilms.forEach((film) => {
      film.fullDay ? (isFullDay = true) : (isPartDay = true);
      film.isOld ? (isOld = true) : (isNew = true);
    });
    if (isNew && isOld && isFullDay && isPartDay) {
      this.condition = 'new-and-old-dif-age'; //новые и старые фильмы с разной возрастной категорией
      return;
    }
    if (((isNew && !isOld) || (!isNew && isOld)) && isFullDay && isPartDay) {
      this.condition = 'new-or-old-dif-age'; //либо новые, либо старые с разной возрастной категорией
      return;
    }
    if (isNew && isOld && (isFullDay || isPartDay)) {
      this.condition = 'new-and-old-same-age'; //фильмы и новые, и старые с одинаковой возрастной категорией
      return;
    }
    this.condition = 'new-or-old-same-age'; //фильмы либо новые, либо старые с одинаковой возрастной категорией
  }

  fillSchedule(el: string, daySchedule: { [x: string]: any[] }) {
    if (this.condition === 'new-or-old-same-age') {
      let currentIdx = 0;
      const { length } = this.adjustedFilms;
      while (this.start < this.end) {
        const timeOfSessionStart = this.calculateTime(this.start, 'local');
        this.setPrice(
          this.start,
          this.adjustedFilms,
          daySchedule,
          el,
          timeOfSessionStart,
          currentIdx,
        );
        this.setScheduleDate(currentIdx);
        currentIdx = currentIdx + 1 === length ? 0 : currentIdx + 1;
      }
    }
    if (this.condition === 'new-and-old-same-age') {
      const oldIdxs = this.adjustedFilms.filter((film) => film.isOld);
      const newIdxs = this.adjustedFilms.filter((film) => !film.isOld);
      const newMaxInRow = 2 * newIdxs.length;
      const oldMaxInRow = oldIdxs.length;
      let currentOldInRow = 0;
      let currentNewInRow = 0;
      let newIdxToShow = 0;
      while (this.start < this.end) {
        const timeOfSessionStart = this.calculateTime(this.start, 'local');
        if (currentNewInRow < newMaxInRow) {
          this.setPrice(
            this.start,
            newIdxs,
            daySchedule,
            el,
            timeOfSessionStart,
            newIdxToShow,
          );
          this.setScheduleDate(newIdxToShow);
          currentNewInRow++;
          newIdxToShow =
            newIdxToShow + 1 === newIdxs.length ? 0 : newIdxToShow + 1;
          currentOldInRow = 0;
        } else if (currentOldInRow < oldMaxInRow) {
          this.setPrice(
            this.start,
            oldIdxs,
            daySchedule,
            el,
            timeOfSessionStart,
            currentOldInRow,
          );
          this.setScheduleDate(currentOldInRow, oldIdxs);
          currentOldInRow++;
          if (currentOldInRow === oldMaxInRow) {
            currentNewInRow = 0;
            newIdxToShow = 0;
          }
        }
      }
    }
    if (this.condition === 'new-or-old-dif-age') {
      let currentIdx = 0;
      const adultFilms = this.adjustedFilms.filter((film) => film.fullDay);
      let currentAdultIdx = 0;
      const { length } = this.adjustedFilms;

      while (this.start < this.end) {
        const timeOfSessionStart = this.calculateTime(this.start, 'local');
        if (this.start.getUTCHours() > 18 || this.start.getHours() < 3) {
          this.setPrice(
            this.start,
            adultFilms,
            daySchedule,
            el,
            timeOfSessionStart,
            currentAdultIdx,
          );
          this.setScheduleDate(currentAdultIdx, adultFilms);

          currentAdultIdx =
            ++currentAdultIdx === adultFilms.length ? 0 : currentAdultIdx++;
        } else {
          this.setPrice(
            this.start,
            this.adjustedFilms,
            daySchedule,
            el,
            timeOfSessionStart,
            currentIdx,
          );
          this.setScheduleDate(currentIdx);
          currentIdx = currentIdx + 1 === length ? 0 : currentIdx + 1;
        }
      }
    }
    if (this.condition === 'new-and-old-dif-age') {
      const oldIdxs = this.adjustedFilms.filter((film) => film.isOld);
      const newIdxs = this.adjustedFilms.filter((film) => !film.isOld);
      const newMaxInRow = 2 * newIdxs.length;
      const oldMaxInRow = oldIdxs.length;
      let currentOldInRow = 0;
      let currentNewInRow = 0;
      let newIdxToShow = 0;
      let currentAdultIdx = 0;
      const adultFilms = this.adjustedFilms.filter((film) => film.fullDay);
      while (this.start < this.end) {
        const timeOfSessionStart = this.calculateTime(this.start, 'local');
        if (this.start.getHours() > 18 || this.start.getHours() < 3) {
          this.setPrice(
            this.start,
            adultFilms,
            daySchedule,
            el,
            timeOfSessionStart,
            currentAdultIdx,
          );
          this.setScheduleDate(currentAdultIdx, adultFilms);
          currentAdultIdx =
            ++currentAdultIdx === adultFilms.length ? 0 : currentAdultIdx++;
        } else if (currentNewInRow < newMaxInRow) {
          this.setPrice(
            this.start,
            newIdxs,
            daySchedule,
            el,
            timeOfSessionStart,
            newIdxToShow,
          );
          this.setScheduleDate(newIdxToShow, newIdxs);
          currentNewInRow++;
          newIdxToShow =
            newIdxToShow + 1 === newIdxs.length ? 0 : newIdxToShow + 1;
          currentOldInRow = 0;
        } else if (currentOldInRow < oldMaxInRow) {
          this.setPrice(
            this.start,
            oldIdxs,
            daySchedule,
            el,
            timeOfSessionStart,
            currentOldInRow,
          );
          this.setScheduleDate(currentOldInRow, oldIdxs);
          currentOldInRow++;
          if (currentOldInRow === oldMaxInRow) {
            currentNewInRow = 0;
            newIdxToShow = 0;
          }
        }
      }
    }
    daySchedule[el].pop();
  }

  setScheduleDate(idx: number, customArr?: adjustedFilm[]) {
    const [hDur, mDur, sDur] = customArr
      ? customArr[idx].totalDuration.split(':')
      : this.adjustedFilms[idx].totalDuration.split(':');
    this.start.setUTCHours(this.start.getUTCHours() + +hDur);
    this.start.setUTCMinutes(this.start.getUTCMinutes() + +mDur);
    this.start.setUTCSeconds(this.start.getUTCSeconds() + +sDur);
  }

  setPrice(
    start: Date,
    arr,
    arrToPush,
    key: string,
    timeOfSessionStart: string,
    idx: number,
  ) {
    if (start.getHours() < 12) {
      const reducedPrice = arr[idx].basePrice * 0.85;
      arrToPush[key].push({
        [timeOfSessionStart]: {
          ...arr[idx],
          price: reducedPrice,
        },
      });
    } else if (start.getHours() > 18) {
      const increasedPrice = arr[idx].basePrice * 1.15;
      arrToPush[key].push({
        [timeOfSessionStart]: {
          ...arr[idx],
          price: increasedPrice,
        },
      });
    } else {
      arrToPush[key].push({
        [timeOfSessionStart]: {
          ...arr[idx],
          price: arr[idx].basePrice,
        },
      });
    }
  }
}
