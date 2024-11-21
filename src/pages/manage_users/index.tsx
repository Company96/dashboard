import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { GET_WITHDRAWAL_REQUESTS, GET_ALL_USERS, GET_MEMO, GET_USER_FOR_ACCOUNT, GET_ALL_USERS_DETAIL} from '@/graphql/query/user'
import { Dot, Loader, Loader2Icon, X } from 'lucide-react'
import { UserLocation } from '@/components/BodyElement/users'
import { CREATE_INVESTMENT } from '@/graphql/mutation/user'
import toast, {Toaster} from 'react-hot-toast'
import { invoice, wallet } from '@/lib/api'

export default function ManageUsers() {
  const [USERID, setUserId] = useState('')
  const [firstName, setFirstName ] = useState('')
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('0')
  const [plan, setPlan] = useState('')
  const [bonus, setBonus] = useState(0)
  const [Sum, setSum]  = useState(0)
  const [date, SetDate] = useState('')
  const [Uid, setUid] = useState('')
  const [ transactionID, setTransactionID] = useState('')
  const [walletAmount, setWalletAmount] = useState(0)
  const [isApproval, setApproval] = useState(false)
  const [isPending, setIsPending] = useState(false)

  // console.log("user Email: ", email)
  // console.log("user name: ", firstName)
  // console.log("user id: ", USERID)

  const {data: User} =useQuery(GET_ALL_USERS)
  const users = User?.getAllUsers || []
  
  const {data: aUSER} = useQuery(GET_USER_FOR_ACCOUNT, {
    variables: {userID: USERID},
  })

  useEffect(() => {
    if(USERID){
      setFirstName(aUSER?.getUser?.firstName)
      setEmail(aUSER?.getUser?.email)
    }
  }, [aUSER, USERID])

  const { data } = useQuery(GET_WITHDRAWAL_REQUESTS)

  const withdrawalReq = data?.getAllWithdrawalRequests || []

  const sortedWithdrawalReq = [...(withdrawalReq)].sort((a: any,b: any) => {
    const dataA = new Date(a.timestamp)
    const dataB = new Date(b.timestamp)
    return dataB.getTime() - dataA.getTime()
  })

  // console.log("Requests", withdrawalReq)

  const { data: allUsers, loading: allUsersLoading } = useQuery(GET_ALL_USERS);

    const ALLUSERS = allUsers?.getAllUsers || []

    const {data: userMemo, loading: memoLoad} = useQuery(GET_MEMO, {
      variables: { userID: USERID },
    })
  
    const MEMO = userMemo?.getMemo.memo || '';

    const [INVEST, { loading }] = useMutation(CREATE_INVESTMENT, {
      variables: {
        userID: USERID,
        input: {
          amount: amount,
        },
      },
  
      onCompleted: async (data) => {
        toast.success(
          `Transaction completed. ${amount} has been successfully Invested for ${firstName}`,
        )

        await invoice(firstName, email, plan, parseInt(amount), bonus, Sum, date)
        setUserId('')
        setAmount('0')
        
      },
      onError: (error) => {
        toast.error(`Transaction failed.`)
      },
    })

    const formatDate = (date: any) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  

    const handleTransfer = () => {
      if ( !MEMO || MEMO === '0x000000000000000000') {
        toast.error('You cannot transfer to yourself or a null account.')
        return
      }

      const amountInt = parseInt(amount);

      if (amountInt <= 499) {
        setPlan('Basic');
        setBonus(30);
        setSum(amountInt * (1 + 0.30)); 
        SetDate(formatDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000)));
    } else if (amountInt <= 999) {
        setPlan('Standard');
        setBonus(50);
        setSum(amountInt * (1 + 0.50)); 
        SetDate(formatDate(new Date(new Date().getTime() + 48 * 60 * 60 * 1000)));
    } else if (amountInt <= 4999) {
        setPlan('Premium');
        setBonus(100); 
        setSum(amountInt * (1 + 1.00)); 
        SetDate(formatDate(new Date(new Date().getTime() + 72 * 60 * 60 * 1000)));
    } else if (amountInt > 4999) {
        setPlan('Elite');
        setBonus(200); 
        setSum(amountInt * (1 + 2.00));
        SetDate(formatDate(new Date(new Date().getTime() + 72 * 60 * 60 * 1000)));
    }
    

      INVEST()


    }

    const { data: allUser, loading: AllUsersLoading } = useQuery(GET_ALL_USERS_DETAIL);

    const ALLUSER = allUser?.getAllUsers || []

    const Pay = async (id: string) => {
      try {
        setIsPending(true)
        const wUser = ALLUSER.find((user: any) => user.userID === id) || {}
        const date = formatDate(new Date(new Date().getTime()));

        if(transactionID){
          console.log(wUser?.firstName, wUser?.email, walletAmount, wUser?.wallet, 'USD', transactionID, date)
          await wallet(wUser?.firstName, wUser?.email, walletAmount, wUser?.wallet, 'USD', transactionID, date)
          toast.success('Payment Successful')
          setIsPending(false)
          setApproval(false)
          setUid('')
          setWalletAmount(0)
          setTransactionID('')
        }
      } catch (error) {
        toast.error('Payment Failed')
        console.error(error)
      }
    }
    


    const handleApproval = (id: string, amount: number) => {
      setUid(id)
      setWalletAmount(amount)
      setApproval(true)
    }

    const handleDecline = () => {
      setApproval(false)
      setUid('')
      setWalletAmount(0)
      setTransactionID('')
    }


  return (
    <section className='p-4 dark:text-white'>

    {isApproval &&(
      <section className='fixed w-full h-screen md:ml-[13rem] flex items-center z-10'>
        <div className='w-full md:w-[50%] h-full md:h-[60vh] backdrop-blur-sm p-4'>
          <div className='w-full flex justify-end'>
            <X size={30} onClick={handleDecline}/>
          </div>
          <div className='w-full mt-20 flex md:items-center justify-center bg-white'>
            {ALLUSER.find((user: any) => user.userID === Uid) && (
              <div key={Uid} className=''>
                <p className='py-4'>
                  Enter Transaction ID to approve <span className='font-bold text-green-900'>${walletAmount} USD</span> to{' '}
                  <span className='font-bold text-green-950'>{ALLUSER.find((user: any) => user.userID === Uid)?.firstName || 'User'}</span>
                </p>
                <input
                  type='text'
                  value={transactionID}
                  onChange={(e) => setTransactionID(e.target.value)}
                  className='w-full p-2 border-2 border-green-900 rounded-lg'
                />
                <button
                  onClick={() => Pay(Uid)}
                  className='w-full bg-green-900 rounded-lg p-2 my-4 text-white font-bold'
                >
                  Confirm
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      )}


      <h1 className="w-7/12 text-xl lg:text-4xl font-bold pb-2">Manage Users</h1>
      <section className='md:flex mb-4'>
        <div className='md:w-6/12'>
          <h3 className='font-bold text-2xl'>Total Users</h3>
          <UserLocation />
          <p className='flex justify-end font-bold text-xl px-10 md:px-20'>Total: {ALLUSERS.length}</p>
        </div>
      <div className='md:w-6/12 md:px-6'>
        <h3 className='font-bold text-2xl'>Open Investment</h3>
        <select value={USERID} onChange={(event) => setUserId(event.target.value)} className='w-full p-2 my-2 border-2 border-green-900 rounded-lg'>
          <option value="">Select User</option>
          {ALLUSERS.map((user: any, index: any) => (
            <option key={index} value={user.userID}>{user.firstName} {user.lastName}</option>
          ))}
        </select>
        <input type='number' placeholder='Amount' value={amount} onChange={(event) => setAmount(event.target.value)} className='w-full p-2 my-4 border-2 border-green-900 rounded-lg' />
        <button onClick={handleTransfer} className='w-full bg-green-900 rounded-lg p-2 my-4 text-white font-bold'>Transfer</button>
      </div>
      </section>
      <table className='w-full mb-10'>
        <thead className='bg-green-900 text-white'>
          <tr>
          <th className='p-4 hidden md:flex justify-center'>S/N</th>
          <th>Name</th>
          <th>Withdrawal Request</th>
          <th>Date</th>
          <th className='hidden md:flex justify-center'>Status</th>
          <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {sortedWithdrawalReq.map((request: any, index: any) => (
          <tr key={index}>
            <td className='justify-center hidden md:flex'><Dot size={30} /></td>
            <td className='text-center'>
              {users.map((user:any) =>(
                user.userID === request.userid &&(
                  <>
                  {user?.firstName} {user?.lastName}
                  </>
                )
              ))}
             </td>
            <td className='text-center'>
              {request.amount} USD
            </td>
            <td className='text-center'>
              {new Date(request.timestamp).toLocaleString()}
            </td>
            <td className='text-center italic text-blue-900 hidden md:flex justify-center '>Pending...</td>
            <td className='justify-self-center'>
            {/* <a href="https://app.luno.com" onClick={() => { window.location.href = 'luno://open'; setTimeout(() => { window.location.href = 'https://www.luno.com/wallet'; }, 1000); }} target="_blank" > */}
                <button onClick={() => handleApproval(request.userid, request.amount)} className='w-full border hover:border-yellow-500 rounded-lg p-2 bg-yellow-600 hover:bg-yellow-500 text-white hover:text-black font-bold my-2 flex justify-center justify-self-center'>
                  {isApproval && request.userid === Uid && request.amount === walletAmount ? <Loader2Icon className='animate-spin' /> : 'Approve'}
                </button>
              {/* </a> */}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      <Toaster />
    </section>
  )
}
