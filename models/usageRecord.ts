import { Schema, model, models } from 'mongoose';

const UsageRecordSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    messageCount: { type: Number, required: true, default: 0 },
    tokenCount: { type: Number, required: true, default: 0 },
    date: { type: Date, required: true, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const UsageRecord = models.UsageRecord || model('UsageRecord', UsageRecordSchema);

export default UsageRecord;