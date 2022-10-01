import { MigrationInterface, QueryRunner } from 'typeorm';

export class addStatuses1664642012469 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const result = await queryRunner.query(
      `INSERT INTO payment_status (name)
            VALUES ('booked'),
                ('sold'),
                ('free');`,
    );
    console.log(result);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM payment_status`);
  }
}
