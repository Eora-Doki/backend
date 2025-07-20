import { Static } from '@sinclair/typebox'
import { registerBodySchema, loginBodySchema } from '../user'

type TUserRegisterBody = Static<typeof registerBodySchema>
type TUserLoginBody = Static<typeof loginBodySchema>

export {
    TUserRegisterBody,
    TUserLoginBody
}