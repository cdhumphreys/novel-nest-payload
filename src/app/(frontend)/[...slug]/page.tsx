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
      breadcrumbUrl: true,
    },
  })

  // Generate proper slug arrays for all pages including home
  const params = pages.docs
    ?.map(({ slug, breadcrumbUrl }) => {
      if (slug === 'home') {
        // Home page gets empty slug array
        return { slug: [] };
      }
      
      if (!breadcrumbUrl) return null;
      
      // Remove leading slash and split into slug array
      const slugPath = breadcrumbUrl.startsWith('/') 
        ? breadcrumbUrl.slice(1) 
        : breadcrumbUrl;
      
      const slugArray = slugPath.split('/').filter(Boolean);
      
      return { slug: slugArray };
    })
    .filter(Boolean); // Remove null entries
    
  return params
}

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()

  const params = await paramsPromise
  const { slug = [] } = params;
  
  // Handle home page (empty slug array) vs other pages
  const breadcrumbUrl = slug.length === 0 ? '/' : '/' + slug.join('/');


  let page: RequiredDataFromCollectionSlug<'pages'> | null

  // Query by breadcrumbUrl for exact matching
  page = await queryPageByBreadcrumbUrl({
    breadcrumbUrl: breadcrumbUrl,
  })

  if (!page) {
    return notFound()
  }

  // Use the breadcrumbUrl for the URL
  const url = breadcrumbUrl;
  
  return (
    <article className="home">
      <h1>Page</h1>
      <p>{page?.title}</p>
      <RichText data={page?.content} />
      {/* <PageClient /> */}
      {/* Allows redirects for valid pages too */}
      {/* <PayloadRedirects disableNotFound url={url} /> */}

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
    select: {
      title: true,
      slug: true,
      content: true,
      breadcrumbUrl: true,
    },
  })

  return result.docs?.[0] || null
})

const queryPageByBreadcrumbUrl = cache(async ({ breadcrumbUrl }: { breadcrumbUrl: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config })


  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      breadcrumbUrl: {
        equals: breadcrumbUrl,
      },
    },
    select: {
      title: true,
      slug: true,
      content: true,
      breadcrumbUrl: true,
    },
  })

  return result.docs?.[0] || null
})