import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type { FastifyCookieOptions } from "@fastify/cookie";
import fastifyCookie from "@fastify/cookie";
import fs from 'fs'
import cors from '@fastify/cors'
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { swaggerConfig, swaggerUiConfig } from "./config/swagger";
import { connectDB } from "./db";
import routes from "./routes";

const fastify = Fastify({
    logger: true,
    // https: {
    //     key: fs.readFileSync('./server.key'),
    //     cert: fs.readFileSync('./server.crt')
    // }
}).withTypeProvider<TypeBoxTypeProvider>()

fastify.register(fastifyCookie);

fastify.register(cors, {
    origin: true, 
    credentials: true, 
    allowedHeaders: ['Content-Type', 'authorization']
})

fastify.register(fastifySwagger, swaggerConfig)
fastify.register(fastifySwaggerUi, swaggerUiConfig)

fastify.register(routes)

const start = async () => {
    try {
        await connectDB();
        await fastify.listen({port: 8083, host: '0.0.0.0'})
        console.log("Server Start!")
    }
    catch(error) {
        fastify.log.error(error)
        process.exit(1)
    }
}
start()