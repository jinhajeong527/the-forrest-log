"use client";

import { useActionState, useTransition } from "react";
import { ForrestButton } from "@/components/ui/forrest-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginWithEmail, loginWithGoogle, type AuthState } from "@/app/login/actions";

const initialState: AuthState = { error: null };

export default function JournalLoginForm() {
  const [state, submitAction, isPending] = useActionState(loginWithEmail, initialState);
  const [isGooglePending, startGoogleTransition] = useTransition();

  return (
    <div className="relative flex flex-col justify-center px-8 py-12 h-full">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-px bg-border/50" />
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground text-xs opacity-60">✦</span>
          <h2 className="font-cormorant italic text-foreground text-2xl tracking-wide">
            Log In
          </h2>
          <span className="text-muted-foreground text-xs opacity-60">✦</span>
        </div>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* Form */}
      <form action={submitAction} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="email"
            className="font-cormorant text-foreground text-sm tracking-wide"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            className="bg-transparent border-border focus-visible:ring-primary/40 rounded-none border-x-0 border-t-0 px-0 shadow-none font-cormorant text-base"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="password"
            className="font-cormorant text-foreground text-sm tracking-wide"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            className="bg-transparent border-border focus-visible:ring-primary/40 rounded-none border-x-0 border-t-0 px-0 shadow-none font-cormorant text-base"
          />
        </div>

        {state.error && (
          <p className="font-cormorant italic text-destructive text-sm">
            {state.error}
          </p>
        )}

        {/* Primary CTA */}
        <ForrestButton
          type="submit"
          disabled={isPending}
          className="mt-2 w-full italic text-lg"
        >
          {isPending ? "Entering…" : "Enter the Log"}
        </ForrestButton>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-border/50" />
        <span className="font-cormorant italic text-muted-foreground text-xs">
          Or log in with Google
        </span>
        <div className="flex-1 h-px bg-border/50" />
      </div>

      {/* Google button */}
      <ForrestButton
        type="button"
        variant="outline"
        disabled={isGooglePending}
        onClick={() => startGoogleTransition(() => loginWithGoogle())}
        className="w-full gap-2 text-base"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {isGooglePending ? "Redirecting…" : "Google"}
      </ForrestButton>
    </div>
  );
}
