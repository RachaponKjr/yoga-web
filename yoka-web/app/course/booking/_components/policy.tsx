import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, Clock, HeartPulse, Camera } from "lucide-react";
import React from "react";

const Policy = ({ setIsAgree }: { setIsAgree: (value: boolean) => void }) => {
  return (
    <Dialog>
      {/* Trigger Link */}
      <DialogTrigger className="text-emerald-600 underline hover:text-emerald-700 font-medium transition-colors text-sm">
        Terms & Booking Policy
      </DialogTrigger>

      <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-white rounded-2xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-emerald-600" />
              Terms & Conditions
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-1.5">
              Please read our booking policy carefully to ensure a smooth
              experience for everyone.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-slate-600 text-sm leading-relaxed custom-scrollbar">
          {/* Section 1: Booking & Payment */}
          <section>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs">
                1
              </span>
              Booking & Payment
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-2 marker:text-slate-300">
              <li>
                Bookings are only confirmed upon receipt of full payment and a
                booking confirmation email.
              </li>
              <li>
                All prices are inclusive of VAT and service charges (if
                applicable).
              </li>
              <li>
                Class packages and bookings are{" "}
                <strong>personal and non-transferable</strong> unless prior
                approval is granted by the studio.
              </li>
            </ul>
          </section>

          {/* Section 2: Cancellation */}
          <section className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
            <h3 className="text-base font-bold text-rose-700 mb-3 flex items-center gap-2">
              <Clock size={18} />
              Cancellation & Refund Policy
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-2 marker:text-rose-300 text-rose-800/80">
              <li>
                Free cancellation is available up to{" "}
                <strong>24 hours before</strong> the class starts. You will
                receive a full refund or credit return.
              </li>
              <li>
                Cancellations made <strong>less than 24 hours</strong> in
                advance are non-refundable (Late Cancel).
              </li>
              <li>
                Failure to attend without prior notice (No-Show) will result in
                the forfeiture of the session.
              </li>
              <li>
                <strong>Late Arrival:</strong> For safety reasons and to avoid
                disturbing the class, entry is not permitted if you arrive more
                than <strong>15 minutes late</strong>.
              </li>
            </ul>
          </section>

          {/* Section 3: Health */}
          <section>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <HeartPulse size={18} className="text-emerald-600" />
              Health & Safety
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-2 marker:text-slate-300">
              <li>
                By booking, you certify that you are in good physical health and
                capable of participating in the exercises.
              </li>
              <li>
                Please inform the instructor <strong>before class</strong> of
                any injuries, medical conditions, or pregnancy.
              </li>
              <li>
                The studio reserves the right to refuse entry if participation
                poses a risk to your health or others.
              </li>
              <li>
                We are not responsible for any loss or damage to personal
                belongings. Please keep valuables with you.
              </li>
            </ul>
          </section>

          {/* Section 4: Privacy & Media */}
          <section>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Camera size={18} className="text-emerald-600" />
              Privacy & Media Consent
            </h3>
            <p className="mb-2">
              We respect your privacy in accordance with PDPA regulations:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 marker:text-slate-300">
              <li>
                Your personal data and health history are kept confidential and
                used solely for providing services.
              </li>
              <li>
                Photography or video recording may occur for promotional
                purposes. If you prefer not to be included, please inform our
                staff upon arrival.
              </li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50/50 flex justify-end rounded-b-2xl">
          <DialogClose asChild>
            <Button
              onClick={() => setIsAgree(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 rounded-full font-semibold shadow-sm shadow-emerald-200"
            >
              I Understand & Agree
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Policy;
