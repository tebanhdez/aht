import express from 'express';
import {AppDataSource} from "./ahtdb";
import {Telemetry} from "./entity/telemetry";
import bodyParser from "body-parser";
import Ajv from "ajv";

const app = express();
const ajv = new Ajv();

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

const telemetrySchema = {
    type: "object",
    properties: {
        id:      { type: "number" },
        reading: { type: "number" },
    },
    required: ["reading"],
}

app.get('/telemetry', async (req, res) => {
    if(!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    const telemetryRepo = AppDataSource.getRepository(Telemetry);
    const telemetry = await telemetryRepo.find();
    res.send(telemetry);
});

app.post("/telemetry", bodyParser.json(),async (req, res) => {
    if(!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    const telemetryRepo = AppDataSource.getRepository(Telemetry);
    let telemetry = new Telemetry();
    const isDataValid = ajv.validate(telemetrySchema, req.body);

    if (isDataValid) {
        telemetry.reading = req.body.reading;
        telemetry = await telemetryRepo.save(telemetry);
        res.send(telemetry);
    } else {
        res.send(ajv.errors!.at(0)!.message);
    }
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});