import React, { useEffect, useState } from 'react';
import { InvestmentChart } from './chart'
import { UserLocation } from './users'
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS, GET_USER, GET_ALL_INVESTMENTS, GET_ALL_BALANCES, ASSETS, GET_REF, GET_MEMO, GET_CREDITS, GET_DEBITS, GET_REFERAL_COUNT } from '@/graphql/query/user';
import { BadgeDollarSign, Eye, EyeOff, EllipsisVertical, Copy, Check, CreditCard, Network, Goal, Users, DollarSign } from 'lucide-react';

interface HeaderProps {
    authenticatedUserID: string;
}

const Body: React.FC<HeaderProps> = ({ authenticatedUserID }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [copy, setCopy] = useState(false);
    const [ref, setRef] = useState('');

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

    const {data: referalCount, loading: referalLoad} = useQuery(GET_REFERAL_COUNT, {
        variables:{userID: authenticatedUserID }
    })

    const REFERAL_COUNT = referalCount?.getReferral.count || 0



    const { data: allUsers, loading: allUsersLoading } = useQuery(GET_ALL_USERS);

    const ALLUSERS = allUsers?.getAllUsers || []

    const { data: userData, loading: userLoading } = useQuery(GET_USER, {
        variables: { userID: authenticatedUserID },
    });

    const USER = userData?.getUser || {};

    const { data: allInvestments, loading: ILoading } = useQuery(GET_ALL_INVESTMENTS);

    const ALLINVESTMENTS = allInvestments?.getAllInvestments || [];
    console.log("All Investments: ", ALLINVESTMENTS)

    const sumInv = ALLINVESTMENTS.reduce((prev: number, investment: { amount: number }) => prev + investment.amount, 0);
    console.log("All Investment sum: ", sumInv)

    const { data: allBalances, loading: BLoading } = useQuery(GET_ALL_BALANCES);

    const ALLBALANCES = allBalances?.getAllBalances || [];

    const sumBal = ALLBALANCES.reduce((prev: number, balance: { amount: number }) => prev + balance.amount, 0);

    const { data: assetsData, loading: assetsLoading } = useQuery(ASSETS, {
        variables: { userid: authenticatedUserID },
    });

    const {data: userMemo, loading: memoLoad} = useQuery(GET_MEMO, {
        variables: { userID: authenticatedUserID },
      })
    
      const MEMO = userMemo?.getMemo.memo || '';

    const {data: userCredit, loading: load, refetch: fetch1} = useQuery(GET_CREDITS,{
        variables:{to: MEMO },
      })
      
      const CREDITS = userCredit?.getUserCreditTransactions || []
      
      const {data: userDebit, loading: load2, refetch: fetch2} = useQuery(GET_DEBITS, {
        variables:{from: MEMO}
      })
      
      const DEBITS = userDebit?.getUserDebutTransactions || []

    const BALANCE = assetsData?.getUserAsset.getBalance || 0;
    const CREDIT = assetsData?.getUserAsset.getCredit || 0;
    const INVESTMENT = assetsData?.getUserAsset.getInvestment || 0;
    const REFERENCE = assetsData?.getUserAsset.getReferences || 0;

    const sumCREDITS = CREDITS.reduce((prev: number, balance: {amount: number}) => prev + balance.amount, 0)
    const sumDEBITS = DEBITS.reduce((prev: number, balance:{amount: number}) => prev + balance.amount, 0);
    const getBALANCE = sumCREDITS - sumDEBITS
    // const getESTIMATE = BALANCE + getBALANCE
    console.log("all credits: ", sumCREDITS)

    const assets = [
        { name: 'Credit', value: sumCREDITS },
        { name: 'Investment', value: INVESTMENT },
        { name: 'Referal', value: REFERAL_COUNT }
    ];

    const { data: refData, loading: refLoading } = useQuery(GET_REF, {
        variables: { userID: authenticatedUserID },
    });

    const REF = refData?.getReferral.link || '';

    useEffect(() => {
        if (REF) {
            setRef(`https://www.aramcodashboard.com/auth/join?link=${REF}`);
        }
    }, [REF]);

    return (
        <div className='dark:text-white'>
            {USER.type == "ADMIN" ?(
                <>
                   <section className='grid md:flex items-center font-semibold'>
                   <div className='bg-green-900 text-white border-2 border-green-500/50 md:w-full p-2 m-4 rounded-lg grid hover:shadow-md hover:shadow-green-500/50'>
                        <div className='flex items-center justify-between h-12'>
                            <p className={`rounded-full flex items-center justify-center w-14 h-11 text-sm text-white p-1 bg-green-900`}>
                            <BadgeDollarSign size={40} className='text-40' />
                            </p>
                            <div className='w-full flex justify-end'>
                                <EllipsisVertical className='text-green-900 cursor-pointer' />
                            </div>
                        </div>
                        <p className='my-2 '> Total Balance </p>
                        <div className='w-full flex items-center justify-between'>
                            <p className='text-xl'>${sumInv == 0 ? '0.00' : sumInv} </p>
                        </div>
                    </div>

                    <div className='border-2 border-green-900 md:w-full p-2 m-4 rounded-lg grid hover:shadow-md hover:shadow-green-500/50'>
                        <div className='flex items-center justify-between h-12'>
                            <p className={`rounded-full flex items-center justify-center w-14 h-11 text-sm text-white p-1 bg-green-900`}>
                                <Goal />
                            </p>
                            <div className='w-full flex justify-end'>
                                <EllipsisVertical className='text-green-900 cursor-pointer' />
                            </div>
                        </div>
                        <p className='my-2 '> Total Investment </p>
                        <div className='w-full flex items-center justify-between'>
                            <p className='text-xl'>${sumInv == 0 ? '0.00' : sumInv} </p>
                        </div>
                    </div>

                    <div className='border-2 border-green-900 md:w-full p-2 m-4 rounded-lg grid hover:shadow-md hover:shadow-green-500/50'>
                        <div className='flex items-center justify-between h-12'>
                            <p className={`rounded-full flex items-center justify-center w-14 h-11 text-sm text-white p-1 bg-green-900`}>
                                <Users />
                            </p>
                            <div className='w-full flex justify-end'>
                                <a href={'/manage_users'} >
                                    <EllipsisVertical className='text-green-900 cursor-pointer' />
                                </a>
                            </div>
                        </div>
                        <p className='my-2 '> Total Users </p>
                        <div className='w-full flex items-center justify-between'>
                            <p className='text-xl'>{ALLUSERS.length} </p>
                        </div>
                    </div>
            </section>  

            <section className='grid md:flex items-center justify-between w-full md:w-[100%] gap-y-4 z-[-1] '>
                <div className='w-full md:w-8/12 dark:bg-white dark:bg-opacity-20 mx-4 p-2 rounded-md'>
                <p className='my-2 mx-4 font-bold  '>Investment Chart </p>
                    <InvestmentChart />
                </div>
                <div className='pl-10 w-full md:w-4/12 dark:bg-white dark:bg-opacity-20 mx-4 p-2 rounded-md'>
                <p className='my-2 font-bold '> Users&apos; Location </p>
                    <UserLocation />
                </div>
            </section>
                </>
            ):(
            <>
            <section className='grid md:flex items-center font-semibold'>
                <div className='bg-green-900 text-white border-2 border-green-500/50 md:w-full p-2 m-4 rounded-lg grid hover:shadow-md hover:shadow-green-500/50'>
                    <div className='w-full flex items-center justify-between'>
                        <BadgeDollarSign size={40} className='text-40' />
                        <EllipsisVertical className='text-white h-10 cursor-pointer' />
                    </div>
                    <p className='my-2 text-lg'>Balance</p>
                    <div className='flex items-center '>
                        {isVisible ? (
                            <>
                                <p className='text-2xl'>${getBALANCE === 0 ? '0.00' : getBALANCE}</p>
                                <Eye className='mx-2 cursor-pointer' onClick={() => setIsVisible(false)} />
                            </>
                        ) : (
                            <>
                                <p className='text-2xl'>$****</p>
                                <EyeOff className='mx-2 cursor-pointer' onClick={() => setIsVisible(true)} />
                            </>
                        )}
                    </div>
                </div>
                {assets.map(card => (
                    <div key={card.name} className='border-2 border-green-900 md:w-full p-2 m-4 rounded-lg grid hover:shadow-md hover:shadow-green-500/50'>
                        <div className='flex items-center justify-between h-12'>
                            <p className={`rounded-full flex items-center justify-center w-14 h-11 text-sm text-white p-1 bg-green-900`}>
                                {card.name === 'Credit' ? <CreditCard /> : card.name === 'Investment' ? <Goal /> : <Network />}
                            </p>
                            <div className='w-full flex justify-end'>
                                <EllipsisVertical className='text-green-900 cursor-pointer' />
                            </div>
                        </div>
                        <p className='my-2 '>{card.name}</p>
                        <div className='w-full flex items-center justify-between'>
                            <p className={`text-xl ${card.name === 'Referal' ? 'ml-2' : null}`}>{card.name === 'Referal' ? '' : '$'}{card.value === 0 ? '0.00' : card.name ===  'Referal' ? REFERAL_COUNT : card.value}</p>
                        </div>
                    </div>
                ))}
            </section>
            </>    
            )}
            

            <section className='font-semibold m-4'>
                <p className='font-bold text-2xl'>Your Referral Link</p>
                <div className='w-full flex border-2 border-green-900/50 my-4'>
                    <input type='text' value={ref} className='w-full px-2  rounded-lg' readOnly />
                    {copy ? (
                        <Check className='border-l-2 border-green-900/50 px-3 mr-2 cursor-pointer' size={55} />
                    ) : (
                        <Copy className='border-l-2 border-green-900/50 px-3 mr-2 cursor-pointer' onClick={() => handleCopy(ref)} size={55} />
                    )}
                </div>
            </section>
        </div>
    );
};

export default Body;
