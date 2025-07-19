import { Static } from '@sinclair/typebox'
import { registerBodySchema } from '../user'

type TUserRegisterBody = Static<typeof registerBodySchema>

export {
    TUserRegisterBody,
}