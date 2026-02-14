// /src/app/admin/utm-builder/page.tsx
// UTM Parameter Builder Tool for Mosquito Curtains

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Container,
  Stack,
  Card,
  Heading,
  Text,
  Button,
  Input,
} from '@/lib/design-system'
import { ArrowLeft, Check, ExternalLink, Copy, RotateCcw, Link2, ChevronDown, ChevronUp } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface UTMParams {
  source: string
  medium: string
  campaign: string
  content: string
  term: string
}

interface Example {
  label: string
  description: string
  color: string
  baseUrl: string
  params: UTMParams
}

// ─────────────────────────────────────────────────────────────────────────────
// Example presets relevant to Mosquito Curtains marketing
// ─────────────────────────────────────────────────────────────────────────────

const EXAMPLES: Record<string, Example> = {
  google_porch: {
    label: 'Google Ads - Screened Porch',
    description: 'Google CPC campaign targeting screened porch keywords',
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    baseUrl: 'https://mosquitocurtains.com/screened-porch',
    params: {
      source: 'google',
      medium: 'cpc',
      campaign: 'screened-porch-spring-2026',
      content: 'responsive-search-ad',
      term: 'screened porch curtains',
    },
  },
  google_vinyl: {
    label: 'Google Ads - Clear Vinyl',
    description: 'Google CPC campaign for clear vinyl winter panels',
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    baseUrl: 'https://mosquitocurtains.com/clear-vinyl-plastic-patio-enclosures',
    params: {
      source: 'google',
      medium: 'cpc',
      campaign: 'clear-vinyl-winter-2026',
      content: 'responsive-search-ad',
      term: 'clear vinyl patio enclosures',
    },
  },
  google_gazebo: {
    label: 'Google Ads - Gazebo',
    description: 'Google CPC campaign for gazebo screen curtains',
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    baseUrl: 'https://mosquitocurtains.com/gazebo-screen-curtains',
    params: {
      source: 'google',
      medium: 'cpc',
      campaign: 'gazebo-screens-2026',
      content: 'responsive-search-ad',
      term: 'gazebo screen curtains',
    },
  },
  facebook_retarget: {
    label: 'Facebook - Retargeting',
    description: 'Facebook retargeting ad for site visitors',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    baseUrl: 'https://mosquitocurtains.com/screened-porch-enclosures',
    params: {
      source: 'facebook',
      medium: 'cpc',
      campaign: 'retarget-site-visitors',
      content: 'carousel-ad-gallery',
      term: '',
    },
  },
  facebook_awareness: {
    label: 'Facebook - Awareness',
    description: 'Facebook brand awareness campaign',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
    baseUrl: 'https://mosquitocurtains.com/gallery',
    params: {
      source: 'facebook',
      medium: 'social',
      campaign: 'brand-awareness-spring-2026',
      content: 'video-ad-before-after',
      term: '',
    },
  },
  email_newsletter: {
    label: 'Email Newsletter',
    description: 'Monthly email newsletter to subscribers',
    color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    baseUrl: 'https://mosquitocurtains.com',
    params: {
      source: 'newsletter',
      medium: 'email',
      campaign: 'monthly-feb-2026',
      content: 'cta-button',
      term: '',
    },
  },
  email_followup: {
    label: 'Email - Lead Follow-up',
    description: 'Follow-up email to quote leads',
    color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    baseUrl: 'https://mosquitocurtains.com/quote/mosquito-curtains',
    params: {
      source: 'email',
      medium: 'email',
      campaign: 'lead-followup-quote',
      content: 'complete-your-quote',
      term: '',
    },
  },
  instagram_organic: {
    label: 'Instagram - Organic',
    description: 'Organic Instagram post / bio link',
    color: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
    baseUrl: 'https://mosquitocurtains.com/gallery',
    params: {
      source: 'instagram',
      medium: 'social',
      campaign: 'bio-link',
      content: 'gallery-showcase',
      term: '',
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Ad Platform Tracking Templates (with dynamic macros)
// Paste these into each platform's "Tracking Template" or "URL Parameters" field
// ─────────────────────────────────────────────────────────────────────────────

interface PlatformTemplate {
  platform: string
  color: string
  badgeColor: string
  description: string
  whereToSet: string
  template: string
  macros: { macro: string; description: string }[]
}

const PLATFORM_TEMPLATES: PlatformTemplate[] = [
  {
    platform: 'Google Ads',
    color: 'border-blue-200 bg-blue-50/50',
    badgeColor: 'bg-blue-100 text-blue-700',
    description:
      'Paste into Google Ads > Account/Campaign Settings > Tracking Template. All params including GCLID are captured by our tracking system.',
    whereToSet: 'Google Ads > Settings > Account Settings > Tracking > Tracking Template',
    template:
      '{lpurl}?utm_source=google&utm_medium={network}&utm_campaign={campaignid}&utm_content={creative}&utm_term={keyword}&gclid={gclid}&matchtype={matchtype}&device={device}&placement={placement}&adposition={adposition}&loc_physical={loc_physical_ms}&targetid={targetid}',
    macros: [
      { macro: '{lpurl}', description: 'Inserts your Final URL automatically (required at the start)' },
      { macro: '{gclid}', description: 'Google Click ID - links this click to Google Ads for conversion tracking & ROAS' },
      { macro: '{campaignid}', description: 'Numeric campaign ID (e.g., 12345678)' },
      { macro: '{keyword}', description: 'The keyword that triggered your ad' },
      { macro: '{creative}', description: 'Unique ad ID' },
      { macro: '{matchtype}', description: 'Match type: e (exact), p (phrase), b (broad)' },
      { macro: '{device}', description: 'Device: m (mobile), t (tablet), c (computer)' },
      { macro: '{network}', description: 'Network: g (Google Search), s (Search Partner), d (Display), ytv (YouTube Video), yts (YouTube Search)' },
      { macro: '{placement}', description: 'Content site placement (Display Network)' },
      { macro: '{adposition}', description: 'Ad position on page (e.g., 1t2 = page 1, top, position 2)' },
      { macro: '{loc_physical_ms}', description: 'Geographic location ID of the click' },
      { macro: '{targetid}', description: 'Target ID: kwd-123 (keyword), aud-456 (audience), dsa-789 (dynamic search)' },
    ],
  },
  {
    platform: 'Facebook / Meta Ads',
    color: 'border-indigo-200 bg-indigo-50/50',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    description:
      'Paste into Meta Ads Manager > Ad level > Tracking > URL Parameters. FBCLID is auto-appended by Facebook and captured by our tracking.',
    whereToSet: 'Meta Ads Manager > Ad > Tracking > URL Parameters',
    template:
      'utm_source=facebook&utm_medium=cpc&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&campaign_id={{campaign.id}}&adset_id={{adset.id}}&adset_name={{adset.name}}&ad_id={{ad.id}}&fb_placement={{placement}}&site_source={{site_source_name}}',
    macros: [
      { macro: '{{campaign.id}}', description: 'Numeric campaign ID' },
      { macro: '{{campaign.name}}', description: 'Campaign name (at time of publication)' },
      { macro: '{{adset.id}}', description: 'Numeric ad set ID' },
      { macro: '{{adset.name}}', description: 'Ad set name (at time of publication)' },
      { macro: '{{ad.id}}', description: 'Numeric ad ID' },
      { macro: '{{ad.name}}', description: 'Ad name (at time of publication)' },
      { macro: '{{placement}}', description: 'Placement: Facebook_Desktop_Feed, Instagram_Stories, Instagram_Feed, etc.' },
      { macro: '{{site_source_name}}', description: 'Platform: fb (Facebook), ig (Instagram), msg (Messenger), an (Audience Network)' },
    ],
  },
  {
    platform: 'Microsoft / Bing Ads',
    color: 'border-teal-200 bg-teal-50/50',
    badgeColor: 'bg-teal-100 text-teal-700',
    description:
      'Paste into Microsoft Ads > Account/Campaign Settings > Tracking Template. Works at account, campaign, ad group, or keyword level.',
    whereToSet: 'Microsoft Ads > Settings > Account Settings > Tracking Template',
    template:
      '{lpurl}?utm_source=bing&utm_medium=cpc&utm_campaign={CampaignId}&utm_content={AdGroupId}&utm_term={keyword}&device={Device}&network={Network}&matchtype={MatchType}&adid={AdId}&loc_physical={loc_physical_ms}',
    macros: [
      { macro: '{lpurl}', description: 'Inserts your Final URL automatically (required at the start)' },
      { macro: '{CampaignId}', description: 'Numeric campaign ID' },
      { macro: '{Campaign}', description: 'Campaign name (alternative to ID)' },
      { macro: '{AdGroupId}', description: 'Numeric ad group ID' },
      { macro: '{AdGroup}', description: 'Ad group name (alternative to ID)' },
      { macro: '{AdId}', description: 'Numeric ad ID' },
      { macro: '{keyword}', description: 'The keyword that triggered the ad' },
      { macro: '{MatchType}', description: 'Match type: e (exact), p (phrase), b (broad)' },
      { macro: '{Device}', description: 'Device type: Desktop, Mobile, Tablet' },
      { macro: '{Network}', description: 'Network: o (owned/Bing), s (syndicated partner), a (audience)' },
      { macro: '{loc_physical_ms}', description: 'Geographic location ID of the click' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function UTMBuilderPage() {
  const [baseUrl, setBaseUrl] = useState('https://mosquitocurtains.com')
  const [utmParams, setUtmParams] = useState<UTMParams>({
    source: '',
    medium: '',
    campaign: '',
    content: '',
    term: '',
  })
  const [copied, setCopied] = useState(false)
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null)
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null)

  // ── Handlers ────────────────────────────────────────────────────────────

  function handleParamChange(field: keyof UTMParams, value: string) {
    setUtmParams((prev) => ({ ...prev, [field]: value }))
  }

  function buildURL(): string {
    const params = new URLSearchParams()

    if (utmParams.source) params.append('utm_source', utmParams.source)
    if (utmParams.medium) params.append('utm_medium', utmParams.medium)
    if (utmParams.campaign) params.append('utm_campaign', utmParams.campaign)
    if (utmParams.content) params.append('utm_content', utmParams.content)
    if (utmParams.term) params.append('utm_term', utmParams.term)

    const queryString = params.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }

  async function copyToClipboard() {
    const url = buildURL()
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  function clearAll() {
    setBaseUrl('https://mosquitocurtains.com')
    setUtmParams({
      source: '',
      medium: '',
      campaign: '',
      content: '',
      term: '',
    })
  }

  function loadExample(key: string) {
    const ex = EXAMPLES[key]
    if (!ex) return
    setBaseUrl(ex.baseUrl)
    setUtmParams({ ...ex.params })
  }

  async function copyTemplate(platform: string, template: string) {
    try {
      await navigator.clipboard.writeText(template)
      setCopiedTemplate(platform)
      setTimeout(() => setCopiedTemplate(null), 2000)
    } catch (error) {
      console.error('Failed to copy template:', error)
    }
  }

  const finalURL = buildURL()
  const hasParams = Object.values(utmParams).some((v) => v.trim() !== '')

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <Container size="xl">
      <Stack gap="lg">
        {/* Header */}
        <div className="pt-6 pb-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#406517] transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Admin
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#406517]/10 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-[#406517]" />
            </div>
            <div>
              <Heading level={1} className="text-xl font-bold text-gray-900">
                UTM Builder
              </Heading>
              <Text className="text-sm text-gray-500">
                Build tracked campaign URLs for attribution analytics
              </Text>
            </div>
          </div>
        </div>

        {/* Quick Examples */}
        <Card variant="outlined" className="p-5">
          <Heading level={2} className="text-base font-semibold text-gray-900 mb-4">
            Quick Examples
          </Heading>

          <div className="space-y-4">
            {/* Google Ads */}
            <div>
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Google Ads
              </Text>
              <div className="flex flex-wrap gap-2">
                {(['google_porch', 'google_vinyl', 'google_gazebo'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => loadExample(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${EXAMPLES[key].color}`}
                  >
                    {EXAMPLES[key].label.replace('Google Ads - ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Facebook */}
            <div>
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Facebook / Instagram
              </Text>
              <div className="flex flex-wrap gap-2">
                {(['facebook_retarget', 'facebook_awareness', 'instagram_organic'] as const).map(
                  (key) => (
                    <button
                      key={key}
                      onClick={() => loadExample(key)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${EXAMPLES[key].color}`}
                    >
                      {EXAMPLES[key].label}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Text className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Email
              </Text>
              <div className="flex flex-wrap gap-2">
                {(['email_newsletter', 'email_followup'] as const).map((key) => (
                  <button
                    key={key}
                    onClick={() => loadExample(key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${EXAMPLES[key].color}`}
                  >
                    {EXAMPLES[key].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Base URL */}
        <Card variant="outlined" className="p-5">
          <Heading level={2} className="text-base font-semibold text-gray-900 mb-3">
            Website URL
          </Heading>
          <Input
            value={baseUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBaseUrl(e.target.value)}
            placeholder="https://mosquitocurtains.com"
          />
          <Text className="text-xs text-gray-400 mt-2">
            Common landing pages:{' '}
            <button
              onClick={() => setBaseUrl('https://mosquitocurtains.com/screened-porch')}
              className="text-[#406517] hover:underline"
            >
              /screened-porch
            </button>
            {' | '}
            <button
              onClick={() =>
                setBaseUrl('https://mosquitocurtains.com/clear-vinyl-plastic-patio-enclosures')
              }
              className="text-[#406517] hover:underline"
            >
              /clear-vinyl
            </button>
            {' | '}
            <button
              onClick={() =>
                setBaseUrl('https://mosquitocurtains.com/gazebo-screen-curtains')
              }
              className="text-[#406517] hover:underline"
            >
              /gazebo
            </button>
            {' | '}
            <button
              onClick={() =>
                setBaseUrl('https://mosquitocurtains.com/quote/mosquito-curtains')
              }
              className="text-[#406517] hover:underline"
            >
              /quote
            </button>
            {' | '}
            <button
              onClick={() => setBaseUrl('https://mosquitocurtains.com/contact')}
              className="text-[#406517] hover:underline"
            >
              /contact
            </button>
            {' | '}
            <button
              onClick={() => setBaseUrl('https://mosquitocurtains.com/gallery')}
              className="text-[#406517] hover:underline"
            >
              /gallery
            </button>
          </Text>
        </Card>

        {/* UTM Parameters */}
        <Card variant="outlined" className="p-5">
          <Heading level={2} className="text-base font-semibold text-gray-900 mb-5">
            UTM Parameters
          </Heading>

          <div className="space-y-5">
            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Campaign Source{' '}
                <span className="text-gray-400 font-normal">(utm_source)</span>
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <Input
                value={utmParams.source}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleParamChange('source', e.target.value)
                }
                placeholder="google, facebook, newsletter, instagram"
              />
              <Text className="text-xs text-gray-400 mt-1">
                The referrer: google, facebook, newsletter, instagram, bing, partner-name
              </Text>
            </div>

            {/* Medium */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Campaign Medium{' '}
                <span className="text-gray-400 font-normal">(utm_medium)</span>
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <Input
                value={utmParams.medium}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleParamChange('medium', e.target.value)
                }
                placeholder="cpc, email, social, referral, display"
              />
              <Text className="text-xs text-gray-400 mt-1">
                Marketing medium: cpc (paid search), email, social, referral, display, banner
              </Text>
            </div>

            {/* Campaign */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Campaign Name{' '}
                <span className="text-gray-400 font-normal">(utm_campaign)</span>
                <span className="text-red-500 ml-0.5">*</span>
              </label>
              <Input
                value={utmParams.campaign}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleParamChange('campaign', e.target.value)
                }
                placeholder="screened-porch-spring-2026, retarget-site-visitors"
              />
              <Text className="text-xs text-gray-400 mt-1">
                Campaign identifier: product-season-year, promo-name, or descriptive slug
              </Text>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Campaign Content{' '}
                <span className="text-gray-400 font-normal">(utm_content)</span>
              </label>
              <Input
                value={utmParams.content}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleParamChange('content', e.target.value)
                }
                placeholder="responsive-search-ad, carousel-ad, cta-button, hero-banner"
              />
              <Text className="text-xs text-gray-400 mt-1">
                Differentiate ads or links that point to the same URL (A/B test variants, ad
                formats)
              </Text>
            </div>

            {/* Term */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Campaign Term{' '}
                <span className="text-gray-400 font-normal">(utm_term)</span>
              </label>
              <Input
                value={utmParams.term}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleParamChange('term', e.target.value)
                }
                placeholder="screened porch curtains, mosquito netting"
              />
              <Text className="text-xs text-gray-400 mt-1">
                Paid search keywords - identify which keyword triggered the ad
              </Text>
            </div>
          </div>
        </Card>

        {/* Generated URL */}
        <Card variant="elevated" className="p-5">
          <Heading level={2} className="text-base font-semibold text-gray-900 mb-3">
            Generated URL
          </Heading>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
            <code className="text-sm text-[#406517] break-all leading-relaxed">
              {finalURL}
            </code>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={copyToClipboard}
              disabled={!hasParams}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1.5" />
                  Copy URL
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(finalURL, '_blank')}
              disabled={!hasParams}
            >
              <ExternalLink className="w-4 h-4 mr-1.5" />
              Test URL
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Reset
            </Button>
          </div>
        </Card>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* Ad Platform Tracking Templates                                  */}
        {/* ──────────────────────────────────────────────────────────────── */}
        <Card variant="outlined" className="p-5">
          <Heading level={2} className="text-base font-semibold text-gray-900 mb-1">
            Ad Platform Tracking Templates
          </Heading>
          <Text className="text-xs text-gray-500 mb-5">
            Copy these into your ad platform&apos;s tracking template settings. Dynamic macros
            (like <code className="bg-gray-100 px-1 rounded">{'{keyword}'}</code>) are
            auto-replaced by the platform when someone clicks your ad.
          </Text>

          <div className="space-y-4">
            {PLATFORM_TEMPLATES.map((pt) => {
              const isExpanded = expandedPlatform === pt.platform
              const isCopied = copiedTemplate === pt.platform

              return (
                <div
                  key={pt.platform}
                  className={`border rounded-xl overflow-hidden ${pt.color}`}
                >
                  {/* Platform header */}
                  <div className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${pt.badgeColor}`}
                        >
                          {pt.platform}
                        </span>
                      </div>
                      <Text className="text-xs text-gray-500">{pt.description}</Text>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => copyTemplate(pt.platform, pt.template)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          isCopied
                            ? 'bg-green-50 border-green-300 text-green-700'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-[#406517] hover:text-[#406517]'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy Template
                          </>
                        )}
                      </button>
                      <button
                        onClick={() =>
                          setExpandedPlatform(isExpanded ? null : pt.platform)
                        }
                        className="p-1.5 rounded-lg hover:bg-white/60 text-gray-500 transition-colors"
                        title={isExpanded ? 'Hide details' : 'Show all macros'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Template string (always visible) */}
                  <div className="px-4 pb-3">
                    <div className="bg-white/80 border border-gray-200 rounded-lg p-3">
                      <code className="text-[11px] text-gray-800 break-all leading-relaxed block">
                        {pt.template}
                      </code>
                    </div>
                    <Text className="text-[10px] text-gray-400 mt-1.5 italic">
                      Where to set: {pt.whereToSet}
                    </Text>
                  </div>

                  {/* Expanded macro reference */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-200/60">
                      <Text className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
                        Available Dynamic Macros
                      </Text>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                        {pt.macros.map((m) => (
                          <div key={m.macro} className="flex items-start gap-2 text-xs">
                            <code className="text-[10px] font-mono bg-white/80 px-1.5 py-0.5 rounded border border-gray-200 text-gray-700 shrink-0 mt-0.5">
                              {m.macro}
                            </code>
                            <span className="text-gray-500">{m.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Best Practices */}
        <Card variant="outlined" className="p-5 mb-8">
          <Heading level={2} className="text-base font-semibold text-gray-900 mb-4">
            Best Practices
          </Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General UTM Guidelines */}
            <div>
              <Text className="text-xs font-semibold text-[#406517] uppercase tracking-wider mb-2">
                UTM Naming Conventions
              </Text>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#406517] font-bold mt-0.5">-</span>
                  <span>
                    <strong>Always use lowercase</strong> - UTM params are case-sensitive.{' '}
                    <code className="text-xs bg-gray-100 px-1 rounded">google</code> not{' '}
                    <code className="text-xs bg-gray-100 px-1 rounded">Google</code>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#406517] font-bold mt-0.5">-</span>
                  <span>
                    <strong>Use hyphens</strong> to separate words:{' '}
                    <code className="text-xs bg-gray-100 px-1 rounded">
                      screened-porch-spring-2026
                    </code>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#406517] font-bold mt-0.5">-</span>
                  <span>
                    <strong>Be consistent</strong> - Use the same names across all campaigns
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#406517] font-bold mt-0.5">-</span>
                  <span>
                    <strong>Source + Medium + Campaign</strong> are essential for attribution
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#406517] font-bold mt-0.5">-</span>
                  <span>
                    <strong>Content for A/B testing</strong> - Differentiate ad variants
                  </span>
                </li>
              </ul>
            </div>

            {/* MC-Specific Guidelines */}
            <div>
              <Text className="text-xs font-semibold text-[#003365] uppercase tracking-wider mb-2">
                Attribution Tracking Notes
              </Text>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#003365] font-bold mt-0.5">-</span>
                  <span>
                    <strong>Google Ads auto-tags GCLID</strong> - UTMs work alongside GCLID,
                    both are captured
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003365] font-bold mt-0.5">-</span>
                  <span>
                    <strong>Facebook auto-tags FBCLID</strong> - Add UTMs for cleaner source
                    identification
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003365] font-bold mt-0.5">-</span>
                  <span>
                    <strong>First-touch is preserved</strong> - Visitor&apos;s first UTM source
                    follows them to purchase
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003365] font-bold mt-0.5">-</span>
                  <span>
                    <strong>New UTMs = new session</strong> - A new UTM click creates a fresh
                    session for attribution
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#003365] font-bold mt-0.5">-</span>
                  <span>
                    <strong>View results</strong> in{' '}
                    <Link
                      href="/admin/mc-sales/analytics"
                      className="text-[#406517] hover:underline"
                    >
                      Attribution Analytics
                    </Link>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Common Source/Medium combos */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Common Source / Medium Combinations
            </Text>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                { source: 'google', medium: 'cpc', desc: 'Google Ads (Search)' },
                { source: 'google', medium: 'display', desc: 'Google Display Network' },
                { source: 'facebook', medium: 'cpc', desc: 'Facebook Paid Ads' },
                { source: 'facebook', medium: 'social', desc: 'Facebook Organic' },
                { source: 'instagram', medium: 'social', desc: 'Instagram Organic' },
                { source: 'newsletter', medium: 'email', desc: 'Email Newsletter' },
                { source: 'email', medium: 'email', desc: 'Direct Email' },
                { source: 'bing', medium: 'cpc', desc: 'Bing/Microsoft Ads' },
                { source: 'partner', medium: 'referral', desc: 'Partner/Referral' },
              ].map(({ source, medium, desc }) => (
                <button
                  key={`${source}-${medium}`}
                  onClick={() => {
                    handleParamChange('source', source)
                    handleParamChange('medium', medium)
                  }}
                  className="flex items-center gap-2 text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-[#406517] hover:bg-[#406517]/5 transition-colors text-xs"
                >
                  <span className="font-mono text-[10px] text-gray-500">
                    {source}/{medium}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span className="text-gray-700">{desc}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </Stack>
    </Container>
  )
}
