import { AxiosResponse } from "axios";
import { axiosInstance as axios } from "../../utils/axios";
import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";

interface filmStartingTime {
  time: string[];
  filmId: number;
}
interface filmStartResponse {
  timeArray: Date[];
  filmId: number;
}
type scheduleTime = filmStartingTime[];

@Module
class ScheduleModule extends VuexModule {
  scheduleTime: scheduleTime = [];
  chosenFilm?: filmStartingTime;

  @Mutation
  pushScheduleTime(filmData: filmStartResponse) {
    const formattedTime = filmData.timeArray.map((t) => {
      const date = new Date(t);
      const hourOfStart =
        date.getHours() < 10 ? "0" + date.getHours() : String(date.getHours());
      const minOfStart =
        date.getMinutes() < 10
          ? "0" + date.getMinutes()
          : String(date.getMinutes());
      return `${hourOfStart}:${minOfStart}`;
    });
    const startingTime = [...new Set(formattedTime)];
    this.scheduleTime.push({ filmId: filmData.filmId, time: startingTime });
  }

  @Mutation
  updateChosenFilm(filmId: number) {
    this.chosenFilm = this.scheduleTime.find((el) => el.filmId === filmId);
    console.log(this.chosenFilm);
  }

  @Action
  async getSchedule(filmId: number) {
    if (this.scheduleTime.find((el) => el.filmId === filmId)) {
      return this.updateChosenFilm(filmId);
    }
    try {
      const res: AxiosResponse<filmStartResponse> = await axios.get(
        `sessions/${filmId}/base-schedule`
      );
      console.log(res, "res");

      if (res.data.timeArray?.length) {
        this.pushScheduleTime(res.data);
        this.updateChosenFilm(filmId);
      }
    } catch (e) {
      console.log(e);

      throw new Error("Сеансы не запланированы");
    }
  }
}

import { store } from "../index";
export const scheduleModule = new ScheduleModule({ store, name: "schedule" });
