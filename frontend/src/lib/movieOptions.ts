export const GENRE_OPTIONS = [
  'ACTION',
  'ADVENTURE',
  'ANIMATION',
  'COMEDY',
  'CRIME',
  'DOCUMENTARY',
  'DRAMA',
  'FAMILY',
  'FANTASY',
  'HORROR',
  'MUSICAL',
  'MYSTERY',
  'ROMANCE',
  'SCI_FI',
  'SPORT',
  'THRILLER',
  'WAR',
] as const

export const LANGUAGE_OPTIONS = [
  'HINDI',
  'ENGLISH',
  'TAMIL',
  'TELUGU',
  'KANNADA',
  'MALAYALAM',
  'PUNJABI',
  'BENGALI',
  'MARATHI',
  'KOREAN',
] as const

export function enumLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join('-')
}
