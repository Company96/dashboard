import React, { useState, useEffect, useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_TYPE, GET_USER_NOTIFICATION } from '@/graphql/query/user';
import { UPDATE_NOTIFICATION_SEEN } from '@/graphql/mutation/user';
import { ArrowLeft, Dot, SearchX, X } from 'lucide-react';
import Link from "next/link"
import { usePathname } from 'next/navigation';
import { timeStamp } from 'console';
// import { ContextProvider } from '@/utils/AppContext';

interface Notification {
  id: string;
  message: string;
  title: String;
  timestamp: string;
  seen: boolean;
}

interface NotificationsData {
  getUserNotifications: Notification[];
}

interface USERID {
  authenticatedUserID: string;
}

const Notification: React.FC<USERID> = ({ authenticatedUserID }) => {
  const navigate = usePathname()
  const [isClient, setIsClient] = useState(false);
  const [Body, setBody] = useState(true);
  const [messageView, setMessageView] = useState(false);
  const [messageCont, setMessageCont] = useState("");

  // const { messageView, setMessageView } = ContextProvider()


  // console.log("Message View: ", messageView)



  const messageViewer = async (id: any) => {
    setMessageCont(id);
    setMessageView(true);
    setBody(false)
    try {
      await updateNotificationSeen({
        variables: { id, seen: true },
      });

      setNotificationSeen(prevState => ({
        ...prevState,
        [id]: true,
      }));

      await refetch();
    } catch (error) {
      console.error('Error updating notification seen status:', error);
    }
    // console.log("Message content id: ", messageCont)
  }

  const handleClose = () => {
    setMessageView(false);
    setBody(true)
  }

  const {data: getType, loading: typeLoading} = useQuery(GET_USER_TYPE, {
    variables: { userID: authenticatedUserID },
  })

  const TYPE = getType?.getUser.type || '';

  const [notificationSeen, setNotificationSeen] = useState<{ [key: string]: boolean }>({});

  const { data, loading, error, refetch } = useQuery<NotificationsData>(GET_USER_NOTIFICATION, {
    variables: { userID: authenticatedUserID },
  });

  const SortedNotification = [...(data?.getUserNotifications || [])].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateB.getTime() - dateA.getTime();
  });
  

  const [updateNotificationSeen] = useMutation(UPDATE_NOTIFICATION_SEEN);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // const handleNotificationLoad = async (id: string) => {
  //   try {
  //     await updateNotificationSeen({
  //       variables: { id, seen: true },
  //     });

  //     setNotificationSeen(prevState => ({
  //       ...prevState,
  //       [id]: true,
  //     }));

  //     await refetch();
  //   } catch (error) {
  //     console.error('Error updating notification seen status:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (data && data.getUserNotifications) {
  //     const initialSeenStatus: { [key: string]: boolean } = {};
  //     data.getUserNotifications.forEach(notification => {
  //       initialSeenStatus[notification.id] = notification.seen;
  //     });
  //     setNotificationSeen(initialSeenStatus);

  //     const timer = setTimeout(() => {
  //       data.getUserNotifications.forEach(notification => {
  //         if (!notification.seen) {
  //           handleNotificationLoad(notification.id);
  //         }
  //       });
  //     }, 5000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [data]);

  if (!isClient || loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error('GraphQL Error:', error);
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
    {messageView && (
  <section className='dark:text-white p-2'>
    <div className='flex justify-center md:justify-start'>
      <X size={30} className='flex md:hidden rounded-full border-2 dark:border-green-900 border-black cursor-pointer text-red-500' onClick={handleClose}/>
      <ArrowLeft size={30} className='hidden md:flex rounded-full border-2 border-black cursor-pointer text-red-500' onClick={handleClose} />
    </div>
    <div>
    {data && data.getUserNotifications.filter(message => message.id === messageCont).map(message => (
          <div key={message.id} className='md:m-4'>
             <div className='flex justify-between'>
            <h3 className='font-bold text my-2'>{message.title}</h3>
            <p className='hidden md:flex font-bold my-4'>{new Date(message.timestamp).toLocaleString()}</p>
            </div>
            <p className='w-full  text-justify' dangerouslySetInnerHTML={{ __html: message.message }} />
            <p className='flex md:hidden font-bold my-4'>{new Date(message.timestamp).toLocaleString()}</p>
          </div>
        ))}
    </div>
  </section>
)}

  {Body && (

    <div className='p-4 dark:text-white'>
      <div className='flex items-center justify-between mb-4'>
      <h1 className='w-7/12 text-xl lg:text-4xl font-bold mb-4'>Notifications</h1>
      {TYPE == "ADMIN" && (
        <Link href={'/Create_Message'} className='font-bold border-2 border-green-900 dark:bg-green-600 dark:text-white hover:border-green-500 rounded-md text-green-900 hover:text-green-500 text-sm md:text-lg p-2 md:px-4'>+ Create message</Link>
      )}
      </div>

      {data && data.getUserNotifications?.length > 0 ? (
        SortedNotification?.map((notification, index) => {
          const isSeen = notificationSeen[notification.id];

          return (
            <div key={notification.id} className='mx-3 md:mx-6 border-b-2 my-2 cursor-pointer'>
              <p className={`flex ${isSeen ? '' : 'font-bold'}`}onClick={() => messageViewer(notification.id)}>
                 <Dot size={30} /><div className=' flex flex-col md:flex-row w-full justify-between'>{notification.title} <span className='font-bold '>({new Date(notification.timestamp).toLocaleString()})</span></div>
              </p>
            </div>
          );
        })
      ) : (
        <p className='flex justify-center items-center'>
          <SearchX /> No notifications available.
        </p>
      )}
      
    </div>
  )}
    </div>
  );
};

export default Notification;
