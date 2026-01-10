import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DialogAddBooking = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <button className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-indigo-600! text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
          + เพิ่มการจอง
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มการจอง</DialogTitle>
          <DialogDescription>เพิ่มการจองใหม่</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddBooking;
