export const getImageUrl = (path: string) => {
  return `${import.meta.env.VITE_BASE_IMAGE_URL}${path}`
}
