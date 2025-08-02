import type { FieldHook } from 'payload'

import type { Page } from '@/payload-types'

const formatBreadcrumbUrl = (breadcrumbs: Page['breadcrumbs']): string => {
  if(!breadcrumbs || breadcrumbs.length === 0) return '';

  const lastBreadcrumb = breadcrumbs.slice(-1)[0];

  if(!lastBreadcrumb || !lastBreadcrumb.url) return '';

  return lastBreadcrumb.url;
}

export const formatBreacrumbUrlHook =
  (fallback: string): FieldHook =>
  ({ data, operation, value }) => {
    // console.log('data',data)
    // console.log('operation',operation)
    // console.log('value',value)

    // Value entered from the fallback field
    if (operation === 'create' || operation === 'update') {
      return formatBreadcrumbUrl(data?.breadcrumbs || [])
    }

    // if (operation === 'create' || !data?.breadcrumbUrl) {
    //   const fallbackData = data?.[fallback] || data?.[fallback]

    //   if (fallbackData && typeof fallbackData === 'string') {
    //     return formatBreadcrumbUrl(fallbackData)
    //   }
    // }

    return value
  }