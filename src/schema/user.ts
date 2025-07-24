import { Type } from '@sinclair/typebox'
import mongoose, { Types } from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    character: { type: String, required: true }, 
    keyword: [{ type: String }],

    token: {type: Types.ObjectId, ref: 'Token'},
    avatar: { type: Types.ObjectId, ref: 'Avatar' },
    reviews: [{ type: Types.ObjectId, ref: 'Review' }],
    trades: [{ type: Types.ObjectId, ref: 'Trade' }],
});

const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
//   expiresAt: { type: Date, required: true }
});

const UserModel = mongoose.model("User", UserSchema);
const TokenModel = mongoose.model("Token", TokenSchema);

const headers = Type.Object({
    Authorization: Type.String()
})

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
            id: Type.String(),
            email: Type.String(),
            name: Type.String(),
            character: Type.String(),
        })
    }
}

const loginBodySchema = Type.Object({
    email: Type.String(),
    password: Type.String()
})

const loginSchema = {
    body: loginBodySchema,
    response: {
        200: Type.Object({
            id: Type.String(),
            email: Type.String(),
            name: Type.String(),
            Authorization: Type.String(),
        })
    }
}

const logoutSchema = {
    response: {
        200: Type.Object({
            message: Type.String()
        })
    }
}

const resetPasswordBodySchema = Type.Object({
    email: Type.String(),
    password: Type.String()
})

const resetPasswordSchema = {
    body: resetPasswordBodySchema,
    response: {
        200: Type.Object({
            message: Type.String()
        })
    }
}

export {
    UserModel,
    TokenModel,

    headers,
    registerBodySchema,
    loginBodySchema,
    resetPasswordBodySchema,

    registerSchema,
    loginSchema,
    resetPasswordSchema,
    logoutSchema,
}