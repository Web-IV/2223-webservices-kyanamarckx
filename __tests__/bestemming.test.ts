import createServer from "../src/createServer";
import request from "supertest";
import { expect } from "@jest/globals";

const testBestemming = {
  land: "LandTest",
  stad: "StadTest",
  postcode: "012345",
}

beforeAll(async () => {
  const server = await createServer();
  await server.start();
});


// TESTS FOR GET REQUESTS:

it("GET /bestemmingen", async () => {
  const server = await createServer();
  const app = server.getApp();

  const response = await request(app).get("/api/bestemmingen");
  expect(response.status).toEqual(200);
  expect(response.body).toEqual([
    {"id": 1,"land": "Spanje","postcode": "46001","stad": "Valencia",},
    {"id": 2,"land": "België","postcode": "9571","stad": "Lierde",},
    {"id": 3,"land": "Frankrijk","postcode": "83570","stad": "Cotignac",},
    {"id": 4,"land": "Zweden","postcode": "20049","stad": "Malmö",},
  ]);
});


it("GET /bestemmingen/:id with correct id", async () => {
  const server = await createServer();
  const app = server.getApp();

  const response = await request(app).get("/api/bestemmingen/1");
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({"id": 1,"land": "Spanje","postcode": "46001","stad": "Valencia",});
});


it("GET /bestemmingen/:id with incorrect id", async () => {
  const server = await createServer();
  const app = server.getApp();

  const response = await request(app).get("/api/bestemmingen/abc");
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},],});
});


it("GET /bestemmingen/:id with non-existing id", async () => {
  const server = await createServer();
  const app = server.getApp();

  const response = await request(app).get("/api/bestemmingen/10");
  expect(response.status).toEqual(404);
  expect(response.body).toEqual("Bestemming niet gevonden");
});



//// TESTS FOR POST REQUESTS:

it("POST /bestemmingen with correct body", async () => {
  const server = await createServer();
  const app = server.getApp();

  const response = await request(app).post("/api/bestemmingen").send(testBestemming);
  const bestemmingId = response.body.id;
  expect(response.status).toEqual(201);
  expect(response.body).toEqual({"id": bestemmingId, "land": "LandTest", "postcode": "012345", "stad": "StadTest",});
});


it("POST /bestemmingen with incorrect body", async () => {
  const server = await createServer();
  const app = server.getApp();

  const response = await request(app).post("/api/bestemmingen").send({});
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({
    "errors": [
      {"location": "body","msg": "Invalid value","param": "land",},
      {"location": "body","msg": "Land must be between 1 and 255 characters","param": "land",},
      {"location": "body","msg": "Invalid value","param": "stad",},
      {"location": "body","msg": "Stad must be between 1 and 255 characters","param": "stad",},
      {"location": "body","msg": "Invalid value","param": "postcode",},
      {"location": "body","msg": "Postcode must be between 1 and 10 characters","param": "postcode",},
    ],
  });
});



//// TESTS FOR PUT REQUESTS:

it("PUT /bestemmingen/:id with correct id and body", async () => {
  const server = await createServer();
  const app = server.getApp();

  const testBestemmingUpdate = {
    land: "LandTestUpdate",
    stad: "StadTestUpdate",
    postcode: "543210",
  };

  const response = await request(app).put("/api/bestemmingen/7").send(testBestemmingUpdate);
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({"id": 7, "land": "LandTestUpdate", "postcode": "543210", "stad": "StadTestUpdate",});
});


it("PUT /bestemmingen/:id with incorrect id and correct body", async () => {
  const server = await createServer();
  const app = server.getApp();

  const testBestemmingUpdate = {
    land: "LandTestUpdate",
    stad: "StadTestUpdate",
    postcode: "543210",
  };

  const response = await request(app).put("/api/bestemmingen/abc").send(testBestemmingUpdate);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},],});
});


it("PUT /bestemmingen/:id with correct id and incorrect body", async () => {
  const server = await createServer();
  const app = server.getApp();

  const testBestemmingFout = {
    land: "",
    stad: "",
    postcode: "",
  };

  const response = await request(app).put("/api/bestemmingen/7").send(testBestemmingFout);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({
    "errors": [
      {"location": "body","msg": "Land must be between 1 and 255 characters","param": "land","value": "",},
      {"location": "body","msg": "Stad must be between 1 and 255 characters","param": "stad","value": "",},
      {"location": "body","msg": "Postcode must be between 1 and 10 characters","param": "postcode","value": "",},
    ],
  });
});


it("PUT /bestemmingen/:id with incorrect id and incorrect body", async () => {
  const server = await createServer();
  const app = server.getApp();

  const testBestemmingFout = {
    land: "",
    stad: "",
    postcode: "",
  };

  const response = await request(app).put("/api/bestemmingen/abc").send(testBestemmingFout);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({
    "errors": [
      {"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},
      {"location": "body","msg": "Land must be between 1 and 255 characters","param": "land","value": "",},
      {"location": "body","msg": "Stad must be between 1 and 255 characters","param": "stad","value": "",},
      {"location": "body","msg": "Postcode must be between 1 and 10 characters","param": "postcode","value": "",},
    ],});
});


it("PUT /bestemmingen/:id with non-existing id and correct body", async () => {
  const server = await createServer();
  const app = server.getApp();

  const testBestemmingUpdate = {
    land: "LandTestUpdate",
    stad: "StadTestUpdate",
    postcode: "543210",
  };

  const response = await request(app).put("/api/bestemmingen/5").send(testBestemmingUpdate);
  expect(response.status).toEqual(500);
  expect(response.body).toEqual("\nInvalid `prisma.bestemming.update()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to update not found.");
});



//// TESTS FOR DELETE REQUESTS:

it("DELETE /bestemmingen/:id with correct id", async () => {
  const server = await createServer();
  const app = server.getApp();

  const response = await request(app).delete("/api/bestemmingen/8");
  expect(response.status).toEqual(204);
  expect(response.body).toEqual({});
});


it("DELETE /bestemmingen/:id with incorrect id", async () => {
  const server = await createServer();
  const app = server.getApp();

  const response = await request(app).delete("/api/bestemmingen/abc");
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},],});
});
