import LoginForm from "@/components/login-form";

export default function SignInPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white">
            <LoginForm />
        </div>
    );
}
