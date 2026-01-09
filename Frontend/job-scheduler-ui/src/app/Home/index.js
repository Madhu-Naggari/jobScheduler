"use client";

import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Home = () => {
  const router = useRouter();

  const [task, setTask] = useState({ taskName: "", priority: "" });
  const [user, setUser] = useState({});
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState({ isError: false, errorMsg: "" });

  const getUserInfo = async () => {
    const token = Cookies.get("jwtToken");
    if (!token) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setUser({ id: data.id, name: data.name, email: data.email });
  };

  const getJobs = async () => {
    const token = Cookies.get("jwtToken");
    if (!token) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setJobs(data);
  };

  useEffect(() => {
    getUserInfo();
    getJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({ isError: false, errorMsg: "" });

    try {
      const token = Cookies.get("jwtToken");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const data = await res.json();
      if (res.ok) {
        setTask({ taskName: "", priority: "" });
        getJobs();
      } else {
        setError({ isError: true, errorMsg: data.message });
      }
    } catch (err) {
      setError({ isError: true, errorMsg: err.message });
    }
  };

  const onClickJob = (id) => router.push(`/jobs/${id}`);

  const columns = [
    { accessorKey: "taskName", header: "Task Name" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("priority")}</div>
      ),
    },
  ];

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data: jobs,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  const handleStatusFilter = (value) =>
    table.getColumn("status")?.setFilterValue(value);
  const handlePriorityFilter = (value) =>
    table.getColumn("priority")?.setFilterValue(value);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-x-hidden">
      {/* USER INFO */}
      <div className="space-y-1 text-gray-700">
        {user.id && <p className="text-sm font-medium">UserId: {user.id}</p>}
        <p className="text-xl font-bold">
          Welcome, {user.name ? user.name.toUpperCase() : "Guest"}
        </p>
        {user.email && <p className="text-sm">{user.email}</p>}
      </div>

      {/* JOB FORM */}
      <div className="bg-white shadow-md rounded-xl p-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Textarea
              id="taskName"
              placeholder="Enter your job task..."
              rows={4}
              value={task.taskName}
              onChange={(e) =>
                setTask((prev) => ({ ...prev, taskName: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Priority</Label>
            <Select
              value={task.priority}
              onValueChange={(value) =>
                setTask((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error.isError && <p className="text-red-600">{error.errorMsg}</p>}

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-900"
          >
            Add Job
          </Button>
        </form>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4">
        <Select onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined}>All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handlePriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={undefined}>All</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* JOBS TABLE */}
      <div className="overflow-hidden rounded-xl border shadow-sm">
        <Table className="min-w-full">
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-2 text-left font-medium text-gray-700"
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  onClick={() => onClickJob(row.original.id)}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2">
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
                  className="h-24 text-center text-gray-400"
                >
                  No jobs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Home;
