import { ContentCrud } from '@/components/ContentCrud'

export function Bookmarks() {
  return (
    <ContentCrud
      type="bookmarks"
      title="Saved Bookmarks & Links"
      description="Manage reference bookmark links, external assets, and saved items."
      hasLink={true}
      hasCategory={true}
    />
  )
}
