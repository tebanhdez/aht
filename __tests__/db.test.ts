import {expect, test, beforeAll, describe} from '@jest/globals';
import {AppDataSource} from "../src/ahtdb";
import {Telemetry} from "../src/entity/telemetry";

describe("DB is initialized", () => {
    beforeAll(async () => {
        await AppDataSource.initialize();
    })
    test("DB connection is open", async () => {
        expect(AppDataSource.isInitialized).toBeTruthy();
   })
    test("Insertion of records into Telemetry table", async () => {
        const telemetry1 = {reading: 100};
        const telemetry2 = {reading: 200};
        const telemetryRepo = AppDataSource.getRepository(Telemetry);
        await telemetryRepo.save(telemetry1);
        await telemetryRepo.save(telemetry2);
        const [telemetries, count] = await telemetryRepo.findAndCount();
        console.log(telemetries);
        expect(count).toBe(2);
    })
})