import { ContentCrud } from '@/components/ContentCrud'

export function Tenders() {
  return (
    <ContentCrud
      type="tenders"
      title="Bids & Procurement Tenders"
      description="Manage ongoing public and private tenders, contracts, and business invitations."
      hasLink={true}
      hasCategory={true}
    />
  )
}
