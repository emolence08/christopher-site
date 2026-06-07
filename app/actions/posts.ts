'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const content = (formData.get('content') as string)?.trim()
  if (!content) return

  await supabase.from('posts').insert({ content, user_id: user.id })
  revalidatePath('/')
}

export async function deletePost(id: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('posts').delete().eq('id', id)
  revalidatePath('/')
}
