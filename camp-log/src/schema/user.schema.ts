import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ["admin", "creator", "viewer"],
    default: "viewer",
  })
  role: "admin" | "creator" | "viewer";
}

export const UserSchema = SchemaFactory.createForClass(User);

