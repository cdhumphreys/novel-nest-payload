// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Books } from './collections/Books'
import { Genres } from './collections/Genres'
import { Authors } from './collections/Authors'
import { Pages } from './collections/Pages'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      url: ({
        data,
      
      }) => {
        // NOTE: Ensure the PREVIEW_SECRET is set with a value in the environment variables
        return `${data.slug !== 'home' ? `/${data.slug}` : ''}`
      },
      breakpoints: [
        {
          name: 'mobile',
          height: 667,
          label: 'Mobile',
          width: 375
        },
        {
          name: 'tablet',
          height: 1024,
          label: 'Tablet',
          width: 768
        },
        {
          name: 'desktop',
          height: 1080,
          label: 'Desktop',
          width: 1920
        }
      ],
      collections: ['pages'],
    },
  },
  collections: [Users, Media, Books, Genres, Authors, Pages],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || '',
    },
  }),
  cors: [getServerSideURL()].filter(Boolean),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
