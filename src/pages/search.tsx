import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { SEARCH_USER_DATA } from '@/graphql/query/user';

interface Notification {
  id: string;
  userID: string;
  message: string;
  seen: boolean;
  timestamp: string;
  source: string;
}

interface History {
  id: string;
  userID: string;
  actionType: string;
  changedData: string;
  timestamp: string;
  entityType: string;
  source: string;
}

const SearchResults = () => {
  const router = useRouter();
  const { q, userID } = router.query;
  const [searchResults, setSearchResults] = useState<(Notification | History)[]>([]);

  const searchTerm = typeof q === 'string' ? q : '';
  const userId = typeof userID === 'string' ? userID : '';

  const { data, loading, error } = useQuery(SEARCH_USER_DATA, {
    variables: { userID: userId, searchTerm },
    skip: !userId || !searchTerm,
  });

  // console.log("user ID: ", userId)
  // console.log("search term: ", searchTerm)

  useEffect(() => {
    if (data) {
      const notifications: Notification[] = data.getUserNotifications
        .filter((notification: Notification) =>
          notification.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((notification: Notification) => ({
          ...notification,
          source: 'Notification',
        }));

      const history: History[] = data.getUserHistory
        .filter((history: History) =>
          history.entityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          history.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          history.changedData.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((history: History) => ({
          ...history,
          source: 'History',
        }));

      setSearchResults([...notifications, ...history]);
      // console.log(notifications)
      // console.log("History Log: ", history)
      // console.log("Notification Log", notifications)
    }
  }, [data, searchTerm]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  


  return (
    <div className='p-4'>
      <h1 className='mb-4'>Showing Results for <span className='text-green-500 underline'> &quot;{searchTerm}&quot; </span></h1>
      {searchResults.length > 0 ? (
        <div className='w-full'>
          <div>
            {searchResults.map((result, index) => (
              <div key={index}>
                {result.source === 'Notification' && 'message' in result ? (
                  <td colSpan={3}>
                    <strong>Notification:</strong> {result.message}
                  </td>
                ) : result.source === 'History' && 'entityType' in result ? (
                  <>
                  <table className='w-full'>
                    <thead className='bg-green-900 text-white'>
                      <tr>
                        <th className='p-4'>Description</th>
                        <th>Changed Data</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody className='text-center'>
                    <td>
                      {result.entityType} {result.actionType}
                    </td>
                    <td>{result.changedData}</td>
                    <td>{new Date(result.timestamp).toLocaleString()}</td>
                    </tbody>
                    </table>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
