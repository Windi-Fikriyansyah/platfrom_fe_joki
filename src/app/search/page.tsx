
import GigCard from "@/components/GigCard";
import FiltersClient from "./FiltersClient";
import Pagination from "@/components/Pagination";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!; // contoh: http://127.0.0.1:8080/api

type SearchParams = {
  q?: string;
  cat?: string;
  min?: string;
  max?: string;
  sort?: string; // latest | price_low | price_high
  page?: string;
};

async function getData(params: SearchParams) {
  const qs = new URLSearchParams();

  if (params.q?.trim()) qs.set("q", params.q);
  if (params.cat?.trim()) qs.set("cat", params.cat);
  if (params.min?.trim()) qs.set("min", params.min);
  if (params.max?.trim()) qs.set("max", params.max);
  if (params.sort?.trim()) qs.set("sort", params.sort);

  // Pagination
  const page = Number(params.page) || 1;
  qs.set("page", page.toString());
  qs.set("limit", "20");

  const [productRes, categoryRes] = await Promise.all([
    fetch(`${API_BASE}/products?${qs.toString()}`, { cache: "no-store" }),
    fetch(`${API_BASE}/categories`, { cache: "no-store" }),
  ]);

  if (!productRes.ok)
    throw new Error(`Gagal ambil products: ${productRes.status}`);
  if (!categoryRes.ok)
    throw new Error(`Gagal ambil categories: ${categoryRes.status}`);

  const productJson = await productRes.json();
  const categoryJson = await categoryRes.json();

  let gigs = (productJson.data ?? []) as any[];
  const categories = (categoryJson.data ?? []) as string[];
  const meta = productJson.meta || { total_pages: 1, page: 1 };

  // SORT handled by backend
  const sort = typeof params.sort === "string" ? params.sort : "latest";

  // Pastikan shape aman buat GigCard (biar ga error seller undefined)
  gigs = gigs.map((g) => ({
    ...g,
    seller: {
      name: g?.seller?.name ?? "Mentor",
      title: g?.seller?.title ?? "Freelancer",
      photo_url: g?.seller?.photo_url ?? "",
    },
  }));

  return { gigs, categories, sort, meta };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { gigs, categories, sort, meta } = await getData(params);

  // Filter params to pass to Pagination
  const queryParams: Record<string, string> = {};
  if (params.q) queryParams.q = params.q;
  if (params.cat) queryParams.cat = params.cat;
  if (params.min) queryParams.min = params.min;
  if (params.max) queryParams.max = params.max;
  if (params.sort) queryParams.sort = params.sort;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Cari Layanan Mahasiswa</h1>
          <p className="mt-1 text-sm text-black/60">
            SSR: data diambil dari backend, filter via query string.
          </p>
        </div>

        {/* Kontrol kanan (toggle filter mobile + sort + tombol) -> client */}
        <FiltersClient
          categories={categories}
          initialCat={typeof params.cat === "string" ? params.cat : ""}
          initialMin={typeof params.min === "string" ? params.min : ""}
          initialMax={typeof params.max === "string" ? params.max : ""}
          initialSort={sort}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[280px_1fr]">
        {/* Sidebar filter (client, tapi layout tetap sama) */}
        <div className="md:block">
          <FiltersClient
            variant="sidebar"
            categories={categories}
            initialCat={typeof params.cat === "string" ? params.cat : ""}
            initialMin={typeof params.min === "string" ? params.min : ""}
            initialMax={typeof params.max === "string" ? params.max : ""}
            initialSort={sort}
          />
        </div>

        <section>
          {gigs.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-black/70">
              Tidak ada layanan yang cocok.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gigs.map((g) => (
                <GigCard key={g.id} gig={g} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={meta.page}
            totalPages={meta.total_pages}
            baseUrl="/search"
            queryParams={queryParams}
          />
        </section>
      </div>
    </div>
  );
}
