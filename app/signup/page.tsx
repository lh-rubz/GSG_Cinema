// page.tsx
import SignUpForm from "@/components/signup-form";

export default function SignUpPage() {
    return (
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-15 bg-gray-100 dark:bg-zinc-900 text-black dark:text-white">
            <SignUpForm />
        </main>
    );
}