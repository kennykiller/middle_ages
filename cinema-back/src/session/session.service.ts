import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThan, Repository } from 'typeorm';
import { Film } from '../film/film.entity';
import { FilmService } from '../film/film.service';
import { DailySchedule, FilmForSession } from '../interfaces/schedule';
import { SeatService } from '../seat/seat.service';
import { Session } from '../session/session.entity';
import {
  multipleFilmsScheduleCreator,
  oneFilmScheduleCreator,
} from '../utils/schedule-creator';
import { LocalTime, UTCTime } from '../utils/time-calculation';
import { CreateSessionDto } from './dto/CreateSessionDto';
import { FindSessionDto } from './dto/FindSessionDto';

type mode = 'local' | 'utc';
type FilmForRecalculation = Partial<FilmForSession>;
@Injectable()
export class SessionService {
  public ITEMS_PER_PAGE = 4;

  constructor(
    @Inject(forwardRef(() => SeatService))
    private seatService: SeatService,
    @InjectRepository(Session)
    private sessionRepo: Repository<Session>,
    private filmService: FilmService,
  ) {}

  async verifyCreationPossibility() {
    const startSchedulePeriod = new Date();
    startSchedulePeriod.setUTCHours(0, 0, 0);
    startSchedulePeriod.setUTCDate(startSchedulePeriod.getUTCDate() + 6);
    const endSchedulePeriod = new Date();
    endSchedulePeriod.setUTCHours(23, 59, 59);
    endSchedulePeriod.setUTCDate(endSchedulePeriod.getUTCDate() + 12);
    try {
      const existingSchedule = await this.sessionRepo.findOne({
        where: {
          filmStart: Between(startSchedulePeriod, endSchedulePeriod),
        },
      });
      if (existingSchedule) {
        throw new ConflictException({
          message: 'На эти даты расписание уже создано',
        });
      } else {
        const calculatedSchedule = this.calculateSchedule(
          startSchedulePeriod,
          endSchedulePeriod,
        );
        return calculatedSchedule;
      }
    } catch (e) {
      throw new BadRequestException();
    }
  }

  private async calculateSchedule(
    startSchedulePeriod: Date,
    endSchedulePeriod: Date,
  ) {
    try {
      const receivedFilms = await this.filmService.getFilmsByPeriod(
        startSchedulePeriod,
        endSchedulePeriod,
      );

      const schedule = await this.prepareSchedule(
        receivedFilms,
        startSchedulePeriod,
        endSchedulePeriod,
      );

      return schedule;
    } catch (e) {
      throw new Error(e);
    }
  }

  async createSession(createSessionDto: CreateSessionDto) {
    const sessionCreateReq = this.sessionRepo.create({
      film: { id: createSessionDto.filmId },
      price: createSessionDto.price,
      filmStart: createSessionDto.filmStart,
    });
    try {
      const session = await this.sessionRepo.save(sessionCreateReq);
      await this.seatService.createSeats({ session });
      return { message: 'Сеанс добавлен.', createdSession: session };
    } catch {
      throw new Error('Session was not created');
    }
  }

  adjustSchedule(sessionsArray: DailySchedule[]) {
    const startOfSession = new Date();
    startOfSession.setHours(8, 0, 0, 0);
    const recalculatedSchedule = sessionsArray.map((session) => {
      const timeOfSessionStart = new LocalTime(startOfSession).timeOfStart;
      //пересчитанное время начала сеанса
      const hourOfSessionStart = startOfSession.getHours();
      const basePrice = (Object.values(session)[0] as FilmForRecalculation)
        .basePrice;
      const price =
        hourOfSessionStart < 12
          ? Math.floor(basePrice * 0.85)
          : hourOfSessionStart >= 18
          ? Math.floor(basePrice * 1.15)
          : Math.floor(basePrice);
      const [hDur, mDur, sDur] = (
        Object.values(session)[0] as FilmForRecalculation
      ).totalDuration.split(':');
      startOfSession.setHours(startOfSession.getHours() + +hDur);
      startOfSession.setMinutes(startOfSession.getMinutes() + +mDur);
      startOfSession.setSeconds(startOfSession.getSeconds() + +sDur);
      return {
        [timeOfSessionStart]: {
          ...(Object.values(session)[0] as FilmForRecalculation),
          price,
        },
      };
    });
    return recalculatedSchedule;
  }

