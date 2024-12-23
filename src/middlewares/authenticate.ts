import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization;
    console.log("token: ", request.headers.authorization);
    if (!token) {
      return reply.status(401).send({ error: "Token not provided" });
    }

    const decoded = jwt.verify(token, "secret-key-example");
    console.log("decoded: ", decoded);
    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({ error: "Invalid token" });
  }
}

export default authenticate;
