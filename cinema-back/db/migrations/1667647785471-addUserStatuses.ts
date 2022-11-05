import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserStatuses1667647785471 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const result = await queryRunner.query(
      `INSERT INTO user_status (name, startAmount, endAmount)
            VALUES ('Начинающий фанат', 0, 5),
                ('Придирчивый посетитель', 6, 10),
                ('Киноман', 11, 20),
                ('Участник комиссии Оскар', 21, 50),
                ('Председатель комиссии Оскар', 51, 100),
                ('Насмотрел на Оскар', 101, 100000);`,
    );
    console.log(result);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM user_status`);
  }
}