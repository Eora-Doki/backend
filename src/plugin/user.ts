import fastify, { FastifyPluginAsync, FastifyRequest } from "fastify";
import { verfiyAccessToken } from "../lib/user";
import fp from 'fastify-plugin'
import { THeaders } from "../schema/types";
import { refreshToken } from "../lib/user";
import jwt from 'jsonwebtoken';
import fastifyCookie from '@fastify/cookie'

const User: FastifyPluginAsync = async (fastify) => {
    fastify.decorateRequest('user', null) 
    fastify.addHook('preHandler', async(req:FastifyRequest<{Headers: THeaders}>) => {
        const {authorization} = req.headers
        const refresh_token = req.cookies.refresh_token

        if (!authorization || !refresh_token) return
        
        try {
            const verifyRefreshToken = jwt.verify(refresh_token, process.env.SRCRET_KEY!)
            if (!verifyRefreshToken) throw Error("RefreshToken이 유효하지 않습니다.")

            const decode = verfiyAccessToken(authorization)

            req.user = { 
                id: decode.id,
                email: decode.email,
                name: decode.name,
            }
        }
        catch(error) {
            return
        }
    })
}
export const userPlugin = fp(User, {
    name: 'userPlugin'
})

declare module 'fastify' {
    interface FastifyRequest {
        user: {
            id: string,
            email: string,
            name: string,
        } | null
    }
}