import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  ],
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    required: true,
  },
  messages: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "message",
      required: false,
    },
  ],
  createAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

ChannelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

ChannelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Channel = mongoose.model("channel", ChannelSchema);

export default Channel;
