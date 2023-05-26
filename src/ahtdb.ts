import { DataSource } from "typeorm";
import { root } from "./paths";
import { Telemetry } from "./entity/telemetry";
import {User} from "./entity/user";

export const AppDataSource = new DataSource ({
    type: "sqlite",
    database: ":memory:",
    entities: [ Telemetry, User ],
    synchronize: true
});
