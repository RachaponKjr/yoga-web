import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/service/auth.service";
import { UserPlus } from "lucide-react";
import React from "react";

const RegisterUser = ({ getUser }: { getUser: () => void }) => {
  const [open, setOpen] = React.useState(false);
  const [payload, setPayload] = React.useState({
    email: "",
    password: "",
    role: "",
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayload({ ...payload, email: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayload({ ...payload, password: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await authService.register(payload);
    } catch (error) {
      console.log(error);
    } finally {
      getUser();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          <UserPlus size={18} /> เพิ่มผู้ใช้ใหม่
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เพิ่มผู้ใช้ใหม่</DialogTitle>
          <DialogDescription>
            กรอกข้อมูลส่วนตัวและกำหนดสิทธิ์เพื่อสร้างบัญชีใหม่
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Email</Label>
            <Input id="name" type="text" onChange={handleEmailChange} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Password</Label>
            <Input id="name" type="text" onChange={handlePasswordChange} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Confirm Password</Label>
            <Select
              value={payload.role}
              onValueChange={(value) => setPayload({ ...payload, role: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Instructor">Instructor</SelectItem>
                <SelectItem value="Student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            variant="outline"
            size={"lg"}
            className="w-full cursor-pointer hover:bg-[#262626]! hover:text-white! duration-300"
          >
            เพิ่มผู้ใช้
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterUser;
