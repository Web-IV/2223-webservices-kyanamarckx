import createServer from "../src/createServer";
import request from "supertest";
import { expect } from "@jest/globals";
import { fetchAccessToken } from "./helper";
import config from "config";

const testReiziger = {
  voornaam: "TestVoornaam",
  naam: "TestNaam",
  geboortedatum: "2021-01-01",
  straat: "TestStraat",
  stad: "TestStad",
  huisnummer: "2",
  auth0id: config.get('auth.testUser.auth0id')
}

const server = createServer();

beforeAll(async () => {
  await (await server).start();
});

afterAll(async () => {
  await (await server).stop();
});



// TESTS FOR GET REQUESTS:

it("GET /reizigers", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).get("/api/reizigers").set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    "count": 1, 
    "reizigers": [
      {"auth0id": "sJUibowqneIEBIvxyeLQd869uivdTHuP@clients", "geboortedatum": "2003-12-15", "huisnummer": "5", "id": 1, "naam": "De Waegeneer", "stad": "Aalst", "straat": "Hugo Lefèvrestraat", "voornaam": "Robin"}, 
    ]});
});


it("GET /reizigers/:id with correct id", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).get("/api/reizigers/1").set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({"auth0id": "sJUibowqneIEBIvxyeLQd869uivdTHuP@clients","geboortedatum": "2003-12-15","huisnummer": "5","id": 1,"naam": "De Waegeneer","stad": "Aalst","straat": "Hugo Lefèvrestraat","voornaam": "Robin",});
});


it("GET /reizigers/:id with incorrect id", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).get("/api/reizigers/-10").set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "-10",},],});
});


it("GET /reizigers/:id with non-existing id", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).get("/api/reizigers/10").set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(404);
  expect(response.body).toEqual("Reiziger niet gevonden");
});



// TESTS FOR POST REQUESTS:

it("POST /reizigers with correct body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).post("/api/reizigers").send(testReiziger).set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(201);
  const reizigerId = response.body.id;
  expect(response.body).toEqual({"auth0id": "639f942faacda0152647fbbf","geboortedatum": "2021-01-01","huisnummer": "2","id": reizigerId,"naam": "TestNaam","stad": "TestStad","straat": "TestStraat","voornaam": "TestVoornaam",});
});


it("POST /reizigers with incorrect body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).post("/api/reizigers").send({}).set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({
    "errors": [
      {"location": "body","msg": "Invalid value","param": "voornaam",},
      {"location": "body","msg": "Voornaam must be between 1 and 255 characters","param": "voornaam",},
      {"location": "body","msg": "Invalid value","param": "naam",},
      {"location": "body","msg": "Naam must be between 1 and 255 characters","param": "naam",},
      {"location": "body","msg": "Invalid value","param": "geboortedatum",},
      {"location": "body","msg": "Geboortedatum must be exact 10 characters (type: YYYY-MM-DD)","param": "geboortedatum",},
      {"location": "body","msg": "Invalid value","param": "stad",},
      {"location": "body","msg": "Stad must be between 1 and 255 characters","param": "stad",},
      {"location": "body","msg": "Invalid value","param": "straat",},
      {"location": "body","msg": "Straat must be between 1 and 255 characters","param": "straat",},
      {"location": "body","msg": "Invalid value","param": "huisnummer",},
      {"location": "body","msg": "Huisnummer must be between 1 and 10 characters","param": "huisnummer",},
      {"location": "body","msg": "Invalid value","param": "auth0id",},
      {"location": "body","msg": "Auth0id must be between 5 and 255 characters","param": "auth0id",}
     ],
  });
});



// TESTS FOR PUT REQUESTS:

it("PUT /reizigers/:id with correct id and body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const testReizigerUpdate = {
    voornaam: "TestVoornaamUpdate",
    naam: "TestNaamUpdate",
    geboortedatum: "2021-01-01",
    straat: "TestStraatUpdate",
    stad: "TestStadUpdate",
    huisnummer: "2",
    auth0id: "639f942faacda0152647fbbf",
  }
  const response = await request(app).put("/api/reizigers/2").send(testReizigerUpdate).set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(200);
  const reizigerId = response.body.id;
  expect(response.body).toEqual({"auth0id": "639f942faacda0152647fbbf","geboortedatum": "2021-01-01","huisnummer": "2","id": reizigerId,"naam": "TestNaamUpdate","stad": "TestStadUpdate","straat": "TestStraatUpdate","voornaam": "TestVoornaamUpdate",});
});


