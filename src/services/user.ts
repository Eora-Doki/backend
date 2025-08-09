import { TokenModel, UserModel } from "../schema/user"
import { verifyEmail, verifyName, passwordEcrypt, accessToken, refreshToken } from "../lib/user"
import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import { userInfo } from "os";

function userService() {
    const register = async ({
        email,
        name,
        password,
        character
    }: {
        email: string, 
        name: string,
        password: string, 
        character: string
    }) => {

        try {
            verifyEmail(email)
            verifyName(name)
            const pwd = await passwordEcrypt(password)

            const userRegister = await UserModel.create({
                email: email,
                name: name,
                password: pwd,
                character: character,
            })

            const userInfo = {
                id: userRegister._id.toString(),
                email: email,
                name: name,
                character: character,
            }

            return userInfo
        }
        catch(err) {
            throw err
        }
    }
    const login = async ({
        email,
        password
    }: {
        email: string, 
        password: string
    }) => {

        try {
            const verify = await UserModel.findOne({ email })
                .select({ _id: 1, name: 1, password: 1, character: 1 })
                .lean() as { _id: any, name: string, password: string, character: string } | null;
            if (!verify) throw Error("해당 유저가 존재하지 않습니다.")
                
            const verifyPassword = await bcrypt.compare(password, verify.password)
            if (!verifyPassword) throw Error("비밀번호가 일치하지 않습니다.")
            
            const access_token = accessToken({
                id: verify._id.toString(),
                email: email,
                name: verify.name
            })

            const refresh_token = refreshToken({
                id: verify._id.toString(),
                email: email,
                name: verify.name
            })

            const tokenRegister = await TokenModel.create({
                userId: verify._id,
                refreshToken: refresh_token
            })

            return {
                id: verify._id,
                email: email,
                name: verify.name,
                character: verify.character,
                access_token,
                refresh_token
            }
        }
        catch(err) {
            throw err
        }
    }
    const logout = async ({
        refresh_token
    }: {
        refresh_token: string
    }) => {

        try {
            const userLogout = await TokenModel.deleteMany({
                refreshToken: refresh_token
            })
            return { message: "로그아웃이 완료되었습니다." }
        }
        catch(err) {
            throw err
        }
    }
    const resetPassword = async ({
        email,
        password,
        userId
    }: {
        email: string, 
        password: string,
        userId: string
    }) => {

        try {
            const verifyUser = await UserModel.findOne({ _id: userId })
                .select({ email: 1 })
            if (!verifyUser || verifyUser.email !== email ) {
                return { message: "해당 유저가 존재하지 않습니다." }
            }

            const pwd = await passwordEcrypt(password)

            const resetPassword = await UserModel.updateOne(
                { _id: userId },
                { $set: { 
                    password: pwd 
                }}
            )

            return { message: '비밀번호 변경이 완료되었습니다.' }
        }
        catch(err) {
            throw err
        }
    }
    const keyword_upload = async({
        userId,
        keyword
    }: {
        userId: string,
        keyword: string[]
    }) => {
        
        try {
            const verifyUser = await UserModel.findById(userId)
            if (!verifyUser) {
                return { message: "해당 유저가 존재하지 않습니다." }
            }

            const keywordRegister = await UserModel.updateOne(
                { _id: userId },
                {
                    $set: {
                        keyword: keyword
                    }
                }
            )

            const returnValue = await UserModel.findById(userId)
                .select({ keyword: 1 })

            return {
                userId,
                keyword: returnValue!.keyword
            }
        }
        catch(err) {
            throw err
        }
    }
    const user_info = async({
        userId
    }: {
        userId: string
    }) => {
        try {
            const userInfo = await UserModel.findById( userId )
            if (!userInfo) {
                return { message: "해당 유저가 존재하지 않습니다." }
            }

            return userInfo
        }
        catch(err) {
            throw err
        }
    }

    return {
        register,
        login,
        logout,
        resetPassword,
        keyword_upload,
        user_info,
    }
}
export default userService()