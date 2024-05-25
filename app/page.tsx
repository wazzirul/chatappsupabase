import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { supabaseServer } from '@/lib/supabase/server'
import InitUser from '@/lib/store/InitUser'

import ChatHeader from '@/components/ChatHeader'

export default async function Page() {
  const supabase = supabaseServer()

  const { data } = await supabase.auth.getSession()

  return (
    <>
    <div className='max-w-3xl mx-auto md:py-10 h-screen'>
      <div className='h-full border rounded-md flex flex-col'>
        <ChatHeader user={data.session?.user} />
        <div className='flex-1 flex flex-col p-5 h-full overflow-y-auto'>
          <div className='flex-1 '></div>
          <div className='space-y-7'>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((value) => {
              return(
              <div className='flex gap-2' key={value}>
                <div className='h-10 w-10 bg-green-500 rounded-full'></div>
                <div className='flex-1'>
                  <div className='flex items-center gap-1'>
                    <h1 className='font-bold'>Topan Gautama</h1>
                    <h1 className='text-sm text-gray-400'>{new Date().toDateString()}</h1>
                  </div>
                  <p className='text-gray-300'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolorem eius vero dolores suscipit placeat esse sed earum consectetur facere iusto cumque minima eaque impedit qui laborum reprehenderit, voluptas quaerat! Aliquid.</p>
                </div>
              </div>
              )
            })}
          </div>
        </div>
        <div className='p-5 '>
          <Input placeholder='send message' />
        </div>
      </div>
    </div>

    <InitUser user={data.session?.user} />
    </>
  )
}
