import { SignInButton } from '../SignInButton'

import styles from './styles.module.scss'
import { ActiveLink } from '../ActiveLink'
import Image from 'next/image'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image src="/images/logo.svg" alt="ig.news" width={110} height={31} />

        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <span>Home</span>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <span>Posts</span>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}
