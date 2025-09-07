import { Message } from '@/models/User'

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