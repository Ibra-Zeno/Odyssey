/* import { signIn } from "next-auth/react";
import React from "react";

const CustomSignIn: React.FC = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
      <button onClick={() => signIn("credentials", { demoLogin: "Demo" })}>
        Demo Login
      </button>
    </div>
  );
};

export default CustomSignIn; */
/* 
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { signIn, getProviders } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { options } from "../api/auth/[...nextauth]";

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/yourRedirectPath`,
              })
            }
          >
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, options);

  // If the user is already logged in, redirect.
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
} */
