import {expect, test, describe, beforeAll} from '@jest/globals';
import {AppDataSource} from "../src/ahtdb";
import {User} from "../src/entity/user";
import {createHash} from "node:crypto";

const app = require("../src/index"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);


describe('Testing endpoints', () => {
    beforeAll(async () => {
        const adminUserInfo = {"name": "ahtadmin", "pass": "passwort"};
        await AppDataSource.initialize();
        const admin = new User();
        admin.username = adminUserInfo.name;
        admin.hash     = createHash('md5')
            .update(adminUserInfo.pass)
            .digest('hex');
        console.log(admin);
        await AppDataSource.getRepository(User).save(admin);
    });
    test('respond with valid HTTP status code and get ping from server', async () => {
        const response = await request.get('/').send();
        expect(response.status).toBe(200);
        expect(response.text).toBe('Hello, world!');
    });
    test('respond with valid HTTP status code and respond with saved entity', async () => {
        const response = await request
            .post('/telemetry')
            .set('Authorization', 'Basic YWh0YWRtaW46cGFzc3dvcnQ=')
            .send({reading: 1111});
        expect(response.status).toBe(200);
        console.log(response);
    });
});