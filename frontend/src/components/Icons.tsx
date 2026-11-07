import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const IconSearch: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export const IconBell: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export const IconBookOpen: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export const IconCards: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

export const IconBudget: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export const IconClose: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const IconChevronRight: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 5l7 7-7 7" />
  </svg>
);

export const IconChevronDown: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M19 9l-7 7-7-7" />
  </svg>
);

export const IconCheck: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

export const IconSparkles: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export const IconBriefcase: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export const IconGraduationCap: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
  </svg>
);

export const IconClock: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const IconShoppingCart: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export const IconHeartPulse: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export const IconLeaf: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export const IconHome: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export const IconLandmark: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

export const IconGlobe: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

export const IconPlans: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

export const IconShare: React.FC<IconProps> = ({ className = "w-5 h-5", size }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

export const IconStar: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg className={className} width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export const IconPhi: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 200 200" fill="none">
    <circle cx="100" cy="100" r="54" stroke="currentColor" strokeWidth="18" />
    <line x1="100" y1="20" x2="100" y2="180" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
  </svg>
);

export function getProfileColor(profileId: string) {
  switch (profileId.toLowerCase()) {
    case 'salaries':
      return { text: 'text-rose-400', bg: 'bg-rose-500/15', border: 'border-rose-500/30', badge: 'bg-rose-600' };
    case 'jeunes':
      return { text: 'text-fuchsia-400', bg: 'bg-fuchsia-500/15', border: 'border-fuchsia-500/30', badge: 'bg-fuchsia-600' };
    case 'retraites':
      return { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/30', badge: 'bg-amber-600' };
    case 'pouvoir_dachat':
      return { text: 'text-yellow-400', bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', badge: 'bg-yellow-600' };
    case 'services_publics':
      return { text: 'text-pink-400', bg: 'bg-pink-500/15', border: 'border-pink-500/30', badge: 'bg-pink-600' };
    case 'ecologie':
      return { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', badge: 'bg-emerald-600' };
    case 'logement':
      return { text: 'text-cyan-400', bg: 'bg-cyan-500/15', border: 'border-cyan-500/30', badge: 'bg-cyan-600' };
    case 'democratie':
      return { text: 'text-purple-300', bg: 'bg-purple-500/20', border: 'border-purple-500/40', badge: 'bg-purple-600' };
    case 'international':
      return { text: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/30', badge: 'bg-blue-600' };
    default:
      return { text: 'text-purple-300', bg: 'bg-purple-500/15', border: 'border-purple-500/30', badge: 'bg-purple-600' };
  }
}

export function renderProfileIcon(iconName: string, className = "w-4 h-4") {
  switch (iconName.toLowerCase()) {
    case 'briefcase': return <IconBriefcase className={className} />;
    case 'graduationcap': return <IconGraduationCap className={className} />;
    case 'clock': return <IconClock className={className} />;
    case 'shoppingcart': return <IconShoppingCart className={className} />;
    case 'heartpulse': return <IconHeartPulse className={className} />;
    case 'leaf': return <IconLeaf className={className} />;
    case 'home': return <IconHome className={className} />;
    case 'landmark': return <IconLandmark className={className} />;
    case 'globe': return <IconGlobe className={className} />;
    case 'sparkles':
    default:
      return <IconSparkles className={className} />;
  }
}
