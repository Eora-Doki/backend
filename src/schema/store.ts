import { Type } from '@sinclair/typebox'
import mongoose, { Types } from 'mongoose';

const StoreSchema = new mongoose.Schema({
    kakaoId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    place_url: { type: String, required: true },
    phone: { type: String, default: "" },
    latitude: { type: Number, required: true }, 
    longitude: { type: Number, required: true },
    average_star: { type: Number, default: 0 },
});

const StoreModel = mongoose.model("Store", StoreSchema);

const searchQuerySchema = Type.Object({
    latitude: Type.Number(),
    longitude: Type.Number()
})

const searchSchema = {
    query: searchQuerySchema,
    response: {
        200: Type.Array(Object({
            kakaoId: Type.String(),
            name: Type.String(),
            address: Type.String(),
            place_url: Type.String(),
            phone: Type.String(),
            category_name: Type.String(),
            latitude: Type.Number(),
            longitude: Type.Number()
        }))
    }
}

export {
    StoreModel,

    searchQuerySchema,

    searchSchema
}