"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
    ClipboardList,
    ChevronUp,
    ChevronDown,
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

// Helper for currency
function formatRupiah(v: unknown) {
    const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : 0;
    if (!Number.isFinite(n)) return "-";
    return new Intl.NumberFormat("id-ID").format(n);
}

// Helper for Status Badge
function StatusBadge({ status }: { status: string }) {
    let color = "bg-gray-100 border-gray-200 text-gray-600";
    let label = status;

    switch (status) {
        case "pending": // Menunggu Pembayaran
            color = "bg-yellow-50 border-yellow-200 text-yellow-700";
            label = "Menunggu Bayar";
            break;
        case "paid": // Dibayar, siap kerja
            color = "bg-blue-50 border-blue-200 text-blue-700";
            label = "Siap Dikerjakan";
            break;
        case "working": // Sedang dikerjakan
            color = "bg-purple-50 border-purple-200 text-purple-700";
            label = "Sedang Dikerjakan";
            break;
        case "delivered": // Menunggu review
            color = "bg-orange-50 border-orange-200 text-orange-700";
            label = "Dikirim (Review)";
            break;
        case "completed": // Selesai
            color = "bg-green-50 border-green-200 text-green-700";
            label = "Selesai";
            break;
        case "cancelled":
            color = "bg-red-50 border-red-200 text-red-700";
            label = "Batal";
            break;
    }

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-extrabold border uppercase ${color}`}
        >
            {label}
        </span>
    );
}

type Order = {
    id: string;
    order_code: string;
    title: string;
    price: number;
    net_amount: number;
    status: string;
    created_at: string;
    delivery_date: string;
    client: {
        name: string;
        photo_url: string;
    };
    product_title: string;
};

export default function FreelancerOrdersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);

    // UI States
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // TanStack States
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    useEffect(() => {
        setLoading(true);
        // @ts-ignore
        api.get("/freelancer/orders").then((res) => {
            if (res.success) {
                setOrders(res.data as Order[]);
            }
            setLoading(false);
        });
    }, []);

    const data = useMemo(() => orders, [orders]);

    const columns = useMemo<ColumnDef<Order>[]>(
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
                accessorKey: "order_code",
                header: "Order Code",
                cell: ({ row }) => (
                    <div className="font-mono text-xs font-bold">{row.original.order_code}</div>
                ),
            },
            {
                accessorKey: "title", // Using title/product_title for searching
                header: ({ column }) => (
                    <button
                        className="inline-flex items-center gap-2 font-extrabold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Layanan / Judul
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
                    <div>
                        <div className="text-sm font-bold line-clamp-1">{row.original.product_title || row.original.title}</div>
                        <div className="text-xs text-black/50 line-clamp-1">{row.original.title}</div>
                    </div>
                ),
            },
            {
                accessorKey: "client.name",
                header: "Client",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                            {row.original.client?.photo_url ? (
                                <img src={row.original.client.photo_url} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-gray-500">
                                    {row.original.client?.name?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="truncate max-w-[100px] text-sm font-medium">{row.original.client?.name}</span>
                    </div>
                )
            },
            {
                accessorKey: "net_amount",
                header: ({ column }) => (
                    <button
                        className="inline-flex items-center gap-2 font-extrabold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Pendapatan
                        {column.getIsSorted() === "asc" ? (
                            <ChevronUp className="w-4 h-4 text-black/60" />
                        ) : column.getIsSorted() === "desc" ? (
                            <ChevronDown className="w-4 h-4 text-black/60" />
                        ) : (
                            <span className="text-black/30 text-xs">↕</span>
                        )}
                    </button>
                ),
                cell: ({ row }) => <div className="text-sm font-semibold text-green-700">Rp {formatRupiah(row.original.net_amount)}</div>,
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => <StatusBadge status={row.original.status} />,
                filterFn: (row, columnId, filterValue) => {
                    if (!filterValue || filterValue === "all") return true;
                    return String(row.getValue(columnId)) === String(filterValue);
                },
            },
            {
                id: "action",
                header: "Aksi",
                cell: ({ row }) => (
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-8 rounded-lg text-xs"
                        onClick={() => router.push(`/chat?order=${row.original.order_code}`)}
                    >
                        Chat & Detail
                    </Button>
                ),
            },
        ],
        [router]
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
        globalFilterFn: (row, columnId, filterValue) => {
            const safeValue = (() => {
                const val = row.getValue(columnId);
                return typeof val === 'string' ? val.toLowerCase() : '';
            })();
            const searchTerms = filterValue.toLowerCase().split(' ');

            // Search across multiple columns
            const searchableText = [
                row.original.order_code,
                row.original.product_title,
                row.original.title,
                row.original.client.name
            ].join(' ').toLowerCase();

            return searchTerms.every((term: string) => searchableText.includes(term));
        },
        getRowId: (row) => row.id,
    });

    // Apply Status Filter
    useEffect(() => {
        const col = table.getColumn("status");
        if (col) {
            col.setFilterValue(statusFilter === "all" ? undefined : statusFilter);
        }
    }, [statusFilter, table]);

    return (
        <div className="space-y-5">
            <div className="bg-white rounded-2xl border shadow-sm p-5">
                <div className="flex items-center gap-2 mb-1">
                    <ClipboardList className="w-5 h-5 text-black/70" />
                    <h1 className="text-lg font-extrabold">Daftar Order</h1>
                </div>
                <p className="text-sm text-black/60 mb-5">
                    Kelola semua pesanan yang masuk dan sedang berjalan.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari order code / judul / client..."
                            className="rounded-xl"
                        />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full h-10 rounded-xl border px-3 text-sm font-semibold bg-white"
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Menunggu Bayar</option>
                            <option value="paid">Siap Dikerjakan</option>
                            <option value="working">Sedang Dikerjakan</option>
                            <option value="delivered">Dikirim (Review)</option>
                            <option value="completed">Selesai</option>
                            <option value="cancelled">Dibatalkan</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-5 overflow-x-auto">
                {loading ? (
                    <div className="text-sm text-black/60 py-10 text-center">Memuat order...</div>
                ) : (
                    <>
                        <div className="rounded-2xl border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-[#fafafa]">
                                    {table.getHeaderGroups().map((hg) => (
                                        <TableRow key={hg.id}>
                                            {hg.headers.map((header) => (
                                                <TableHead key={header.id} className="text-[11px] uppercase tracking-wide font-extrabold text-black/60">
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
                                            <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                                Tidak ada order ditemukan.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

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
                                <Button
                                    variant="outline"
                                    className="rounded-xl h-9"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    className="rounded-xl h-9"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
