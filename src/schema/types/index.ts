import { Static } from '@sinclair/typebox'
import { headers, registerBodySchema, loginBodySchema, resetPasswordBodySchema } from '../user'
import { searchQuerySchema } from '../store'
import { updateBodySchema, paramsKakaoId, paramsKakaoIdReviewId, paramsUserId, queryUserId } from '../review'
import { paramsTradesId } from '../trade'
import { keywordBodySchema } from '../keyword'

type THeaders = Static<typeof headers>
type TUserRegisterBody = Static<typeof registerBodySchema>
type TUserLoginBody = Static<typeof loginBodySchema>
type TUserResetPasswordBody = Static<typeof resetPasswordBodySchema>
type TStoreSearchQuery = Static<typeof searchQuerySchema>
type TReviewKakaoIdParams = Static<typeof paramsKakaoId>
type TReviewKakaoIdReviewIdParams = Static<typeof paramsKakaoIdReviewId>
type TUserIdParams = Static<typeof paramsUserId>
type TUserIdQuery = Static<typeof queryUserId>
type TReviewUpdateBody = Static<typeof updateBodySchema>
type TTradeIdParams = Static<typeof paramsTradesId>
type TUserKeywordBody = Static<typeof keywordBodySchema>

export {
    THeaders,
    TUserRegisterBody,
    TUserLoginBody,
    TUserResetPasswordBody,
    TStoreSearchQuery,
    TReviewKakaoIdParams,
    TReviewKakaoIdReviewIdParams,
    TUserIdParams,
    TUserIdQuery,
    TReviewUpdateBody,
    TTradeIdParams,
    TUserKeywordBody,
}