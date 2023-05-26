import express from 'express';
import {AppDataSource} from "./ahtdb";
import {Telemetry} from "./entity/telemetry";
import {User} from "./entity/user";
import bodyParser from "body-parser";
import Ajv from "ajv";
import { createHash } from 'node:crypto'

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

const adminUserInfo = {"name": "ahtadmin", "pass": "passwort"};

app.get('/telemetry', async (req, res) => {
    if(!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    const telemetryRepo = AppDataSource.getRepository(Telemetry);
    const telemetry = await telemetryRepo.find();
    res.send(telemetry);
});

app.post("/telemetry", bodyParser.json(), async (req, res, next) => {

    if(!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        let admin = new User();
        admin.username = adminUserInfo.name;
        admin.hash     = createHash('md5')
            .update(adminUserInfo.pass)
            .digest('hex');
        console.log(admin);
        await AppDataSource.getRepository(User).save(admin);
    }

    const authHeader = req.headers.authorization;
    if(!authHeader) {
        let err = new Error('You are not authenticated!');
        return next(err)
    } else {
        const auth = Buffer.from(authHeader.split(' ')[1],
            'base64').toString().split(':');
        const user = auth[0];
        const pass = auth[1];
        const admin = await AppDataSource.getRepository(User).findOneBy({username: user,});
        if(!admin || admin.hash != createHash('md5')
            .update(pass)
            .digest('hex')){
            let err = new Error('You are not authenticated!');
            return next(err);
        }
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