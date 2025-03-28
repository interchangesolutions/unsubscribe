// login page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Redirect to the backend login endpoint to start the OAuth flow.
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/login`;
    } catch (err) {
      setError("Failed to authenticate with Google. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            <span className="text-xl font-bold">TidyInbox</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
            <CardDescription>
              Connect your Google account to manage your email subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Connecting..." : "Continue with Google"}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{" "}
              <Link href="#" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </CardFooter>
        </Card>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TidyInbox. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
