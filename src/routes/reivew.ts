import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import reviewService from "../services/review";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";
import { StoreModel } from "../schema/store";
import storeService from "../services/store"

const reviewRoute = async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'POST',
        url: '/register',
        handler: async (req: FastifyRequest, rep: FastifyReply) => {
            const parts = await req.parts()
            const userId = req.user!.id
            const userName = req.user!.name

            const photoPaths: string[] = []
            let info_review = ''
            let info_store = ''

            for await (const part of parts) {
                if (part.type === 'file' && part.fieldname === 'photo') {
                    if (part.filename) {
                        const filename = Date.now() + '_' + part.filename
                        const filePath = path.join(__dirname, '../../../uploads', filename)
                        await pipeline(part.file, fs.createWriteStream(filePath))
                        photoPaths.push(`/uploads/${filename}`)
                    }
                } else if (part.type === 'field') {
                    if (part.fieldname === 'review') info_review = part.value as string;
                    if (part.fieldname === 'store') info_store = part.value as string;
                }
            }

            let review: {
                star: number
                content: string
                kakaoId: string
            }
            
            let store: {
                kakaoId: string
                name: string
                address: string
                place_url: string
                phone: string
                latitude: string
                longitude: string
            } | null = null

            try {
                review = JSON.parse(info_review)
                store = JSON.parse(info_store)
            } 
            catch (err) {
                return rep.status(400).send({ message: '잘못된 JSON 형식입니다.' });
            }

            if (!store) {
                return rep.status(400).send({ message: '가게 정보가 누락되었습니다.' });
            }

            try {
                const stores = await storeService.register({
                    kakaoId: store.kakaoId,
                    name: store.name,
                    address: store.address,
                    place_url: store.place_url,
                    phone: store.phone,
                    latitude: parseFloat(store.latitude),
                    longitude: parseFloat(store.longitude),
                    star: review.star
                })

                const reviews = await reviewService.register({
                    star: review.star,
                    photo: photoPaths,
                    content: review.content,
                    kakaoId: review.kakaoId,
                    userId,
                    userName,
                });

                return rep.send({
                    store: stores,
                    review: reviews
                });
            } 
            catch (err) {
                return rep.status(500).send({ message: '리뷰 등록 실패', error: err });
            }
        }
    });
};

export default reviewRoute;