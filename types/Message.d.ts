type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
    profileId?: string;
}

type SelectedMessage = {
    message: Message;
    index: number;
}