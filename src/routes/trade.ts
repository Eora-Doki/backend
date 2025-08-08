import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { uploadToS3 } from "../utils/s3Upload";
import tradeService from "../services/trade"
import { readAllSchema, readSchema } from "../schema/trade";
import { TTradeIdParams } from "../schema/types";

const tradeRoute = async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'POST',
        url: '',
        handler: async (req: FastifyRequest, rep: FastifyReply) => {
            const parts = await (req as any).parts();

            const photoPaths: string[] = []
            let info_trade = ''

            for await (const part of parts) {
                if (part.type === 'file' && part.fieldname === 'photo') {
                    if (part.filename) {
                        const s3Url = await uploadToS3(part.file, part.filename, part.mimetype);
                        photoPaths.push(s3Url);
                    }
                } else if (part.type === 'field') {
                    if (part.fieldname === 'trade') info_trade = part.value as string
                }
            }

            let trade!: {
                title: string,
                price: number,
                description: string,
                userId: string,
                userName: string,
            } 

            try {
                trade = JSON.parse(info_trade)
            } 
            catch (err) {
                return rep.status(400).send({ message: '잘못된 JSON 형식입니다.' })
            }

            try {
                const trades = await tradeService.register({
                    title: trade.title,
                    price: trade.price,
                    description: trade.description,
                    photo: photoPaths,
                    userId: trade.userId,
                    userName: trade.userName
                })
                return rep.send({
                    trade: trades
                })
            }
            catch(err) {
                throw err
            }
        }
    })
    fastify.route({
        method: 'GET',
        url: '',
        schema: readAllSchema,
        handler: async(req: FastifyRequest, rep: FastifyReply) => {
            try {
                const trades = await tradeService.readAll()
                return {
                    trade: trades
                }
            }
            catch(err) {
                throw err
            }
        }
    })
    fastify.route({
        method: 'GET',
        url: '/:tradesId',
        schema: readSchema,
        handler: async(req: FastifyRequest<{ Params: TTradeIdParams }>, rep: FastifyReply) => {
            const { tradesId } = req.params

            try {
                const trade = await tradeService.read({ tradesId })
                if (!trade) {
                    return rep.status(404).send({ message: '해당 게시글이 없습니다.' })
                }

                rep.send( trade )
            }
            catch(err) {
                throw err
            }
        }
    })
}

export default tradeRoute