import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className='flex items-center justify-center md:h-screen'>
      <div className='relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32'>
        <div className='flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36'>
          <div className='w-32 text-white md:w-36'>
            <AcmeLogo />
          </div>
        </div>
        <LoginForm />
        <div className='flex flex-col px-6'>
          <span className='text-slate-400 text-base'>
            Entrar como usuario visitante
          </span>
          <span className='text-slate-400 text-sm'>
            E-mail: <span className='text-slate-600'>user@nextmail.com</span>
          </span>
          <span className='text-slate-400 text-sm'>
            Senha: <span className='text-slate-600'>123456</span>
          </span>
        </div>
      </div>
    </main>
  );
}
