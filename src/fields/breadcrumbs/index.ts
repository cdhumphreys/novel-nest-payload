import type { TextField } from 'payload'

import { formatBreadcrumbUrlHook } from './addBreadcrumbUrl'

export const breadcrumbFullUrlField = () => {

  const breadcrumbUrlField: TextField = {
    name: 'breadcrumbUrl',
    type: 'text',
    label: 'Breadcrumb URL',
    index: true,
    hooks: {
      beforeChange: [formatBreadcrumbUrlHook('breadcrumbs')],
    },
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
  }

  return [breadcrumbUrlField]
}