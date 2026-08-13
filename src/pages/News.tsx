import React from 'react'
import { ContentCrud } from '@/components/ContentCrud'
import { Newspaper, TrendingUp, AlertCircle } from 'lucide-react'

type NewsTab = 'news' | 'trending-news' | 'breaking-news'

export function News() {
  const [activeTab, setActiveTab] = React.useState<NewsTab>('news')

  const tabs = [
    { id: 'news' as NewsTab, name: 'General News', icon: Newspaper, desc: 'Manage global daily news feeds.' },
    { id: 'trending-news' as NewsTab, name: 'Trending News', icon: TrendingUp, desc: 'Manage highly shared/viewed trending topics.' },
    { id: 'breaking-news' as NewsTab, name: 'Breaking News', icon: AlertCircle, desc: 'Manage immediate flash notices and alert events.' },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex border-b border-border bg-card/50 p-1.5 rounded-lg max-w-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="inline sm:hidden">{tab.name.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-200">
        {activeTab === 'news' && (
          <ContentCrud
            type="news"
            title="General News Hub"
            description="Create, update, and manage global articles displayed in the primary news section."
            hasImage={true}
          />
        )}
        {activeTab === 'trending-news' && (
          <ContentCrud
            type="trending-news"
            title="Trending Topics Control"
            description="Manage popular, high-engagement news updates currently trending."
            hasImage={true}
          />
        )}
        {activeTab === 'breaking-news' && (
          <ContentCrud
            type="breaking-news"
            title="Breaking Alerts Center"
            description="Publish critical, immediate breaking news alerts to all subscribers."
            hasImage={true}
          />
        )}
      </div>
    </div>
  )
}
