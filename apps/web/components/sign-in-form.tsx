"use client"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { type FormEvent, useState } from "react"

import { authClient } from "@/lib/auth-client"

export function SignInForm({ redirectTo }: { redirectTo: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setPending(true)

    const form = new FormData(event.currentTarget)
    const email = String(form.get("email"))
    const password = String(form.get("password"))

    const result = await authClient.signIn.email({ email, password })

    if (result.error) {
      setError(result.error.message ?? "登录失败")
      setPending(false)
      return
    }

    window.location.assign(redirectTo)
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="space-y-2">
        <Label htmlFor="email">邮箱</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">密码</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="输入密码"
          autoComplete="current-password"
          minLength={8}
          required
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button className="w-full" type="submit" disabled={pending}>
        {pending ? "登录中…" : "登录"}
      </Button>
    </form>
  )
}
