import { title } from "process"
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
    const readAll = async() => {
        try {
            const tradeAllRead = await TradeModel.find().sort({ createdAt: -1 }) 

            return tradeAllRead
        } 
        catch (err) {
            throw err
        }
    }
    const read = async({
        tradesId
    }: {
        tradesId: string
    }) => {

        try {   
            const tradeRead = await TradeModel.findById( tradesId )

            return {
                id: tradeRead?._id,
                title: tradeRead?.title,
                price: tradeRead?.price,
                description: tradeRead?.description,
                photo: tradeRead?.photo,
                heart: tradeRead?.heart,
                userName: tradeRead?.userName,
                createdAt: tradeRead?.createdAt
            }
        }
        catch(err) {
            throw err
        }
    }
    const update = async({
        tradesId,
        title,
        price,
        description,
        photo,
        userId,
        userName,

    }: {
        tradesId: string,
        title: string,
        price: number,
        description: string,
        photo: string[]
        userId: string,
        userName: string
    }) => {

        try {
            const tradeUpdate = await TradeModel.updateOne(
                { _id: tradesId },
                {
                    $set: {
                        title,
                        price,
                        description,
                        photo,
                        userId,
                        userName
                    }
                }
            )
            const returnValue = await TradeModel.findById( tradesId )

            return returnValue 
        }
        catch(err) {
            throw err
        }
    }

    return {
        register,
        readAll,
        read,
        update,
    }
}

export default tradeService()