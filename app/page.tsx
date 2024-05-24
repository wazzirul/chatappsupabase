import React from 'react'
import { Button } from "@/components/ui/button"

import { supabaseServer } from '@/lib/supabase/server'
import InitUser from '@/lib/store/InitUser'

import ChatHeader from '@/components/ChatHeader'

export default async function Page() {
  const supabase = supabaseServer()

  const { data } = await supabase.auth.getSession()

  return (
    <>
    <div className='max-w-3xl mx-auto md:py-10 h-screen'>
      <div className='h-full border rounded-md'>
        <ChatHeader user={data.session?.user} />
      </div>
    </div>

    <InitUser user={data.session?.user} />
    </>
  )
}
