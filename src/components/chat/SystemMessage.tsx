// src/components/chat/SystemMessage.tsx
export default function SystemMessage() {
  return (
    <div className="mx-auto max-w-xl rounded-xl bg-blue-50 p-6 text-sm text-black/70">
      <p className="mb-4 font-semibold">Langkah 1</p>
      <p>Chat dengan freelancer untuk membahas detail pekerjaan.</p>

      <p className="mt-4 font-semibold">Langkah 2</p>
      <p>Sepakati harga dan lakukan pembayaran.</p>

      <p className="mt-4 font-semibold">Langkah 3</p>
      <p>
        Freelancer mengirim hasil akhir, klien dapat merevisi atau menyetujui.
      </p>
    </div>
  );
}
