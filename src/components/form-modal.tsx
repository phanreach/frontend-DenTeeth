import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";

type FormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;

  children: ReactNode;

  submitText?: string;
  cancelText?: string;

  onSubmit?: () => void;
  loading?: boolean;
};

export default function FormModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitText = "Save",
  cancelText = "Cancel",
  onSubmit,
  loading,
}: FormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4 py-2">{children}</div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>

          <Button type="button" onClick={onSubmit} disabled={loading}>
            {loading ? "Loading..." : submitText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
