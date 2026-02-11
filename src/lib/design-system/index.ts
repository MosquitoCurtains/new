// Mosquito Curtains Design System
// Based on Startup Design System v2

// Export the design system
export * from './components'
export * from './tokens'
export * from './templates'

// Re-export commonly used components
export {
  // Layout Primitives
  Stack,
  Inline,
  Grid,
  Switcher,
  Cover,
  Frame,
  Container,
  TwoColumn,
  FourColumn,
  
  // UI Components
  Card,
  FeatureCard,
  CategoryCard,
  CategoryGrid,
  Button,
  Icon,
  Select,
  Badge,
  StatusBadge,
  Input,
  DatePicker,
  Radio,
  RadioGroup,
  Checkbox,
  Textarea,
  Heading,
  Text,
  Title,
  PageTitles,
  PageHeader,
  PageHero,
  
  // Layout Components
  Section,
  
  // List Components
  BulletedList,
  IconList,
  ListItem,
  OrderedList,
  OfferStack,
  PageLayout,
  
  // Feedback Components
  Spinner,
  ProgressBar,
  
  // Media Components
  Video,
  YouTubeEmbed,
  ImageLightbox,
  
  // Overlay Components
  Modal,
  
  // Specialized Cards
  ItemListCard,
  PricingCard,
  FlowCards,
  ProofWall,
  
  // Navigation Components
  Sidebar,
  MobileBottomNav,
  SidebarLayout,
  
  // Marketing Components
  GoogleReviews,
  
  // Section Components (Global Containers)
  GradientSection,
  HeaderBarSection,
  CTASection,
  TwoColumnSection,
} from './components'

// Re-export templates (pre-built content blocks)
export {
  // Content Block Templates
  WhyChooseUsTemplate,
  ClientReviewsTemplate,
  HowItWorksTemplate,
  WhoWeAreWhatWeDoTemplate,
  FinalCTATemplate,
  ProfessionalsCalloutTemplate,
  
  // Header Templates
  PowerHeaderTemplate,
  
  // MC Hero Actions (Global - Edit Once, Update Everywhere)
  MC_HERO_ACTIONS,
  MC_ACTIONS,
  CV_HERO_ACTIONS,
  MC_SIMPLE_ACTIONS,
  getMCHeroActions,
  
  // Page Layout Templates
  ProjectTypePageTemplate,
  ProductPageTemplate,
  InstallationPageTemplate,
  SupportPageTemplate,
  GalleryPageTemplate,
} from './templates'

// Re-export design tokens
export {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  durations,
  easings,
  zIndex,
  gradients,
  breakpoints,
  components,
} from './tokens'

// Re-export status system
export {
  STATUS_COLORS,
  type StatusType
} from './components'

// Utility function
export { cn } from '@/lib/utils'
