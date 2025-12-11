import { getNavigationData } from '@/app/actions/navigation'
import { Sidebar } from './Sidebar'

export async function SidebarWrapper({ className, onNavClick }: { className?: string, onNavClick?: () => void }) {
  const { folders, tags } = await getNavigationData()

  return (
    <Sidebar 
      className={className} 
      folders={folders} 
      tags={tags} 
      onNavClick={onNavClick} 
    />
  )
}


