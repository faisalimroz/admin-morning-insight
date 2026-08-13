import { ContentCrud } from '@/components/ContentCrud'

export function Insights() {
  return (
    <ContentCrud
      type="insight"
      title="Strategic Insights & Reports"
      description="Publish detailed industry research, analytical reports, and strategic guidance."
      hasCategory={true}
      hasImage={true}
    />
  )
}
