import type { TextField } from 'payload'

import { formatBreacrumbUrlHook } from './addBreadcrumbUrl'

export const breadcrumbsField = () => {

  const breadcrumbUrlField: TextField = {
    name: 'breadcrumbUrl',
    type: 'text',
    label: 'Breadcrumb URL',
    index: true,
    hooks: {
      beforeChange: [formatBreacrumbUrlHook('breadcrumbs')],
    },
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
  }

  return [breadcrumbUrlField]
}