"use client";
import DashboardSidebar from "@/components/dashboard_sidebar"; // Example import

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <DashboardSidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
