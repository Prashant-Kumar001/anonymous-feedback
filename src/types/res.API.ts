
export interface Message {
    _id: string,
    content: string,
    createAt: Date
}

export interface resAPI {
    success: boolean;
    message: string;
    error: string | null;

}
export interface IEexcept {
    isExcepting: boolean;
}

export interface IMMessage {
    messages: Message[]
    success: true,
    message: 'Messages found',
}