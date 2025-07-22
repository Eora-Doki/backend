import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { registerSchema, loginSchema } from "../schema/user";
import { TUserRegisterBody, TUserLoginBody } from "../schema/types";
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
    fastify.route({
        method: 'POST',
        url: '/login',
        schema: loginSchema,
        handler: async (
            req: FastifyRequest<{Body: TUserLoginBody}>,
            rep: FastifyReply ) => {
                const { email, password } = req.body

                try {
                    const userLogin = await userService.login(email, password)

                    rep.setCookie('refresh_token', userLogin.refresh_token, {
                        sameSite: 'lax',
                        secure: false,
                        path: '/',
                        httpOnly: true,
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
                    });

                    rep.status(200).send({
                        id: userLogin.id,
                        email: userLogin.email,
                        Authorization: userLogin.access_token
                    })
                }

                catch(err) {
                    throw err
                }
            }
    })
}

export default userRoute