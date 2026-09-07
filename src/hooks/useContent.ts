// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { apiClient } from '@/api/client'

// export interface ContentItem {
//   _id?: string
//   id?: string
//   title: string
//   content: string
//   category?: string
//   imageUrl?: string
//   link?: string // For bookmarks or tenders
//   createdAt?: string
//   updatedAt?: string
// }

// // Maps type keys to their corresponding endpoint paths
// const ENDPOINTS: Record<string, string> = {
//   news: '/admin/news',
//   'trending-news': '/admin/news',
//   'breaking-news': '/admin/news',
//   tenders: '/admin/tenders',
//   insight: '/admin/news',
//   bookmarks: '/admin/bookmarks',
// }

// export function useContentList(type: string) {
//   return useQuery<ContentItem[]>({
//     queryKey: [type],
//     queryFn: async () => {
//       const endpoint = ENDPOINTS[type]
//       if (!endpoint) throw new Error(`Invalid content type: ${type}`)
//       const response = await apiClient.get(endpoint)
//       // Accept array structure from response data or wrapper
//       return Array.isArray(response.data) ? response.data : (response.data?.data || [])
//     },
//   })
// }

// export function useContentDetail(type: string, id?: string) {
//   return useQuery<ContentItem>({
//     queryKey: [type, id],
//     queryFn: async () => {
//       const endpoint = ENDPOINTS[type]
//       if (!endpoint || !id) throw new Error(`Invalid request`)
//       const response = await apiClient.get(`${endpoint}/${id}`)
//       return response.data?.data || response.data
//     },
//     enabled: !!id,
//   })
// }

// export function useCreateContent(type: string) {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async (data: Omit<ContentItem, 'id' | '_id'>) => {
//       const endpoint = ENDPOINTS[type]
//       if (!endpoint) throw new Error(`Invalid content type: ${type}`)
//       const response = await apiClient.post(endpoint, data)
//       return response.data
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [type] })
//       if (type === 'insight') {
//         // Also invalidate category counts
//         queryClient.invalidateQueries({ queryKey: ['insight-category-counts'] })
//       }
//     },
//   })
// }

// export function useUpdateContent(type: string) {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async ({ id, data }: { id: string; data: Partial<ContentItem> }) => {
//       const endpoint = ENDPOINTS[type]
//       if (!endpoint) throw new Error(`Invalid content type: ${type}`)
//       const response = await apiClient.put(`${endpoint}/${id}`, data)
//       return response.data
//     },
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: [type] })
//       queryClient.invalidateQueries({ queryKey: [type, variables.id] })
//       if (type === 'insight') {
//         queryClient.invalidateQueries({ queryKey: ['insight-category-counts'] })
//       }
//     },
//   })
// }

// export function useDeleteContent(type: string) {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async (id: string) => {
//       const endpoint = ENDPOINTS[type]
//       if (!endpoint) throw new Error(`Invalid content type: ${type}`)
//       const response = await apiClient.delete(`${endpoint}/${id}`)
//       return response.data
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: [type] })
//       if (type === 'insight') {
//         queryClient.invalidateQueries({ queryKey: ['insight-category-counts'] })
//       }
//     },
//   })
// }

// // Special hook for Insight Category Counts: /admin/insight/categories/count
// export interface CategoryCount {
//   _id: string
//   count: number
// }

// export function useInsightCategoryCounts() {
//   return useQuery<CategoryCount[]>({
//     queryKey: ['insight-category-counts'],
//     queryFn: async () => {
//       const response = await apiClient.get('/admin/insight/categories/count')
//       return Array.isArray(response.data) ? response.data : (response.data?.data || [])
//     },
//   })
// }


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface ContentItem {
  _id?: string
  id?: string
  event_id?: string
  category?: string
  title?: string
  content?: string
  canonical_title?: string
  merged_article?: string
  summary?: string
  sources?: string[]
  imageUrl?: string
  image_url?: string
  link?: string
  createdAt?: string
  updatedAt?: string
}

// Maps type keys to their corresponding endpoint paths
const ENDPOINTS: Record<string, string> = {
  news: '/admin/news',
  'trending-news': '/admin/news',
  'breaking-news': '/admin/news',
  tenders: '/admin/tenders',
  insight: '/admin/news',
  bookmarks: '/admin/bookmarks',
}

export function useContentList(type: string) {
  return useQuery<ContentItem[]>({
    queryKey: [type],
    queryFn: async () => {
      const endpoint = ENDPOINTS[type]
      if (!endpoint) throw new Error(`Invalid content type: ${type}`)
      const response = await apiClient.get(endpoint)
      // Accept array structure from response data or wrapper
      return Array.isArray(response.data) ? response.data : (response.data?.data || [])
    },
  })
}

export function useContentDetail(type: string, id?: string) {
  return useQuery<ContentItem>({
    queryKey: [type, id],
    queryFn: async () => {
      const endpoint = ENDPOINTS[type]
      if (!endpoint || !id) throw new Error(`Invalid request`)
      const response = await apiClient.get(`${endpoint}/${id}`)
      return response.data?.data || response.data
    },
    enabled: !!id,
  })
}

export function useCreateContent(type: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Omit<ContentItem, 'id' | '_id'>) => {
      const endpoint = ENDPOINTS[type]
      if (!endpoint) throw new Error(`Invalid content type: ${type}`)
      const response = await apiClient.post(endpoint, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] })
      if (type === 'insight') {
        queryClient.invalidateQueries({ queryKey: ['insight-category-counts'] })
      }
    },
  })
}

export function useUpdateContent(type: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContentItem> }) => {
      const endpoint = ENDPOINTS[type]
      if (!endpoint) throw new Error(`Invalid content type: ${type}`)
      const response = await apiClient.put(`${endpoint}/${id}`, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [type] })
      queryClient.invalidateQueries({ queryKey: [type, variables.id] })
      if (type === 'insight') {
        queryClient.invalidateQueries({ queryKey: ['insight-category-counts'] })
      }
    },
  })
}

export function useDeleteContent(type: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const endpoint = ENDPOINTS[type]
      if (!endpoint) throw new Error(`Invalid content type: ${type}`)
      const response = await apiClient.delete(`${endpoint}/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [type] })
      if (type === 'insight') {
        queryClient.invalidateQueries({ queryKey: ['insight-category-counts'] })
      }
    },
  })
}

export interface CategoryCount {
  category: number
  _id: string
  count: number
}

export function useInsightCategoryCounts() {
  return useQuery<CategoryCount[]>({
    queryKey: ['insight-category-counts'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/news/categories/count')
      return Array.isArray(response.data) ? response.data : (response.data?.data || [])
    },
  })
}