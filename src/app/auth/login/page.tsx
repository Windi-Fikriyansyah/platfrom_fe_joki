import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white text-sm font-bold">SM</span>
            <span className="text-lg sm:text-xl font-extrabold">SkripsiMate</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Masuk</h1>
          <p className="mt-2 text-sm text-black/60 max-w-sm">
            Masuk untuk mengelola layanan, chat mentor, dan melihat progress
          </p>
        </div>

        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" placeholder="contoh@email.com" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input type="password" placeholder="••••••••" required />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" className="w-4 h-4 rounded border-border" />
              <span>Ingat saya</span>
            </label>
            <Link href="/auth/forgot-password" className="text-sm text-black/60 hover:text-black">
              Lupa password?
            </Link>
          </div>

          <Button className="w-full h-11">Masuk</Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-black/50">atau</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button className="flex-1 h-10 rounded-lg border bg-white hover:bg-black/5 font-semibold">Google</button>
          <button className="flex-1 h-10 rounded-lg border bg-white hover:bg-black/5 font-semibold">GitHub</button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-black/60">Belum punya akun? </span>
          <Link href="/auth/register" className="font-semibold text-black hover:underline">
            Daftar sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
