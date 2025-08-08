import type { CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { breadcrumbFullUrlField } from '@/fields/breadcrumbs'

import { createBreadcrumbsField, createParentField } from '@payloadcms/plugin-nested-docs'

import { HomeBannerBlock } from '@/blocks/HomeBannerBlock/config'

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
    fullBreadcrumbUrl: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        // Use breadcrumbUrl for nested pages, fall back to slug for home page
        const fullPath =
          typeof data?.breadcrumbUrl === 'string'
            ? data.breadcrumbUrl
            : data?.slug === 'home'
              ? '/'
              : `/${data?.slug || 'home'}`

        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : 'home',
          collection: 'pages',
          req,
          fullPath,
        })

        return path
      },
    },
    preview: (data, { req }) => {
      // Use breadcrumbUrl for nested pages, fall back to slug for home page
      const fullPath =
        typeof data?.breadcrumbUrl === 'string'
          ? data.breadcrumbUrl
          : data?.slug === 'home'
            ? '/'
            : `/${data?.slug || 'home'}`
      return generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : 'home',
        collection: 'pages',
        req,
        fullPath,
      })
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    createParentField(
      // First argument is equal to the slug of the collection
      // that the field references
      'pages',

      // Second argument is equal to field overrides that you specify,
      // which will be merged into the base parent field config
      {
        admin: {
          position: 'sidebar',
        },
        // Note: if you override the `filterOptions` of the `parent` field,
        // be sure to continue to prevent the document from referencing itself as the parent like this:
        // filterOptions: ({ id }) => ({ id: {not_equals: id }})
      },
    ),
    createBreadcrumbsField(
      // First argument is equal to the slug of the collection
      // that the field references
      'pages',

      // Argument equal to field overrides that you specify,
      // which will be merged into the base `breadcrumbs` field config
      {
        label: 'Page Breadcrumbs',
      },
    ),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [HomeBannerBlock],
      required: true,
      admin: {
        initCollapsed: true,
      },
    },
    ...slugField(),
    ...breadcrumbFullUrlField(),
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
