import { signIn } from 'next-auth/react'

export function SignIn() {
  return <button onClick={() => signIn('github')}>SIGNIN</button>
}
