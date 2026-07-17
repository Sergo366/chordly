import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveRefreshTokensFromUser1784273641378 implements MigrationInterface {
    name = 'RemoveRefreshTokensFromUser1784273641378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshTokens"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "refreshTokens" text`);
    }

}
