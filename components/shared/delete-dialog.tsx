"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";

const DeleteDialog = ({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
}) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelte = () => {
    startTransition(async () => {
      const res = await action(id);

      console.log("deleted from handle delete");
      if (!res.success) {
        toast.error(res.message);
      } else {
        setOpen(false);
        toast.success(res.message);
      }
    });
  };

  //toast.error(res.message, { duration: 3000, className: 'bg-red-600'})

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" className="ml-2">
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogTitle>Do you want to delete?</AlertDialogTitle>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button onClick={handleDelte} className="bg-red-500" size="sm">
              {isPending ? "Deleting..." : "Continue"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
