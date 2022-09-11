import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'developer',
  password: 'dev-secret',
  database: 'middle-ages',
  autoLoadEntities: true,
  synchronize: true, //just for dev
} as TypeOrmModuleOptions;
