'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MenuItem {
  name: string
  href: string
  children?: MenuItem[]
  /** Render the dropdown as a multi-column mega-menu (e.g. Applications) */
  megaMenu?: boolean
}

// ---------------------------------------------------------------------------
// Timing constants – generous to prevent accidental closes
// ---------------------------------------------------------------------------

/** How long (ms) to wait before closing a dropdown after the mouse leaves */
const CLOSE_DELAY = 400
/** How long (ms) to wait before closing a nested sub-menu */
const SUB_CLOSE_DELAY = 300

// ---------------------------------------------------------------------------
// Navigation data – mirrors mosquitocurtains.com WordPress menus
// with routes updated to match Next.js app directory
// ---------------------------------------------------------------------------

const navigation: MenuItem[] = [
  { name: 'Home', href: '/' },

  // ── Products ──────────────────────────────────────────────────────────
  {
    name: 'Products',
    href: '/products',
    children: [
      { name: 'Mosquito Curtains', href: '/screened-porch-enclosures' },
      { name: 'Clear Vinyl Winter Panels', href: '/clear-vinyl-plastic-patio-enclosures' },
      { name: 'Raw Netting', href: '/raw-netting-fabric-store' },
      { name: 'Roll Up Shade Screens', href: '/roll-up-shade-screens' },
    ],
  },

  // ── Learn Options ─────────────────────────────────────────────────────
  {
    name: 'Learn Options',
    href: '/options',
    children: [
      { name: 'Mosquito Curtain Options', href: '/options' },
      { name: 'Clear Vinyl Options', href: '/clear-vinyl-options' },
    ],
  },

  // ── Instant Quote ─────────────────────────────────────────────────────
  {
    name: 'Instant Quote',
    href: '/quote/mosquito-curtains',
    children: [
      { name: 'Mosquito Curtain Instant Quote', href: '/quote/mosquito-curtains' },
      { name: 'Clear Vinyl Instant Quote', href: '/quote/clear-vinyl' },
    ],
  },

  // ── Applications (mega-menu) ──────────────────────────────────────────
  {
    name: 'Applications',
    href: '/applications',
    megaMenu: true,
    children: [
      { name: 'Awning Screen Enclosures', href: '/awning-screen-enclosures' },
      { name: 'Boat Screens', href: '/boat-screens' },
      { name: 'Camping Net', href: '/camping-net' },
      { name: 'Clear Vinyl Enclosures', href: '/clear-vinyl-plastic-patio-enclosures' },
      { name: 'Deck Screens', href: '/screened-in-decks' },
      { name: 'French Door Screens', href: '/french-door-screens' },
      { name: 'Garage Door Screens', href: '/garage-door-screens' },
      { name: 'Gazebo Screen Curtains', href: '/gazebo-screen-curtains' },
      { name: 'HVAC Chiller Screens', href: '/hvac-chiller-screens' },
      { name: 'Industrial Netting', href: '/industrial-netting' },
      { name: 'Outdoor Projection Screens', href: '/outdoor-projection-screens' },
      { name: 'Patio Enclosures', href: '/screen-patio' },
      { name: 'Pergola Screen Curtains', href: '/pergola-screen-curtains' },
      { name: 'Porch Enclosures', href: '/screened-porch' },
      { name: 'Roll Up Shade Screens', href: '/roll-up-shade-screens' },
      { name: 'Tent Screens', href: '/tent-screens' },
      { name: 'Theater Scrims', href: '/theater-scrims' },
      { name: 'Yardistry Gazebo Curtains', href: '/yardistry-gazebo-curtains' },
    ],
  },

  // ── Install ───────────────────────────────────────────────────────────
  {
    name: 'Install',
    href: '/install',
    children: [
      { name: 'Mosquito Curtains Tracking Installation', href: '/install/tracking' },
      { name: 'Mosquito Curtains Velcro Installation', href: '/install/velcro' },
      { name: 'Clear Vinyl Installation', href: '/install/clear-vinyl' },
      { name: 'Caring For Mosquito Curtains', href: '/care/mosquito-curtains' },
      { name: 'Caring For Clear Vinyl', href: '/care/clear-vinyl' },
    ],
  },

  // ── Gallery ───────────────────────────────────────────────────────────
  {
    name: 'Gallery',
    href: '/gallery',
    children: [
      { name: 'Mosquito Curtains', href: '/gallery?filter=mosquito_curtains' },
      { name: 'Clear Vinyl Plastic', href: '/gallery?filter=clear_vinyl' },
      { name: 'Video Gallery', href: '/videos' },
    ],
  },

  // ── About ─────────────────────────────────────────────────────────────
  {
    name: 'About',
    href: '/about',
    children: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
      { name: 'Customer Reviews', href: '/reviews' },
      { name: 'Shipping', href: '/shipping' },
      {
        name: "FAQ's",
        href: '/faq',
        children: [
          { name: "Mosquito Curtains FAQ's", href: '/faq/mosquito-curtains' },
          { name: 'Clear Vinyl FAQs', href: '/faq/clear-vinyl' },
        ],
      },
      { name: 'Satisfaction Guarantee', href: '/satisfaction-guarantee' },
      { name: 'Opportunities', href: '/opportunities' },
    ],
  },

  // ── Order ─────────────────────────────────────────────────────────────
  {
    name: 'Order',
    href: '/order',
    children: [
      { name: 'Order Mosquito Curtains', href: '/order/mosquito-curtains' },
      { name: 'Order Tracking Hardware', href: '/order/track-hardware' },
      { name: 'Order Attachment Hardware', href: '/order/attachments' },
      { name: 'Order Clear Vinyl', href: '/order/clear-vinyl' },
      { name: 'Order Mosquito Netting & Other Mesh Types', href: '/raw-netting-fabric-store' },
      { name: 'Order Roll Up Shade Screens', href: '/order/roll-up-shades' },
    ],
  },

  // ── Contact Us ────────────────────────────────────────────────────────
  { name: 'Contact Us', href: '/contact' },
]

