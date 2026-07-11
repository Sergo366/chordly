import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UserProfileFields1783065551256 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'surname',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'fullName',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'birthday',
        type: 'date',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'gender',
        type: 'enum',
        enum: ['male', 'female'],
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'profileImg',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'location',
        type: 'varchar',
        isNullable: true,
      }),
    );

    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'currencyPreference',
        type: 'enum',
        enum: ['USD', 'EUR', 'GBP', 'UAH'],
        default: "'USD'",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'surname');
    await queryRunner.dropColumn('user', 'fullName');
    await queryRunner.dropColumn('user', 'birthday');
    await queryRunner.dropColumn('user', 'gender');
    await queryRunner.dropColumn('user', 'profileImg');
    await queryRunner.dropColumn('user', 'location');
    await queryRunner.dropColumn('user', 'currencyPreference');
  }
}
