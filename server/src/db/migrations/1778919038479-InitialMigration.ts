import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1778919038479 implements MigrationInterface {
    name = 'InitialMigration1778919038479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clothing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "userTitle" character varying NOT NULL, "type" character varying NOT NULL, "category" character varying, "seasons" text, "imageUrl" character varying, "ticker" character varying, "userId" uuid NOT NULL, "isFavorite" boolean NOT NULL DEFAULT false, "isHidden" boolean NOT NULL DEFAULT false, "isForSale" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_43489b6750d2a415a2f8254e757" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "iconName" character varying NOT NULL DEFAULT '', "isHidden" boolean NOT NULL DEFAULT false, "categoryTypes" jsonb NOT NULL DEFAULT '[]', "userId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c22adcb15e7de70e1a74b4a3542" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "hashedRt" character varying, "rtExpiresAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "clothing" ADD CONSTRAINT "FK_d2424113553d2426d5707b8f564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_category" ADD CONSTRAINT "FK_d6d0397f3d4b205f880addd4b53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_category" DROP CONSTRAINT "FK_d6d0397f3d4b205f880addd4b53"`);
        await queryRunner.query(`ALTER TABLE "clothing" DROP CONSTRAINT "FK_d2424113553d2426d5707b8f564"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_category"`);
        await queryRunner.query(`DROP TABLE "clothing"`);
    }

}
