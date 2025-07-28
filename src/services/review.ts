import { ReviewModel } from "../schema/review"
import { StoreModel } from "../schema/store"

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

    return {
        register,
        readMy,
        read
    }
}

export default reviewService()