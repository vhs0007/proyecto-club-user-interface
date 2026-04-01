export interface ClubBrandingColors {
  primary: string
  primaryLight: string
  primaryHover: string
  secondary: string
  dark: string
  black: string
  shadowSm: string
  shadowMd: string
  shadowLg: string
}

export const DEFAULT_CLUB_BRANDING_COLORS: ClubBrandingColors = {
  primary: '#06b6d4',
  primaryLight: '#a5f3fc',
  primaryHover: '#0e7490',
  secondary: '#000000',
  dark: '#000000',
  black: '#000000',
  shadowSm: '0 2px 4px rgba(0, 0, 0, 0.12)',
  shadowMd: '0 4px 6px rgba(0, 0, 0, 0.18)',
  shadowLg: '0 10px 25px rgba(0, 0, 0, 0.22)',
}

const CSS_VAR_MAP: Record<keyof ClubBrandingColors, string> = {
  primary: '--club-primary',
  primaryLight: '--club-primary-light',
  primaryHover: '--club-primary-hover',
  secondary: '--club-secondary',
  dark: '--club-dark',
  black: '--club-black',
  shadowSm: '--shadow-sm',
  shadowMd: '--shadow-md',
  shadowLg: '--shadow-lg',
}

export function applyClubBrandingToRoot(colors: ClubBrandingColors): void {
  const root = document.documentElement
  for (const key of Object.keys(CSS_VAR_MAP) as (keyof ClubBrandingColors)[]) {
    const value = colors[key]
    if (value != null && value !== '') {
      root.style.setProperty(CSS_VAR_MAP[key], value)
    }
  }
}

export function mergeClubBranding(
  base: ClubBrandingColors,
  partial: Partial<ClubBrandingColors>,
): ClubBrandingColors {
  return { ...base, ...partial }
}
