import * as prismic from '@prismicio/client'

export function getPrismicClient() {
  const repositoryName = 'ignews2304'
  const endpoint = prismic.getRepositoryEndpoint(repositoryName)
  const client = prismic.createClient(endpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN!,
  })

  return client
}
