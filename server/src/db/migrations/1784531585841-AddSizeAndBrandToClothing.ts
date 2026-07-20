import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSizeAndBrandToClothing1784531585841 implements MigrationInterface {
    name = 'AddSizeAndBrandToClothing1784531585841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clothing" ADD "size" text`);
        await queryRunner.query(`ALTER TABLE "clothing" ADD "brand" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clothing" DROP COLUMN "brand"`);
        await queryRunner.query(`ALTER TABLE "clothing" DROP COLUMN "size"`);
    }

}