it("PUT /reizigers/:id with incorrect id and correct body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const testReizigerUpdate = {
    voornaam: "TestVoornaamUpdate",
    naam: "TestNaamUpdate",
    geboortedatum: "2021-01-01",
    straat: "TestStraatUpdate",
    stad: "TestStadUpdate",
    huisnummer: "2",
    auth0id: "639f942faacda0152647fbbf",
  }

  const response = await request(app).put("/api/reizigers/-10").send(testReizigerUpdate).set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "-10",},],});
});


it("PUT /reizigers/:id with correct id and incorrect body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).put("/api/reizigers/4").send({}).set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({
    "errors": [
      {"location": "body","msg": "Invalid value","param": "voornaam",},
      {"location": "body","msg": "Voornaam must be between 1 and 255 characters","param": "voornaam",},
      {"location": "body","msg": "Invalid value","param": "naam",},
      {"location": "body","msg": "Naam must be between 1 and 255 characters","param": "naam",},
      {"location": "body","msg": "Invalid value","param": "geboortedatum",},
      {"location": "body","msg": "Geboortedatum must be exact 10 characters (type: YYYY-MM-DD)","param": "geboortedatum",},
      {"location": "body","msg": "Invalid value","param": "stad",},
      {"location": "body","msg": "Stad must be between 1 and 255 characters","param": "stad",},
      {"location": "body","msg": "Invalid value","param": "straat",},
      {"location": "body","msg": "Straat must be between 1 and 255 characters","param": "straat",},
      {"location": "body","msg": "Invalid value","param": "huisnummer",},
      {"location": "body","msg": "Huisnummer must be between 1 and 10 characters","param": "huisnummer",},
      {"location": "body","msg": "Invalid value","param": "auth0id",},
      {"location": "body","msg": "Auth0id must be between 5 and 255 characters","param": "auth0id",}
    ],
  });
});


it("PUT /reizigers/:id with incorrect id and incorrect body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).put("/api/reizigers/-10").send({}).set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({
    "errors": [
      {"location": "params","msg": "Id must be a positive integer","param": "id","value": "-10",},
      {"location": "body","msg": "Invalid value","param": "voornaam",},
      {"location": "body","msg": "Voornaam must be between 1 and 255 characters","param": "voornaam",},
      {"location": "body","msg": "Invalid value","param": "naam",},
      {"location": "body","msg": "Naam must be between 1 and 255 characters","param": "naam",},
      {"location": "body","msg": "Invalid value","param": "geboortedatum",},
      {"location": "body","msg": "Geboortedatum must be exact 10 characters (type: YYYY-MM-DD)","param": "geboortedatum",},
      {"location": "body","msg": "Invalid value","param": "stad",},
      {"location": "body","msg": "Stad must be between 1 and 255 characters","param": "stad",},
      {"location": "body","msg": "Invalid value","param": "straat",},
      {"location": "body","msg": "Straat must be between 1 and 255 characters","param": "straat",},
      {"location": "body","msg": "Invalid value","param": "huisnummer",},
      {"location": "body","msg": "Huisnummer must be between 1 and 10 characters","param": "huisnummer",},
      {"location": "body","msg": "Invalid value","param": "auth0id",},
      {"location": "body","msg": "Auth0id must be between 5 and 255 characters","param": "auth0id",}
    ],
  });
});


it("PUT /reizigers/:id with non-existing id and correct body", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const testReizigerUpdate = {
    voornaam: "TestVoornaamUpdate",
    naam: "TestNaamUpdate",
    geboortedatum: "2021-01-01",
    straat: "TestStraatUpdate",
    stad: "TestStadUpdate",
    huisnummer: "2",
    auth0id: "639f942faacda0152647fbbf",
  }

  const response = await request(app).put("/api/reizigers/10").send(testReizigerUpdate).set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(500);
  expect(response.body).toEqual("\nInvalid `prisma.reiziger.update()` invocation:\n\n\nAn operation failed because it depends on one or more records that were required but not found. Record to update not found.");
});



// TESTS FOR DELETE REQUESTS:

it("DELETE /reizigers/:id with correct id", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).delete("/api/reizigers/2").set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(204);
  expect(response.body).toEqual({});
});


it("DELETE /reizigers/:id with incorrect id", async () => {
  const app = (await server).getApp();
  const token = await fetchAccessToken();

  const response = await request(app).delete("/api/reizigers/-10").set("Authorization", `Bearer ${token}`);
  expect(response.status).toEqual(400);
  expect(response.body).toEqual({"errors": [{"location": "params", "msg": "Id must be a positive integer", "param": "id", "value": "-10",},],});
});
