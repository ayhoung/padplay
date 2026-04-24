"use client";

import { useState } from "react";
import Link from "next/link";
import { Tablet, User as UserIcon } from "lucide-react";
import { SubmitModal } from "../submit/SubmitModal";
import { AuthModal } from "../auth/AuthModal";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <Tablet className="h-5 w-5 text-brand-600" aria-hidden />
            <span>PadPlay</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-slate-600">
            <Link href="/about" className="hover:text-slate-900">
              About
            </Link>

            <div className="h-4 w-px bg-slate-200 mx-1" />

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <UserIcon className="h-4 w-4" />
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-slate-500 hover:text-slate-800"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="font-medium hover:text-slate-900"
              >
                Log in / Join
              </button>
            )}

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="rounded-md bg-brand-600 px-3 py-1.5 text-white font-medium hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Submit
            </button>
          </nav>
        </div>
      </header>

      <SubmitModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)} 
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
