import { create } from 'zustand'
import { LIMIT_MESSAGES } from '../constant';

export type Imessage = {
  created_at: string;
  id: string;
  is_edit: boolean;
  send_by: string;
  text: string;
  users: {
      avatar_url: string;
      created_at: string;
      display_name: string;
      id: string;
  } | null;
}


interface MessageState {
  hasMore: boolean;
  page: number;
  messages: Imessage[];
  actionMessage: Imessage | undefined;
	optimisticIds: string[];
  addMessage: (message:Imessage)=>void;
  setActionMessage: (message:Imessage|undefined)=>void;
  optimisticDeleteMessage: (messageId:string)=>void;
  optimisticEditMessage: (message: Imessage) => void;
	setOptimisticIds: (id: string) => void;
  setMessages: (message:Imessage[])=>void;
}

export const useMessage = create<MessageState>()((set) => ({
  hasMore: true,
  page: 1,
  messages: [],
  actionMessage: undefined,
	optimisticIds: [],
	setOptimisticIds: (id: string) =>
		set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
	addMessage: (newMessages) =>
		set((state) => ({
			messages: [...state.messages, newMessages],
		})),
  setActionMessage: (message) => set(() => ({ actionMessage: message })),
  optimisticDeleteMessage: (messageId) => set((state) => {
    return {
      messages:state.messages.filter((message) => message.id !== messageId),
    }
  }),
  optimisticEditMessage: (editMessage) => 
    set((state) => {
      return {
        messages: state.messages.filter((message) =>{
            if(message.id === editMessage.id){
              message.text = editMessage.text
              message.is_edit = editMessage.is_edit
            }
            return message;
          }
        )
      }
  }),
  setMessages: (message) => set((state) => ({
    messages: [ ...message, ...state.messages],
    page: state.page + 1,
    hasMore: message.length >= LIMIT_MESSAGES
  })),
}))