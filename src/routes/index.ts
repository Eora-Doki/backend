import fastify, { FastifyInstance } from "fastify";
import userRoute from "./user";
import storeRoute from "./store";
import reviewRoute from "./reivew";
import tradeRoute from "./trade";

const routes = async (fastify: FastifyInstance) => {
    await fastify.register(userRoute, {prefix: '/users'})
    await fastify.register(storeRoute, {prefix: '/stores'})
    await fastify.register(reviewRoute, {prefix: '/stores'})
    await fastify.register(tradeRoute, {prefix: '/trades'})
}

export default routes