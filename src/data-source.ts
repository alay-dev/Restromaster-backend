import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "viaduct.proxy.rlwy.net",
  port: 17491,
  username: "postgres",
  password: "DdA5F6fcfdf*a2DacGBdBd*3cD-cGgae",
  database: "railway",
  synchronize: true,
  logging: false,
  entities: ["src/entity/*.ts"],
  migrations: [],
  subscribers: [],
});
