import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'pages',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      })
    },
      // {
      //   type: 'tabs',
      //   tabs: [
      //     {
      //         label: 'Content',
      //       fields: [
      //         {
      //           name: 'layout',
      //           type: 'blocks',
      //           blocks: [],
      //           required: false,
      //           admin: {
      //             initCollapsed: true,
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        name: 'publishedAt',
        type: 'date',
        admin: {
          position: 'sidebar',
        },
      },
      ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
