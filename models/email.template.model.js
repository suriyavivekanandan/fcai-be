import { STATUS } from "@/constants/enums";
import mongoose, { Schema } from "mongoose";


const EmailTemplateSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
    },
    subject: { 
      type: String,
      required: true,
    }, 
    content: {
      type: String,
      required: true,
    },
    status: {
        type: String, 
        enum: STATUS,
        default: "active"   
    } 
  }, 
  { timestamps: true }
);


export const EmailTemplate = mongoose.model("EmailTemplate", EmailTemplateSchema);

