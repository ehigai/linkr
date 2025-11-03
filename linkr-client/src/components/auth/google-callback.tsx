import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { googleCallback } from "@/api/api"

const GoogleCallback = () => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get("code") || ""
  const state = params.get("state") ||""

  const { mutate, isPending } = useMutation({
    mutationFn: () => googleCallback(code, state),
    onSuccess: () => {
      // Redirect to home on success
      window.location.href = "/"
    },
    onError: (error) => {
        // Do something to handle error
      console.error("Google callback error", error)
    },
  })

  useEffect(() => {
    if (code) mutate()
  }, [code, mutate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isPending ? <p>Signing you in...</p> : <p>Processing...</p>}
    </div>
  )
}

export default GoogleCallback
