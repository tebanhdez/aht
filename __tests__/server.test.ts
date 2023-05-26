import {expect, test, describe} from '@jest/globals';

const app = require("../src/index"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);


describe('Testing endpoints', () => {
    test('respond with valid HTTP status code and get ping from server', async () => {
        const response = await request.get('/').send();
        expect(response.status).toBe(200);
        console.log(response);
        expect(response.text).toBe('Hello, world!');
    });
});