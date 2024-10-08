import "reflect-metadata";
import { DataSourceOptions } from "typeorm";
import path from "path";
import {SnakeNamingStrategy} from "typeorm-naming-strategies";
const dotenv = require("dotenv");

dotenv.config();

export const dbConfig: DataSourceOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname + "/../apps/**/model/*{.ts,.js}")],
  migrations: [path.join(__dirname, "/../database/migrations/*{.ts,.js}")],
  namingStrategy: new SnakeNamingStrategy(),
};

console.log(
  `Database HOST (./config/database.ts): ${process.env.DATABASE_HOST}`
);
