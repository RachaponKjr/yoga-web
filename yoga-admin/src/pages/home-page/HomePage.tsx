import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  Users,
  Wallet,
  BookOpen,
  RefreshCw,
  Clock3,
  Globe2,
  Clapperboard,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminService } from "@/service/admin.service";
import { useAuthStore } from "@/stores/useAuthStore";
import type { BookingType } from "@/types/booking.type";
import type { Round } from "@/types/round.type";
import type { UserType } from "@/types/auth.type";

interface Stats {
  users: { total: number };
  bookings: { total: number };
  classes: { today: number };
  revenue: {
    total: number;
    thisMonth: number;
    monthly: { month: string; total_revenue: number }[];
  };
}
interface StudioRound extends Round {
  teacher?: UserType;
  subTeacher?: UserType;
}
interface Country {
  country: string;
  count: number;
}
const number = (value: number | undefined) =>
  value === undefined ? "—" : Number(value).toLocaleString("th-TH");
const date = (value: string | Date, options: Intl.DateTimeFormatOptions) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleString("th-TH", { timeZone: "Asia/Bangkok", ...options });
};
const dayKey = (value: string | Date) =>
  new Date(value).toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" });
function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="dash-empty">
      <CalendarDays size={27} strokeWidth={1.2} />
      <p>{children}</p>
    </div>
  );
}
function SectionTitle({
  eyebrow,
  title,
  to,
}: {
  eyebrow: string;
  title: string;
  to: string;
}) {
  return (
    <div className="dash-section-title">
      <div>
        <span className="dash-eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      <Link to={to}>
        ดูทั้งหมด <ArrowUpRight size={17} />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<Stats>();
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [rounds, setRounds] = useState<StudioRound[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const [updated, setUpdated] = useState<Date>();
  const [now] = useState(() => new Date());
  const [period, setPeriod] = useState<"today" | "upcoming">("today");
  useEffect(() => {
    let active = true;
    Promise.allSettled([
      adminService.getDashboardStatus(),
      adminService.getBookingLast(),
      adminService.getRoundsAll(),
      adminService.getMonitorCountryStats(),
    ]).then((results) => {
      if (!active) return;
      const labels = ["ภาพรวม", "การจองล่าสุด", "รอบเรียน", "ประเทศของสมาชิก"];
      const failed: string[] = [];
      results.forEach((result, index) => {
        if (result.status === "rejected") failed.push(labels[index]);
      });
      if (results[0].status === "fulfilled") setStats(results[0].value.data);
      if (results[1].status === "fulfilled")
        setBookings(results[1].value.data || []);
      if (results[2].status === "fulfilled")
        setRounds(results[2].value.data || []);
      if (results[3].status === "fulfilled")
        setCountries(results[3].value.data || []);
      setErrors(failed);
      setLoading(false);
      setUpdated(new Date());
    });
    return () => {
      active = false;
    };
  }, [revision]);
  const today = dayKey(updated || now);
  const visibleRounds = rounds
    .filter((round) =>
      period === "today"
        ? dayKey(round.startDateTime) === today
        : new Date(round.startDateTime).getTime() >= (updated || now).getTime(),
    )
    .sort(
      (a, b) =>
        new Date(a.startDateTime).getTime() -
        new Date(b.startDateTime).getTime(),
    )
    .slice(0, 5);
  const cards = [
    {
      label: "รายได้เดือนนี้",
      value: stats ? `฿${number(stats.revenue.thisMonth)}` : "—",
      note: "จากรายการที่ชำระแล้ว",
      icon: Wallet,
      to: "/bookings",
      accent: true,
    },
    {
      label: "การจองทั้งหมด",
      value: number(stats?.bookings.total),
      note: "รายการสะสมของสตูดิโอ",
      icon: CalendarDays,
      to: "/bookings",
    },
    {
      label: "รอบเรียนวันนี้",
      value: number(stats?.classes.today),
      note: "ตามข้อมูลรอบเรียนของระบบ",
      icon: BookOpen,
      to: "/classes",
    },
    {
      label: "บัญชีสมาชิกทั้งหมด",
      value: number(stats?.users.total),
      note: "บัญชีทุกบทบาทในระบบ",
      icon: Users,
      to: "/users",
    },
  ];
  const countryTotal = countries.reduce(
    (sum, item) => sum + Number(item.count),
    0,
  );
  return (
    <div className="dashboard">
      <section className="dash-heading">
        <div>
          <span className="dash-eyebrow">YOUR STUDIO, AT A GLANCE</span>
          <h1>
            สวัสดี
            {user?.userInfo?.firstName
              ? `, ${user.userInfo.firstName}`
              : "ครับ"}{" "}
            <span className="dash-greeting-dot" />
          </h1>
          <p>เริ่มต้นวันดี ๆ ด้วยภาพรวมของสตูดิโอคุณ</p>
        </div>
        <div className="dash-heading-actions">
          <span className="dash-date">
            <CalendarDays size={16} />
            {date(updated || now, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            className="dash-icon-button"
            title="รีเฟรชข้อมูล"
            aria-label="รีเฟรชข้อมูล"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              setRevision((value) => value + 1);
            }}
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </section>
      {errors.length > 0 && (
        <div role="alert" className="dash-error">
          <AlertCircle size={19} />
          <span>
            โหลดข้อมูล {errors.join(", ")} ไม่สำเร็จ{" "}
            {stats
              ? "บางส่วนอาจเป็นข้อมูลจากครั้งก่อน"
              : "กรุณาลองรีเฟรชอีกครั้ง"}
          </span>
        </div>
      )}
      <section
        aria-label="สรุปภาพรวม"
        className="dash-stats"
        aria-busy={loading}
      >
        {cards.map((card) => (
          <Link
            to={card.to}
            key={card.label}
            className={`dash-stat ${card.accent ? "dash-stat-featured" : ""}`}
          >
            <div className="dash-stat-top">
              <span>{card.label}</span>
              <card.icon size={20} strokeWidth={1.5} />
            </div>
            <strong>
              {loading ? <span className="dash-skeleton" /> : card.value}
            </strong>
            <div className="dash-stat-bottom">
              <span>{card.note}</span>
              <ArrowUpRight size={16} />
            </div>
          </Link>
        ))}
      </section>
      <section className="dash-quick">
        <div>
          <span className="dash-eyebrow">QUICK ACTIONS</span>
          <h2>งานที่ใช้บ่อย</h2>
        </div>
        {[
          { to: "/bookings", label: "จัดการการจอง", icon: CalendarDays },
          { to: "/classes", label: "จัดการคลาสเรียน", icon: BookOpen },
          { to: "/video", label: "อัปเดตตารางเรียน", icon: Clapperboard },
        ].map((item) => (
          <Link key={item.to} to={item.to}>
            <span>
              <item.icon size={19} />
              {item.label}
            </span>
            <ArrowRight size={17} />
          </Link>
        ))}
      </section>
      <div className="dash-main-grid">
        <section className="dash-panel">
          <SectionTitle
            eyebrow="CLASS SCHEDULE"
            title="รอบเรียนของสตูดิโอ"
            to="/classes"
          />
          <div className="dash-tabs" role="group" aria-label="ช่วงเวลารอบเรียน">
            <button
              aria-pressed={period === "today"}
              onClick={() => setPeriod("today")}
              className={period === "today" ? "selected" : ""}
            >
              วันนี้
            </button>
            <button
              aria-pressed={period === "upcoming"}
              onClick={() => setPeriod("upcoming")}
              className={period === "upcoming" ? "selected" : ""}
            >
              กำลังจะมาถึง
            </button>
            <span>
              <Clock3 size={13} />
              เวลาประเทศไทย
            </span>
          </div>
          {loading ? (
            <Empty>กำลังโหลดรอบเรียน…</Empty>
          ) : errors.includes("รอบเรียน") ? (
            <Empty>โหลดรอบเรียนไม่สำเร็จ กรุณารีเฟรช</Empty>
          ) : !visibleRounds.length ? (
            <Empty>
              {period === "today"
                ? "วันนี้ยังไม่มีรอบเรียน"
                : "ยังไม่มีรอบเรียนที่กำลังจะมาถึง"}
            </Empty>
          ) : (
            <div className="dash-rounds">
              {visibleRounds.map((round, index) => {
                const teacher = round.subTeacherId
                  ? round.subTeacher
                  : round.teacher;
                const occupied =
                  Number(round.current_online || 0) +
                  Number(round.current_walk_in || 0);
                const capacity =
                  Number(round.max_online || 0) +
                  Number(round.max_walk_in || 0);
                return (
                  <div className="dash-round" key={round.id || index}>
                    <div className="dash-round-time">
                      <strong>
                        {date(round.startDateTime, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </strong>
                      <span>
                        {date(round.startDateTime, {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="dash-round-info">
                      <h3>{round.course?.title || "คลาสโยคะ"}</h3>
                      <p>
                        {teacher?.userInfo?.firstName || "ยังไม่ระบุผู้สอน"} ·
                        ถึง{" "}
                        {date(round.endDateTime, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <small>
                        ออนไลน์ {round.current_online || 0}/
                        {round.max_online || 0} · ที่สตูดิโอ{" "}
                        {round.current_walk_in || 0}/{round.max_walk_in || 0}
                      </small>
                    </div>
                    <div className="dash-capacity">
                      <span
                        className={`dash-badge ${round.status === "Open" ? "is-green" : "is-neutral"}`}
                      >
                        {{
                          Open: "เปิดจอง",
                          Full: "เต็ม",
                          Closed: "ปิดจอง",
                          Finished: "จบแล้ว",
                          Draft: "ฉบับร่าง",
                        }[round.status || ""] ||
                          round.status ||
                          "—"}
                      </span>
                      <small>
                        {occupied}/{capacity} ที่นั่ง
                      </small>
                      <progress
                        value={occupied}
                        max={capacity || 1}
                        aria-label={`ที่นั่ง ${round.course?.title}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Link to="/classes" className="dash-panel-footer">
            จัดการคลาสและรอบเรียน <ArrowRight size={16} />
          </Link>
        </section>
        <section className="dash-panel">
          <SectionTitle
            eyebrow="RECENT BOOKINGS"
            title="การจองล่าสุด"
            to="/bookings"
          />
          {loading ? (
            <Empty>กำลังโหลดการจอง…</Empty>
          ) : errors.includes("การจองล่าสุด") ? (
            <Empty>โหลดการจองไม่สำเร็จ กรุณารีเฟรช</Empty>
          ) : !bookings.length ? (
            <Empty>ยังไม่มีรายการจอง</Empty>
          ) : (
            <div className="dash-bookings">
              {bookings.slice(0, 5).map((item) => (
                <div className="dash-booking" key={item.id}>
                  <span className="dash-person">
                    {(item.student?.userInfo?.firstName || "ส").slice(0, 1)}
                  </span>
                  <div>
                    <strong>
                      {[
                        item.student?.userInfo?.firstName,
                        item.student?.userInfo?.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ") || "สมาชิก"}
                    </strong>
                    <p>{item.round?.course?.title || "คลาสโยคะ"}</p>
                    <small>
                      {date(item.createdAt, {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                  <span
                    className={`dash-badge ${item.status === "PAID" ? "is-green" : item.status === "PENDING" ? "is-amber" : "is-neutral"}`}
                  >
                    {{
                      PAID: "ชำระแล้ว",
                      PENDING: "รอชำระ",
                      CANCELLED: "ยกเลิก",
                      FAILED: "ไม่สำเร็จ",
                    }[item.status] || item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link to="/bookings" className="dash-panel-footer">
            ดูรายการจองทั้งหมด <ArrowRight size={16} />
          </Link>
        </section>
      </div>
      <section className="dash-panel">
        <SectionTitle
          eyebrow="OUR COMMUNITY"
          title="สมาชิกจากทั่วโลก"
          to="/users"
        />
        {loading ? (
          <Empty>กำลังโหลดข้อมูลสมาชิก…</Empty>
        ) : errors.includes("ประเทศของสมาชิก") ? (
          <Empty>โหลดประเทศของสมาชิกไม่สำเร็จ กรุณารีเฟรช</Empty>
        ) : !countries.length ? (
          <Empty>ยังไม่มีข้อมูลประเทศของสมาชิก</Empty>
        ) : (
          <div className="dash-countries">
            {[...countries]
              .sort((a, b) => b.count - a.count)
              .slice(0, 8)
              .map((item) => (
                <div key={item.country}>
                  <div className="dash-country-label">
                    <span>
                      <Globe2 size={16} />
                      {item.country || "ไม่ระบุประเทศ"}
                    </span>
                    <strong>
                      {number(item.count)} <small>คน</small>
                    </strong>
                  </div>
                  <progress
                    value={Number(item.count)}
                    max={countryTotal || 1}
                    aria-label={`สัดส่วนสมาชิก ${item.country}`}
                  />
                  <small>
                    {countryTotal
                      ? ((Number(item.count) / countryTotal) * 100).toFixed(1)
                      : 0}
                    % ของข้อมูลประเทศที่ได้รับ
                  </small>
                </div>
              ))}
          </div>
        )}
      </section>
      <p className="dash-updated" role="status">
        {loading
          ? "กำลังอัปเดตข้อมูล…"
          : `ตรวจสอบข้อมูลล่าสุด ${updated ? date(updated, { hour: "2-digit", minute: "2-digit" }) : "—"} น.${errors.length ? " · บางส่วนโหลดไม่สำเร็จ" : ""}`}
      </p>
    </div>
  );
}
