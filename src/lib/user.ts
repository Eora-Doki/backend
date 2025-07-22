import { UserModel } from "../schema/user"
import { TUserLoginBody } from "../schema/types"
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken';

const verifyEmail = async (email: string) => {
    try {
        const cnt = await UserModel.countDocuments({
            email: email
        })
        if (cnt > 0) throw Error("이미 사용중인 이메일입니다.")
        return true
    }
    catch(err) {
        throw err
    }
}

const verifyName = async (name: string) => {
    try {
        const cnt = await UserModel.countDocuments({
            name: name
        })
        if (cnt > 0) throw Error("이미 사용중인 닉네임입니다.")
        return true
    }
    catch(err) {
        throw err
    }
}

const passwordEcrypt = async (password: string) => {
    const ecrypt = await bcrypt.hash(password, Number(process.env.HASH_ROUND))
    return ecrypt
}

const accessToken = (user: {id: string, email: string, name: string}) => {
    const accessToken = jwt.sign({id:user.id, email:user.email, name:user.name}, process.env.SECRET_KEY!, {expiresIn: process.env.ACCESS_TOKEN_EXPIRES})
    return accessToken
}

const refreshToken = (user: {id: string, email: string, name: string}) => {
    const refreshToken = jwt.sign({id:user.id, email:user.email, name: user.name}, process.env.SECRET_KEY!, {expiresIn: process.env.REFRESH_TOKEN_EXPIRES})
    return refreshToken
}

const verfiyAccessToken = (access_token: string) => {
    try {
        const decode = jwt.verify(access_token, process.env.SECRET_KEY!) as JwtPayload
        return decode
    }
    catch(err) {
        throw err
    }
}


export {
    verifyEmail,
    verifyName,
    passwordEcrypt,
    accessToken,
    refreshToken,
    verfiyAccessToken,
}