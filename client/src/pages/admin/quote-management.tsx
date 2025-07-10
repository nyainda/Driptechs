import { useEffect } from "react";
import { useLocation } from "wouter";
import { getAuthToken, getUser } from "@/lib/auth";
import QuoteManagement from "@/components/admin/quote-management";

export default function QuoteManagementPage() {
  const [, setLocation] = useLocation();
  const token = getAuthToken();
  const user = getUser();

  useEffect(() => {
    if (!token || !user) {
      setLocation("/admin");
    }
  }, [token, user, setLocation]);

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-8">
      <div className="max-w-7xl mx-auto">
        <QuoteManagement />
      </div>
    </div>
  );
}