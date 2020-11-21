import {MigrationInterface, QueryRunner} from 'typeorm';

export class Initial1605964480299 implements MigrationInterface {
    name = 'Initial1605964480299';

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(14) NOT NULL, "name" character varying(14), "description" character varying(280), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "password" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))');
      await queryRunner.query('CREATE TABLE "message" ("id" SERIAL NOT NULL, "text" character varying(280) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))');
      await queryRunner.query('ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"');
      await queryRunner.query('DROP TABLE "message"');
      await queryRunner.query('DROP TABLE "user"');
    }

}
