import { Type } from '@sinclair/typebox'
import mongoose, { Types } from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },

    avatar: { type: Types.ObjectId, ref: 'Avatar' },
    reviews: [{ type: Types.ObjectId, ref: 'Review' }],
    trades: [{ type: Types.ObjectId, ref: 'Trade' }],
});

const UserModel = mongoose.model("User", UserSchema);

const registerBodySchema = Type.Object({
    email: Type.String(),
    name: Type.String(),
    password: Type.String(),
    character: Type.String()
})

const registerSchema = {
    body: registerBodySchema,
    response: {
        201: Type.Object({
            message: Type.String(),

            id: Type.String(),
            email: Type.String(),
            name: Type.String(),
            character: Type.String(),
        })
    }
}

export {
    UserModel,

    registerBodySchema,

    registerSchema,
}