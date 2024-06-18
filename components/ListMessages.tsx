"use client";
import { useMessage } from '@/lib/store/messages';
import React, { useEffect, useRef, useState } from 'react'
import Message from './Message';
import { DeleteAlert, EditAlert } from './MessageAction';
import { supabaseBrowser } from '@/lib/supabase/browser';
import { toast } from 'sonner'
import { Imessage } from '@/lib/store/messages'
import { ArrowDown } from 'lucide-react';
import LoadMoreMessages from './LoadMoreMessages';

export default function ListMessages() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {messages, addMessage, optimisticIds, optimisticDeleteMessage, optimisticEditMessage} = useMessage((state)=>state);
  const supabase = supabaseBrowser();
  const [userScroll, setUserScroll] = useState(false);

  const [notification, setNotification] = useState(0);

  useEffect(() => {
    const channel = supabase
    .channel('chat-room')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, 
      async payload => {
        if(optimisticIds.includes(payload.new.id)) return

        const { error, data } = await supabase.from("users").select("*").eq("id", payload.new.send_by).single();
        if(error){
          toast.error(error.message);
        }else{
          const newMessage = {
            ...payload.new,
            users:data
          } 
          addMessage(newMessage as Imessage);
        }     

        // for setting notification when user scroll
        const scrollContainer = scrollRef.current;
        if(scrollContainer){
          const isScroll = scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
          if(isScroll){
            setNotification((prev) => prev + 1);   
          }
        }
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, payload => {
      optimisticDeleteMessage(payload.old.id);
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, payload => {
      optimisticEditMessage(payload.new as Imessage);
    })
    .subscribe()

    return () => {
      channel.unsubscribe();
    }
  }, [messages]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if(scrollContainer && !userScroll) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll = scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight - 10;
      setUserScroll(isScroll);

      if(scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight) {
        setNotification(0);
      }
    }
  }

  const scrollDown = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
      setNotification(0);
      setUserScroll(false);
    }
  }

  return (
    <div
      className='flex-1 flex flex-col p-5 h-full overflow-y-auto gap-5'
      ref={scrollRef}
      onScroll={handleOnScroll}
    >
      <div className='flex-1 '>
        <LoadMoreMessages />
      </div>
      <div className='space-y-7'>
        {messages.map((value : any, index : number) => {
          return(
            <Message key={index} message={value}/>
          )
        })}
      </div>
      {
        userScroll && 
        <div className='absolute bottom-20 w-full'>
          {
            notification > 0 ? (
              <div className='mx-auto w-max bg-indigo-500 p-1 rounded-md cursor-pointer hover:scale-110 transition-all' onClick={scrollDown}>
                <h1>{notification} new message</h1>
              </div>
            ) : (
              <div
                className='mx-auto h-10 w-10 bg-blue-500 rounded-full justify-center items-center flex mx-auto border cursor-pointer hover:scale-110 transition-all'
                onClick={scrollDown}
              >
                <ArrowDown />
              </div>
            )
          }
        </div>
      }
      <DeleteAlert />
      <EditAlert />
    </div>
  )
}