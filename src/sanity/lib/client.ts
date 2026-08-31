import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // false: every route here is dynamic and driven by the Live Content API,
  // so the CDN's cache only adds staleness — newly published content would
  // not appear for up to a minute.
  useCdn: false,
})
