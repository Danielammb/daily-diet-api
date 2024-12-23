import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import authenticate from "../middlewares/authenticate";
import { getBestSequenceChronological } from "../utils";

export async function mealRoutes(app: FastifyInstance) {
  app.post("/", { preHandler: [authenticate] }, async (request, reply) => {
    const createRegistrationBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.string(),
      isInDiet: z.boolean(),
    });

    const { name, description, date, isInDiet } =
      createRegistrationBodySchema.parse(request.body);

    await knex("meals").insert({
      id: randomUUID(),
      name,
      description,
      date,
      isInDiet,
      user_id: request.user.userId,
    });

    return reply.status(201).send();
  });
  app.get("/", { preHandler: [authenticate] }, async (request, reply) => {
    const meals = await knex("meals")
      .select("*")
      .where({ user_id: request.user.userId });

    return { meals };
  });
  app.put("/:id", { preHandler: [authenticate] }, async (request, reply) => {
    const createRegistrationBodySchema = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      date: z.string().optional(),
      isInDiet: z.boolean().optional(),
    });

    const requestBody = createRegistrationBodySchema.parse(request.body);

    const updateData = Object.fromEntries(
      Object.entries(requestBody).filter(([_, value]) => value !== undefined)
    );

    await knex("meals")
      .where({ id: request?.params.id, user_id: request.user.userId })
      .update(updateData);

    return reply.status(200).send();
  });
  app.delete("/:id", { preHandler: [authenticate] }, async (request, reply) => {
    await knex("meals")
      .delete()
      .where({ id: request?.params.id, user_id: request.user.userId });

    return reply.status(204).send();
  });
  app.get("/:id", { preHandler: [authenticate] }, async (request, reply) => {
    const meals = await knex("meals")
      .select("*")
      .where({ id: request?.params.id, user_id: request.user.userId });

    return { meals };
  });
  app.get(
    "/summary",
    { preHandler: [authenticate] },
    async (request, reply) => {
      const meals = await knex("meals")
        .select("*")
        .where({ user_id: request.user.userId });

      return {
        mealsRegistered: meals.length,
        mealsInDiet: meals.filter((meal) => meal.isInDiet).length,
        mealsOutDiet: meals.filter((meal) => !meal.isInDiet).length,
        bestSequenceChronological: getBestSequenceChronological(meals),
      };
    }
  );
}
