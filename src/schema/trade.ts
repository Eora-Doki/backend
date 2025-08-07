import { Type } from '@sinclair/typebox'
import mongoose, { Types } from 'mongoose';

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

const TradeModel = mongoose.model("Trade", TradeSchema);

export {
    TradeModel,
}