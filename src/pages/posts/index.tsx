import Head from 'next/head'
import { GetStaticProps } from 'next'
import * as prismicHelpers from '@prismicio/helpers'
import Link from 'next/link'

import styles from './styles.module.scss'
import { getPrismicClient } from '@/services/prismic'

type Post = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts(props: PostsProps) {
  const { posts } = props

  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`posts/${post.slug}`}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  const response = await prismic.getAllByType('post', {
    fetch: ['post.title', 'post.content'],
  })
  const posts = response.map((post) => {
    const excerpt =
      post.data.content.find((content: any) => content.type === 'paragraph')
        ?.text ?? ''
    return {
      excerpt,
      slug: post.uid,
      title: prismicHelpers.asText(post.data.title),
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    }
  })

  return {
    props: {
      posts,
    },
  }
}
