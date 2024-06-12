import React, { Suspense } from 'react'
import ListMessages from './ListMessages'
import { supabaseServer } from '@/lib/supabase/server'
import InitMessages from '@/lib/store/InitMessages';

export default async function ChatMessages() {
 const supabase = supabaseServer();
 const {data} = await supabase.from("messages").select("*,users(*)").order("created_at", { ascending: true })

 console.log("ChatMessages : ",data)


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListMessages />
      <InitMessages messages={data || []} />
    </Suspense>
  )
}