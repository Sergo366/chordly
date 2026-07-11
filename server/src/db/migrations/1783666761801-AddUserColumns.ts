import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddUserColumns1783666761801 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'name',
                type: 'varchar',
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'surname',
                type: 'varchar',
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'fullName',
                type: 'varchar',
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'birthday',
                type: 'date',
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'gender',
                type: 'enum',
                enum: ['male', 'female'],
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'profileImg',
                type: 'varchar',
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'location',
                type: 'varchar',
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            'user',
            new TableColumn({
                name: 'currencyPreference',
                type: 'enum',
                enum: ['USD', 'EUR', 'GBP', 'UAH'],
                default: "'USD'",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Check if columns exist before dropping
        const table = await queryRunner.getTable('user');
        
        if (table) {
            if (table.findColumnByName('name')) {
                await queryRunner.dropColumn('user', 'name');
            }
            if (table.findColumnByName('surname')) {
                await queryRunner.dropColumn('user', 'surname');
            }
            if (table.findColumnByName('fullName')) {
                await queryRunner.dropColumn('user', 'fullName');
            }
            if (table.findColumnByName('birthday')) {
                await queryRunner.dropColumn('user', 'birthday');
            }
            if (table.findColumnByName('gender')) {
                await queryRunner.dropColumn('user', 'gender');
            }
            if (table.findColumnByName('profileImg')) {
                await queryRunner.dropColumn('user', 'profileImg');
            }
            if (table.findColumnByName('location')) {
                await queryRunner.dropColumn('user', 'location');
            }
            if (table.findColumnByName('currencyPreference')) {
                await queryRunner.dropColumn('user', 'currencyPreference');
            }
        }
    }

}
