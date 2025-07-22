import { Static } from '@sinclair/typebox'
import { headers, registerBodySchema, loginBodySchema } from '../user'

type THeaders = Static<typeof headers>
type TUserRegisterBody = Static<typeof registerBodySchema>
type TUserLoginBody = Static<typeof loginBodySchema>

export {
    THeaders,
    TUserRegisterBody,
    TUserLoginBody
}