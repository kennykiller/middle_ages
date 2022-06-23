class Time {
  hourOfStart: string;
  minOfStart: string;
  secOfStart: string;
  timeOfStart: string;
  constructor(public start: Date) {
    this.start = start;
  }
  setTimeOfStartString() {
    this.timeOfStart = `${this.hourOfStart}:${this.minOfStart}:${this.secOfStart}`;
  }
}

export class LocalTime extends Time {
  constructor(public start: Date) {
    super(start);
    this.updateLocalTime();
    this.setTimeOfStartString();
  }
  updateLocalTime() {
    this.hourOfStart =
      this.start.getHours() < 10
        ? "0" + this.start.getHours()
        : String(this.start.getHours());
    this.minOfStart =
      this.start.getMinutes() < 10
        ? "0" + this.start.getMinutes()
        : String(this.start.getMinutes());
    this.secOfStart =
      this.start.getSeconds() < 10
        ? "0" + this.start.getSeconds()
        : String(this.start.getSeconds());
  }
}

export class UTCTime extends Time {
  constructor(public start: Date) {
    super(start);
    this.updateLocalTime();
    this.setTimeOfStartString();
  }
  updateLocalTime() {
    this.hourOfStart =
      this.start.getUTCHours() < 10
        ? "0" + this.start.getUTCHours()
        : String(this.start.getUTCHours());
    this.minOfStart =
      this.start.getUTCMinutes() < 10
        ? "0" + this.start.getUTCMinutes()
        : String(this.start.getUTCMinutes());
    this.secOfStart =
      this.start.getUTCSeconds() < 10
        ? "0" + this.start.getUTCSeconds()
        : String(this.start.getUTCSeconds());
  }
}
