import fastify, { FastifyInstance } from "fastify";
import userRoute from "./user";
import storeRoute from "./store";
import reviewRoute from "./reivew";

const routes = async (fastify: FastifyInstance) => {
    await fastify.register(userRoute, {prefix: '/user'})
    await fastify.register(storeRoute, {prefix: '/store'})
    await fastify.register(reviewRoute, {prefix: '/review'})
}

export default routes