  private async prepareSchedule(films: Film[], start: Date, end: Date) {
    if (!films.length) {
      throw new NotFoundException('Нет фильмов в прокате на эти даты');
    }
    const weekSchedule: string[] = [];
    while (start < end) {
      const keyDate = start.toISOString().split('T')[0];
      weekSchedule.push(keyDate);
      start.setUTCDate(start.getUTCDate() + 1);
    }
    if (films.length === 1) {
      return films[0].endDate > end
        ? this.oneFilmSchedule(films[0], weekSchedule)
        : this.oneFilmSchedule(films[0], weekSchedule, true);
    } else {
      const multipleCreator = new multipleFilmsScheduleCreator(
        films,
        weekSchedule,
      );
      return multipleCreator.setupBase();
    }
  }

  private oneFilmSchedule(
    film: Film,
    scheduleArr: string[],
    filmEndsBeforeSchedule = false,
  ) {
    const filmScheduleCreator = new oneFilmScheduleCreator(
      scheduleArr,
      film,
      filmEndsBeforeSchedule,
    );
    filmScheduleCreator.durationCount(film);
    const arr = scheduleArr.map((el) => {
      const daySchedule = {
        [el]: [],
      };
      filmScheduleCreator.setSchedule(el);
      if (filmEndsBeforeSchedule && filmScheduleCreator.start > film.endDate) {
        return daySchedule;
      }
      while (filmScheduleCreator.start < filmScheduleCreator.end) {
        const timeOfSessionStart = this.calculateTime(
          filmScheduleCreator.start,
          'local',
        );
        daySchedule[el].push({ [timeOfSessionStart]: film });
        filmScheduleCreator.postponeStart();
      }
      daySchedule[el].pop();
      return daySchedule;
    });
    return arr;
  }

  public calculateTime(start: Date, mode: mode) {
    return mode === 'local'
      ? new LocalTime(start).timeOfStart
      : new UTCTime(start).timeOfStart;
  }

  async getSessionWithSeats(id: number) {
    try {
      const session = await this.sessionRepo.findOneBy({ id });
      const seats = await this.seatService.getSeatsForSession(session);
      return { seats, session };
    } catch (e) {
      throw new BadRequestException('Session does not exist');
    }
  }

  async findSessions(dto: FindSessionDto) {
    try {
      const film = await this.filmService.getFilmWithoutModify(dto.filmId);
      const dateStart = new Date(dto.date);
      dateStart.setUTCHours(0, 0, 0, 0);
      const dateEnd = new Date(dto.date);
      dateEnd.setUTCHours(23, 59, 59, 999);

      const sessions = await this.sessionRepo.find({
        where: {
          film,
          filmStart: Between(dateStart, dateEnd),
        },
      });

      return sessions;
    } catch (e) {
      throw new HttpException(e.message || 'Error occured', 400);
    }
  }

  async updateAvailableSeats(
    sessionId: number,
    seatsAmount: number,
    changeType: 'decrease' | 'increase',
  ) {
    const currentSeatsAmount = await this.sessionRepo.findOne({
      where: { id: sessionId },
    });
    return await this.sessionRepo.update(
      {
        id: sessionId,
      },
      {
        seatsAvailable:
          changeType === 'decrease'
            ? currentSeatsAmount.seatsAvailable - seatsAmount
            : currentSeatsAmount.seatsAvailable + seatsAmount,
      },
    );
  }

  async getBaseFilmSchedule(id: number) {
    try {
      const film = await this.filmService.getFilmWithoutModify(id);
      const sessions = await this.sessionRepo.find({
        where: { film, filmStart: MoreThan(new Date()) },
      });
      return {
        timeArray: sessions.map((s) => s.filmStart),
        filmId: id,
      };
    } catch (e) {
      throw new HttpException('Fail to find sessions', 404);
    }
  }
}
