import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import { createPost, deletePost } from '@/app/actions/posts'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between max-w-xl mx-auto">
        <h1 className="font-bold text-lg">Christopher</h1>
        <form action={logout}>
          <button type="submit" className="text-sm text-gray-500 hover:text-black">Logout</button>
        </form>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6 space-y-6">
        <form action={createPost} className="bg-white border rounded-lg p-4 space-y-3">
          <textarea
            name="content"
            placeholder="What's on your mind?"
            maxLength={280}
            required
            rows={3}
            className="w-full text-sm resize-none focus:outline-none"
          />
          <div className="flex justify-end">
            <button type="submit" className="bg-black text-white text-sm px-4 py-1.5 rounded-full font-medium">
              Post
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {posts?.map((post) => (
            <div key={post.id} className="bg-white border rounded-lg p-4">
              <p className="text-sm whitespace-pre-wrap">{post.content}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {new Date(post.created_at).toLocaleString()}
                </span>
                {post.user_id === user.id && (
                  <form action={deletePost.bind(null, post.id)}>
                    <button type="submit" className="text-xs text-red-400 hover:text-red-600">Delete</button>
                  </form>
                )}
              </div>
            </div>
          ))}
          {(!posts || posts.length === 0) && (
            <p className="text-center text-sm text-gray-400 py-8">No posts yet. Say something!</p>
          )}
        </div>
      </main>
    </div>
  )
}
