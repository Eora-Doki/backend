import { TradeModel } from "../schema/trade"

function tradeService() {
    const register = async ({
        title,
        price,
        description,
        photo,
        userId,
        userName,

    }: {
        title: string,
        price: number,
        description: string,
        photo: string[]
        userId: string,
        userName: string
    }) => {

        try {
            const tradeRegister = await TradeModel.create({
                title,
                price,
                description,
                photo,
                heart: 0,
                userId,
                userName,
            })

            return tradeRegister
        }
        catch(err) {
            throw err
        }
    }
          
    return {
        register
    }
}

export default tradeService()