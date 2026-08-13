import { useToastStore } from "@/store/toastStore"
import { X, CheckCircle2, AlertTriangle, Info } from "lucide-react"

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md pointer-events-none">
      {toasts.map((toast) => {
        const isDestructive = toast.variant === 'destructive'
        const isSuccess = toast.variant === 'success'

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 pointer-events-auto animate-in slide-in-from-bottom-5 ${
              isDestructive
                ? 'bg-destructive border-destructive/20 text-destructive-foreground'
                : isSuccess
                ? 'bg-emerald-950 border-emerald-800/30 text-emerald-100'
                : 'bg-card border-border text-foreground'
            }`}
          >
            {isSuccess && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />}
            {isDestructive && <AlertTriangle className="h-5 w-5 shrink-0 text-red-400" />}
            {!isSuccess && !isDestructive && <Info className="h-5 w-5 shrink-0 text-blue-400" />}

            <div className="flex-1 space-y-1">
              {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
              {toast.description && <p className="text-xs opacity-90 leading-relaxed">{toast.description}</p>}
            </div>

            <button
              onClick={() => dismiss(toast.id)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
