import axios from "axios";
import { StoreModel } from "../schema/store";
import { ReviewModel } from "../schema/review";

function storeService() {
    const keywords = ["가챠", "피규어", "굿즈"];
    const search = async (latitude: number, longitude: number) => {
        try {
            const results = await Promise.all(
                keywords.map(async (keyword) => {
                    const response = await axios.get(
                    "https://dapi.kakao.com/v2/local/search/keyword.json",
                    {
                        headers: {
                            Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
                        },
                        params: {
                            query: keyword,
                            x: longitude,
                            y: latitude,
                            radius: 20000,
                            sort: "distance"
                        }
                    });

                    return response.data.documents
                        .filter((doc: any) => 
                            doc.category_name?.includes("장난감,완구")
                        )
                        .map((doc: any) => ({
                            kakaoId: doc.id.toString(),
                            name: doc.place_name,
                            address: doc.road_address_name || doc.address_name,
                            place_url: doc.place_url,
                            phone: doc.phone || "",
                            category_name: doc.category_name,
                            longitude: doc.x,
                            latitude: doc.y,
                    }));
                })
            );

            const stores = results.flat();

            const returnStores = Array.from(
                new Map(stores.map(store => [store.kakaoId, store])).values()
            );

            return returnStores;
        }
        catch (err) {
            throw err
        }
    }

    const register = async ({
        kakaoId,
        name,
        address,
        place_url,
        phone,
        latitude,
        longitude,
        star
        }: {
            kakaoId: string
            name: string
            address: string
            place_url: string
            phone: string
            latitude: number
            longitude: number,
            star: number
        }) => {
            try {
                const store_info = await StoreModel.findOne({ kakaoId })
                    .select({ kakaoId: 1, name: 1, address: 1, place_url: 1, phone: 1, latitude: 1, longitude: 1, average_star: 1})
                
                if (!store_info) {
                    const storeRegister = await StoreModel.create({
                        kakaoId,
                        name,
                        address,
                        place_url,
                        phone,
                        latitude,
                        longitude,
                        average_star: star
                    })
                    return storeRegister
                }
                else {
                    const reviews = await ReviewModel.find({ kakaoId });
                    if (reviews.length > 0) {
                        const total = reviews.reduce((acc, cur) => acc + cur.star, 0);
                        const avg = parseFloat((total / reviews.length).toFixed(1));

                        store_info.average_star = avg;
                        await store_info.save();
                    }
                    return store_info;
                }
            }
            catch(err) {
                throw err
            }
    }
    return {
        search,
        register,
    }
}

export default storeService()