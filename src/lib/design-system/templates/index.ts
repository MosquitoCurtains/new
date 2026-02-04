// Pre-built Templates - Content Blocks Ready to Deploy
// Edit these once, update everywhere across the site

// Content Block Templates
export { WhyChooseUsTemplate } from './WhyChooseUsTemplate'
export { HowItWorksTemplate } from './HowItWorksTemplate'
export { WhoWeAreWhatWeDoTemplate } from './WhoWeAreWhatWeDoTemplate'
export { FinalCTATemplate } from './FinalCTATemplate'
export { ProfessionalsCalloutTemplate } from './ProfessionalsCalloutTemplate'

// Header Templates
export { PowerHeaderTemplate } from './PowerHeaderTemplate'
export type { PowerHeaderTemplateProps, PowerHeaderAction } from './PowerHeaderTemplate'

// Page Layout Templates
export { ProjectTypePageTemplate } from './ProjectTypePageTemplate'
export type { ProjectTypePageTemplateProps, ContentSection, GalleryImage as ProjectGalleryImage } from './ProjectTypePageTemplate'

export { ProductPageTemplate } from './ProductPageTemplate'
export type { ProductPageTemplateProps, ProjectType, ProductFeature } from './ProductPageTemplate'

export { InstallationPageTemplate } from './InstallationPageTemplate'
export type { InstallationPageTemplateProps, InstallationType, InstallationStep } from './InstallationPageTemplate'

export { SupportPageTemplate } from './SupportPageTemplate'
export type { SupportPageTemplateProps, ContentSection as SupportContentSection, QuickLink } from './SupportPageTemplate'

export { GalleryPageTemplate } from './GalleryPageTemplate'
export type { GalleryPageTemplateProps, GalleryImage, GalleryFilters, FilterOption } from './GalleryPageTemplate'

// Re-export GoogleReviews for use in templates
export { GoogleReviews } from '../components/marketing/GoogleReviews'
