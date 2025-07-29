import { Static } from '@sinclair/typebox'
import { headers, registerBodySchema, loginBodySchema, resetPasswordBodySchema } from '../user'
import { searchQuerySchema } from '../store'
import { readQuerySchema, updateBodySchema } from '../review'

type THeaders = Static<typeof headers>
type TUserRegisterBody = Static<typeof registerBodySchema>
type TUserLoginBody = Static<typeof loginBodySchema>
type TUserResetPasswordBody = Static<typeof resetPasswordBodySchema>
type TStoreSearchQuery = Static<typeof searchQuerySchema>
type TReviewReadQuery = Static<typeof readQuerySchema>
type TReviewUpdateBody = Static<typeof updateBodySchema>

export {
    THeaders,
    TUserRegisterBody,
    TUserLoginBody,
    TUserResetPasswordBody,
    TStoreSearchQuery,
    TReviewReadQuery,
    TReviewUpdateBody
}