import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { registerSchema, loginSchema, resetPasswordSchema, logoutSchema, userInfoSchema } from "../schema/user";
import { TUserRegisterBody, TUserLoginBody, TUserResetPasswordBody, TUserIdParams, TUserKeywordBody } from "../schema/types";
import fastifyCookie from '@fastify/cookie'
import userService from "../services/user.ts"
import { readMySchema } from "../schema/review.ts";
import reviewService from "../services/review";
import { userPlugin } from "../plugin/user";
import { readMyTradesSchema } from "../schema/trade.ts";
import tradeService from "../services/trade.ts"
import { keywordRegisterSchema } from "../schema/keyword.ts";

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
        url: '/reset_password',
        schema: resetPasswordSchema,
        handler: async (req: FastifyRequest<{Body: TUserResetPasswordBody}>, rep: FastifyReply ) => {
                const { email, password } = req.body
                const userId = req.user!.id

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
    fastify.route({
        method: 'GET',
        url: '/:userId',
        schema: userInfoSchema,
        handler: async(req: FastifyRequest<{ Params: TUserIdParams }>, rep: FastifyReply) => {
            const { userId } = req.params

            try {
                const userInfo = await userService.user_info({
                    userId
                })
                rep.send(userInfo)
            }
            catch(err) {
                throw err
            }
        }
    })
    fastify.route({
        method: 'GET',
        url: '/:userId/reviews',
        schema: readMySchema,
        handler: async (req: FastifyRequest<{ Params: TUserIdParams }>, rep: FastifyReply) => {
            const { userId } = req.params

            try {
                const readMy = await reviewService.readMy(userId)
                rep.status(200).send(readMy)
            }
            catch(err) {
                throw err
            }
        }
    })
    fastify.route({
        method: 'GET',
        url: '/:userId/trades',
        schema: readMyTradesSchema,
        handler: async(req: FastifyRequest<{ Params: TUserIdParams }>, rep: FastifyReply) => {
            const { userId } = req.params

            try {
                const readMy = await tradeService.readMy({ userId })
                rep.send( readMy )
            }
            catch(err) {
                throw err
            }
        }
    })
    fastify.route({
        method: 'PATCH',
        url: '/:userId/keyword',
        schema: keywordRegisterSchema,
        handler: async(req: FastifyRequest<{ Body: TUserKeywordBody, Params: TUserIdParams }>, rep: FastifyReply) => {
            const { userId } = req.params
            const { keyword } = req.body

            try {
                const keywordUpload = await userService.keyword_upload({
                    userId,
                    keyword
                })
                rep.send(keywordUpload)
            }
            catch(err) {
                throw err
            }
        }
    })
}

export default userRoute