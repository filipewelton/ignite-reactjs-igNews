import { GetStaticProps } from 'next'
import Head from 'next/head'

import styles from '../styles/home.module.scss'
import { SubscribeButton } from '../components/SubscribeButton'
import { stripe } from '../services/stripe'
import Image from 'next/image'

interface HomeProps {
  product: {
    priceId: string
    amount: number
  }
}

export default function Home(props: HomeProps) {
  const { product } = props

  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>
            <Image 
              src="/images/clapping.png" 
              alt="Hands clapping" 
              width={0} 
              height={0}
            /> Hey, welcome
          </span>

          <h1>
            News about the <span>React</span> world.
          </h1>

          <p>
            Get access to all the publications
            <br />
            <span>for {product.amount}</span>
          </p>

          <SubscribeButton priceId={product.priceId} />
        </section>

        <Image src="/images/avatar.svg" alt="Girl programming" width={336} height={512} />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve(process.env.STRIPE_PRICE_ID!)
  const product = {
    price: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount! / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24
  }
}
