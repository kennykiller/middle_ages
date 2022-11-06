import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserStatuses1667647785471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO user_status (name, startAmount, endAmount, discountPercentage)
            VALUES ('Начинающий ходок', 0, 5, 0),
                ('Придирчивый посетитель', 6, 10, 5),
                ('Киноман', 11, 20, 10),
                ('Участник комиссии Оскар', 21, 50, 15),
                ('Председатель комиссии Оскар', 51, 100, 20),
                ('Насмотрел на Оскар', 101, 100000, 25);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM user_status`);
  }
}