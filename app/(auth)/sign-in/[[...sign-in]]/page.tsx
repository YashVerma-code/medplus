import { SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (
    <SignIn fallbackRedirectUrl={"/"} forceRedirectUrl={"/"}/>
    )
}

export default SignInPage