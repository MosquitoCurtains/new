// Pre-built Templates - Content Blocks Ready to Deploy
// Edit these once, update everywhere across the site

// Content Block Templates
export { WhyChooseUsTemplate } from './WhyChooseUsTemplate'
export { ClientReviewsTemplate } from './ClientReviewsTemplate'
export { HowItWorksTemplate } from './HowItWorksTemplate'
export { WhoWeAreWhatWeDoTemplate } from './WhoWeAreWhatWeDoTemplate'
export { FinalCTATemplate } from './FinalCTATemplate'
export { ProfessionalsCalloutTemplate } from './ProfessionalsCalloutTemplate'

// Header Templates
export { PowerHeaderTemplate } from './PowerHeaderTemplate'
export type { PowerHeaderTemplateProps, PowerHeaderAction } from './PowerHeaderTemplate'

// Hero Actions (Global - Edit Once, Update Everywhere)
export { 
  MC_HERO_ACTIONS,
  MC_ACTIONS,
  CV_HERO_ACTIONS,
  RN_HERO_ACTIONS,
  MC_SIMPLE_ACTIONS,
  getHeroActions,
  getMCHeroActions,
} from './MCHeroActions'
export type { MCHeroAction } from './MCHeroActions'

// Page Layout Templates
export { ProjectTypePageTemplate } from './ProjectTypePageTemplate'
export type { ProjectTypePageTemplateProps, ContentSection, GalleryImage as ProjectGalleryImage } from './ProjectTypePageTemplate'

export { ProductPageTemplate } from './ProductPageTemplate'
export type { ProductPageTemplateProps, ProjectType, ProductFeature } from './ProductPageTemplate'

export { InstallationPageTemplate } from './InstallationPageTemplate'
export type { InstallationPageTemplateProps, InstallationType, InstallationStep, VideoEntry, HelpfulVideo } from './InstallationPageTemplate'

export { SupportPageTemplate } from './SupportPageTemplate'
export type { SupportPageTemplateProps, ContentSection as SupportContentSection, QuickLink } from './SupportPageTemplate'

export { GalleryPageTemplate } from './GalleryPageTemplate'
export type { GalleryPageTemplateProps, GalleryImage, GalleryFilters, FilterOption } from './GalleryPageTemplate'

// Re-export for convenience — GalleryImage is also used by ProjectTypePageTemplate
// Use ProjectGalleryImage for that context to avoid naming collisions

// Re-export GoogleReviews for use in templates
export { GoogleReviews } from '../components/marketing/GoogleReviews'
