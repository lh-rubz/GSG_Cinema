import Link from "next/link";

export default function NotFoundPage() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-background text-center dark:bg-gray-900">
            <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
            <p className="mt-4 text-lg text-muted-foreground dark:text-gray-400">
                Oops! The page you are looking for does not exist.
            </p>
            <Link
                href="/"
                className="mt-6 rounded-md bg-primary px-4 py-2 text-white transition hover:bg-primary-dark dark:bg-primary-light dark:hover:bg-primary"
            >
                Go Back Home
            </Link>
        </div>
    );
}