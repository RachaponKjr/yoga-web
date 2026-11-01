"use client";

import { imageUrl } from "@/lib/image-url";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  Clock3,
  Users,
  Leaf,
  Maximize2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { isSameDay } from "date-fns";
import { CourseProps } from "../page";
import { formatRoundEnglish, formatRoundTime } from "@/utils/format";
import CourseCalendar from "@/components/CourseCalendar";
import { useBooking } from "@/store/useBooking";
import styles from "./course-detail.module.css";



export default function CourseDetailPage({
  course,
  date,
}: {
  course: CourseProps;
  date: Date | string;
}) {
  const [selectRound, setSelectRound] = useState(() => {
    const matching =
      date &&
      course.rounds.find((round) =>
        isSameDay(new Date(round.startDateTime), new Date(date)),
      );
    return (
      matching ||
      course.rounds.find(
        (round) => new Date(round.startDateTime) > new Date(),
      ) ||
      course.rounds[0]
    );
  });
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const { setBooking } = useBooking();
  const selectedDate = useMemo(
    () => (selectRound ? new Date(selectRound.startDateTime) : undefined),
    [selectRound],
  );
  const hasDiscount =
    course.discount_price > 0 && course.discount_price < course.price;
  const displayPrice = hasDiscount ? course.discount_price : course.price;
  const discount = hasDiscount
    ? Math.round((1 - course.discount_price / course.price) * 100)
    : 0;
  const seats = selectRound
    ? Math.max(0, selectRound.max_online - selectRound.current_online)
    : 0;
  const canBook =
    !!selectRound &&
    seats > 0 &&
    new Date(selectRound.startDateTime) > new Date();
  const labels = selectRound
    ? formatRoundEnglish(selectRound.startDateTime, selectRound.endDateTime)
    : null;
  const teacher = course.teacher?.userInfo;
  const teacherName =
    [teacher?.firstName, teacher?.lastName].filter(Boolean).join(" ") ||
    "Yoga By Niti";
  const sameDayRounds = selectedDate
    ? course.rounds.filter((round) =>
        isSameDay(new Date(round.startDateTime), selectedDate),
      )
    : [];
  const photos = [
    ...new Set([course.cover_image, ...(course.images || [])].filter(Boolean)),
  ];

  const handleBooking = () => {
    if (!canBook) return;
    setBooking({
      ...selectRound,
      quantity: 1,
      title: course.title,
      price: course.price,
      discount_price: course.discount_price,
      cover_image: course.cover_image,
    });
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">
            <ArrowLeft size={14} /> หน้าหลัก
          </Link>
          <span>/</span>
          <span>คอร์สโยคะ</span>
        </nav>
        <header className={`${styles.header} py-8! items-end!`}>
          <div>
            <p className={styles.eyebrow}>
              <span /> THE YOGA COLLECTION
            </p>
            <h1 className="my-0!">{course.title}</h1>
          </div>
          <div className={styles.signature}>
            <Leaf size={25} strokeWidth={1} />
            <span>
              Mindful movement.
              {/* <br /> */}
              Meaningful moments.
            </span>
          </div>
        </header>

        <div className={styles.layout}>
          <div className={styles.content}>
            <div className={styles.gallery}>
              <button
                className={styles.cover}
                onClick={() => setSelectedImg(course.cover_image)}
                aria-label={`ดูภาพ ${course.title} ขนาดเต็ม`}
              >
                <Image
                  src={imageUrl(course.cover_image)}
                  alt={course.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
                <span className={styles.imageLabel}>
                  <Leaf size={14} /> YOGA BY NITI
                </span>
                <span className={styles.zoom}>
                  <Maximize2 size={16} />
                </span>
              </button>
              {photos.length > 1 && (
                <div className={styles.thumbnails}>
                  {photos.map((photo, index) => (
                    <button
                      key={photo}
                      onClick={() => setSelectedImg(photo)}
                      aria-label={`ดูภาพคอร์สที่ ${index + 1}`}
                    >
                      <Image
                        src={imageUrl(photo)}
                        alt={`${course.title} ภาพที่ ${index + 1}`}
                        fill
                        sizes="100px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.principles}>
              <span>
                01 <span>Move with intention</span>
              </span>
              <span>
                02 <span>Breathe & reconnect</span>
              </span>
              <Leaf size={19} strokeWidth={1} />
            </div>
            <section className={styles.about}>
              <p className={styles.eyebrow}>THE EXPERIENCE</p>
              <h2>เกี่ยวกับคอร์สนี้</h2>
              <p className={styles.description}>
                {course.about ||
                  course.description ||
                  "รายละเอียดคอร์สจะอัปเดตเร็ว ๆ นี้"}
              </p>
            </section>
            <section className={styles.instructor}>
              <p className={styles.eyebrow}>YOUR GUIDE</p>
              <div className={styles.teacherRow}>
                <Avatar className="size-20 shrink-0">
                  <AvatarImage
                    src={teacher?.avatar ? imageUrl(teacher.avatar) : undefined}
                    alt={teacherName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-[#e5e7dc] text-[#454d39] text-2xl">
                    {teacherName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className={styles.muted}>ผู้สอนของคุณ</span>
                  <h2>{teacherName}</h2>
                </div>
                <Link
                  href="/instructors"
                  className={styles.profileLink}
                  aria-label="ดูข้อมูลผู้สอน"
                >
                  <ArrowUpRight size={22} />
                </Link>
              </div>
              {teacher?.experience && (
                <p className={styles.description}>{teacher.experience}</p>
              )}
            </section>
          </div>

          <aside className={styles.sidebar} aria-label="จองคอร์สเรียน">
            <div className={styles.booking}>
              <div className={styles.bookingHeading}>
                <p className={styles.eyebrow}>YOUR NEXT MOMENT</p>
                <Leaf size={20} strokeWidth={1} />
              </div>
              <h2>เริ่มต้นเวลาของคุณ</h2>
              <div className={styles.priceRow}>
                <strong>฿{displayPrice.toLocaleString()}</strong>
                <span>/ ท่าน</span>
                {hasDiscount && (
                  <span className={styles.discount}>ประหยัด {discount}%</span>
                )}
              </div>
              {hasDiscount && (
                <p className={styles.originalPrice}>
                  จากปกติ <s>฿{course.price.toLocaleString()}</s>
                </p>
              )}
              <div className={styles.divider} />
              <div className={styles.sectionHeading}>
                <h3>เลือกวันเรียน</h3>
                <span>01 — SELECT DATE</span>
              </div>
              {course.rounds.length > 0 ? (
                <div className={styles.calendar}>
                  <CourseCalendar
                    rounds={course.rounds}
                    selectedDate={selectedDate}
                    onDateSelect={(_, rounds) => {
                      if (rounds.length) setSelectRound(rounds[0]);
                    }}
                  />
                </div>
              ) : (
                <p className={styles.empty}>ยังไม่มีรอบเรียนในขณะนี้</p>
              )}
              {sameDayRounds.length > 1 && (
                <div className={styles.rounds} aria-label="เลือกรอบเวลา">
                  {sameDayRounds.map((round) => (
                    <button
                      key={round.id}
                      aria-pressed={round.id === selectRound?.id}
                      onClick={() => setSelectRound(round)}
                    >
                      {formatRoundTime(round.startDateTime, round.endDateTime)}
                    </button>
                  ))}
                </div>
              )}
              {labels && (
                <div className={styles.details}>
                  <div>
                    <CalendarDays size={17} />
                    <span>วันที่เรียน</span>
                    <strong>{labels.dateLabel}</strong>
                  </div>
                  <div>
                    <Clock3 size={17} />
                    <span>เวลา</span>
                    <strong>{labels.timeLabel} น.</strong>
                  </div>
                  <div>
                    <Users size={17} />
                    <span>ที่ว่าง</span>
                    <strong className={styles.availability}>
                      {seats > 0 ? `${seats} ที่นั่ง` : "เต็มแล้ว"}
                    </strong>
                  </div>
                </div>
              )}
              {(selectRound?.description || selectRound?.about) && (
                <details className={styles.notes}>
                  <summary>รายละเอียดรอบเรียน</summary>
                  {selectRound.description && <p>{selectRound.description}</p>}
                  {selectRound.about && <p>{selectRound.about}</p>}
                </details>
              )}
              {canBook ? (
                <Link
                  href={`/course/booking?roundId=${selectRound.id}`}
                  onClick={handleBooking}
                  className={styles.bookButton}
                >
                  จองคลาสนี้ <ArrowRight size={19} />
                </Link>
              ) : (
                <button className={styles.bookButton} disabled>
                  {!selectRound
                    ? "ยังไม่เปิดจอง"
                    : seats === 0
                      ? "รอบนี้เต็มแล้ว"
                      : "รอบเรียนนี้สิ้นสุดแล้ว"}
                </button>
              )}
              <p className={styles.bookingFootnote}>
                เลือกวันและเวลาที่เหมาะกับคุณ แล้วพบกันบนเสื่อโยคะ
              </p>
            </div>
            <p className={styles.sideNote}>
              A little time for yourself.
              <br />
              <span>A beautiful place to begin.</span>
            </p>
          </aside>
        </div>
      </div>
      <Dialog
        open={!!selectedImg}
        onOpenChange={(open) => {
          if (!open) setSelectedImg(null);
        }}
      >
        <DialogContent
          className="sm:max-w-4xl bg-[#faf9f6] p-4"
          aria-describedby={undefined}
        >
          <DialogTitle className="pr-8 text-sm font-normal">
            {course.title}
          </DialogTitle>
          {selectedImg && (
            <div className="relative h-[75vh]">
              <Image
                src={imageUrl(selectedImg)}
                alt={course.title}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
