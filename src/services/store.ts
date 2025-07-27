import axios from "axios";

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
        throw err;
    }

    };
    return {
        search,
    }
}

export default storeService()