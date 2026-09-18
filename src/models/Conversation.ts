import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type Tone = "professional" | "casual" | "concise";

export interface IConversation extends Document {
  title: string;
  tone: Tone;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema<IConversation>(
  {
    title: { type: String, default: "New Chat" },
    tone: {
      type: String,
      enum: ["professional", "casual", "concise"],
      default: "professional",
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
