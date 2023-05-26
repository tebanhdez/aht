import { DataSource } from "typeorm";
import { root } from "./paths";
import { Telemetry } from "./entity/telemetry";

export const AppDataSource = new DataSource ({
    type: "sqlite",
    database: ":memory:",
    entities: [ Telemetry ],
    synchronize: true
});
