"use client"
import React from 'react'
import { Input } from "@/components/ui/input"
import { supabaseBrowser } from '@/lib/supabase/browser'
import { toast } from 'sonner'
import { v4 as uuid } from 'uuid'
import { useUser } from '@/lib/store/user'
import { useMessage } from '@/lib/store/messages'
import { Imessage } from '@/lib/store/messages'

export default function ChatInput() {
  const supabase = supabaseBrowser();
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);

  const handleSendMessage = async (text:string) => {
    if(text.trim()){
      const newMessage = {
        id: uuid(),
        text,
        send_by: user?.id,
        is_edit:false,
        created_at: new Date().toISOString(),
        users:{
          avatar_url: user?.user_metadata?.avatar_url,
          created_at: new Date().toISOString(),
          display_name: user?.user_metadata?.user_name,
          id: user?.id
        }
      };
  
      addMessage(newMessage as Imessage);
      // alert(text)
      // call to supabase to send message to supabase database
      const { error } = await supabase.from("messages").insert({text});
      if(error){
        toast.error(error.message);
      }      
    }else{
      toast.error("Please enter a message");
    }
  }

  return (
    <div className='p-5 '>
      <Input placeholder='send message' onKeyDown={(e) => { 
          if (e.key === 'Enter') { 
            handleSendMessage(e.currentTarget.value) 
            e.currentTarget.value = ''
          } 
        }} />
    </div>
  )
}
