import Link from "next/link"

import { AuthLayout } from "@/components/auth-layout"
import { SignInForm } from "@/components/sign-in-form"
import { SocialLogin } from "@/components/social-login"

function safeRedirect(value: string | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/"
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect } = await searchParams

  return (
    <AuthLayout>
      <article className="space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">登录 Sweet Kit</h1>
          <p className="text-sm text-muted-foreground">选择登录方式继续</p>
        </header>

        <SocialLogin />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        <SignInForm redirectTo={safeRedirect(redirect)} />

        <footer className="text-center text-sm text-muted-foreground">
          没有账号？{" "}
          <Link className="font-medium text-foreground hover:underline" href="/sign-up">
            创建账号
          </Link>
        </footer>
      </article>
    </AuthLayout>
  )
}
