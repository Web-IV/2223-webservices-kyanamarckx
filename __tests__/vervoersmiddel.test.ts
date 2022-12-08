import createServer from "../src/createServer";
import request from "supertest";
import { expect } from "@jest/globals";

const testVervoersmiddel = {
  type: "TypeTest",
};

const server = createServer();

beforeAll(async () => {
  (await server).start();
});

afterAll(async () => {
  (await server).stop();
});



// TESTS FOR GET REQUESTS:

it("GET /vervoersmiddelen", async () => {
  const app = (await server).getApp();

  const response = await request(app).get("/api/vervoersmiddelen");
  expect(response.status).toEqual(200);
  expect(response.body).toEqual([
    {"id": 1,"type": "trein",},
    {"id": 2,"type": "vliegtuig",},
    {"id": 3,"type": "boot",},
    {"id": 4,"type": "bus",},
    {"id": 5,"type": "auto",},
    {"id": 6,"type": "TypeTest",},
    {"id": 7,"type": "TypeTestUpdate",},
  ]);
});


it("GET /vervoersmiddelen/:id with correct id", async () => {
  const app = (await server).getApp();

  const response = await request(app).get("/api/vervoersmiddelen/1");
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({"id": 1,"type": "trein",});
});


it("GET /vervoersmiddelen/:id with incorrect id", async () => {
  const app = (await server).getApp();

  const response = await request(app).get("/api/vervoersmiddelen/abc");
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},],});
});


it("GET /vervoersmiddelen/:id with non-existing id", async () => {
  const app = (await server).getApp();

  const response = await request(app).get("/api/vervoersmiddelen/100");
  expect(response.status).toEqual(404);
  expect(response.body).toEqual("Vervoersmiddel niet gevonden");
});



// TESTS FOR POST REQUESTS:

it("POST /vervoersmiddelen with correct body", async () => {
  const app = (await server).getApp();

  const response = await request(app).post("/api/vervoersmiddelen").send(testVervoersmiddel);
  const vervoersmiddelId = response.body.id;
  expect(response.status).toEqual(201);
  expect(response.body).toEqual({"id": vervoersmiddelId,"type": "TypeTest",});
});


it("POST /vervoersmiddelen with incorrect body", async () => {
  const app = (await server).getApp();

  const response = await request(app).post("/api/vervoersmiddelen").send({});
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({
    "errors": [
      {"location": "body", "msg": "Invalid value", "param": "type",},
      {"location": "body", "msg": "Type must be a string between 1 and 255 characters", "param": "type"}
    ],
  });
});



// TESTS FOR PUT REQUESTS:

it("PUT /vervoersmiddelen/:id with correct id and correct body", async () => {
  const app = (await server).getApp();

  const testVervoersmiddelUpdate = {
    type: "TypeTestUpdate",
  }

  const response = await request(app).put("/api/vervoersmiddelen/7").send(testVervoersmiddelUpdate);
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({"id": 7,"type": "TypeTestUpdate",});
});


it("PUT /vervoersmiddelen/:id with incorrect id and correct body", async () => {
  const app = (await server).getApp();

  const testVervoersmiddelUpdate = {
    type: "TypeTestUpdate",
  }

  const response = await request(app).put("/api/vervoersmiddelen/abc").send(testVervoersmiddelUpdate);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},],});
});


it("PUT /vervoersmiddelen/:id with correct id and incorrect body", async () => {
  const app = (await server).getApp();

  const testVervoersmiddelUpdate = {
    type: "",
  }

  const response = await request(app).put("/api/vervoersmiddelen/7").send(testVervoersmiddelUpdate);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({
    "errors": [
      {"location": "body", "msg": "Type must be a string between 1 and 255 characters", "param": "type", "value": "",},
    ],
  });
});


it("PUT /vervoersmiddelen/:id with incorrect id and incorrect body", async () => {
  const app = (await server).getApp();

  const testVervoersmiddelUpdate = {
    type: "",
  }

  const response = await request(app).put("/api/vervoersmiddelen/abc").send(testVervoersmiddelUpdate);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({
    "errors": [
      {"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},
      {"location": "body", "msg": "Type must be a string between 1 and 255 characters", "param": "type", "value": "",},
    ],
  });
});


it("PUT /vervoersmiddelen/:id with non-existing id and correct body", async () => {
  const app = (await server).getApp();

  const testVervoersmiddelUpdate = {
    type: "TypeTestUpdate",
  }

  const response = await request(app).put("/api/vervoersmiddelen/100").send(testVervoersmiddelUpdate);
  expect(response.status).toEqual(500);
  expect(response.body).toEqual("\nInvalid `prisma.vervoersmiddel.update()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to update not found.");
});



// TESTS FOR DELETE REQUESTS:

it("DELETE /vervoersmiddelen/:id with correct id", async () => {
  const app = (await server).getApp();

  const response = await request(app).delete("/api/vervoersmiddelen/8");
  expect(response.status).toEqual(204);
  expect(response.body).toEqual({});
});


it("DELETE /vervoersmiddelen/:id with incorrect id", async () => {
  const app = (await server).getApp();

  const response = await request(app).delete("/api/vervoersmiddelen/abc");
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "abc",},],});
});
