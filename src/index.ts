import express from 'express';
import {AppDataSource} from "./ahtdb";
import {Telemetry} from "./entity/telemetry";

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.get('/telemetry', async (req, res) => {
    if(!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    const telemetryRepo = AppDataSource.getRepository(Telemetry);
    const telemetry = await telemetryRepo.find();
    res.send(telemetry);
});

app.post('/telemetry', async (req, res) => {
    if(!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    const telemetryRepo = AppDataSource.getRepository(Telemetry);
    let telemetry = {reading: 1000};
    console.log(req);
    telemetry = await telemetryRepo.save(telemetry);
    res.send(telemetry);
});

app.listen(8080, () => {
    console.log('Server is listening on port 8080');
});