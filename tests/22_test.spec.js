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
        const response = await request(app).get("/weather");
        const body = response.body
        expect(response.statusCode).toBe(200);
        expect(body.length).toBe(5);
    });


    test("Testing if wrong input of city name gives undefined result", async () => {
        const response = await request(app).get("/weather/Lodnon");
        expect(response.statusCode).toBe(404);
        expect(response.body).toBeUndefined();
    });


    test("Testing if return object is json-format", async () => {
        const response = await request(app).get("/weather");
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toBe(true);
    });


    test("Test if a object contains of cityName, temprature and weatherDescription", async () => {
        const response = await request(app).get("/weather?max=1");
        expect(response.statusCode).toBe(200);
        expect(response.body.cityName).toBeDefined();
        expect(response.body.temperature).toBeDefined();
        expect(response.body.weatherDescription).toBeDefined();
    });



});