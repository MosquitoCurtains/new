'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '../shared-utils'
import { userNavigation, adminNavigation as centralAdminNav, isNavItemActive, type NavItem } from '@/lib/navigation'

// Sidebar Component - Mosquito Curtains Version
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  navigation?: NavItem[]
  isAdmin?: boolean
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, navigation, isAdmin = false, ...props }, ref) => {
    const navItems = isAdmin ? centralAdminNav : (navigation || userNavigation)
    const [collapsed, setCollapsed] = useState(false)
    const [expandedItems, setExpandedItems] = useState<string[]>([])
    const pathname = usePathname()

    const toggleExpanded = (itemName: string) => {
      setExpandedItems(prev => 
        prev.includes(itemName) 
          ? prev.filter(name => name !== itemName)
          : [...prev, itemName]
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col h-full bg-white border-r border-gray-200',
          collapsed ? 'w-16' : 'w-64',
          'transition-all duration-300',
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <span className="text-lg font-bold text-[#406517]">
                Menu
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = isNavItemActive(item, pathname)
            const isExpanded = expandedItems.includes(item.name)

            return (
              <div key={item.name}>
                {item.hasDropdown && item.children && !collapsed ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.name)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left',
                        isActive
                          ? 'bg-[#406517]/10 text-[#406517]'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                      <span className="flex-1">{item.name}</span>
                      <ChevronDown className={cn(
                        'w-4 h-4 transition-transform duration-200',
                        isExpanded ? 'rotate-180' : ''
                      )} />
                    </button>
                    
                    {isExpanded && (
                      <div className="ml-6 mt-2 space-y-1">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon
                          const isChildActive = isNavItemActive(child, pathname)
                          
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                                isChildActive
                                  ? 'bg-[#406517]/10 text-[#406517]'
                                  : 'text-gray-600 hover:bg-gray-100'
                              )}
                            >
                              {ChildIcon && <ChildIcon className="w-4 h-4 flex-shrink-0" />}
                              <span>{child.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-[#406517]/10 text-[#406517]'
                        : 'text-gray-700 hover:bg-gray-100',
                      collapsed && 'justify-center'
                    )}
                  >
                    {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs bg-[#406517] text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    )
  }
)
Sidebar.displayName = 'Sidebar'
