import { UserModel } from "../schema/user"
import bcrypt from 'bcrypt'

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

export {
    verifyEmail,
    verifyName,
    passwordEcrypt,
}