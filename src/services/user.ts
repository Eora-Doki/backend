import { TokenModel, UserModel } from "../schema/user"
import { verifyEmail, verifyName, passwordEcrypt, accessToken, refreshToken } from "../lib/user"
import bcrypt from 'bcrypt'

function userService() {
    const register = async (email: string, name: string, password: string, character: string) => {
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
    const login = async (email: string, password: string) => {
        try {
            const verify = await UserModel.findOne({email})
                .select({ _id: 1, name: 1, password: 1 })
                .lean() as { _id: any, name: string, password: string } | null;
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
                access_token,
                refresh_token
            }
        }
        catch(err) {
            throw err
        }
    }

    return {
        register,
        login,
    }
}
export default userService()