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

describe("meals routes", () => {
  test("can register a new meal", async () => {
    await request(app.server).post("/user/register").send({
      name: "Bob",
      password: "123456",
    });
    const _response = await request(app.server).post("/user/login").send({
      name: "Bob",
      password: "123456",
    });
    await request(app.server)
      .post("/meal")
      .send({
        name: "Lanche",
        description: "café com pão de queijo",
        date: "2022-01-01",
        isInDiet: true,
      })
      .set("Authorization", _response.body.token);
    const response = await request(app.server)
      .get("/meal")
      .set("Authorization", _response.body.token);
    expect(response.status).toBe(200);
  });

  test("should get meal registered", async () => {
    await request(app.server).post("/user/register").send({
      name: "Bob",
      password: "123456",
    });
    const _response = await request(app.server).post("/user/login").send({
      name: "Bob",
      password: "123456",
    });
    await request(app.server)
      .post("/meal")
      .send({
        name: "Lanche",
        description: "café com pão de queijo",
        date: "2022-01-01",
        isInDiet: true,
      })
      .set("Authorization", _response.body.token);
    const response = await request(app.server)
      .get("/meal")
      .set("Authorization", _response.body.token);
    expect(response.status).toBe(200);
  });

  test("should get meal registered by id", async () => {
    await request(app.server).post("/user/register").send({
      name: "Bob",
      password: "123456",
    });
    const _response = await request(app.server).post("/user/login").send({
      name: "Bob",
      password: "123456",
    });
    await request(app.server)
      .post("/meal")
      .send({
        name: "Lanche",
        description: "café com pão de queijo",
        date: "2022-01-01",
        isInDiet: true,
      })
      .set("Authorization", _response.body.token);
    const responseMeals = await request(app.server)
      .get("/meal")
      .set("Authorization", _response.body.token);
    const response = await request(app.server)
      .get(`/meal/${responseMeals.body.meals[0].id}`)
      .set("Authorization", _response.body.token);
    expect(response.status).toBe(200);
  });

  test("should be able to edit meal registered by id", async () => {
    await request(app.server).post("/user/register").send({
      name: "Bob",
      password: "123456",
    });
    const _response = await request(app.server).post("/user/login").send({
      name: "Bob",
      password: "123456",
    });
    await request(app.server)
      .post("/meal")
      .send({
        name: "Lanche",
        description: "café com pão de queijo",
        date: "2022-01-01",
        isInDiet: true,
      })
      .set("Authorization", _response.body.token);
    const responseMeals = await request(app.server)
      .get("/meal")
      .set("Authorization", _response.body.token);
    const response = await request(app.server)
      .put(`/meal/${responseMeals.body.meals[0].id}`)
      .send({
        name: "Café da tarde",
      })
      .set("Authorization", _response.body.token);
    expect(response.status).toBe(200);
  });
  test("should be able to delete meal registered by id", async () => {
    await request(app.server).post("/user/register").send({
      name: "Bob",
      password: "123456",
    });
    const _response = await request(app.server).post("/user/login").send({
      name: "Bob",
      password: "123456",
    });
    await request(app.server)
      .post("/meal")
      .send({
        name: "Lanche",
        description: "café com pão de queijo",
        date: "2022-01-01",
        isInDiet: true,
      })
      .set("Authorization", _response.body.token);
    const responseMeals = await request(app.server)
      .get("/meal")
      .set("Authorization", _response.body.token);
    const response = await request(app.server)
      .delete(`/meal/${responseMeals.body.meals[0].id}`)
      .send({
        name: "Café da tarde",
      })
      .set("Authorization", _response.body.token);
    expect(response.status).toBe(204);
  });
  test("should be able to get summary", async () => {
    await request(app.server).post("/user/register").send({
      name: "Bob",
      password: "123456",
    });
    const _response = await request(app.server).post("/user/login").send({
      name: "Bob",
      password: "123456",
    });
    await request(app.server)
      .post("/meal")
      .send({
        name: "Lanche",
        description: "café com pão de queijo",
        date: "2022-01-01",
        isInDiet: true,
      })
      .set("Authorization", _response.body.token);
    await request(app.server)
      .post("/meal")
      .send({
        name: "Sobremesa",
        description: "sorvete",
        date: "2022-01-01",
        isInDiet: false,
      })
      .set("Authorization", _response.body.token);
    const response = await request(app.server)
      .get(`/meal/summary`)
      .send({
        name: "Café da tarde",
      })
      .set("Authorization", _response.body.token);
    expect(response.status).toBe(200);
  });
});
