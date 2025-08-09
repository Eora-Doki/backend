import { Type } from '@sinclair/typebox'
import { paramsUserId } from './review'

const keywordBodySchema = Type.Object({
    keyword: Type.Array(Type.String())
})

const keywordRegisterSchema = {
    params: paramsUserId,
    body: keywordBodySchema,
    response: {
        200: Type.Object({
            userId: Type.String(),
            keyword: Type.Array(Type.String())
        })
    }
}

export {
    keywordBodySchema,

    keywordRegisterSchema,
}