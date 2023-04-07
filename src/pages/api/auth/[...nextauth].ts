import GithubProvider from 'next-auth/providers/github'
import NextAuth from 'next-auth'
import { fauna } from '../../../services/fauna'
import { query as q } from 'faunadb'

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user',
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  'ref',
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user?.email!)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                'active'
              )
            ])
          )
        )

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        }
      } catch {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },
    async signIn({ user, account, profile }) {
      const { email } = user

      try {
        const matchQuery = q.Match(q.Index('user_by_email'), q.Casefold(email!))

        await fauna.query(
          q.If(
            q.Not(q.Exists(matchQuery)),
            q.Create(q.Collection('users'), { data: { email } }),
            q.Get(matchQuery)
          )
        )

        return true
      } catch {
        return false
      }
    },
  },
})
