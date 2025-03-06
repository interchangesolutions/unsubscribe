// dashboard layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, LayoutDashboard, BarChart3, Settings, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Dashboard-specific navigation only */}
      <nav className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Minimal branding or dashboard title */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Dashboard</span>
          </div>
          {/* Dashboard navigation items */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">User menu</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    U
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center md:hidden"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/analytics"
                    className="flex w-full items-center md:hidden"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/settings"
                    className="flex w-full items-center md:hidden"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/" className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      {/* Do not include a footer here. The global layout already renders one. */}
    </>
  );
}