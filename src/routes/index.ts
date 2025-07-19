import fastify, { FastifyInstance } from "fastify";
import userRoute from "./user";

const routes = async (fastify: FastifyInstance) => {
    await fastify.register(userRoute, {prefix: '/user'})
}

export default routes