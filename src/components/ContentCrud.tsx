import React from 'react'
import {
  useContentList,
  useCreateContent,
  useUpdateContent,
  useDeleteContent,
  type ContentItem
} from '@/hooks/useContent'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/Table'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  Dialogmerged_article,
  DialogFooter
} from '@/components/ui/Dialog'
import { Card, CardContent } from '@/components/ui/Card'
import { toast } from '@/store/toastStore'
import { Search,  Edit, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

interface ContentCrudProps {
  type: string

  canonical_title: string
  merged_article: string
  
  hasCategory?: boolean
  hasLink?: boolean
  hasImage?: boolean
}

export function ContentCrud({
  type,

  canonical_title,
  merged_article,

  hasCategory = false,
  hasLink = false,
  hasImage = true,
}: ContentCrudProps) {
  // Search & Pagination State
  const [searchTerm, setSearchTerm] = React.useState('')
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 8

  // Modal States
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<ContentItem | null>(null)

  // Form Fields
  const [formTitle, setFormTitle] = React.useState('')
  const [formContent, setFormContent] = React.useState('')
  const [formCategory, setFormCategory] = React.useState('')
  const [formLink, setFormLink] = React.useState('')
  const [formImage, setFormImage] = React.useState('')

  // Queries
  const { data: items, isLoading, error } = useContentList(type)
  const createMutation = useCreateContent(type)
  const updateMutation = useUpdateContent(type)
  const deleteMutation = useDeleteContent(type)

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  // Reset pagination when searching
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Open Add Dialog
  // const handleAddClick = () => {
  //   setSelectedItem(null)
  //   setFormTitle('')
  //   setFormContent('')
  //   setFormCategory('')
  //   setFormLink('')
  //   setFormImage('')
  //   setIsFormOpen(true)
  // }

  // Open Edit Dialo
  const handleEditClick = (item: any) => {
    setSelectedItem(item)
    setFormTitle(item.canonical_title || '') // Map canonical_title to your title state
    setFormContent(item.merged_article || item.summary || '') // Map merged_article to content state
    setFormCategory(item.category || '')
    // setFormSources(Array.isArray(item.sources) ? item.sources.join(', ') : '')
    setFormImage(item.image_url || '')
    setIsFormOpen(true)
  }

  // Open Delete Dialog
  const handleDeleteClick = (item: ContentItem) => {
    setSelectedItem(item)
    setIsDeleteOpen(true)
  }

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle || !formContent) {
      toast({
        canonical_title: 'Validation error',
        merged_article: 'Title and content are required.',
        variant: 'destructive',
      })
      return
    }

    const payload = {
      canonical_title: formTitle,
      merged_article: formContent,
      summary: formContent, // or a dedicated summary field if you split them
      // sources: formSources ? formSources.split(',').map((s: string) => s.trim()) : [],
      ...(hasCategory && { category: formCategory }),
      ...(hasImage && { image_url: formImage }),
    }

    try {
      if (selectedItem) {
        const id = selectedItem._id || selectedItem.id
        if (!id) return
        await updateMutation.mutateAsync({ id, data: payload })
        toast({
          canonical_title: 'Item updated',
          merged_article: `"${formTitle}" has been successfully updated.`,
          variant: 'success',
        })
      } else {
        await createMutation.mutateAsync(payload)
        toast({
          canonical_title: 'Item created',
          merged_article: `"${formTitle}" has been successfully created.`,
          variant: 'success',
        })
      }
      setIsFormOpen(false)
    } catch (err: any) {
      console.error(err)
      toast({
        canonical_title: 'Operation failed',
        merged_article: err.response?.data?.message || err.message || 'An error occurred.',
        variant: 'destructive',
      })
    }
  }

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    const id = selectedItem?._id || selectedItem?.id
    if (!id) return

    try {
      await deleteMutation.mutateAsync(id)
      toast({
        canonical_title: 'Item deleted',
        merged_article: 'The item has been deleted successfully.',
        variant: 'success',
      })
      setIsDeleteOpen(false)
    } catch (err: any) {
      console.error(err)
      toast({
        canonical_title: 'Delete failed',
        merged_article: err.response?.data?.message || err.message || 'An error occurred.',
        variant: 'destructive',
      })
    }
  }

  // Filters and splits
