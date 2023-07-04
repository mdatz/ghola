import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    emailVerified: { type: Boolean, required: true },
    role: { type: String, required: false },
    token: { type: String, required: false },
});

const User = models.User || model('User', UserSchema);

export default User;