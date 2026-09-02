'use client'

import { useContentList } from '@/hooks/useContent'

export function Bookmarks() {
  const { data, isLoading, error } = useContentList('bookmarks')

  if (isLoading) return <div className="p-4 text-sm text-gray-500">Loading bookmarks...</div>
  if (error) return <div className="p-4 text-sm text-red-500">Error loading bookmarks</div>

  // Extract the items array safely whether it's wrapped in { items: [] } or returned directly
  const bookmarks = Array.isArray(data) 
    ? data 
    : (data as any)?.items || (data as any)?.data?.items || []

  return (
    <div className="space-y-4">
      {bookmarks.length === 0 ? (
        <p className="text-sm text-gray-500">No bookmarks found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark: any) => (
            <div 
              key={bookmark._id} 
              className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {bookmark.newsId?.category || 'General'}
                  </span>
                  <span className="text-xs text-gray-400">
                    Saved: {bookmark.createdAt ? new Date(bookmark.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                
                <h3 className="mb-1 text-base font-bold text-gray-900 line-clamp-1">
                  {bookmark.newsId?.title || bookmark.title}
                </h3>
                
                <p className="mb-4 text-xs text-gray-600 line-clamp-2">
                  {bookmark.newsId?.content || bookmark.content}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-xs text-gray-500">
                <span>By: <strong className="text-gray-700">{bookmark.newsId?.author || 'Unknown'}</strong></span>
                <span>User: <strong className="text-gray-700">{bookmark.userId?.name || 'Admin'}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}