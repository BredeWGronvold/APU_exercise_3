import { async } from 'regenerator-runtime';
import request from 'supertest';
import app from '../server/app'

describe("End point tests", () => {

    
    test("Testing if response is OK", async () => {
        const response = await request(app).get("/weather/:city");
        const body = response.body
        expect(response.statusCode).toBe(200);
    });


    test("Testing if non specified parameter returns 5 entries", async () => {
        const response = await request(app).get("/weather");                       // from the "/weather/?max=X" request
        const body = response.body
        expect(response.statusCode).toBe(200);
        expect(body.length).toBe(5);
    });


    test("Test if a object contains of cityName, temprature and weatherDescription", async () => {
        const response = await request(app).get("/weather/?max=1");
        expect(response.statusCode).toBe(200);
        expect(response.body.cityName).toBeDefined();
        expect(response.body.temperature).toBeDefined();
        expect(response.body.weatherDescription).toBeDefined();
    });

});