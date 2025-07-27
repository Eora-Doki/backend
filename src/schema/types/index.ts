import { Static } from '@sinclair/typebox'
import { headers, registerBodySchema, loginBodySchema, resetPasswordBodySchema } from '../user'
import { searchQuerySchema } from '../store'

type THeaders = Static<typeof headers>
type TUserRegisterBody = Static<typeof registerBodySchema>
type TUserLoginBody = Static<typeof loginBodySchema>
type TUserResetPasswordBody = Static<typeof resetPasswordBodySchema>
type TStoreSearchQuery = Static<typeof searchQuerySchema>

export {
    THeaders,
    TUserRegisterBody,
    TUserLoginBody,
    TUserResetPasswordBody,
    TStoreSearchQuery,
}