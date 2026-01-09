"use client";

import Cookies from "js-cookie";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { toastManager } from "@/components/ui/toast";

const StatusBadge = ({ status }) => {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    running: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const priorityClasses = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${priorityClasses[priority]}`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

function Particle() {
  return (
    <Button
      onClick={() =>
        toastManager.getState().add({
          title: "Warning",
          description: "Job already running or completed",
          type: "warning",
        })
      }
      variant="outline"
      className="w-full md:w-auto"
    >
      Run Job
    </Button>
  );
}

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  const fetchJob = async () => {
    if (!id) return;

    const token = Cookies.get("jwtToken");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/jobs/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    if (res.ok) setJob(data[0]);
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const runJob = async () => {
    const token = Cookies.get("jwtToken");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/run-job/${id}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();

    if (res.ok) {
      setJob((prev) => ({ ...prev, status: "running" }));
      setTimeout(fetchJob, 4000);
    } else {
      toastManager.getState().add({
        title: "Error",
        description: data.message,
        type: "error",
      });
    }
  };

  if (!job)
    return (
      <p className="text-center text-gray-500 mt-10">Loading job details...</p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">{job.taskName}</h1>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Status:</span>
            <StatusBadge status={job.status} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Priority:</span>
            <PriorityBadge priority={job.priority} />
          </div>
        </div>

        <div className="mt-4">
          {job.status === "pending" ? (
            <Button type="button" onClick={runJob} className="w-full md:w-auto">
              Run Job
            </Button>
          ) : (
            <Particle />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
