import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Vehicle } from './vehicle.schema';
import { Media } from './media.schema';

export type TripDocument = Trip & Document;

@Schema({ timestamps: true })
export class Trip {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  location: string;

  @Prop({
    type: {
      lat: Number,
      lng: Number,
    },
    _id: false,
  })
  coordinates?: {
    lat: number;
    lng: number;
  };

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    required: true,
    enum: ["sand", "mud", "gravel", "grass", "rock", "mixed"],
  })
  terrainType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Vehicle, required: true })
  vehicle: Vehicle;

  @Prop({ type: [Media], default: [] })
  media: Media[];

  @Prop([String])
  tags: string[];

  @Prop({
    enum: ["sunny", "rainy", "cloudy", "storm"],
  })
  weather?: string;

  @Prop({ min: 1, max: 5 })
  rating?: number;

  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  userId: Types.ObjectId;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop()
  deletedAt?: Date;
}

export const TripSchema = SchemaFactory.createForClass(Trip);