// ---------------------------------------------------------------------------
// Desktop dropdown (hover-based with generous timing & smooth transitions)
// ---------------------------------------------------------------------------

function DesktopDropdown({
  item,
  isOpen,
  onOpen,
  onClose,
  onLinkClick,
  alignRight,
}: {
  item: MenuItem
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onLinkClick: () => void
  alignRight?: boolean
}) {
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null)
  const subTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      if (subTimerRef.current) clearTimeout(subTimerRef.current)
    }
  }, [])

  // Reset sub-menus when dropdown closes
  useEffect(() => {
    if (!isOpen) setSubMenuOpen(null)
  }, [isOpen])

  const handleMouseEnter = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    onOpen()
  }, [onOpen])

  const handleMouseLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(onClose, CLOSE_DELAY)
  }, [onClose])

  const handleSubEnter = useCallback((name: string) => {
    if (subTimerRef.current) {
      clearTimeout(subTimerRef.current)
      subTimerRef.current = null
    }
    setSubMenuOpen(name)
  }, [])

  const handleSubLeave = useCallback(() => {
    subTimerRef.current = setTimeout(() => setSubMenuOpen(null), SUB_CLOSE_DELAY)
  }, [])

  // Active state: item or any of its children match the current path
  const isActive =
    pathname === item.href ||
    item.children?.some(
      (c) =>
        pathname === c.href ||
        c.children?.some((sc) => pathname === sc.href)
    )

  // Simple link (no dropdown)
  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={cn(
          'text-[13px] font-medium transition-colors whitespace-nowrap py-5',
          isActive
            ? 'text-[#406517]'
            : 'text-gray-700 hover:text-[#406517]'
        )}
      >
        {item.name}
      </Link>
    )
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-1 text-[13px] font-medium transition-colors whitespace-nowrap py-5',
          isActive
            ? 'text-[#406517]'
            : 'text-gray-700 hover:text-[#406517]'
        )}
      >
        {item.name}
        <ChevronDown
          className={cn(
            'w-3 h-3 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </Link>

      {/* Dropdown panel – always rendered; visibility controlled via CSS for smooth transitions */}
      <div
        className={cn(
          'absolute top-full z-50 transition-all duration-200 ease-out',
          item.megaMenu
            ? 'left-1/2 -translate-x-1/2'
            : alignRight
              ? 'right-0'
              : 'left-0',
          isOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-1 invisible pointer-events-none'
        )}
      >
        {/* Invisible hover bridge – prevents the gap between trigger and panel from closing the menu */}
        <div className="h-3" aria-hidden="true" />

        <div
          className={cn(
            'bg-white rounded-lg shadow-xl border border-gray-200 overflow-visible',
            item.megaMenu ? 'w-[640px]' : 'min-w-[260px]'
          )}
        >
          <div
            className={cn(
              item.megaMenu
                ? 'grid grid-cols-3 gap-0 p-2'
                : 'py-1'
            )}
          >
            {item.children.map((child) => {
              const hasSubMenu = !!child.children

              return (
                <div
                  key={child.name}
                  className="relative"
                  onMouseEnter={() =>
                    hasSubMenu ? handleSubEnter(child.name) : undefined
                  }
                  onMouseLeave={
                    hasSubMenu ? handleSubLeave : undefined
                  }
                >
                  <Link
                    href={child.href}
                    onClick={onLinkClick}
                    className={cn(
                      'flex items-center justify-between text-sm text-gray-700',
                      'hover:bg-gray-50 hover:text-[#406517] transition-colors',
                      item.megaMenu
                        ? 'px-3 py-2 rounded-md'
                        : 'px-4 py-2.5'
                    )}
                  >
                    <span>{child.name}</span>
                    {hasSubMenu && (
                      <ChevronRight className="w-3 h-3 ml-2 flex-shrink-0 text-gray-400" />
                    )}
                  </Link>

                  {/* Nested sub-menu (e.g. FAQ's under About) */}
                  {hasSubMenu && (
                    <div
                      className={cn(
                        'absolute left-full top-0 z-50 pl-2 transition-all duration-200 ease-out',
                        subMenuOpen === child.name
                          ? 'opacity-100 translate-x-0 visible'
                          : 'opacity-0 -translate-x-1 invisible pointer-events-none'
                      )}
                    >
                      <div className="bg-white rounded-lg shadow-xl border border-gray-200 min-w-[240px] py-1">
                        {child.children!.map((subChild) => (
                          <Link
                            key={subChild.name}
                            href={subChild.href}
                            onClick={onLinkClick}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#406517] transition-colors"
                          >
                            {subChild.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mobile accordion menu item (with smooth height animation)
// ---------------------------------------------------------------------------

function MobileAccordion({
  item,
  onNavigate,
}: {
  item: MenuItem
  onNavigate: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [subOpen, setSubOpen] = useState<string | null>(null)

  // Simple link (no children)
  if (!item.children) {
    return (
      <Link
        href={item.href}
        className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
        onClick={onNavigate}
      >
        {item.name}
      </Link>
    )
  }

  return (
    <div>
      {/* Accordion trigger */}
      <button
        className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{item.name}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Animated expandable children (grid-rows trick for smooth height) */}
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-in-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <div className="ml-4 border-l-2 border-gray-100 pl-2 pb-1 pt-1">
            {/* Link to the parent page itself */}
            <Link
              href={item.href}
              className="block px-4 py-2 text-sm font-medium text-[#406517] hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
              onClick={onNavigate}
            >
              All {item.name}
            </Link>

            {item.children.map((child) =>
              child.children ? (
                // ── Nested accordion (e.g. FAQ's) ───────────────────────
                <div key={child.name}>
                  <button
                    className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 active:bg-gray-100 rounded-lg transition-colors"
                    onClick={() =>
                      setSubOpen(
                        subOpen === child.name ? null : child.name
                      )
                    }
                  >
                    <span>{child.name}</span>
                    <ChevronDown
                      className={cn(
                        'w-3 h-3 text-gray-400 transition-transform duration-300',
                        subOpen === child.name && 'rotate-180'
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-[grid-template-rows] duration-300 ease-in-out',
                      subOpen === child.name
                        ? 'grid-rows-[1fr]'
                        : 'grid-rows-[0fr]'
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-4 border-l-2 border-gray-100 pl-2">
                        {child.children.map((subChild) => (
                          <Link
                            key={subChild.name}
                            href={subChild.href}
                            className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-[#406517] active:bg-gray-100 rounded-lg transition-colors"
                            onClick={onNavigate}
                          >
                            {subChild.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // ── Regular child link ──────────────────────────────────
                <Link
                  key={child.name}
                  href={child.href}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#406517] active:bg-gray-100 rounded-lg transition-colors"
                  onClick={onNavigate}
                >
                  {child.name}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const closeAll = useCallback(() => {
    setOpenDropdown(null)
  }, [])

  // Close all menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ── Logo ─────────────────────────────────────────────── */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png"
                alt="Mosquito Curtains"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* ── Desktop Navigation ───────────────────────────────── */}
          <div className="hidden xl:flex xl:items-center xl:gap-4 2xl:gap-5">
            {navigation.map((item, index) => (
              <DesktopDropdown
                key={item.name}
                item={item}
                isOpen={openDropdown === item.name}
                onOpen={() => setOpenDropdown(item.name)}
                onClose={closeAll}
                onLinkClick={closeAll}
                alignRight={index >= navigation.length - 3}
              />
            ))}
          </div>

          {/* ── CTA and Phone ────────────────────────────────────── */}
          <div className="hidden xl:flex xl:items-center xl:gap-3">
            <a
              href="tel:7706454745"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-[#406517] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              (770) 645-4745
            </a>
            <Link
              href="/start-project"
              className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-[#406517] rounded-full hover:bg-[#365512] transition-colors"
            >
              Start a Project
            </Link>
          </div>

          {/* ── Mobile menu button ───────────────────────────────── */}
          <div className="xl:hidden flex items-center gap-3">
            <a
              href="tel:7706454745"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-[#406517]"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">(770) 645-4745</span>
            </a>
            <button
              type="button"
              className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Navigation (slide-down with backdrop overlay) ── */}
      <div
        className={cn(
          'xl:hidden fixed inset-0 top-16 z-40 transition-all duration-300 ease-in-out',
          mobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Menu panel */}
        <div
          className={cn(
            'relative bg-white border-t border-gray-200 max-h-[calc(100vh-4rem)] overflow-y-auto',
            'transition-transform duration-300 ease-in-out',
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-4'
          )}
        >
          <div className="py-4 space-y-0.5">
            {navigation.map((item) => (
              <MobileAccordion
                key={item.name}
                item={item}
                onNavigate={() => setMobileMenuOpen(false)}
              />
            ))}

            {/* Phone + CTA at the bottom of mobile menu */}
            <div className="pt-4 mt-4 border-t border-gray-200 space-y-3 px-1">
              <a
                href="tel:7706454745"
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700"
              >
                <Phone className="w-5 h-5" />
                (770) 645-4745
              </a>
              <Link
                href="/start-project"
                className="block mx-3 text-center px-4 py-2.5 text-base font-semibold text-white bg-[#406517] rounded-full hover:bg-[#365512] active:bg-[#2d4a0f] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
