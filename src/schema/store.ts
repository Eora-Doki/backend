import { Type } from '@sinclair/typebox'
import mongoose, { Types } from 'mongoose';

const StoreSchema = new mongoose.Schema({
    kakaoId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    place_url: { type: String, required: true },
    phone: { type: String, default: "" },
    x: { type: Number, required: true }, 
    y: { type: Number, required: true },
    average_star: { type: Number, required: true },
});