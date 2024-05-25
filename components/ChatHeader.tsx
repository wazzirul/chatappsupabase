"use client";
import React from 'react'
import { Button } from "@/components/ui/button"
import { supabaseBrowser } from '@/lib/supabase/browser';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function ChatHeader({ user }:{user:User | undefined}) {
  const router = useRouter();

  const handleLoginwithGithub = () => {
    const supabase = supabaseBrowser();
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo:location.origin + "/auth/callback",
      }
    })
  }

  const handleLogoutwithGithub = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <div className='h-20'>
      <div className='p-5 border-b flex items-center justify-between h-full'>
        <div className=''>
          <h1 className='text-xl font-bold'>Daily Chat Supabase App</h1>
          <div className='flex items-center gap-1'>
            <div className='h-4 w-4 bg-green-500 rounded-full animate-pulse'></div>
            <h1 className='text-sm text-gray-400'>2 Onlines</h1>
          </div>
        </div>
        {
          user ? (
            <Button onClick={handleLogoutwithGithub}>
              Logout
            </Button>
          ) : (
            <Button onClick={handleLoginwithGithub}>
              Login
            </Button>
          )
        }
      </div>
    </div>
  )
}
