"use client";

import React, { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
    Wallet,
    ChevronUp,
    ChevronDown,
} from "lucide-react";

import {
    ColumnDef,
    SortingState,
    getCoreRowModel,
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
import { Button } from "@/components/ui/Button";

function formatRupiah(v: unknown) {
    const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : 0;
    if (!Number.isFinite(n)) return "-";
    return new Intl.NumberFormat("id-ID").format(n);
}

type Transaction = {
    id: string;
    amount: number;
    type: string;
    description: string;
    created_at: string;
};

export default function FreelancerEarningsPage() {
    const [data, setData] = useState<{
        total_earnings: number;
        history: Transaction[];
    }>({ total_earnings: 0, history: [] });

    const [loading, setLoading] = useState(true);

    // TanStack States
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        setLoading(true);
        // @ts-ignore
        api.get("/freelancer/earnings").then((res) => {
            if (res.success) {
                setData(res.data as any);
            }
            setLoading(false);
        });
    }, []);

    const historyData = useMemo(() => data.history, [data.history]);

    const columns = useMemo<ColumnDef<Transaction>[]>(
        () => [
            {
                accessorKey: "created_at",
                header: ({ column }) => (
                    <button
                        className="inline-flex items-center gap-2 font-extrabold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tanggal
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
                    <div className="text-sm text-gray-600">
                        {new Date(row.original.created_at).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                    </div>
                ),
            },
            {
                accessorKey: "description",
                header: "Keterangan",
                cell: ({ row }) => <div className="font-medium">{row.original.description || "-"}</div>,
            },
            {
                accessorKey: "type",
                header: "Tipe",
                cell: ({ row }) => (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase ${row.original.type === 'credit'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {row.original.type === 'credit' ? 'Masuk' : 'Keluar'}
                    </span>
                ),
            },
            {
                accessorKey: "amount",
                header: ({ column }) => (
                    <button
                        className="inline-flex items-center gap-2 font-extrabold"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Jumlah
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
                    <div className={`text-sm font-bold ${row.original.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {row.original.type === 'credit' ? '+' : '-'} Rp {formatRupiah(row.original.amount)}
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: historyData,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });


    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="flex flex-col md:flex-row gap-5">
                <div className="flex-1 bg-black text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2 text-white/70">
                            <Wallet className="w-5 h-5" />
                            <span className="text-sm font-bold">Total Pendapatan Bersih</span>
                        </div>
                        <div className="text-4xl font-extrabold tracking-tight">
                            Rp {formatRupiah(data.total_earnings)}
                        </div>
                        <div className="mt-4 text-xs text-white/40 max-w-sm">
                            * Total akumulasi pendapatan dari semua order yang telah selesai.
                        </div>
                    </div>
                    {/* Decorative blob */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                </div>

                <div className="w-full md:w-80 bg-white rounded-2xl border p-6 flex flex-col justify-center items-center text-center shadow-sm">
                    <p className="text-sm text-black/60 mb-4 font-medium">Saldo dapat dicairkan kapan saja.</p>
                    <Button className="w-full rounded-xl" disabled>
                        Tarik Dana (Segera Hadir)
                    </Button>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
                <div className="flex items-center gap-2 mb-5">
                    <h2 className="text-lg font-extrabold">Riwayat Transaksi</h2>
                </div>

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
                                        Belum ada riwayat transaksi.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Simple Pagination for History */}
                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-sm text-black/60 font-semibold">
                        Menampilkan {table.getFilteredRowModel().rows.length} transaksi
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
            </div>
        </div>
    );
}
