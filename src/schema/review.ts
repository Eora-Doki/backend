import { Type } from '@sinclair/typebox'
import mongoose, { Types } from 'mongoose';
import { headers } from './user';

const header = headers

const ReviewSchema = new mongoose.Schema({
    star: { type: Number, required: true },
    photo: { type: [String], default: [] },
    content: { type: String, required: true },

    kakaoId: { type: String, ref: 'Store' },
    userId: { type: Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true }
});

const readMySchema = {
  response: {
    200: Type.Object({
      count: Type.Number(),
      reviews: Type.Array(
        Type.Object({
          _id: Type.String(),  
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


const ReviewModel = mongoose.model("Review", ReviewSchema);

export {
    ReviewModel,

    readMySchema,
}