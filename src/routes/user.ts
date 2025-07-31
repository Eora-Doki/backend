import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { registerSchema, loginSchema, resetPasswordSchema, logoutSchema } from "../schema/user";
import { TUserRegisterBody, TUserLoginBody, TUserResetPasswordBody, TUserResetPasswordParams } from "../schema/types";
import fastifyCookie from '@fastify/cookie'
import userService from "../services/user.ts"

const userRoute = async (fastify: FastifyInstance) => {
    fastify.route({
        method: 'POST',
        url: '/register',
        schema: registerSchema,
        handler: async (req: FastifyRequest<{Body: TUserRegisterBody}>, rep: FastifyReply) => {
                const { email, name, password, character } = req.body

                try {
                    const userRegister = await userService.register({
                        email, 
                        name, 
                        password,
                        character
                    })

                    rep.status(201).send(userRegister) 
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
        handler: async (req: FastifyRequest<{Body: TUserLoginBody}>, rep: FastifyReply ) => {
                const { email, password } = req.body

                try {
                    const userLogin = await userService.login({
                        email, 
                        password
                    })

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
                        name: userLogin.name,
                        character: userLogin.character,
                        Authorization: userLogin.access_token
                    })
                }

                catch(err) {
                    throw err
                }
            }
    })
    fastify.route({
        method: 'DELETE',
        url: '/logout',
        schema: logoutSchema,
        handler: async (req: FastifyRequest, rep: FastifyReply ) => {
                const refresh_token = req.cookies.refresh_token
                if (!refresh_token) {
                    return rep.status(401).send({ message: "refresh token이 존재하지 않습니다." });
                }
                
                try {
                    const userLogout = await userService.logout({
                        refresh_token
                    })

                    rep.clearCookie('refresh_token', {path: '/'})
                    rep.status(200).send(userLogout)
                }
                catch(err) {
                    throw err
                }
            }
    })
    fastify.route({
        method: 'PATCH',
        url: '/:userId/password',
        schema: resetPasswordSchema,
        handler: async (req: FastifyRequest<{Body: TUserResetPasswordBody, Params: TUserResetPasswordParams}>, rep: FastifyReply ) => {
                const { email, password } = req.body
                const { userId } = req.params

                try {
                    const resetPassword = await userService.resetPassword({
                        email, 
                        password, 
                        userId
                    })

                    rep.status(200).send(resetPassword)
                }
                catch(err) {
                    throw err
                }

        }
    })
}

export default userRoute