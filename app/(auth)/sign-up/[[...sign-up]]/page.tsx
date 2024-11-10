import { SignUp } from '@clerk/nextjs'
import React from 'react'

const SignUpPage = () => {
  return (
    <SignUp fallbackRedirectUrl={"/"} forceRedirectUrl={"/"}/>
    )
}

export default SignUpPage