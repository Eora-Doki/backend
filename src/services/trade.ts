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
    const readMy = async({
        userId
    }: {
        userId: string
    }) => {
        try {
            const tradeRead = await TradeModel.find({
                userId: userId
            })
            return {
                trade: tradeRead
            }
        }
        catch(err) {
            throw(err)
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
    const deleteMy = async({
        tradesId,
        userId
    }: {
        tradesId: string,
        userId: string
    }) => {
        try {
            const tradeDelete = await TradeModel.findOne({
                _id: tradesId
            }).select({ userId: 1 })

            if (!tradeDelete) {
                return { message: "해당 게시글이 존재하지 않습니다."}
            }
            if ((userId !== tradeDelete.userId!.toString())) {
                return { message: "해당 게시글의 삭제 권한이 없습니다."}
            }

            await TradeModel.deleteOne({ _id: tradesId })
            return { message: "해당 게시글의 삭제가 완료되었습니다."}
        }
        catch(err) {
            throw err
        }
    }

    return {
        register,
        readAll,
        read,
        readMy,
        update,
        deleteMy,
    }
}

export default tradeService()