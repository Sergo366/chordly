import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSaleEntity1782460033870 implements MigrationInterface {
    name = 'AddSaleEntity1782460033870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."sales_currency_enum" AS ENUM('EUR', 'USD', 'UAH')`);
        await queryRunner.query(`CREATE TABLE "sales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "price" integer NOT NULL, "currency" "public"."sales_currency_enum" NOT NULL DEFAULT 'USD', "description" character varying, "isNegotiable" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "clothingId" uuid, CONSTRAINT "REL_826f34afc624de611123fe80dd" UNIQUE ("clothingId"), CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_826f34afc624de611123fe80dd1" FOREIGN KEY ("clothingId") REFERENCES "clothing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_826f34afc624de611123fe80dd1"`);
        await queryRunner.query(`DROP TABLE "sales"`);
        await queryRunner.query(`DROP TYPE "public"."sales_currency_enum"`);
    }

}
