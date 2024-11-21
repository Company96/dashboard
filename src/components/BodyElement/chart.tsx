import React from "react";
import { Chart } from "react-google-charts";
import { useQuery } from "@apollo/client";
import { GET_INVESTMENTS_CHAT } from "@/graphql/query/user";

interface Investment {
  amount: number;
  timestamp: string;
}

interface DataResponse {
  getAllInvestments: Investment[];
}

export const options = {
  hAxis: {
    title: "Day",
  },
  vAxis: {
    title: "Investment",
  },
  series: {
    0: { 
      pointSize: 5,
      lineWidth: 2 
    },
    1: { 
      curveType: "function",
      pointSize: 1, 
      lineWidth: 1 
    }
  },
  backgroundColor: 'transparent',
  chartArea: {
    backgroundColor: {
      fill: 'transparent' 
    },
    width: '80%', 
    height: '80%' 
  }
};

export function InvestmentChart() {
  const { loading, error, data } = useQuery<DataResponse>(GET_INVESTMENTS_CHAT);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data available</p>;

  const formattedData: (string | number)[][] = [
    ["Date", "Investment"],
    ...data.getAllInvestments.map((investment) => {
      const date = new Date(investment.timestamp);
      const formattedDate = date.toLocaleDateString("en-GB");
      return [formattedDate, investment.amount];
    })
  ];

  return (
    <Chart
      chartType="LineChart"
      width="100%" 
      height="400px"
      data={formattedData as any} 
      options={options}
      className="dark:text-white z-[-999]"
    />
  );
}
