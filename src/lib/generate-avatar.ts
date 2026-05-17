import { stringify } from 'qs'

type TAvatarGenOptions = {
  name: string
  background?: string
  color?: string
  length?: number
  bold?: boolean
  format?: 'svg' | 'png'
}

export default function generateAvatar({
  background = '#525252',
  color = '#fafafa',
  length = 1,
  bold = true,
  format = 'svg',
  name,
}: TAvatarGenOptions) {
  const BASE_AVATAR_URL = 'https://api.dicebear.com'
  const avatarURL = new URL('/9.x/initials/svg', BASE_AVATAR_URL)

  avatarURL.search = stringify(
    {
      background,
      color,
      length,
      bold,
      format,
      seed: name,
    },
    { addQueryPrefix: true }
  )

  return avatarURL.toString()
}
