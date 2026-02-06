'use client'

import React from 'react'
import Link from 'next/link'
import { Phone, Mail } from 'lucide-react'
import { ORDERS_SERVED_STRINGS } from '@/lib/constants/orders-served'

const footerLinks = {
  products: [
    { name: 'Mosquito Curtains', href: '/screened-porch-enclosures' },
    { name: 'Clear Vinyl Enclosures', href: '/clear-vinyl-plastic-patio-enclosures' },
    { name: 'Raw Mosquito Netting', href: '/raw-netting-fabric-store' },
  ],
  support: [
    { name: 'Planning A Project', href: '/planning' },
    { name: 'Installation Guides', href: '/install' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Shipping & Returns', href: '/shipping' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Customer Reviews', href: '/reviews' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact Us', href: '/contact' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <img 
              src="https://static.mosquitocurtains.com/wp-media-folder-mosquito-curtains/wp-content/uploads/2019/08/MC-Logo.png"
              alt="Mosquito Curtains"
              className="h-10 w-auto brightness-0 invert"
            />
            <p className="text-gray-400 text-sm">
              Custom screen enclosures since 2004. {ORDERS_SERVED_STRINGS.happyClients}.
            </p>
            <div className="space-y-2">
              <a
                href="tel:7706454745"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                (770) 645-4745
              </a>
              <a
                href="mailto:help@mosquitocurtains.com"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                help@mosquitocurtains.com
              </a>
            </div>
            <p className="text-xs text-gray-500">
              Monday - Friday: 9am - 5pm EST
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Products
            </h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Mosquito Curtains. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
