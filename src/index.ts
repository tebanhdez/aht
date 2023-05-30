import express from 'express';
import {AppDataSource, findUserByUsername, init_db, saveTelemetry} from "./ahtdb";
import {Telemetry} from "./entity/telemetry";
import bodyParser from "body-parser";
import Ajv from "ajv";
import { createHash } from 'node:crypto';

const app = express();
const ajv = new Ajv();

app.get('/ping', (req, res) => {
    res.send('pong');
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
    const telemetryRepo = AppDataSource.getRepository(Telemetry);
    const telemetry = await telemetryRepo.find();
    res.send(telemetry);
});

app.post("/telemetry", bodyParser.json(), async (req, res) => {

    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).send('Unauthorized');
    } else {
        const auth = Buffer.from(authHeader.split(' ')[1] || "",
            'base64').toString().split(':');
        const user = auth[0] || "";
        const pass = auth[1] || "";
        const admin = await findUserByUsername(user);

        if(!admin || admin.hash != createHash('md5')
            .update(pass)
            .digest('hex')){
            return res.status(401).send('Unauthorized');
        }
    }
    let telemetry = new Telemetry();
    const isDataValid = ajv.validate(telemetrySchema, req.body);
    if (isDataValid) {
        telemetry.reading = req.body.reading;
        telemetry = await saveTelemetry(telemetry);
        res.send(telemetry);
    } else {
        res.status(400);
        res.send(ajv.errors!.at(0)!.message);
    }
});

app.listen(8080, async () => {
    await init_db("");
    console.log('Server is listening on port 8080');
});

module.exports = app;