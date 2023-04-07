import { getPrismicClient } from '@/services/prismic'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import * as prismicHelpers from '@prismicio/helpers'
import Head from 'next/head'

import style from './post.module.scss'

interface PostProps {
  post: {
    slug: string
    title: string
    content: string
    updatedAt: string
  }
}

type Session = {
  activeSubscription: object | null
} | null

export default function Post(props: PostProps) {
  const { post } = props

  return post !== null ? (
    <>
      <Head>
        <title>{post.title + ' | ig.news'}</title>
      </Head>

      <main className={style.container}>
        <article className={style.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={style.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  ) : null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params } = context
  const slug = params!.slug!
  const session = (await getSession({ req })) as Session

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      },
    }
  }

  try {
    const prismic = getPrismicClient()
    const response = await prismic.getByUID('post', String(slug))
    const post = {
      slug,
      title: prismicHelpers.asText(response.data.title),
      content: prismicHelpers.asHTML(response.data.content),
      updatedAt: new Date(response.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    }

    return {
      props: {
        post,
      },
    }
  } catch {
    return {
      props: {
        post: null,
      },
    }
  }
}
