import { Type } from '@sinclair/typebox'
import mongoose, { Types } from 'mongoose';

const paramsTradesId = Type.Object({
    tradesId: Type.String()
})

const paramsUserId = Type.Object({
    userId: Type.String()
})

const TradeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    photo: { type: [String], default: [] },
    heart: { type: Number, default: 0 },
    userId: { type: Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true }
}, {
    timestamps: true 
})

TradeSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,      
    transform(doc: any, ret: any) {
        ret.id = ret._id
        delete ret._id
    }
})

const TradeModel = mongoose.model("Trade", TradeSchema)

const readAllSchema = {
    response: {
        200: Type.Object({
            trade: Type.Array(
                Type.Object({
                    id: Type.String(),
                    title: Type.String(),
                    price: Type.Number(),
                    description: Type.String(),
                    photo: Type.Array(Type.String()),
                    heart: Type.Number(),
                    userName: Type.String(),
                    createdAt: Type.String(),
                })
            )
        })
    }
}

const readSchema = {
    params: paramsTradesId,
    response: {
        200: Type.Object({
            id: Type.String(),
            title: Type.String(),
            price: Type.Number(),
            description: Type.String(),
            photo: Type.Array(Type.String()),
            heart: Type.Number(),
            userName: Type.String(),
            createdAt: Type.String(),
        })
    }
}

const readMyTradesSchema = {
    params: paramsUserId,
    response: {
        200: Type.Object({
            trade: Type.Array(
                Type.Object({
                    id: Type.String(),
                    title: Type.String(),
                    price: Type.Number(),
                    description: Type.String(),
                    photo: Type.Array(Type.String()),
                    heart: Type.Number(),
                    userName: Type.String(),
                    createdAt: Type.String(),
                })
            )
        })
    }
}

export {
    TradeModel,

    paramsTradesId,
    paramsUserId,

    readAllSchema,
    readSchema,
    readMyTradesSchema
}