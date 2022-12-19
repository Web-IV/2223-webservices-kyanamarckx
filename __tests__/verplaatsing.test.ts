import createServer from "../src/createServer";
import request from "supertest";
import { expect } from "@jest/globals";
import { fetchAccessToken } from "./helper";

const testVerplaatsing = {
  reiziger_id: 1,
  bestemming_id: 1,
  vervoersmiddel_id: 1,
};

const server = createServer();

beforeAll(async () => {
  (await server).start();
});

afterAll(async () => {
  (await server).stop();
});



// TESTS FOR GET REQUESTS:

it("GET /verplaatsingen", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).get("/api/verplaatsingen").set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({"count": 1,"verplaatsingen": [{"bestemming_id": 1,"id": 1,"reiziger_id": 1,"vervoersmiddel_id": 1,},],});
});


it("GET /verplaatsingen/:id with correct id", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).get("/api/verplaatsingen/1").set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({"bestemming_id": 1,"id": 1,"reiziger_id": 1,"vervoersmiddel_id": 1,});
});


it("GET /verplaatsingen/:id with incorrect id", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).get("/api/verplaatsingen/abc").set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},],});
});


it("GET /verplaatsingen/:id with non-existing id", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).get("/api/verplaatsingen/10").set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(404);
  expect(response.body).toEqual("Verplaatsing niet gevonden");
});



// TESTS FOR POST REQUESTS:

it("POST /verplaatsingen with correct body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).post("/api/verplaatsingen").send(testVerplaatsing).set('Authorization', `Bearer ${token}`);
  const verplaatsingId = response.body.id;
  expect(response.status).toEqual(201);
  expect(response.body).toEqual({"bestemming_id": 1,"id": verplaatsingId,"reiziger_id": 1,"vervoersmiddel_id": 1,});
});


it("POST /verplaatsingen with empty body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).post("/api/verplaatsingen").send({}).set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({
    "errors": [
      {"location": "body", "msg": "reiziger_id must be a positive integer", "param": "reiziger_id",},
      {"location": "body", "msg": "bestemming_id must be a positive integer", "param": "bestemming_id",},
      {"location": "body", "msg": "vervoersmiddel_id must be a positive integer", "param": "vervoersmiddel_id",},
    ],
  });
});


it("POST /verplaatsingen with incorrect body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const testVerplaatsingFout = {
    reiziger_id: 12345,
    bestemming_id: 12345,
    vervoersmiddel_id: 12345,
  }

  const response = await request(app).post("/api/verplaatsingen").send(testVerplaatsingFout).set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(500);
  expect(response.body).toEqual("\nInvalid `prisma.verplaatsing.create()` invocation:\n\n\nForeign key constraint failed on the field: `reiziger_id`");
});



// TESTS FOR PUT REQUESTS:

it("PUT /verplaatsingen/:id with correct id and correct body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const testVerplaatsingUpdate = {
    reiziger_id: 1,
    bestemming_id: 1,
    vervoersmiddel_id: 1,
  }

  const response = await request(app).put("/api/verplaatsingen/2").send(testVerplaatsingUpdate).set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({"bestemming_id": 1,"id": 2,"reiziger_id": 1,"vervoersmiddel_id": 1,});
});


it("PUT /verplaatsingen/:id with correct id and incorrect body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const testVerplaatsingUpdateFout = {
    reiziger_id: 12345,
    bestemming_id: 12345,
    vervoersmiddel_id: 12345,
  };

  const response = await request(app).put("/api/verplaatsingen/2").send(testVerplaatsingUpdateFout).set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(500);
  expect(response.body).toEqual("\nInvalid `prisma.verplaatsing.update()` invocation:\n\n\nForeign key constraint failed on the field: `reiziger_id`");
});


it("PUT /verplaatsingen/:id with correct id and empty body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).put("/api/verplaatsingen/2").send({}).set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({
    "errors": [
      {"location": "body", "msg": "reiziger_id must be a positive integer", "param": "reiziger_id",},
      {"location": "body", "msg": "bestemming_id must be a positive integer", "param": "bestemming_id",},
      {"location": "body", "msg": "vervoersmiddel_id must be a positive integer", "param": "vervoersmiddel_id",},
    ],
  });
});


it("PUT /verplaatsingen/:id with incorrect id and correct body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const testVerplaatsingUpdate = {
    reiziger_id: 1,
    bestemming_id: 1,
    vervoersmiddel_id: 1,
  }

  const response = await request(app).put("/api/verplaatsingen/abc").send(testVerplaatsingUpdate).set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},],});
});


it("PUT /verplaatsingen/:id with incorrect id and incorrect body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const testVerplaatsingUpdateFout = {
    reiziger_id: 12345,
    bestemming_id: 12345,
    vervoersmiddel_id: 12345,
  };

  const response = await request(app).put("/api/verplaatsingen/abc").send(testVerplaatsingUpdateFout).set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},],});
});


it("PUT /verplaatsingen/:id with non-existing id and correct body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const testVerplaatsingUpdate = {
    reiziger_id: 1,
    bestemming_id: 1,
    vervoersmiddel_id: 1,
  }

  const response = await request(app).put("/api/verplaatsingen/10").send(testVerplaatsingUpdate).set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(500);
  expect(response.body).toEqual("\nInvalid `prisma.verplaatsing.update()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to update not found.");
});



// TESTS FOR DELETE REQUESTS:

it("DELETE /verplaatsingen/:id with correct id", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).delete("/api/verplaatsingen/2").set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(204);
  expect(response.body).toEqual({});
});


it("DELETE /verplaatsingen/:id with incorrect id", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).delete("/api/verplaatsingen/abc").set('Authorization', `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},],});
});