const filteredItems = React.useMemo(() => {
  if (!items) return []
  const q = searchTerm.toLowerCase().trim()
  if (!q) return items

  return items.filter(
    (item: any) =>
      item.canonical_title?.toLowerCase().includes(q) ||
      item.summary?.toLowerCase().includes(q) ||
      item.merged_article?.toLowerCase().includes(q) ||
      (Array.isArray(item.sources) && item.sources.some((s: string) => s.toLowerCase().includes(q)))
  )
}, [items, searchTerm])
  // Paginated data
  const paginatedItems = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredItems.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredItems, currentPage])

  const totalPages = Math.max(Math.ceil(filteredItems.length / itemsPerPage), 1)

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{canonical_title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{merged_article}</p>
        </div>
        {/* <Button onClick={handleAddClick} className="self-start sm:self-center">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button> */}
      </div>

      {/* Controls Card */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, content..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading contents...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-sm text-destructive font-semibold">Failed to fetch data.</p>
              <p className="text-xs text-muted-foreground mt-1">Please check your network and try again.</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-sm font-semibold">No matches found.</p>
              <p className="text-xs mt-0.5">Try searching for a different keyword or add a new entry.</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%]">Title</TableHead>
                    <TableHead className="w-[40%]">Content</TableHead>
                    <TableHead className="w-[40%]">Sources</TableHead>
                    {hasCategory && <TableHead className="w-[15%]">Category</TableHead>}
                    {hasLink && <TableHead className="w-[15%]">Link</TableHead>}
                    <TableHead className="text-right w-[15%]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item: any) => (
                    <TableRow key={item._id || item.event_id}>
                      {/* Change from item.title to item.canonical_title */}
                      <TableCell className="font-semibold align-top">{item.canonical_title}</TableCell>

                      {/* Change from item.content to item.summary */}
                      <TableCell className="text-muted-foreground line-clamp-3 align-top py-4 max-w-md break-words">
                        {item.summary}
                      </TableCell>

                      {/* Render sources array correctly */}
                      <TableCell className="text-xs text-muted-foreground align-top">
                        {Array.isArray(item.sources) ? item.sources.join(', ') : item.sources}
                      </TableCell>

                      {hasCategory && (
                        <TableCell className="align-top">
                          <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold capitalize">
                            {item.category || 'N/A'}
                          </span>
                        </TableCell>
                      )}

                      <TableCell className="text-right align-top">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)} title="Edit">
                            <Edit className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)} title="Delete">
                            <Trash2 className="h-4 w-4 text-rose-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-6 py-4">
                  <div className="text-xs text-muted-foreground font-semibold">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                    {Math.min(currentPage * itemsPerPage, filteredItems.length)} of{' '}
                    {filteredItems.length} entries
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs font-mono font-bold">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogHeader>
          <DialogTitle>{selectedItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <Dialogmerged_article>
            {selectedItem
              ? 'Update the fields below to edit this entry.'
              : 'Fill out the form below to create a new entry.'}
          </Dialogmerged_article>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold" htmlFor="form-title">
              Title
            </label>
            <Input
              id="form-title"
              placeholder="Enter title..."
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              disabled={isMutating}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold" htmlFor="form-content">
              Content merged_article
            </label>
            <textarea
              id="form-content"
              rows={4}
              placeholder="Enter details..."
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              disabled={isMutating}
              required
            />
          </div>

          {hasCategory && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" htmlFor="form-category">
                Category
              </label>
              <Input
                id="form-category"
                placeholder="e.g. Energy, Finance, Technology..."
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                disabled={isMutating}
              />
            </div>
          )}

          {hasLink && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" htmlFor="form-link">
                Reference Link URL
              </label>
              <Input
                id="form-link"
                type="url"
                placeholder="https://example.com/reference"
                value={formLink}
                onChange={(e) => setFormLink(e.target.value)}
                disabled={isMutating}
              />
            </div>
          )}

          {hasImage && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold" htmlFor="form-image">
                Image URL
              </label>
              <Input
                id="form-image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formImage}
                onChange={(e) => setFormImage(e.target.value)}
                disabled={isMutating}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isMutating}>
              {isMutating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <Dialogmerged_article>
            Are you sure you want to delete this entry? This action cannot be undone.
          </Dialogmerged_article>
        </DialogHeader>
        <div className="bg-muted/30 p-3 rounded border my-2 text-sm">
          <strong className="block text-foreground">{selectedItem?.title}</strong>
          <span className="text-xs text-muted-foreground line-clamp-2 mt-1">{selectedItem?.content}</span>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteOpen(false)}
            disabled={isMutating}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={isMutating}
          >
            {isMutating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
