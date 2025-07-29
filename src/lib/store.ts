import { ReviewModel } from "../schema/review";
import { StoreModel } from "../schema/store";

const update_avg_star = async (kakaoId: string) => {
    try {
        const store_info = await StoreModel.findOne({ kakaoId })

        if (!store_info) {
            return { message: "해당 가게 정보를 찾을 수 없습니다." }
        }

        const reviews = await ReviewModel.find({ kakaoId })
        if (reviews.length === 0) {
            store_info.average_star = 0;
        } else {
            const total = reviews.reduce((acc, cur) => acc + cur.star, 0)
            const avg = parseFloat((total / reviews.length).toFixed(1))
            store_info.average_star = avg
        }
        await store_info.save()
        return store_info;

    } catch (err) {
        throw err
    }
}

export {
    update_avg_star
}