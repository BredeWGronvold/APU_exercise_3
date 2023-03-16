import { async } from 'regenerator-runtime';
import request from 'supertest';
import app from '../server/app'

describe("End point tests", () => {
 
    
    test("Testing If Response Is OK", async () => {
        const response = await request(app).get("/weather/London");
        const body = response.body;
        expect(response.statusCode).toBe(200);
    });


    test("Testing If Max Query > 5 Shows All Entries When Cache Is Full", async () => {
        await request(app).get("weather/Oslo");
        await request(app).get("weather/Bergen");
        await request(app).get("weather/Alta");
        await request(app).get("weather/Trondheim");
        
        const response = await request(app).get("/weather?max=99");
        const body = response.body;
        expect(response.statusCode).toBe(200);
        expect(body.length).toBe(5);
    });


    test("Testing If Error Returned When Specifying Max Value < 1", async () => {
        const response = await request(app).get("/weather?max=0");
        expect(response.statusCode).toBe(400);
        expect(response.body).toBeUndefined();
    });


    test("Testing If Return Object Is Json-Format", async () => {
        const response = await request(app).get("/weather");
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toBe(true);
    });


    test("Test If An Object Contains Keys CityName, Temprature and WeatherDescription", async () => {
        const response = await request(app).get("/weather?max=1");
        expect(response.statusCode).toBe(200);
        expect(response.body.cityName).toBeDefined();
        expect(response.body.temperature).toBeDefined();
        expect(response.body.weatherDescription).toBeDefined();
    });

    test("Test Get Object From Cache", async() => {
        await request(app).get("/weather/Athens");
        const response = await request(app).get("/weather/Athens");
        expect(response.statusCode).toBe(200);
        expect(response.body.cityName).toBeDefined();
        expect(response.body.temperature).toBeDefined();
        expect(response.body.weatherDescription).toBeDefined();
    });

    test("Test If CityName Is Valid", async() => {
        const response = await request(app).get("weather/lsakdghkjldhfjsdfkghsdkljf");
        expect(response.statusCode).toBe(404);

    })

});