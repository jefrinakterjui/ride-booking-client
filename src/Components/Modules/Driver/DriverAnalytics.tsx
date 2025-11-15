import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { BarChartHorizontal, CircleDollarSign } from "lucide-react";
import { 
  useGetDriverEarningsQuery,
  useGetDriverRideHistoryQuery 
} from '@/redux/freatures/driver/driver.api';
import { Skeleton } from '@/Components/ui/skeleton';

declare global {
  interface Window {
    google: any;
  }
}


function useGoogleCharts() {
  const [isLoaded, setIsLoaded] = useState(window.google && window.google.charts);

  useEffect(() => {
    if (!isLoaded) {
      const script = document.getElementById('google-charts-script');
      
      const handleLoad = () => {
          window.google.charts.load('current', { 'packages': ['corechart'] }); 
          window.google.charts.setOnLoadCallback(() => {
            setIsLoaded(true);
            window.dispatchEvent(new Event('google-charts-loaded'));
          });
      }

      const onChartsLoaded = () => setIsLoaded(true);
      window.addEventListener('google-charts-loaded', onChartsLoaded);

      if (!script) {
        const newScript = document.createElement('script');
        newScript.src = 'https://www.gstatic.com/charts/loader.js';
        newScript.id = 'google-charts-script';
        newScript.onload = handleLoad;
        document.head.appendChild(newScript);
      } else if (window.google && window.google.charts) {
        handleLoad();
      }

      return () => {
        window.removeEventListener('google-charts-loaded', onChartsLoaded);
      }
    }
  }, [isLoaded]);

  return isLoaded;
}


const Chart = ({ chartType, data, options, width = "100%", height = "400px", isChartsLoaded }: { chartType: string, data: any[], options: object, width?: string, height?: string, isChartsLoaded: boolean }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isChartsLoaded && chartRef.current && window.google.visualization) {
      const dataTable = window.google.visualization.arrayToDataTable(data);
      let chart;
      switch (chartType) {
        case 'PieChart':
          chart = new window.google.visualization.PieChart(chartRef.current);
          break;
        default:
          console.error(`Unsupported chart type: ${chartType}`);
          return;
      }
      chart.draw(dataTable, options);
    }
  }, [isChartsLoaded, chartType, data, options, height, width]);

  if (!isChartsLoaded) {
    return (
      <div style={{ width, height }} className="flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Loading Chart...</p>
      </div>
    );
  }

  return <div ref={chartRef} style={{ width, height }} />;
};

const StatCard = ({
  icon,
  title,
  value,
  isLoading,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  isLoading: boolean;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-8 w-1/2" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);


const ChartCard = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={`bg-white p-6 rounded-xl border border-gray-200 ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
      {children}
    </div>
);



const DriverAnalytics = () => {
  const isChartsLoaded = useGoogleCharts();
  
  const { data: earningsData, isLoading: isEarningsLoading, isError: isEarningsError } = useGetDriverEarningsQuery(undefined);
  
  const { data: historyData, isLoading: isHistoryLoading, isError: isHistoryError } = useGetDriverRideHistoryQuery({ limit: 1000 });

  const stats = {
    totalEarnings: earningsData?.data?.totalEarnings || 0,
    totalRides: earningsData?.data?.totalRides || 0,
  };

  const pieChartData = useMemo(() => {
    if (!historyData?.data) {
      return [
        ["Status", "Count"],
        ["No Data", 1],
      ];
    }
    
    const statusCounts = historyData.data.reduce((acc, ride) => {
      const status = ride.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(statusCounts).map(([status, count]) => {
      const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
      return [formattedStatus, count];
    });

    return [
      ["Status", "Count"],
      ...chartData,
    ];

  }, [historyData]);

  const pieChartOptions = {
    title: "All-Time Ride Status Breakdown",
    is3D: true,
    colors: ["#10b981", "#ef4444", "#f59e0b", "#3b82f6", "#a855f7"], 
    backgroundColor: 'transparent',
    titleTextStyle: { color: '#333' },
    legendTextStyle: { color: '#333' },
  };


  if (isEarningsError || isHistoryError) {
    return (
      <div className="p-6 text-red-500 font-semibold">
        Failed to load analytics data. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-full space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Earnings Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<CircleDollarSign className="text-green-500" />} 
          title="Total Earnings" 
          value={`৳${stats.totalEarnings}`}
          isLoading={isEarningsLoading}
        />
        <StatCard 
          icon={<BarChartHorizontal className="text-blue-500" />} 
          title="Rides Completed" 
          value={stats.totalRides}
          isLoading={isEarningsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <ChartCard title="Rides Breakdown" className="lg:col-span-1">
          {isHistoryLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : (
            <Chart
              chartType="PieChart"
              data={pieChartData}
              options={pieChartOptions}
              isChartsLoaded={isChartsLoaded}
            />
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default DriverAnalytics;