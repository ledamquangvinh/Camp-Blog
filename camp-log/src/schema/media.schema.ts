import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class Media {
  @Prop({ required: true })
  url: string;

  @Prop({
    required: true,
    enum: ["image", "video"],
  })
  type: "image" | "video";

  @Prop()
  caption?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MediaSchema = SchemaFactory.createForClass(Media);