import { Type } from '@sinclair/typebox'
import mongoose, { Types } from 'mongoose';
import { headers } from './user';

const header = headers

const ReviewSchema = new mongoose.Schema({
    star: { type: Number, required: true },
    photo: { type: [String], default: [] },
    content: { type: String, required: true },

    kakaoId: { type: String, ref: 'Store' },
    userId: { type: Types.ObjectId, ref: 'User' }
});

const ReviewModel = mongoose.model("Review", ReviewSchema);

export {
    ReviewModel,
}