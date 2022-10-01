import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../src/user/user.entity';
import { Discount } from '../src/discount/discount.entity';
import { Film } from '../src/film/film.entity';
import { Genre } from '../src/genre/genre.entity';
import { Order } from '../src/order/order.entity';
import { RefreshToken } from '../src/refresh_token/refresh_token.entity';
import { ResetToken } from '../src/reset_token/reset_token.entity';
import { Seat } from '../src/seat/seat.entity';
import { Session } from '../src/session/session.entity';
import { PaymentStatus } from '../src/status/payment_status.entity';
import { Ticket } from '../src/ticket/ticket.entity';
import { addGenres1664616153216 } from './migrations/1664616153216-addGenres';
import { addStatuses1664642012469 } from './migrations/1664642012469-addStatuses';

export default {
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: 'developer',
  password: 'dev-secret',
  database: 'middle-ages',
  autoLoadEntities: true,
  entities: [
    User,
    Discount,
    Film,
    Genre,
    Order,
    RefreshToken,
    ResetToken,
    Seat,
    Session,
    PaymentStatus,
    Ticket,
  ],
  migrations: [addGenres1664616153216, addStatuses1664642012469],
  migrationsRun: true,
  synchronize: true, //just for dev
} as TypeOrmModuleOptions;
