import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { SidebarMenuButton } from './ui/sidebar'
import { IconCirclePlusFilled } from '@tabler/icons-react'
import { Card, CardHeader } from './ui/card'
import { CreateLink } from './dialog-create-link'
import { CreateProduct } from './dialog-create-product'

export function CreateDialog() {
  // Main dialog state
  const [open, setOpen] = useState(false)
  // Sub-dialog states
  const [openLink, setOpenLink] = useState(false)
  const [openProduct, setOpenProduct] = useState(false)

  return (
    <>
      {/* MAIN DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <SidebarMenuButton
            tooltip="Quick Create"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <IconCirclePlusFilled />
            <span>Quick Create</span>
          </SidebarMenuButton>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>What are we creating today?</DialogTitle>
          </DialogHeader>

          <div className="flex items-center justify-between gap-2">
            <Card
              onClick={() => {
                setOpen(false)
                setOpenLink(true)
              }}
              className="flex-1 hover:cursor-pointer hover:bg-muted hover:text-muted-foreground"
            >
              <CardHeader>
                <CreateLink labelOnly onOpenChange={setOpenLink} />
              </CardHeader>
            </Card>

            <Card
              onClick={() => {
                setOpen(false)
                setOpenProduct(true)
              }}
              className="flex-1 hover:cursor-pointer hover:bg-muted hover:text-muted-foreground"
            >
              <CardHeader>
                <CreateProduct labelOnly onOpenChange={setOpenProduct} />
              </CardHeader>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREATE LINK DIALOG */}
      <CreateLink isOpen={openLink} onOpenChange={setOpenLink} />

      {/* CREATE PRODUCT DIALOG */}
      <CreateProduct isOpen={openProduct} onOpenChange={setOpenProduct} />
    </>
  )
}
