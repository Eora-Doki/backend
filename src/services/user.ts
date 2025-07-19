import { UserModel } from "../schema/user"
import { verifyEmail, verifyName, passwordEcrypt } from "../lib/user"

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

    return {
        register,
    }
}
export default userService()