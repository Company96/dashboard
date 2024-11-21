import React, { useEffect, useState } from 'react';
import { GET_USER_HISTORY } from '@/graphql/query/user';
import { useQuery } from '@apollo/client';
import { Dot, SearchX } from 'lucide-react';

interface USERID {
  authenticatedUserID: string;
}

const History: React.FC<USERID> = ({ authenticatedUserID }) => {
  const { data, loading, error } = useQuery(GET_USER_HISTORY, {
    variables: { userID: authenticatedUserID },
  });

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const userHistory = data?.getUserHistory || [];
  // console.log("Data: ", userHistory);
  // console.log("UserID from History: ", authenticatedUserID);

  const SortedHistory = [...(userHistory || [])].sort((a,b) => {
    const dataA = new Date(a.timestamp)
    const dataB = new Date(b.timestamp)
    return dataB.getTime() - dataA.getTime()
  })

  if (!isClient) {
    return <p>Loading...</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error('GraphQL Error:', error);
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className='p-4 dark:text-white'>
      <table className='w-full'>
        <thead className='bg-green-900 text-white'>
          <tr>
            <th className='p-4'>S/N</th>
            <th>History</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {userHistory.length > 0 ? (
            SortedHistory.map((data: any, index: number) => (
              <tr key={data.id} className='text-center border-b-2'>
                <td className='py-4 flex justify-center'><Dot size={30} /></td>
                <td>{data.changedData}</td>
                <td>{new Date(data.timestamp).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className='text-center py-4 flex items-center justify-center '><SearchX /> No history available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default History;
