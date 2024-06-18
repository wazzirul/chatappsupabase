import React, { Suspense } from 'react'
import ListMessages from './ListMessages'
import { supabaseServer } from '@/lib/supabase/server'
import InitMessages from '@/lib/store/InitMessages';
import { LIMIT_MESSAGES } from '@/lib/constant';

export default async function ChatMessages() {
 const supabase = supabaseServer();
 const {data} = await supabase.from("messages").select("*,users(*)").order("created_at", { ascending: false }).range(0, LIMIT_MESSAGES);


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListMessages />
      <InitMessages messages={data?.reverse() || []} />
    </Suspense>
  )
}