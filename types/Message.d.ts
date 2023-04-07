type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

type SelectedMessage = {
    message: Message;
    index: number;
}