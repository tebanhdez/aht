import {expect, test, describe, jest} from '@jest/globals';
import {Telemetry} from "../src/entity/telemetry";
import {User} from "../src/entity/user";

const app = require("../src/index");
const supertest = require("supertest");
const request = supertest(app);

const telemetryMock = {"id": 100, "reading": 1234.5678};
const mockFind : (username: string) => Promise<User> = async function(username: string) : Promise<User> {return {"id": 1, "username": "ahtadmin", "hash":"e22a63fb76874c99488435f26b117e37"};};
const mockSave : (telemetry: Telemetry) => Promise<Telemetry> = async function(telemetry: Telemetry) : Promise<Telemetry> {return telemetryMock;};
const mockInit : (pass: string) => Promise<void> = async function(pass: string) : Promise<void> {return;}
jest.mock('../src/ahtdb', () => ({
    findUserByUsername: (username: string) => mockFind(username),
    saveTelemetry     : (telemetry: Telemetry) => mockSave(telemetry),
    init_db           : (pass: string) => mockInit(pass),
}));


describe('Testing endpoints', () => {

    test('respond with valid HTTP status code and get ping from server', async () => {
        const response = await request.get('/ping').send();
        expect(response.status).toBe(200);
        expect(response.text).toBe('pong');
    });
    test('respond with valid HTTP status code and respond with saved entity', async () => {
        const response = await request
            .post('/telemetry')
            .set('Authorization', 'Basic YWh0YWRtaW46cGFzc3dvcnQ=')
            .send({reading: 1234.5678});
        expect(response.status).toBe(200);
        expect(telemetryMock).toMatchObject(JSON.parse(response.text));
    });
    test('respond with valid HTTP status 401 code when auth header is missing', async () => {
        const response = await request
            .post('/telemetry')
            .send({reading: 1234.5678});
        expect(response.status).toBe(401);
        expect(response.text).toBe('Unauthorized');
    });
    test('respond with HTTP status 401 code when an invalid auth header password is used', async () => {
        const response = await request
            .post('/telemetry')
            .set('Authorization', '####')
            .send({reading: 1234.5678});
        expect(response.status).toBe(401);
        expect(response.text).toBe('Unauthorized');
    });
    test('respond with valid HTTP status code if invalid payload format', async () => {
        const response = await request
            .post('/telemetry')
            .set('Authorization', 'Basic YWh0YWRtaW46cGFzc3dvcnQ=')
            .send({reading: ""});
        expect(response.status).toBe(400);
    });
});