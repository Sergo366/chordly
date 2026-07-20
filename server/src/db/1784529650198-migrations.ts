import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1784529650198 implements MigrationInterface {
    name = 'Migrations1784529650198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clothing" ADD "size" text`);
        await queryRunner.query(`ALTER TABLE "clothing" ADD "brand" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clothing" DROP COLUMN "brand"`);
        await queryRunner.query(`ALTER TABLE "clothing" DROP COLUMN "size"`);
    }

}
