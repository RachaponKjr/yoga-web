"use client";
import { useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { UserInfoType } from "@/types/auth.type";

interface AuthHydratorProps {
  id: string;
  role: string;
  email: string;
  userInfo: UserInfoType;
}

export default function AuthHydrator({ user }: { user: AuthHydratorProps }) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useAuthStore.setState({
      user: user,
      isAuthenticated: !!user,
    });
    initialized.current = true;
  }

  return null;
}
