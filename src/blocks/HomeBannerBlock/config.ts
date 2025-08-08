import type { Block } from 'payload'

export const HomeBannerBlock: Block = {
  slug: 'homeBannerBlock', // Unique identifier for the block
  interfaceName: 'HomeBannerBlock', // TypeScript interface name
  fields: [
    // Define your block fields here
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      // ... field configuration
    },
  ],
  labels: {
    singular: 'Home Banner Block',
    plural: 'Home Banner Blocks',
  },
}
