import { Sidebar } from '@/components/shell/Sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { BriefProvider } from '@/features/brief/BriefContext'
import { DevToolbar } from '@/features/brief/DevToolbar'
import { OutreachDrawer } from '@/features/brief/OutreachDrawer'
import { Toast } from '@/features/brief/Toast'
import { OrgPage } from '@/features/org/OrgPage'

export default function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <BriefProvider>
        <div className="flex h-dvh min-w-[1280px] overflow-hidden">
          <Sidebar />
          <main className="min-w-0 flex-1">
            <OrgPage />
          </main>
        </div>
        <OutreachDrawer />
        <Toast />
        <DevToolbar />
      </BriefProvider>
    </TooltipProvider>
  )
}
