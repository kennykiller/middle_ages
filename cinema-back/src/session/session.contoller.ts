import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GenericValidation } from '../pipes/GenericValidation.pipe';
import { FindSessionDto } from './dto/FindSessionDto';
import { SessionService } from './session.service';

@Controller('sessions')
export class SessionController {
  constructor(private sessionService: SessionService) {}

  @Get('/:filmId/base-schedule')
  async getBaseSchedule(@Param('filmId', ParseIntPipe) filmId: number) {
    return this.sessionService.getBaseFilmSchedule(filmId);
  }

  @Get(':filmId/:date')
  async findSessions(@Param(new GenericValidation()) dto: FindSessionDto) {
    return this.sessionService.findSessions(dto);
  }

  @Get(':id')
  async getSession(@Param('id', ParseIntPipe) id: number) {
    return this.sessionService.getSessionWithSeats(id);
  }
}
