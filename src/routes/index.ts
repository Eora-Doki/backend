import fastify, { FastifyInstance } from "fastify";
import userRoute from "./user";
import storeRoute from "./store";

const routes = async (fastify: FastifyInstance) => {
    await fastify.register(userRoute, {prefix: '/user'})
    await fastify.register(storeRoute, {prefix: '/store'})
}

export default routes