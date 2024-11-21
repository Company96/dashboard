import { Check, Copy, CopyIcon, Eye, EyeOff } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import { MAKE_TRANSACTION } from '@/graphql/mutation/user';
import { GET_USER, ASSETS, GET_MEMO, GET_CREDITS, GET_DEBITS, GET_REF, GET_USER_INVESTMENT } from '@/graphql/query/user';
import toast, {Toaster} from 'react-hot-toast'

interface HeaderProps {
  authenticatedUserID: string;
}

const Card: React.FC<HeaderProps> = ({ authenticatedUserID }) => {
    const [show, isOpen] = useState<boolean>(false)
    const [copy, setCopy] = useState<boolean>(false)
    const [ref, setRef] = useState('')
    const [mem, setMem] = useState('')
    const [memoCopy, setMemoCopy] = useState<boolean>(false)
    

    const { data: userData, loading: userLoading, refetch } = useQuery(GET_USER, {
      variables: { userID: authenticatedUserID },
  });

  const USER = userData?.getUser || {};

  const {data: userMemo, loading: memoLoad} = useQuery(GET_MEMO, {
    variables: { userID: authenticatedUserID },
  })

  const MEMO = userMemo?.getMemo.memo || '';

  // console.log("memo: ", MEMO);

  const {data: Assets, loading: useLoading, refetch: reload} = useQuery(ASSETS, {
    variables: {userid: authenticatedUserID}
});

const BALANCE = Assets?.getUserAsset.getBalance || 0;

const {data: investments} = useQuery(GET_USER_INVESTMENT,{
  variables: {userID: authenticatedUserID}
})

const INVESTMENT = investments?.getInvestment || []
// console.log("investment: ", INVESTMENT)

const handleCopy = (link: string) => {
  navigator.clipboard.writeText(link)
      .then(() => {
          setCopy(true);
          setTimeout(() => setCopy(false), 1000);
      })
      .catch(err => {
          console.error('Failed to copy: ', err);
      });
};

const handleMemoCopy = (link: string) => {
  navigator.clipboard.writeText(link)
  .then(() =>{
    setMemoCopy(true);
    setTimeout(() => setMemoCopy(false), 1000);
  })
  .catch(err => {
    console.error('Failed to copy: ', err);
  })
}

const { data: refData, loading: refLoading } = useQuery(GET_REF, {
  variables: { userID: authenticatedUserID },
});

const REF = refData?.getReferral.link || '';

useEffect(() => {
  if (REF) {
      setRef(`https://www.aramcodashboard.com/auth/join?link=${REF}`);
  }
}, [REF]);

useEffect(() => {
  if (MEMO){
    setMem(MEMO);
  }
}, [MEMO])

const {data: userCredit, loading: load, refetch: fetch1} = useQuery(GET_CREDITS,{
  variables:{to: MEMO },
})

const CREDITS = userCredit?.getUserCreditTransactions || []

const {data: userDebit, loading: load2, refetch: fetch2} = useQuery(GET_DEBITS, {
  variables:{from: MEMO}
})

const DEBITS = userDebit?.getUserDebutTransactions || []

const sumINVESTMENTS = INVESTMENT.reduce((prev: number, balance: {amount: number}) => prev + balance.amount, 0)
const sumCREDITS = CREDITS.reduce((prev: number, balance: {amount: number}) => prev + balance.amount, 0)
const sumDEBITS = DEBITS.reduce((prev: number, balance:{amount: number}) => prev + balance.amount, 0);
const getBALANCE = sumCREDITS - sumDEBITS

const getESTIMATE = BALANCE + getBALANCE

  return (
    <div>
    <section className='flex bg-gray-100 dark:bg-white dark:bg-opacity-10 py-6 mb-4 dark:text-white'>
    <div className='w-7/12 p-4 text-md lg:text-xl  font-semibold leading-loose '>
    <div className='mb-2 pb-2 border-b-2 border-black'>
      <p>Memo:</p>
      <div className='flex items-center gap-x-4'>
        <div className='flex overflow-hidden'>
          <p>{MEMO}</p>
        </div>  
      {memoCopy ? <Check size={30}/> : <CopyIcon size={30} onClick={() => handleMemoCopy(mem)} />}
      </div>
    </div>
      <p className='flex items-center mb-2 md:mb-6 '>Estimated Balance {show ? <span><Eye className='mx-2' onClick={() => isOpen(false)} /></span> : <EyeOff className='mx-2' onClick={() => isOpen(true)} />}</p>
      {show ?(
        <p>${getESTIMATE == 0 ? '0.00': getESTIMATE}</p>
      ):(
        <p>***Balance is hidden***</p>
      )}
    </div>
    <div className='w-5/12 py-4 pr-4'>
      <p className='font-semibold text-xl mb-2'>My Assets</p>
      <table className='w-full text-left'>
        <thead className='bg-green-900 text-white'>
          <tr>
            <th className='p-2'>Asset</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr className='border-b-2 dark:border-black'>
            <td>Investment</td>
            <td>${sumINVESTMENTS === 0 ? '0.00' : sumINVESTMENTS}</td>
          </tr>
          <tr className='border-b-2 dark:border-black'>
            <td>Credit</td>
            <td>${sumCREDITS === 0 ? '0.00' : sumCREDITS}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section className='font-semibold m-4 dark:text-white'>
      <p className='font-bold text-2xl'>Your Referral Link</p>
      <div className='w-full flex border-2 border-green-900/50 my-4'>
          <input type='text' value={ref} className='w-full px-2 rounded-lg' readOnly />
          {copy ? (
              <Check className='border-l-2 border-green-900/50 px-3 mr-2 cursor-pointer' size={55} />
          ) : (
              <Copy className='border-l-2 border-green-900/50 px-3 mr-2 cursor-pointer' onClick={() => handleCopy(ref)} size={55} />
          )}
      </div>
  </section>
  <Toaster />
  </div>
  )
}

export default Card;
