import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Vehicle {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  is4x4: boolean;

  @Prop({ trim: true })
  note?: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);