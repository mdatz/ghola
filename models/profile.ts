import { Schema, model, models } from 'mongoose';

const ProfileSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    visibility: { type: String, required: true },
    messageCount: { type: Number, required: true, default: 0 },
    favouriteCount: { type: Number, required: true, default: 0 },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Profile = models.Profile || model('Profile', ProfileSchema);

export default Profile;