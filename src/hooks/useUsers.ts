import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export interface UserItem {
  _id: string
  username: string
  email: string
  name?: string
  role?: string
  createdAt?: string
}

export function useUsersList() {
  return useQuery<UserItem[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get('/admin/users')
      return Array.isArray(response.data) ? response.data : (response.data?.data || [])
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<UserItem> }) => {
      const response = await apiClient.put(`/admin/users/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/admin/users/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useCreateAdmin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Record<string, string>) => {
      // Endpoint to register another admin user
      const response = await apiClient.post('/admin/auth/register', {
        ...data,
        role: 'admin' // Ensure the backend sets the proper role if required
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
