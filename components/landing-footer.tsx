import Link from "next/link";
import { Film, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background dark:bg-black">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Film className="h-6 w-6 text-primary dark:text-red-700" />
              <span className="font-bold text-zinc-900 dark:text-white">CinemaHub</span>
            </Link>
            <p className="text-sm text-muted-foreground dark:text-zinc-400">
              Your ultimate cinema experience with the latest movies and premium comfort.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/movies" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/showtimes" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                  Showtimes
                </Link>
              </li>
              <li>
                <Link href="/promotions" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                  Promotions
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-white">Connect With Us</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground dark:text-zinc-400 hover:text-primary dark:hover:text-white">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
           
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground dark:text-zinc-400">
          <p>&copy; {new Date().getFullYear()} CinemaHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}