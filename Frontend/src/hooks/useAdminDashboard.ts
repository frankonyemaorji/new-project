"use client";

import { useState, useEffect } from 'react';

interface DashboardStats {
  universities: {
    total: number;
    change: string;
    trend: string;
  };
  students: {
    total: number;
    change: string;
    trend: string;
  };
  counselors: {
    total: number;
    change: string;
    trend: string;
  };
  scholarships: {
    total: number;
    change: string;
    trend: string;
  };
  applications: {
    total: number;
    change: string;
    trend: string;
  };
  revenue: {
    total: number;
    change: string;
    trend: string;
  };
}

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  status: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: Activity[];
}

export function useAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock data service instead of API
      const { MockDataService } = await import('@/lib/services/mockDataService');
      const dataService = MockDataService.getInstance();
      const result = await dataService.getDashboardStats();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData
  };
}