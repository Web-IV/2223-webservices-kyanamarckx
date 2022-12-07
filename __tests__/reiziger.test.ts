import createServer from "../src/createServer";
import { main } from "../src/index";
import request from "supertest";
import { expect, jest, test } from "@jest/globals";

const testReiziger = {
  voornaam: "TestVoornaam",
  naam: "TestNaam",
  geboortedatum: "2021-01-01",
  straat: "TestStraat",
  stad: "TestStad",
  huisnummer: "2",
}

beforeAll(async () => {
  const server = await createServer();
  await server.start();
});

// it("GET /reizigers", async () => {
//   const server = await createServer();
//   const app = server.getApp();

//   const response = await request(app).get("/api/reizigers");
//   expect(response.status).toEqual(200);
//   expect(response.body).toEqual([
//     {
//       "geboortedatum": "2003-10-01",
//       "huisnummer": "1C",
//       "id": 1,
//       "naam": "Marckx",
//       "stad": "Lierde",
//       "straat": "Keistraat",
//       "voornaam": "Kyana",
//     },
//     {
//       "geboortedatum": "2003-12-15",
//       "huisnummer": "5",
//       "id": 2,
//       "naam": "De Waegeneer",
//       "stad": "Aalst",
//       "straat": "Hugo Lefèvrestraat",
//       "voornaam": "Robin",
//     },
//     {
//       "geboortedatum": "1959-12-09",
//       "huisnummer": "10",
//       "id": 3,
//       "naam": "Van der Linden",
//       "stad": "Lierde",
//       "straat": "Molenstraat",
//       "voornaam": "Greta",
//     },
//   ]);
// });

it("GET /reizigers/:id", async () => {
  const server = await createServer();
  const app = server.getApp();

  const response = await request(app).get("/api/reizigers/1");
  expect(response.status).toEqual(200);
  const reizigerId = response.body.id;
  expect(response.body).toEqual({"geboortedatum": "2003-10-01", "huisnummer": "1C", "id": reizigerId, "naam": "Marckx", "stad": "Lierde", "straat": "Keistraat", "voornaam": "Kyana"});
});

it("POST /reizigers", async () => {
  const server = await createServer();
  const app = server.getApp();

  const response = await request(app).post("/api/reizigers").send(testReiziger);
  expect(response.status).toEqual(201);
  const reizigerId = response.body.id;
  expect(response.body).toEqual({"geboortedatum": "2021-01-01", "huisnummer": "2", "id": reizigerId, "naam": "TestNaam", "stad": "TestStad", "straat": "TestStraat", "voornaam": "TestVoornaam"});
});

it("PUT /reizigers/:id", async () => {
  const server = await createServer();
  const app = server.getApp();

  const testReizigerOrigineel = {
    "geboortedatum": "2003-10-01",
    "huisnummer": "1C",
    "id": 1,
    "naam": "Marckx",
    "stad": "Lierde",
    "straat": "Keistraat",
    "voornaam": "Kyana",
  }
  const response = await request(app).put("/api/reizigers/1").send(testReizigerOrigineel);
  expect(response.status).toEqual(200);
  const reizigerId = response.body.id;
  expect(response.body).toEqual({"geboortedatum": "2003-10-01", "huisnummer": "1C", "id": reizigerId, "naam": "Marckx", "stad": "Lierde", "straat": "Keistraat", "voornaam": "Kyana"});
});

it("PUT /reizigers/:id", async () => {
  const server = await createServer();
  const app = server.getApp();

  const testReizigerUpdate = {
    voornaam: "TestVoornaamUpdate",
    naam: "TestNaamUpdate",
    geboortedatum: "2021-01-01",
    straat: "TestStraatUpdate",
    stad: "TestStadUpdate",
    huisnummer: "2",
  }
  const response = await request(app).put("/api/reizigers/5").send(testReizigerUpdate);
  expect(response.status).toEqual(200);
  const reizigerId = response.body.id;
  expect(response.body).toEqual({"geboortedatum": "2021-01-01", "huisnummer": "2", "id": reizigerId, "naam": "TestNaamUpdate", "stad": "TestStadUpdate", "straat": "TestStraatUpdate", "voornaam": "TestVoornaamUpdate"});
});

it("DELETE /reizigers/:id", async () => {
  const server = await createServer();
  const app = server.getApp();

  const response = await request(app).delete("/api/reizigers/23");
  expect(response.status).toEqual(204);
  expect(response.body).toEqual({});
});