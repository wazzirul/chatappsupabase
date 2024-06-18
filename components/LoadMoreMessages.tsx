import React from 'react'
import { Button } from './ui/button'
import { supabaseBrowser } from '@/lib/supabase/browser';
import { LIMIT_MESSAGES } from '@/lib/constant';
import { getFromAndTo } from '@/lib/utils';
import { useMessage } from '@/lib/store/messages';
import { toast } from 'sonner';


export default function LoadMoreMessages() {
  const page = useMessage((state)=>state.page);
  const setMessages = useMessage((state)=>state.setMessages);
  const hasMore = useMessage((state)=>state.hasMore);

  const fetchMore = async() => {
    const {from, to} = getFromAndTo(page, LIMIT_MESSAGES);
    
    const supabase = supabaseBrowser();
    const {data, error} = await supabase.from("messages").select("*,users(*)").order("created_at", { ascending: false }).range(from, to);

    if(error){
      toast.error(error.message);
    }else{
      setMessages(data.reverse());
    }
  }

  if(hasMore){
    return (
      <Button variant={'outline'} className='w-full' onClick={fetchMore}>Load More</Button>
    )
  }
  
  return <></>;
}
