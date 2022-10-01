import { MigrationInterface, QueryRunner } from 'typeorm';

export class addGenres1664616153216 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const result = await queryRunner.query(
      `INSERT INTO genre (name)
              VALUES ('боевик'),
                  ('драма'),
                  ('мультфильм'),
                  ('комедия'),
                  ('триллер'),
                  ('ужасы'),
                  ('семейный'),
                  ('спорт'),
                  ('исторический'),
                  ('документальный'),
                  ('детектив'),
                  ('приключения');`,
    );
    console.log(result);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE * FROM genre`);
  }
}
