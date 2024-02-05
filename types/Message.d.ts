type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
    profileId?: string;
    profileName?: string;
    profileImage?: string;
}

type SelectedMessage = {
    message: Message;
    index: number;
}