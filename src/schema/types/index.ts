import { Static } from '@sinclair/typebox'
import { headers, registerBodySchema, loginBodySchema, resetPasswordParamsSchema, resetPasswordBodySchema } from '../user'
import { searchQuerySchema } from '../store'
import { updateBodySchema, paramsKakaoId, paramsKakaoIdReviewId, paramsUserId, queryUserId } from '../review'

type THeaders = Static<typeof headers>
type TUserRegisterBody = Static<typeof registerBodySchema>
type TUserLoginBody = Static<typeof loginBodySchema>
type TUserResetPasswordParams = Static<typeof resetPasswordParamsSchema>
type TUserResetPasswordBody = Static<typeof resetPasswordBodySchema>
type TStoreSearchQuery = Static<typeof searchQuerySchema>
type TReviewKakaoIdParams = Static<typeof paramsKakaoId>
type TReviewKakaoIdReviewIdParams = Static<typeof paramsKakaoIdReviewId>
type TReviewUserIdParams = Static<typeof paramsUserId>
type TReviewUserIdQuery = Static<typeof queryUserId>
type TReviewUpdateBody = Static<typeof updateBodySchema>

export {
    THeaders,
    TUserRegisterBody,
    TUserLoginBody,
    TUserResetPasswordParams,
    TUserResetPasswordBody,
    TStoreSearchQuery,
    TReviewKakaoIdParams,
    TReviewKakaoIdReviewIdParams,
    TReviewUserIdParams,
    TReviewUserIdQuery,
    TReviewUpdateBody,
}