import type { CollectionConfig } from 'payload'

export const Books: CollectionConfig = {
  slug: 'books',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
      {
        name: 'image',
        type: 'upload',
        required: true,
        relationTo: 'media',
      },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'genres',
      type: 'relationship',
      relationTo: 'genres',
      hasMany: true,
    },
  ]
}
