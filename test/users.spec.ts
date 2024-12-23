import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "vitest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import request from "supertest";

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(async () => {
  execSync("npm run knex migrate:rollback --all");
  execSync("npm run knex migrate:latest");
});

describe("users routes", () => {
  test("can register a new user", async () => {
    const response = await request(app.server).post("/user/register").send({
      name: "Bob",
      password: "123456",
    });

    expect(response.status).toBe(201);
  });

  test("should login in existing user", async () => {
    await request(app.server).post("/user/register").send({
      name: "Bob",
      password: "123456",
    });

    const response = await request(app.server).post("/user/login").send({
      name: "Bob",
      password: "123456",
    });

    expect(response.status).toBe(200);
  });

  test("should not login in user that doesnt exist", async () => {
    const response = await request(app.server).post("/user/login").send({
      name: "Bobby",
      password: "123345",
    });

    expect(response.status).toBe(401);
  });
});
