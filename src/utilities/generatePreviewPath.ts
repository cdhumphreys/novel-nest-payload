import { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
  fullPath?: string // Optional full path for nested pages
}

export const generatePreviewPath = ({ collection, slug, fullPath }: Props) => {
  // Use fullPath if provided, otherwise construct from slug
  const path = fullPath || `${collectionPrefixMap[collection]}/${slug}`
  
  const encodedParams = new URLSearchParams({
    slug,
    collection,
    path,
    previewSecret: process.env.PREVIEW_SECRET || '',
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}