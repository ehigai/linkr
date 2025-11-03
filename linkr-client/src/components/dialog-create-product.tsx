import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'

export function CreateProduct({
  labelOnly,
  onOpenChange,
  isOpen,
}: {
  labelOnly?: boolean
  isOpen?: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (labelOnly) {
    return <span>Create Product</span>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Coming soon...</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Join the waitlist to be notified when this feature is available!
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Join waitlist</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
