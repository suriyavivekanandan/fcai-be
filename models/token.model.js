import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    sessionId: {
        type: String,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

export const Token = mongoose.model('token', TokenSchema, 'token')
