"use client";

import { useMemo, useState } from "react";

type Msg = { id: number; from: "me" | "them"; text: string; time: string };

export default function ChatUI() {
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 1,
      from: "them",
      text: "Halo! Kamu butuh pendampingan bagian apa? Bab 1–3, olah data, atau PPT sidang?",
      time: "19:01",
    },
    {
      id: 2,
      from: "me",
      text: "Saya butuh bimbingan olah data SPSS + cara interpretasi hasilnya.",
      time: "19:02",
    },
    {
      id: 3,
      from: "them",
      text: "Siap. Kamu bisa kirim: variabel, hipotesis, dan file data (tanpa info sensitif). Nanti aku pandu step-by-step.",
      time: "19:03",
    },
  ]);

  const groups = useMemo(() => msgs, [msgs]);

  function send() {
    if (!text.trim()) return;
    setMsgs((p) => [
      ...p,
      { id: Date.now(), from: "me", text, time: "now" } as any,
    ]);
    setText("");
    setTimeout(() => {
      setMsgs((p) => [
        ...p,
        {
          id: Date.now() + 1,
          from: "them",
          text: "Oke, aku jawab ya. Kalau ada catatan dosen, kirim juga biar revisinya tepat.",
          time: "now",
        } as any,
      ]);
    }, 450);
  }

  return (
    <div className="grid h-[70vh] sm:h-[72vh] grid-rows-[auto_1fr_auto] overflow-hidden rounded-2xl border bg-white">
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="font-extrabold truncate">Chat Sesi #SM-001</div>
          <div className="text-xs text-black/60 truncate">
            Mentor: Dimas • Status: In Progress • Fokus: Olah Data (Bimbingan)
          </div>
        </div>
        <button className="shrink-0 rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-black/5">
          Kirim File
        </button>
      </div>

      <div className="space-y-3 overflow-auto p-4">
        {groups.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.from === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                m.from === "me" ? "bg-black text-white" : "bg-black/5"
              }`}
            >
              <div>{m.text}</div>
              <div
                className={`mt-1 text-[11px] ${
                  m.from === "me" ? "text-white/70" : "text-black/50"
                }`}
              >
                {m.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
          placeholder="Tulis pesan…"
        />
        <button
          onClick={send}
          className="rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
