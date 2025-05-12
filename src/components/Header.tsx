import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { siteConfig } from "@/config/site";
import { BookText } from "lucide-react"; // Using BookText as a journal icon

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookText className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">{siteConfig.name}</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Today
          </Link>
          <Link href="/history" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            History
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
