import { ReviewModel } from "../schema/review"
import { StoreModel } from "../schema/store"
import { update_avg_star } from "../lib/store"

function reviewService() {
    const register = async ({
        star, 
        photo, 
        content, 
        kakaoId, 
        userId,
        userName
    }: {
        star: number, 
        photo: string[],
        content: string, 
        kakaoId: string, 
        userId: string,
        userName: string
    }) => {

        try {
            const reviewRegister = await ReviewModel.create({
                star: star,
                photo: photo,
                content: content,

                kakaoId: kakaoId,
                userId: userId,
                userName: userName
            })

            return reviewRegister
        }
        catch(err) {
            throw err
        }
    }
    const readMy = async (userId: string) => {
        try {
            const reviewMyRead = await ReviewModel.find({ userId })
                .select({ _id: 1, star: 1, photo: 1 ,content: 1, kakaoId: 1, userId: 1 })
            if (reviewMyRead.length === 0) {
                return { message: "작성한 리뷰가 없습니다." };
            }

            return {
                count: reviewMyRead.length,
                reviews: reviewMyRead
            }
        }
        catch(err) {
            throw err
        }
    }
    const read = async (kakaoId: string) => {
        try {
            const reviewRead = await ReviewModel.find({ kakaoId })
                .select({ _id: 1, star: 1, photo: 1 ,content: 1, userName: 1 })
            if (reviewRead.length === 0) {
                return { message: "작성된 리뷰가 없습니다."}
            }

            return {
                reviews: reviewRead
            }
        }
        catch(err) {
            throw err
        }
    }
    const update = async ({
        star,
        photo,
        content,
        _id,
        userId,
        kakaoId
    }: {
        star: number,
        photo: string[],
        content: string,
        _id: string
        userId: string,
        kakaoId: string
    }) => {
        
        try {
            const review = await ReviewModel.findOne({ _id })
                .select({ userId: 1 })
            if (!review || !review.userId) {
                return { message: "해당 리뷰가 존재하지 않습니다." }
            }

            if (userId !== review.userId.toString()) {
                return { message: "리뷰 수정 권한이 없습니다." }
            }

            const reviewUpdate = await ReviewModel.updateOne(
                { _id },
                {
                    $set: {
                        star,
                        photo,
                        content
                    }
                }  
            )
            await update_avg_star(kakaoId)

            const reviewUpdateValue = await ReviewModel.findOne({ _id })

            return reviewUpdateValue
        }
        catch(err) {
            throw err
        }
    }
    const deleteMY = async ({ 
        _id,
        kakaoId,
        userId
    }: {
        _id: string,
        kakaoId: string,
        userId: string
    }) => {
        try {
            const review = await ReviewModel.findOne({ _id })
                .select({ userId })
            if (!review || !review.userId) {
                return { message: "해당 리뷰가 존재하지 않습니다."}
            }

            if (userId !== review.userId.toString()) {
                return { message: "해당 리뷰의 수정 권한이 없습니다."}
            }

            const reviewDelete = await ReviewModel.deleteOne({ _id })
            await update_avg_star(kakaoId)

            return { message: "해당 리뷰가 삭제되었습니다."}
        }
        catch(err) {
            throw err
        }
    }

    return {
        register,
        readMy,
        read,
        update,
        deleteMY
    }
}

export default reviewService()