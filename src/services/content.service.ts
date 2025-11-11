import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

export interface SiteSettings {
  id: number;
  siteName: string;
  siteTagline: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string | null;
  contactPhone: string | null;
  physicalAddress: string | null;
  officeHours: Record<string, string> | null;
  socialMedia: Record<string, string> | null;
  googleMapsUrl: string | null;
  copyrightText: string | null;
}

export interface LandingPageContent {
  id: number;
  heroHeading: string;
  heroSubheading: string | null;
  heroIcon: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
  stats: Array<{ label: string; value: string }> | null;
  features: Array<{ icon: string; title: string; description: string }> | null;
  noticeSectionTitle: string;
  noticeSectionDescription: string | null;
  ctaSectionHeading: string | null;
  ctaSectionDescription: string | null;
  ctaSectionButtonText: string;
  ctaSectionButtonLink: string;
}

export interface AboutPageContent {
  id: number;
  heroTitle: string;
  heroDescription: string | null;
  missionStatement: string | null;
  visionStatement: string | null;
  coreValues: Array<{ title: string; description: string }> | null;
  achievements: Array<{ number: string; label: string }> | null;
  whyChooseItems: Array<{ icon: string; title: string; description: string }> | null;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface HelpResource {
  id: number;
  title: string;
  description: string;
  icon: string;
  link: string | null;
  order: number;
}

export interface NavigationSettings {
  id: number;
  mainNavLinks: Array<{ href: string; label: string }> | null;
  footerQuickLinks: Array<{ href: string; label: string }> | null;
  footerSupportLinks: Array<{ href?: string; label: string }> | null;
  footerLegalLinks: Array<{ href: string; label: string }> | null;
}

export interface SeoSettings {
  id: number;
  metaTitleTemplate: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogImageUrl: string | null;
  twitterCardSettings: Record<string, string> | null;
}

// Public API calls
export const contentService = {
  // Public endpoints
  getSiteSettings: () =>
    apiClient.get<{ data: SiteSettings }>('/public/content/site-settings').then((res) => res.data.data),

  getLandingPageContent: () =>
    apiClient.get<{ data: LandingPageContent }>('/public/content/landing-page').then((res) => res.data.data),

  getAboutPageContent: () =>
    apiClient.get<{ data: AboutPageContent }>('/public/content/about-page').then((res) => res.data.data),

  getFaqs: (category?: string) =>
    apiClient.get<{ data: Faq[] }>('/public/content/faqs', { params: { category } }).then((res) => res.data.data),

  getHelpResources: () =>
    apiClient.get<{ data: HelpResource[] }>('/public/content/help-resources').then((res) => res.data.data),

  getNavigationSettings: () =>
    apiClient.get<{ data: NavigationSettings }>('/public/content/navigation').then((res) => res.data.data),

  getSeoSettings: () =>
    apiClient.get<{ data: SeoSettings }>('/public/content/seo').then((res) => res.data.data),
};

// Admin API calls
export const adminContentService = {
  // Site Settings
  getSiteSettings: () =>
    apiClient.get<{ data: SiteSettings }>('/admin/content/site-settings').then((res) => res.data.data),
  
  updateSiteSettings: (data: Partial<SiteSettings>) =>
    apiClient.put<{ data: SiteSettings }>('/admin/content/site-settings', data).then((res) => res.data.data),

  // Landing Page
  getLandingPageContent: () =>
    apiClient.get<{ data: LandingPageContent }>('/admin/content/landing-page').then((res) => res.data.data),

  updateLandingPageContent: (data: Partial<LandingPageContent>) =>
    apiClient.put<{ data: LandingPageContent }>('/admin/content/landing-page', data).then((res) => res.data.data),

  // About Page
  getAboutPageContent: () =>
    apiClient.get<{ data: AboutPageContent }>('/admin/content/about-page').then((res) => res.data.data),

  updateAboutPageContent: (data: Partial<AboutPageContent>) =>
    apiClient.put<{ data: AboutPageContent }>('/admin/content/about-page', data).then((res) => res.data.data),
  
  // FAQs
  getFaqs: (params?: { per_page?: number; category?: string }) =>
    apiClient.get<{ data: Faq[] }>('/admin/content/faqs', { params }).then((res) => res.data.data),

  getFaq: (id: number) =>
    apiClient.get<{ data: Faq }>(`/admin/content/faqs/${id}`).then((res) => res.data.data),

  createFaq: (data: Omit<Faq, 'id'>) =>
    apiClient.post<{ data: Faq }>('/admin/content/faqs', data).then((res) => res.data.data),

  updateFaq: (id: number, data: Partial<Faq>) =>
    apiClient.put<{ data: Faq }>(`/admin/content/faqs/${id}`, data).then((res) => res.data.data),

  deleteFaq: (id: number) =>
    apiClient.delete(`/admin/content/faqs/${id}`).then((res) => res.data),

  // Help Resources
  getHelpResources: () =>
    apiClient.get<{ data: HelpResource[] }>('/admin/content/help-resources').then((res) => res.data.data),

  getHelpResource: (id: number) =>
    apiClient.get<{ data: HelpResource }>(`/admin/content/help-resources/${id}`).then((res) => res.data.data),

  createHelpResource: (data: Omit<HelpResource, 'id'>) =>
    apiClient.post<{ data: HelpResource }>('/admin/content/help-resources', data).then((res) => res.data.data),

  updateHelpResource: (id: number, data: Partial<HelpResource>) =>
    apiClient.put<{ data: HelpResource }>(`/admin/content/help-resources/${id}`, data).then((res) => res.data.data),

  deleteHelpResource: (id: number) =>
    apiClient.delete(`/admin/content/help-resources/${id}`).then((res) => res.data),

  // Navigation
  getNavigationSettings: () =>
    apiClient.get<{ data: NavigationSettings }>('/admin/content/navigation').then((res) => res.data.data),

  updateNavigationSettings: (data: Partial<NavigationSettings>) =>
    apiClient.put<{ data: NavigationSettings }>('/admin/content/navigation', data).then((res) => res.data.data),

  // SEO
  getSeoSettings: () =>
    apiClient.get<{ data: SeoSettings }>('/admin/content/seo').then((res) => res.data.data),

  updateSeoSettings: (data: Partial<SeoSettings>) =>
    apiClient.put<{ data: SeoSettings }>('/admin/content/seo', data).then((res) => res.data.data),
};

export default apiClient;
