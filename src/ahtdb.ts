import { DataSource } from "typeorm";
import { Telemetry } from "./entity/telemetry";
import {User} from "./entity/user";
import {createHash} from "node:crypto";
import generator from "generate-password";

export const AppDataSource = new DataSource ({
    type: "sqlite",
    database: ":memory:",
    entities: [ Telemetry, User ],
    synchronize: true
});

const adminUserInfo = {"name": "ahtadmin", "pass": generator.generate({
        length: 12,
        numbers: true
    })};

export async function init_db (pass: string) {
    if(!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        const admin = new User();
        admin.username = adminUserInfo.name;
        admin.hash     = createHash('md5')
            .update(pass || adminUserInfo.pass)
            .digest('hex');
        console.log("Admin user password: " + adminUserInfo.pass);
        await AppDataSource.getRepository(User).save(admin);
    }
    console.log('DB initialized.');
}

export async function findUserByUsername(username: string): Promise<User> {
    return AppDataSource.getRepository(User).findOneBy({username: username,});
}

export async function saveTelemetry(telemetry: Telemetry): Promise<Telemetry> {
    return AppDataSource.getRepository(Telemetry).save(telemetry);
}