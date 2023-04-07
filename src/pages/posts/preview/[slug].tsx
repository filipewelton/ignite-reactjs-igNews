import { getPrismicClient } from '@/services/prismic'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import * as prismicHelpers from '@prismicio/helpers'
import Head from 'next/head'

import styles from '../post.module.scss'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'

interface PostPreviewProps {
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

export default function PostPreview(props: PostPreviewProps) {
  const { post } = props
  const session = useSession().data as Session
  const router = useRouter()

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [post?.slug, router, session])

  return post !== null ? (
    <>
      <Head>
        <title>{post.title + ' | ig.news'}</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              Subscription now!
              <Image src="/images/happy.png" alt="Hands clapping" width={0} height={0} />
            </Link>
          </div>
        </article>
      </main>
    </>
  ) : null
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context
  const slug = params!.slug!

  try {
    const prismic = getPrismicClient()
    const response = await prismic.getByUID('post', String(slug))
    const post =
      {
        slug,
        title: prismicHelpers.asText(response.data.title),
        content: prismicHelpers.asHTML(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString(
          'pt-BR',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }
        ),
      } ?? null

    return {
      props: {
        post,
      },
      revalidate: 60 * 30,
    }
  } catch {
    return {
      props: {
        post: null,
      },
    }
  }
}
