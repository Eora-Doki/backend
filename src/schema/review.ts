import { Type } from '@sinclair/typebox'
import mongoose, { Types } from 'mongoose';
import { headers } from './user';

const paramsKakaoId = Type.Object({
    kakaoId: Type.String()
})

const paramsKakaoIdReviewId = Type.Object({
    kakaoId: Type.String(),
    reviewId: Type.String()
})

const paramsUserId = Type.Object({
    userId: Type.String()
})

const queryUserId = Type.Object({
    userId: Type.String()
})

const ReviewSchema = new mongoose.Schema({
    star: { type: Number, required: true },
    photo: { type: [String], default: [] },
    content: { type: String, required: true },

    kakaoId: { type: String, ref: 'Store' },
    userId: { type: Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true }
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,      
        transform(doc: any, ret: any) {
            ret.id = ret._id
            delete ret._id
        }
    }
})

const readMySchema = {
    params: paramsUserId,
    response: {
        200: Type.Object({
            count: Type.Number(),
            review: Type.Array(
                Type.Object({
                    id: Type.String(),
                    star: Type.Number(),
                    photo: Type.Array(Type.String()),
                    content: Type.String(),
                    kakaoId: Type.String(),
                    userId: Type.String()
                })
            )
        })
    }
}

const readSchema = {
    params: paramsKakaoId,
    response: {
        200: Type.Object({
            review: Type.Array(
                Type.Object({
                    id: Type.String(),
                    star: Type.Number(),
                    photo: Type.Array(Type.String()),
                    content: Type.String(),
                    userName: Type.String()
                })
            )
        })
    }
}

const updateBodySchema = Type.Object({
    star: Type.Number(),
    photo: Type.String(),
    content: Type.String(),

    id: Type.String(),
})

const updateSchema = {
    params: paramsKakaoIdReviewId,
    body: updateBodySchema,
    response: {
        200: Type.Object({
            id: Type.String(),
            star: Type.Number(),
            photo: Type.String(),
            content: Type.String(),

            kakaoId: Type.String(),
            userId: Type.String(),
            userName: Type.String()
        })
    }
}

const deleteSchema = {
    params: paramsKakaoIdReviewId,
    query: queryUserId,
    response: {
        200: Type.Object({
            message: Type.String()
        })
    }
}

const ReviewModel = mongoose.model("Review", ReviewSchema);

export {
    ReviewModel,

    paramsKakaoId,
    paramsKakaoIdReviewId,
    paramsUserId,
    queryUserId,
    updateBodySchema,

    readMySchema,
    readSchema,
    updateSchema,
    deleteSchema,
}