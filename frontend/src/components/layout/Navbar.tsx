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
              <div className="relative group">
                <button className="flex items-center gap-2 text-slate-700 font-medium hover:text-slate-900 h-10 px-2 rounded-md hover:bg-slate-100 transition-colors">
                  <div className="bg-brand-100 text-brand-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {user.email ? user.email.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                  </div>
                  <span className="max-w-[120px] truncate">{user.email}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-sm font-medium text-slate-900 truncate">Account</p>
                  </div>
                  <button
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                  >
                    Submit an App
                  </button>
                  {user.isAdmin && (
                    <>
                      <Link
                        href="/admin/submissions"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      >
                        Admin · Submissions
                      </Link>
                      <Link
                        href="/admin/users"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      >
                        Admin · Users
                      </Link>
                      <Link
                        href="/admin/games"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      >
                        Admin · Games
                      </Link>
                    </>
                  )}
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="font-medium hover:text-slate-900"
                >
                  Log in / Join
                </button>
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="rounded-md bg-brand-600 px-3 py-1.5 text-white font-medium hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  Submit
                </button>
              </div>
            )}
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
