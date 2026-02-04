'use client'

import React, { useState } from 'react'
import { Send, Upload, Phone, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickConnectFormProps {
  className?: string
  title?: string
  subtitle?: string
}

export function QuickConnectForm({ 
  className,
  title = "Quick Connect Form",
  subtitle = "Fill and a planner will connect to discuss your project!"
}: QuickConnectFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    interest: '',
    projectType: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Capture attribution from URL params
      const urlParams = new URLSearchParams(window.location.search)
      
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          interest: formData.interest,
          projectType: formData.projectType,
          message: formData.message,
          source: 'quick_connect',
          utm_source: urlParams.get('utm_source') || '',
          utm_medium: urlParams.get('utm_medium') || '',
          utm_campaign: urlParams.get('utm_campaign') || '',
          utm_content: urlParams.get('utm_content') || '',
          utm_term: urlParams.get('utm_term') || '',
          referrer: document.referrer,
          landing_page: window.location.href,
          session_id: Math.random().toString(36).substring(2, 15),
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Thank you! We will contact you soon.')
        setFormData({
          firstName: '', lastName: '', phone: '', email: '',
          interest: '', projectType: '', message: '',
        })
      } else {
        alert('Error submitting form. Please try again.')
      }
    } catch (error) {
      console.error('Form submit error:', error)
      alert('Error submitting form. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className={cn('bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200', className)}>
      <div className="text-center mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-600">
          {subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#406517] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="Last Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#406517] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#406517] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#406517] focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I'm interested in... <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.interest}
              onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#406517] focus:border-transparent transition-all bg-white"
            >
              <option value="">Select...</option>
              <option value="curtains">Mosquito Curtains</option>
              <option value="vinyl">Clear Vinyl</option>
              <option value="both">Both MC & CV</option>
              <option value="netting">Raw Materials</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              My project type... <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#406517] focus:border-transparent transition-all bg-white"
            >
              <option value="">Select...</option>
              <option value="porch">Porch / Patio</option>
              <option value="deck">Deck</option>
              <option value="pergola">Pergola</option>
              <option value="gazebo">Gazebo</option>
              <option value="garage">Garage Door</option>
              <option value="other">Other Project Type</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Please tell us about your project
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Describe your project..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#406517] focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#406517] transition-colors cursor-pointer">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Upload images showing your full project from the outside
          </p>
          <p className="text-xs text-gray-400 mt-1">
            (no close-ups)
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-[#406517] text-white font-semibold rounded-full hover:bg-[#365512] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>Processing...</>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600 mb-2">
          Or call us directly:
        </p>
        <a 
          href="tel:7706454745"
          className="inline-flex items-center gap-2 text-lg font-semibold text-[#406517] hover:underline"
        >
          <Phone className="w-5 h-5" />
          (770) 645-4745
        </a>
      </div>
    </div>
  )
}
