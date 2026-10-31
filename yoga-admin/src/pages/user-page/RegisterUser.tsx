import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/service/auth.service";
import { adminService } from "@/service/admin.service";
import { isAxiosError } from "axios";
import { UserPlus } from "lucide-react";
import { useState, type FormEvent } from "react";

const empty = { email: "", password: "", firstName: "", lastName: "", phone_number: "", experience: "" };

const RegisterUser = ({ getUser, instructor = false }: { getUser: () => void; instructor?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState(empty);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const title = instructor ? "เพิ่มครูผู้สอน" : "เพิ่มสมาชิก";

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    if (payload.password !== confirmPassword) { setError("รหัสผ่านยืนยันไม่ตรงกัน"); return; }
    setSaving(true);
    setError("");
    try {
      if (instructor) await adminService.createInstructor(payload);
      else await authService.register({ email: payload.email.trim(), password: payload.password, role: "Student" });
      setOpen(false);
      setPayload(empty);
      setConfirmPassword("");
      getUser();
    } catch (error) {
      setError(isAxiosError(error) ? error.response?.data?.message || "บันทึกไม่สำเร็จ กรุณาลองใหม่" : "บันทึกไม่สำเร็จ กรุณาลองใหม่");
    } finally { setSaving(false); }
  };

  return <Dialog open={open} onOpenChange={(value) => { if (!saving) { setOpen(value); setError(""); } }}>
    <DialogTrigger asChild><Button variant="outline" className="cursor-pointer"><UserPlus size={18} />{title}</Button></DialogTrigger>
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>
        {instructor ? "บัญชีนี้จะเป็นครูผู้สอน สามารถเลือกสอนคลาสและแสดงในหน้าครูผู้สอนได้" : "สร้างบัญชีสำหรับสมาชิกผู้เรียน"}
      </DialogDescription></DialogHeader>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        {instructor && <>
          {([ ["firstName", "ชื่อ"], ["lastName", "นามสกุล"], ["phone_number", "เบอร์โทร (ไม่บังคับ)"] ] as const).map(([field, label]) => <div key={field} className="space-y-2">
            <Label htmlFor={`register-${field}`}>{label}</Label>
            <Input id={`register-${field}`} type={field === "phone_number" ? "tel" : "text"} required={field !== "phone_number"} maxLength={field === "phone_number" ? 30 : 100} value={payload[field]} onChange={e => setPayload({ ...payload, [field]: e.target.value })} />
          </div>)}
          <div className="space-y-2"><Label htmlFor="register-experience">ประสบการณ์สอน (ไม่บังคับ)</Label>
            <textarea id="register-experience" rows={3} maxLength={5000} className="w-full rounded-md border p-3 text-sm" value={payload.experience} onChange={e => setPayload({ ...payload, experience: e.target.value })} />
          </div>
        </>}
        <div className="space-y-2"><Label htmlFor="register-email">อีเมล</Label><Input id="register-email" type="email" autoComplete="email" required value={payload.email} onChange={e => setPayload({ ...payload, email: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor="register-password">รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</Label><Input id="register-password" type="password" autoComplete="new-password" required minLength={6} maxLength={72} value={payload.password} onChange={e => setPayload({ ...payload, password: e.target.value })} /></div>
        <div className="space-y-2"><Label htmlFor="register-confirm">ยืนยันรหัสผ่าน</Label><Input id="register-confirm" type="password" autoComplete="new-password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></div>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={saving}>{saving ? "กำลังบันทึก…" : title}</Button>
      </form>
    </DialogContent>
  </Dialog>;
};
export default RegisterUser;
