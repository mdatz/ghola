import { Schema, model, models } from 'mongoose';

const SharedConversationSchema = new Schema({
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
    rawMessages: { type: Array, required: true },
    messages: { type: Array, required: true },
    viewCount: { type: Number, required: true, default: 0 },
    likeCount: { type: Number, required: true, default: 0 },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const SharedConversation = models.SharedConversation || model('SharedConversation', SharedConversationSchema);

export default SharedConversation;