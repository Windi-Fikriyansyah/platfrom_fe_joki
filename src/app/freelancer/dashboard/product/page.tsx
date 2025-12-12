"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ToastProvider";
import {
  Briefcase,
  Plus,
  Pencil,
  Eye,
  ChevronUp,
  ChevronDown,
  Trash2,
} from "lucide-react";

import {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Product = {
  id: string | number;
  title?: string;
  category?: string;
  base_price?: number | string;
  status?: string;
  created_at?: string;
};

type Row = {
  id: string;
  title: string;
  category: string;
  price: number | string;
  status: string;
  created: string;
};

function formatRupiah(v: unknown) {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : 0;
  if (!Number.isFinite(n)) return "-";
  return new Intl.NumberFormat("id-ID").format(n);
}

function statusBadgeClass(st: string) {
  const s = String(st || "draft")
    .trim()
    .toLowerCase();
  return [
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-extrabold border capitalize",
    s === "published"
      ? "bg-green-50 border-green-200 text-green-700"
      : s === "review"
      ? "bg-yellow-50 border-yellow-200 text-yellow-700"
      : s === "rejected" || s === "ditolak"
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-blue-50 border-blue-200 text-blue-700",
  ].join(" ");
}

export default function FreelancerProductsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  // UI states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | string>("all");

  // TanStack states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  function openDeleteModal(id: string) {
    setDeleteId(id);
  }

  function closeDeleteModal() {
    if (deleteLoading) return;
    setDeleteId(null);
  }

  async function confirmDelete() {
    if (!deleteId) return;

    const api = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    setDeleteLoading(true);

    try {
      const res = await fetch(`${api}/freelancer/products/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        throw new Error(json?.message || "Gagal menghapus layanan");
      }

      showToast("Layanan berhasil dihapus.", "success");

      setProducts((prev) => prev.filter((p) => String(p.id) !== deleteId));

      setDeleteId(null);
    } catch (err: any) {
      showToast(err.message || "Gagal menghapus layanan", "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function fetchProducts() {
    const api = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    setLoading(true);

    const ac = new AbortController();
    try {
      const res = await fetch(`${api}/freelancer/products`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        signal: ac.signal,
      });

      if (res.status === 401 || res.status === 403) {
        setProducts([]);
        showToast("Silakan login sebagai freelancer.", "error");
        return;
      }

      const json = await res.json().catch(() => null);

      if (!json?.success) {
        setProducts([]);
        return;
      }

      const list: Product[] =
        (json?.data as Product[]) ||
        (json?.data?.items as Product[]) ||
        (Array.isArray(json) ? (json as Product[]) : []);

      setProducts(Array.isArray(list) ? list : []);
    } catch {
      showToast("Gagal memuat layanan.", "error");
      setProducts([]);
    } finally {
      setLoading(false);
    }

    return () => ac.abort();
  }

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const data: Row[] = useMemo(() => {
    return products.map((p) => {
      const st = String(p.status || "draft")
        .trim()
        .toLowerCase();
      return {
        id: String(p.id),
        title: p.title || "(Tanpa judul)",
        category: p.category || "-",
        price: (p as any).base_price ?? (p as any).price_from ?? 0,
        status: st || "draft",
        created: p.created_at
          ? new Date(p.created_at).toLocaleDateString("id-ID")
          : "-",
      };
    });
  }, [products]);

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "no",
        header: "#",
        cell: ({ row, table }) => {
          const idx = row.index;
          const pageIndex = table.getState().pagination.pageIndex;
          const pageSize = table.getState().pagination.pageSize;
          return (
            <span className="text-sm font-semibold tabular-nums">
              {pageIndex * pageSize + idx + 1}
            </span>
          );
        },
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "title",
        header: ({ column }) => (
          <button
            className="inline-flex items-center gap-2 font-extrabold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Judul
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="w-4 h-4 text-black/60" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="w-4 h-4 text-black/60" />
            ) : (
              <span className="text-black/30 text-xs">↕</span>
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-sm font-semibold">{row.original.title}</div>
        ),
      },
      {
        accessorKey: "category",
        header: ({ column }) => (
          <button
            className="inline-flex items-center gap-2 font-extrabold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Kategori
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="w-4 h-4 text-black/60" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="w-4 h-4 text-black/60" />
            ) : (
              <span className="text-black/30 text-xs">↕</span>
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-sm">{row.original.category}</div>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <button
            className="inline-flex items-center gap-2 font-extrabold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Harga mulai
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="w-4 h-4 text-black/60" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="w-4 h-4 text-black/60" />
            ) : (
              <span className="text-black/30 text-xs">↕</span>
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-sm">Rp {formatRupiah(row.original.price)}</div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <button
            className="inline-flex items-center gap-2 font-extrabold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="w-4 h-4 text-black/60" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="w-4 h-4 text-black/60" />
            ) : (
              <span className="text-black/30 text-xs">↕</span>
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className={statusBadgeClass(row.original.status)}>
            {row.original.status}
          </span>
        ),
        // filter status exact match
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue === "all") return true;
          return String(row.getValue(columnId)) === String(filterValue);
        },
      },
      {
        accessorKey: "created",
        header: ({ column }) => (
          <button
            className="inline-flex items-center gap-2 font-extrabold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Dibuat
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="w-4 h-4 text-black/60" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="w-4 h-4 text-black/60" />
            ) : (
              <span className="text-black/30 text-xs">↕</span>
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div className="text-sm">{row.original.created}</div>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {/* <button
              type="button"
              onClick={() =>
                router.push(`/freelancer/dashboard/product/${row.original.id}`)
              }
              className="inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-extrabold hover:bg-black/5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Lihat
            </button> */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/freelancer/dashboard/product/${row.original.id}/edit`
                )
              }
              className="inline-flex items-center gap-1 rounded-xl bg-black text-white px-3 py-1.5 text-xs font-extrabold hover:bg-black/90 cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => openDeleteModal(row.original.id)}
              className="inline-flex items-center gap-1 rounded-xl bg-red-600 text-white px-3 py-1.5 text-xs font-extrabold hover:bg-red-700 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          </div>
        ),
        enableSorting: false,
        enableColumnFilter: false,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: search,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
    getRowId: (row) => row.id,
  });

  // apply status filter to column "status"
  useEffect(() => {
    const col = table.getColumn("status");
    if (!col) return;

    if (status === "all") col.setFilterValue(undefined);
    else col.setFilterValue(status);
  }, [status, table]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border shadow-sm p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-black/70" />
              <h1 className="text-lg font-extrabold">Layanan Saya</h1>
            </div>
            <p className="text-sm text-black/60 mt-1">
              Kelola layanan yang kamu buat. Total:{" "}
              <span className="font-semibold text-black">{data.length}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => router.push("/freelancer/dashboard/product/basic")}
              className="rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2" />
              Buat Layanan
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul / kategori / status…"
              className="rounded-xl"
            />
          </div>

          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 rounded-xl border px-3 text-sm font-semibold bg-white"
            >
              <option value="all">Semua status</option>
              <option value="published">Published</option>
              <option value="review">Review</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-5 overflow-x-auto">
        {loading ? (
          <div className="text-sm text-black/60">Memuat layanan…</div>
        ) : (
          <>
            <div className="rounded-2xl border overflow-hidden">
              <Table>
                <TableHeader className="bg-[#fafafa]">
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="text-[11px] uppercase tracking-wide font-extrabold text-black/60"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-black/[0.03]">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-3">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="py-10 text-center text-sm text-black/60"
                      >
                        Tidak ada data.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Footer: pagination */}
            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-sm text-black/60 font-semibold">
                Menampilkan{" "}
                <span className="text-black">
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1}
                </span>
                {" - "}
                <span className="text-black">
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}
                </span>{" "}
                dari{" "}
                <span className="text-black">
                  {table.getFilteredRowModel().rows.length}
                </span>{" "}
                data
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => table.setPageSize(Number(e.target.value))}
                  className="h-9 rounded-xl border px-3 text-sm font-semibold bg-white"
                >
                  {[10, 25, 50, 100].map((s) => (
                    <option key={s} value={s}>
                      {s}/hal
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Prev
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>

            {data.length === 0 && (
              <div className="mt-3 text-sm text-black/60">
                Belum ada layanan. Klik{" "}
                <span className="font-semibold">Buat Layanan</span> untuk mulai.
              </div>
            )}
          </>
        )}
      </div>
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl p-6 animate-in fade-in zoom-in">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-extrabold">Hapus Layanan?</h3>
            </div>

            <p className="mt-3 text-sm text-black/60">
              Layanan yang dihapus tidak dapat dikembalikan. Pastikan kamu
              benar-benar yakin.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Batal
              </Button>

              <Button
                className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Menghapus..." : "Ya, Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
