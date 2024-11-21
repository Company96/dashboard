import React from "react";
import { Chart } from "react-google-charts";
import { useQuery } from "@apollo/client";
import { GET_ALL_USERS_LOCATION } from "@/graphql/query/user";


interface User {
  country: string;
}

interface DataResponse {
  getAllUsers: User[];
}

export function UserLocation() {
  const { loading, error, data } = useQuery<DataResponse>(GET_ALL_USERS_LOCATION);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data) return <p>No data available</p>;

  const formattedData: (string | number)[][] = [
    ["Location", "Count"],
    ...data.getAllUsers.reduce((acc: [string, number][], user: User) => {
      const location = user.country;
      const existingIndex = acc.findIndex(([loc]) => loc === location);

      if (existingIndex !== -1) {
        acc[existingIndex][1] = (acc[existingIndex][1] as number) + 1;
      } else {
        acc.push([location, 1]);
      }

      return acc;
    }, [] as [string, number][])
  ];

  const options = {
    title: "Users Locations",
    backgroundColor: 'transparent',
    chartArea: {
      backgroundColor: {
        fill: 'transparent'
      },
      width: '100%',
      height: '100%' 
    },
    pieSliceText: 'label',
    pieSliceTextStyle: {
      fontSize: 14
    },
    pieStartAngle: 0,
    sliceVisibilityThreshold: 0 
  };

  return (
    <Chart
      chartType="PieChart"
      data={formattedData}
      options={options}
      width={"100%"}
      height={"400px"}
    />
  );
}
