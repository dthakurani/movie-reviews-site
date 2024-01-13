import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateMovie1705127405464 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      await queryRunner.createTable(
        new Table({
          name: 'movie',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
              default: 'uuid_generate_v4()',
            },
            {
              name: 'name',
              type: 'varchar',
              isNullable: false,
              isUnique: true,
            },
            {
              name: 'release_date',
              type: 'date',
              isNullable: false,
            },
            {
              name: 'user_id',
              type: 'uuid',
              isNullable: false,
            },
            {
              name: 'average_rating',
              type: 'numeric',
              isNullable: false,
              default: 0,
            },
            {
              name: 'review_count',
              type: 'integer',
              isNullable: false,
              default: 0,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'now()',
              isNullable: false,
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'now()',
              isNullable: false,
            },
            {
              name: 'deleted_at',
              type: 'timestamp',
              isNullable: true,
            },
          ],
        }),
        true,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();
    try {
      await queryRunner.dropTable('movie');

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
  }
}
