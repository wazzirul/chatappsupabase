"use client";
import React, { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Imessage, useMessage } from '@/lib/store/messages'
import { supabaseBrowser } from '@/lib/supabase/browser';
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DeleteAlert() {
  const actionMessage =useMessage((state) => state.actionMessage);

  const optimisticDeleteMessage = useMessage((state) => state.optimisticDeleteMessage);

  const handleDeleteMessage = async () => {
    const supabase = supabaseBrowser();
    optimisticDeleteMessage(actionMessage?.id!);
    const { error } = await supabase.from("messages").delete().eq("id", actionMessage?.id!);
    if(error){
      toast.error(error.message);
    }else{
      toast.success("Message deleted");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button id='triggerDelete'></button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            message. 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function EditAlert() {
  const actionMessage =useMessage((state) => state.actionMessage);
  const optimisticEditMessage = useMessage((state) => state.optimisticEditMessage);

  const editRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const handleEdit = async () => {
    const supabase = supabaseBrowser();
    const text = editRef.current.value.trim();

    if(text){

      optimisticEditMessage({
        ...actionMessage,
        text,
        is_edit: true
      } as Imessage);
      
      const { error } = await supabase.from("messages").update({text, is_edit: true}).eq("id", actionMessage?.id!);

      if(error){
        toast.error(error.message);
      }else{
        toast.success("Message updated");
        document.getElementById('triggerEdit')?.click();
      }
    }else{
      document.getElementById('triggerEdit')?.click();
      document.getElementById('triggerDelete')?.click();
    }

  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id='triggerEdit'></button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader className='text-center sm:text-center'>
          <DialogTitle>Edit message</DialogTitle>
          <DialogDescription>
            Make changes to your message here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Input
          id="name"
          defaultValue={actionMessage?.text}
          className=""
          ref={editRef}
        />
        <DialogFooter>
          <Button type="submit" className="w-full" onClick={handleEdit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
