"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Video,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

// --- Mock Data Types ---
type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";
type ClassType = "ONLINE" | "ONSITE";

interface Booking {
  id: string;
  courseTitle: string;
  coverImage: string;
  roundDate: string; // ISO String
  startTime: string;
  endTime: string;
  instructor: {
    name: string;
    avatar: string;
  };
  location: string;
  type: ClassType;
  status: BookingStatus;
  price: number;
}

// --- Mock Data ---
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1",
    courseTitle: "Morning Flow Yoga & Meditation",
    coverImage:
      "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop",
    roundDate: "2026-01-15T09:00:00Z",
    startTime: "09:00",
    endTime: "10:30",
    instructor: { name: "Sarah Wilson", avatar: "" },
    location: "Zoom Meeting",
    type: "ONLINE",
    status: "CONFIRMED",
    price: 500,
  },
  {
    id: "2",
    courseTitle: "Advanced Hatha Yoga",
    coverImage:
      "https://images.unsplash.com/photo-1599447421405-0cbe87236a67?q=80&w=1974&auto=format&fit=crop",
    roundDate: "2026-01-20T17:00:00Z",
    startTime: "17:00",
    endTime: "18:30",
    instructor: { name: "Michael Chen", avatar: "" },
    location: "Studio Room A",
    type: "ONSITE",
    status: "CONFIRMED",
    price: 800,
  },
  {
    id: "3",
    courseTitle: "Beginner Stretching",
    coverImage:
      "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2626&auto=format&fit=crop",
    roundDate: "2023-12-10T10:00:00Z",
    startTime: "10:00",
    endTime: "11:00",
    instructor: { name: "Emily Rose", avatar: "" },
    location: "Studio Room B",
    type: "ONSITE",
    status: "COMPLETED",
    price: 450,
  },
  {
    id: "4",
    courseTitle: "Power Yoga Core",
    coverImage:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop",
    roundDate: "2023-11-05T18:00:00Z",
    startTime: "18:00",
    endTime: "19:00",
    instructor: { name: "Sarah Wilson", avatar: "" },
    location: "Zoom Meeting",
    type: "ONLINE",
    status: "CANCELLED",
    price: 500,
  },
];

const MyBooking = () => {
  const [activeTab, setActiveTab] = useState<
    "UPCOMING" | "HISTORY" | "CANCELLED"
  >("UPCOMING");

  // Filter Logic
  const filteredBookings = MOCK_BOOKINGS.filter((booking) => {
    if (activeTab === "UPCOMING") return booking.status === "CONFIRMED";
    if (activeTab === "HISTORY") return booking.status === "COMPLETED";
    if (activeTab === "CANCELLED") return booking.status === "CANCELLED";
    return true;
  });

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 pt-30 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">My Schedule</h1>
            <p className="text-zinc-500 mt-1">
              Manage your upcoming classes and viewing history.
            </p>
          </div>

          {/* Search Box (Optional) */}
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search class..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 transition-all"
            />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-1 bg-zinc-100/50 p-1 rounded-xl w-fit mb-8 border border-zinc-200/50">
          {["UPCOMING", "HISTORY", "CANCELLED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <EmptyState type={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const BookingCard = ({ booking }: { booking: Booking }) => {
  const isUpcoming = booking.status === "CONFIRMED";

  return (
    <div className="group bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-300 flex flex-col md:flex-row gap-5">
      {/* Image */}
      <div className="relative w-full md:w-48 aspect-video md:h-auto rounded-xl overflow-hidden bg-zinc-100 shrink-0">
        <Image
          src={booking.coverImage}
          alt={booking.courseTitle}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
              booking.type === "ONLINE"
                ? "bg-blue-500/90 text-white"
                : "bg-emerald-500/90 text-white"
            }`}
          >
            {booking.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-zinc-900 line-clamp-1">
              {booking.courseTitle}
            </h3>
            <StatusBadge status={booking.status} />
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>
                {format(new Date(booking.roundDate), "EEE, dd MMM yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>
                {booking.startTime} - {booking.endTime}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {booking.type === "ONLINE" ? (
                <Video size={14} />
              ) : (
                <MapPin size={14} />
              )}
              <span>{booking.location}</span>
            </div>
          </div>
        </div>

        {/* Footer: Instructor & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
          <div className="flex items-center gap-2">
            <Avatar className="size-8 border border-zinc-100">
              <AvatarImage src={booking.instructor.avatar} />
              <AvatarFallback className="bg-zinc-100 text-xs">
                {booking.instructor.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-zinc-700">
              {booking.instructor.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isUpcoming ? (
              <>
                <button className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition-colors">
                  Reschedule
                </button>
                <button className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg transition-colors shadow-sm">
                  {booking.type === "ONLINE" ? "Join Class" : "View Ticket"}
                </button>
              </>
            ) : booking.status === "COMPLETED" ? (
              <button className="px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-200 hover:bg-emerald-50 rounded-lg transition-colors">
                Leave a Review
              </button>
            ) : (
              <span className="text-sm text-zinc-400 font-medium">
                No actions available
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: BookingStatus }) => {
  switch (status) {
    case "CONFIRMED":
      return (
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
          <CheckCircle2 size={12} /> Confirmed
        </div>
      );
    case "COMPLETED":
      return (
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-xs font-semibold border border-zinc-200">
          <CheckCircle2 size={12} /> Completed
        </div>
      );
    case "CANCELLED":
      return (
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold border border-red-100">
          <XCircle size={12} /> Cancelled
        </div>
      );
    default:
      return null;
  }
};

const EmptyState = ({ type }: { type: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <Calendar className="text-zinc-300" size={32} />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-1">
        No {type.toLowerCase()} bookings
      </h3>
      <p className="text-zinc-500 text-sm max-w-xs mb-6">
        You don't have any {type.toLowerCase()} classes at the moment.
      </p>
      {type === "UPCOMING" && (
        <Link
          href="/"
          className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-200"
        >
          Browse Courses
        </Link>
      )}
    </div>
  );
};

export default MyBooking;
