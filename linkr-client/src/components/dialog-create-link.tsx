import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CreateLink({
  labelOnly,
  onOpenChange,
  isOpen,
}: {
  labelOnly?: boolean
  isOpen?: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (labelOnly) {
    return <span>Create Link</span>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a smart Link</DialogTitle>
            {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid gap-4 mt-2">
            <div className="grid gap-1">
              <Label htmlFor="slug" className="text-primary/95">
                Choose a slug that represents your business.*
              </Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="slug" className="text-muted-foreground">
                  linkr.co/
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  className="outline-none border-t-0 border-x-0 focus-visible:border-0 focus-visible:ring-0 p-0 rounded-none"
                  autoFocus
                  placeholder="Your unique slug"
                />
              </div>
            </div>
            <div className="grid gap-1">
              <Label htmlFor="defaultDestination" className="text-primary/95">
                Destination*
              </Label>
              <Input
                id="defaultDestination"
                name="defaultDestination"
                className="outline-none border-t-0 border-x-0 focus-visible:border-0 focus-visible:ring-0 p-0 rounded-none"
                placeholder="Default destination url"
              />
              {/* <Label htmlFor="defaultDestination" className="text-muted-foreground">You will be able to change this later</Label> */}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create Link</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
