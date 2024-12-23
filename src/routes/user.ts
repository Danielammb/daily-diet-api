import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";

export async function userRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const createRegistrationBodySchema = z.object({
      name: z.string(),
      password: z.string().min(6),
    });

    const { name, password } = createRegistrationBodySchema.parse(request.body);

    await knex("users").insert({
      id: randomUUID(),
      name,
      password, //usar hash ao salvar no banco de dados
    });

    return reply.status(201).send();
  });
  app.post("/login", async (request, reply) => {
    const createLoginBodySchema = z.object({
      name: z.string(),
      password: z.string().min(6),
    });

    const { name, password } = createLoginBodySchema.parse(request.body);

    const user = await knex("users").where({ name, password }).first();

    if (!user) {
      return reply.status(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, "secret-key-example", {
      expiresIn: "1h",
    });

    return reply.send({ token });
  });
}
