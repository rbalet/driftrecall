import { Link, useLocation } from "@tanstack/react-router";
import { HouseIcon, LibraryIcon, SettingsIcon } from "lucide-react";

import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

const navItems = [
  {
    to: "/" as const,
    label: "Home",
    icon: HouseIcon,
    matches: (pathname: string) => pathname === "/",
  },
  {
    to: "/library" as const,
    label: "Library",
    icon: LibraryIcon,
    matches: (pathname: string) =>
      pathname === "/library" || pathname.startsWith("/study/") || pathname.startsWith("/sets/"),
  },
  {
    to: "/settings" as const,
    label: "Settings",
    icon: SettingsIcon,
    matches: (pathname: string) => pathname === "/settings",
  },
];

export function AppNavbar({
  className,
  floating = false,
  show = true,
}: {
  className?: string;
  floating?: boolean;
  show?: boolean;
}) {
  const { pathname } = useLocation();

  return (
    <nav
      aria-label="Primary"
      className={cn("z-40", floating && "fixed top-4 left-1/2 -translate-x-1/2", className)}
    >
      <div
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/45 p-1 shadow-xl backdrop-blur-xl transition-all duration-300",
          show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0",
        )}
      >
        {navItems.map(({ to, label, icon: Icon, matches }) => {
          const isActive = matches(pathname);

          return (
            <Button
              key={to}
              render={<Link to={to} />}
              nativeButton={false}
              variant="ghost"
              size="sm"
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-full px-3 text-white/70 hover:bg-white/10 hover:text-white",
                isActive && "bg-white/15 text-white hover:bg-white/20",
              )}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
