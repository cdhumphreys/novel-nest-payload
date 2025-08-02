import { getPayload, RequiredDataFromCollectionSlug } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import React, { cache } from 'react'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import RichText from '@/components/RichText'
import { PayloadRedirects } from '@/components/PayloadRedirects'


export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  // Filter out the home page
  const params = pages.docs
    ?.filter((doc) => {
      return doc.slug !== 'home'
    })
    .map(({ slug }) => {
      return { slug }
    })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()

  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug;

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug,
  })

  if (!page) {
    return notFound()
  }
  return (
    <article className="home">
      <h1>Page</h1>
      <p>{page?.title}</p>
      <RichText data={page?.content} />
      {/* <PageClient /> */}
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}


      {/* <RenderBlocks blocks={layout} /> */}
    </article>
  )

}

// export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
//   const { slug = 'home' } = await paramsPromise
//   const page = await queryPageBySlug({
//     slug,
//   })

//   return generateMeta({ doc: page })
// }



const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})