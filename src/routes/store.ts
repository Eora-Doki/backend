import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { searchSchema } from "../schema/store";
import { TStoreSearchQuery } from "../schema/types";
import storeService from "../services/store"

const storeRoute = async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'GET',
        url: '/search',
        schema: searchSchema,
        handler: async (req: FastifyRequest<{Querystring: TStoreSearchQuery}>, rep: FastifyReply ) => {
            const { latitude, longitude } = req.query

            try {
                const info = await storeService.search(latitude, longitude)
                rep.status(200).send(info)
            }
            catch(err) {
                throw err
            }
        }
    })
}

export default storeRoute