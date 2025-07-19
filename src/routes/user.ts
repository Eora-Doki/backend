import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { registerSchema } from "../schema/user";
import { TUserRegisterBody } from "../schema/types";
import userService from "../services/user.ts"

const userRoute = async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'POST',
        url: '/register',
        schema: registerSchema,
        handler: async (
            req: FastifyRequest<{Body: TUserRegisterBody}>, 
            rep: FastifyReply) => {
                const { email, name, password, character } = req.body

                try {
                    const userRegister = await userService.register(email, name, password, character)
                    return userRegister
                }
                catch(err) {
                    throw err
                }
        }
    })
}

export default userRoute