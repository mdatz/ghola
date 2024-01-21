import { Schema, model, models } from 'mongoose';

const ConversationRecordSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    usageId: { type: Schema.Types.ObjectId, ref: 'UsageRecord', required: true },
    profileId: { type: Schema.Types.ObjectId, ref: 'Profile', required: true  },
    messageCount: { type: Number, required: true, default: 0 },
    tokenCount: { type: Number, required: true, default: 0 },
    customerId: { type: String, required: false },
    loggingEnabled: { type: Boolean, required: true, default: false },
    messages: { type: Array, required: false },
    date: { type: Date, required: true, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const ConversationRecord = models.ConversationRecord || model('ConversationRecord', ConversationRecordSchema);

export default ConversationRecord;
