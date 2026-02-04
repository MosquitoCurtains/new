'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Mosquito Curtains', href: '/screened-porch-enclosures' },
  { name: 'Clear Vinyl', href: '/clear-vinyl-plastic-patio-enclosures' },
  { name: 'Raw Netting', href: '/raw-netting-fabric-store' },
  { name: 'Options', href: '/options' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'About', href: '/about' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png"
                alt="Mosquito Curtains"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-[#406517] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA and Phone */}
          <div className="hidden md:flex md:items-center md:gap-4">
            <a
              href="tel:7706454745"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#406517]"
            >
              <Phone className="w-4 h-4" />
              (770) 645-4745
            </a>
            <Link
              href="/start-project"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#406517] rounded-full hover:bg-[#365512] transition-colors"
            >
              Start a Project
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <a
                  href="tel:7706454745"
                  className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-700"
                >
                  <Phone className="w-5 h-5" />
                  (770) 645-4745
                </a>
                <Link
                  href="/start-project"
                  className="block mt-2 mx-3 text-center px-4 py-2 text-base font-semibold text-white bg-[#406517] rounded-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start a Project
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
