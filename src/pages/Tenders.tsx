import { ContentCrud } from '@/components/ContentCrud'

export function Tenders() {
  return (
   <ContentCrud
  type="tenders"
  canonical_title="Bids & Procurement Tenders"
  merged_article="Manage ongoing public and private tenders, contracts, and business invitations."
  hasLink={true}
  hasCategory={true}
/>
  )
}
