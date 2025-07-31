import { Static } from '@sinclair/typebox'
import { headers, registerBodySchema, loginBodySchema, resetPasswordParamsSchema, resetPasswordBodySchema } from '../user'
import { searchQuerySchema } from '../store'
import { readQuerySchema, updateBodySchema, deleteQuerySchema } from '../review'

type THeaders = Static<typeof headers>
type TUserRegisterBody = Static<typeof registerBodySchema>
type TUserLoginBody = Static<typeof loginBodySchema>
type TUserResetPasswordParams = Static<typeof resetPasswordParamsSchema>
type TUserResetPasswordBody = Static<typeof resetPasswordBodySchema>
type TStoreSearchQuery = Static<typeof searchQuerySchema>
type TReviewReadQuery = Static<typeof readQuerySchema>
type TReviewUpdateBody = Static<typeof updateBodySchema>
type TReviewDeleteQuery = Static<typeof deleteQuerySchema>

export {
    THeaders,
    TUserRegisterBody,
    TUserLoginBody,
    TUserResetPasswordParams,
    TUserResetPasswordBody,
    TStoreSearchQuery,
    TReviewReadQuery,
    TReviewUpdateBody,
    TReviewDeleteQuery,
}