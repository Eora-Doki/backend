import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import reviewService from "../services/review";
import { StoreModel } from "../schema/store";
import storeService from "../services/store"
import { deleteSchema, readMySchema, readSchema, updateSchema } from "../schema/review";
import { TReviewKakaoIdParams, TReviewKakaoIdReviewIdParams, TReviewUpdateBody, TUserIdQuery } from "../schema/types";
import { userPlugin } from "../plugin/user";
import { uploadToS3 } from "../utils/s3Upload";
// import path from "path";
// import fs from "fs";
// import { pipeline } from "stream/promises";

const reviewRoute = async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'POST',
        url: '/:kakaoId/reviews',
        handler: async (req: FastifyRequest<{ Params: TReviewKakaoIdParams }>, rep: FastifyReply) => {
            const parts = await (req as any).parts();
            const { kakaoId } = req.params

            const photoPaths: string[] = []
            let info_review = ''
            let info_store = ''

            for await (const part of parts) {
                if (part.type === 'file' && part.fieldname === 'photo') {
                    if (part.filename) {
                        const s3Url = await uploadToS3(part.file, part.filename, part.mimetype);
                        photoPaths.push(s3Url);
                        // const filename = Date.now() + '_' + part.filename
                        // const filePath = path.join(__dirname, '../../../uploads', filename)
                        // await pipeline(part.file, fs.createWriteStream(filePath))
                        // photoPaths.push(`/uploads/${filename}`)
                    }
                } else if (part.type === 'field') {
                    if (part.fieldname === 'review') info_review = part.value as string
                    if (part.fieldname === 'store') info_store = part.value as string
                }
            }

            let review: {
                star: number
                content: string
                userId: string
                userName: string
            }
            
            let store: {
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
                return rep.status(400).send({ message: '잘못된 JSON 형식입니다.' })
            }

            if (!store) {
                return rep.status(400).send({ message: '가게 정보가 누락되었습니다.' })
            }

            try {
                const stores = await storeService.register({
                    kakaoId,
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
                    kakaoId,
                    userId: review.userId,
                    userName: review.userName,
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
    })
    fastify.route({
        method: 'GET',
        url: '/:kakaoId/reviews',
        schema: readSchema,
        handler: async (req: FastifyRequest<{ Params: TReviewKakaoIdParams }>, rep: FastifyReply) => {
            const { kakaoId } = req.params

            try {
                const readAll = await reviewService.read(kakaoId)
                rep.status(200).send(readAll)
            }
            catch(err) {
                throw err
            }
        }
    })
    fastify.route({
        method: 'PATCH',
        url: '/:kakaoId/reviews/:reviewId',
        // schema: updateSchema,
        handler: async (req: FastifyRequest<{ Params: TReviewKakaoIdReviewIdParams }>, rep: FastifyReply) => {
            const parts = await (req as any).parts()
            const { kakaoId, reviewId } = req.params

            const photoPaths: string[] = []
            let info_review = ''

            for await (const part of parts) {
                if (part.type === 'file' && part.fieldname === 'photo') {
                    if (part.filename) {
                        const s3Url = await uploadToS3(part.file, part.filename, part.mimetype);
                        photoPaths.push(s3Url);
                        // const filename = Date.now() + '_' + part.filename
                        // const filePath = path.join(__dirname, '../../../uploads', filename)
                        // await pipeline(part.file, fs.createWriteStream(filePath))
                        // photoPaths.push(`/uploads/${filename}`)
                    }
                }
                else if (part.type === 'field') {
                    if (part.fieldname === 'review') info_review = part.value as string
                }
            }

            let review: {
                star: number
                content: string
                userId: string
                userName: string
            }

            try {
                review = JSON.parse(info_review)
            } 
            catch (err) {
                return rep.status(400).send({ message: '잘못된 JSON 형식입니다.' })
            }

            try {
                const reviews = await reviewService.update({
                    star: review.star,
                    photo: photoPaths,
                    content: review.content,
                    reviewId: reviewId,
                    kakaoId: kakaoId,
                    userId: review.userId,
                })
                return rep.send({
                    review: reviews
                });
            }
            catch(err) {
                return rep.status(500).send({ message: '리뷰 수정 실패', error: err });
            }
        }   
    })
    fastify.route({
        method: 'DELETE',
        url: '/:kakaoId/reviews/reviewId',
        schema: deleteSchema,
        handler: async (req: FastifyRequest<{ Params: TReviewKakaoIdReviewIdParams, Querystring: TUserIdQuery }>, rep: FastifyReply) => {
            const { kakaoId, reviewId } = req.params
            const { userId } = req.query

            try {
                const deleteMy = await reviewService.deleteMY({
                    _id: reviewId,
                    kakaoId,
                    userId: userId
                })
                rep.status(200).send(deleteMy)
            }
            catch(err) {
                throw err
            }
        }
    })
}

export default reviewRoute;