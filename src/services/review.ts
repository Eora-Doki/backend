import { ReviewModel } from "../schema/review"
import { StoreModel } from "../schema/store"

function reviewService() {
    const register = async ({
        star, 
        photo, 
        content, 
        kakaoId, 
        userId
    }: {
        star: number, 
        photo: string[],
         content: string, 
         kakaoId: string, 
         userId: string
    }) => {

        try {
            const reviewRegister = await ReviewModel.create({
                star: star,
                photo: photo,
                content: content,

                kakaoId: kakaoId,
                userId: userId
            })

            return reviewRegister
        }
        catch(err) {
            throw err
        }
    }

    return {
        register,
    }
}

export default reviewService()