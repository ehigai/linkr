import { googleLogin } from '@/api/api'
import { LoginForm } from '@/components/auth/login-form'
import { useMutation } from '@tanstack/react-query'
import { GalleryVerticalEnd } from 'lucide-react'

export default function LoginPage() {
  const { mutate, isPending } = useMutation({
    mutationFn: () => googleLogin(),
    onSuccess: (data: { redirect: string }) => {
      console.log(data.redirect)
      window.location.href = data.redirect
    },
  })

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Linkr.
        </a>
        <LoginForm loginWithGoogle={mutate} isPending={isPending} />
      </div>
    </div>
  )
}
