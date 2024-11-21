import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AlignLeft, Check, Copy, X } from 'lucide-react'
import { Menu } from '@/utils/nav'
import { useQuery, useMutation } from '@apollo/client'
import { MAKE_TRANSACTION, EDIT_WALLET, MAKE_WITHDRAWAL_REQUEST } from '@/graphql/mutation/user'
import {
  ASSETS,
  GET_USER_TYPE,
  GET_MEMO,
  GET_CREDITS,
  GET_DEBITS,
  GET_ADMIN_ACCOUNT,
} from '@/graphql/query/user'
import toast, { Toaster } from 'react-hot-toast'

interface HeaderProps {
  authenticatedUserID: string
}

const Head: React.FC<HeaderProps> = ({ authenticatedUserID }) => {
  const [menu, isOpen] = useState<boolean>(false)
  const [deposit, setDeposit] = useState<boolean>(false)
  const [withdrawal, setWithdrawal] = useState<boolean>(false)
  const [transfer, setTransfer] = useState<boolean>(false)
  const [copy, setCopy] = useState<boolean>(false)
  const [receipient, setReceipient] = useState('')
  const [amount, setAmount] = useState('0')
  const [amountReq, setAmountReq] = useState('0')
  const [account, setAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [receiverAddress, setReceiverAddress] = useState('');

  const { data: getType, loading: typeReload } = useQuery(GET_USER_TYPE, {
    variables: { userID: authenticatedUserID },
  })

  const TYPE = getType?.getUser.type || ''

  const { data: Account, loading: accountload } = useQuery(GET_ADMIN_ACCOUNT)

  const { data: userMemo, loading: memoLoad } = useQuery(GET_MEMO, {
    variables: { userID: authenticatedUserID },
  })

  const MEMO = userMemo?.getMemo.memo || ''

  const [TRANS, { loading }] = useMutation(MAKE_TRANSACTION, {
    variables: {
      input: {
        to: receipient,
        from: TYPE === 'ADMIN' ? '0x000000000000000000000000000000000' : MEMO,
        amount: amount,
      },
    },

    onCompleted: (data) => {
      //   console.log(data)
      toast.success(
        `Transaction completed. ${amount} has been successfully sent to ${receipient}`,
      )
      setTransfer(false)
      reload()
      reloadCredit()
      reloadDebit()
    },
    onError: (error) => {
      toast.error(`Transaction failed.`)
    },
  })

  const { data: Assets, loading: useLoading, refetch: reload } = useQuery(
    ASSETS,
    {
      variables: { userid: authenticatedUserID },
    },
  )

  const BALANCE = Assets?.getUserAsset.getBalance || 0

  const { data: userCredit, loading: load, refetch: reloadCredit } = useQuery(
    GET_CREDITS,
    {
      variables: { to: MEMO },
    },
  )

  const CREDITS = userCredit?.getUserCreditTransactions || []

  const { data: userDebit, loading: load2, refetch: reloadDebit } = useQuery(
    GET_DEBITS,
    {
      variables: { from: MEMO },
    },
  )

  const DEBITS = userDebit?.getUserDebutTransactions || []

  const sumCREDITS = CREDITS.reduce(
    (prev: number, balance: { amount: number }) => prev + balance.amount,
    0,
  )
  const sumDEBITS = DEBITS.reduce(
    (prev: number, balance: { amount: number }) => prev + balance.amount,
    0,
  )
  const getBALANCE = sumCREDITS - sumDEBITS

  const getESTIMATE = BALANCE + getBALANCE

  const handleCopy = (link: string) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopy(true)
        setTimeout(() => setCopy(false), 1000)
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }

  const handleBalCopy = () => {
    setAmount(BALANCE.toString())
  }

  const handleTransfer = () => {
    if (receipient === MEMO || receipient === '0x000000000000000000') {
      toast.error('You cannot transfer to yourself or a null account.')
      return
    }

    TRANS()
  }

  useEffect(() => {
    const ADMIN_ACCOUNT = Account?.getWallet.address || {}
    setAccount(ADMIN_ACCOUNT)
  }, [Account])

  const [Edit, { loading: editLoad }] = useMutation(EDIT_WALLET, {
    onCompleted: (data) => {
      // console.log(data)
      toast.success(`Admin address edited successfully`)
      setIsLoading(false)
    },
    onError: (error) => {
      toast.error(`Failed to edit address.`)
      setIsLoading(false)
    },
  })

  const handleAccountEdit = async () => {
    setIsLoading(true)
    try {
      await Edit({
        variables: {
          walletID: '0a00',
          input: {
            address: account,
          },
        },
      })
    } catch (error) {
      console.log('Error updating Admin wallet address')
    }
  }

  const [withdrawalRequest] =useMutation(MAKE_WITHDRAWAL_REQUEST,{
    variables: {
      userID: authenticatedUserID,
      input: {
        userid: authenticatedUserID,
        from: MEMO,
        amount: amountReq,
      },
    },
    onCompleted: (data) => {
      toast.success("Withdrawal request sent to the admin successfully")
      setWithdrawal(false)
      reload()
      reloadCredit()
      reloadDebit()
    }
  })

  const makeWithdrawalRequest =()=>{
    withdrawalRequest()
  }

  return (
    <div className="dark:text-white">
      {deposit && (
        <section className="fixed w-full h-full bg-white dark:bg-[#121212] bg-opacity-50 dark:bg-opacity-30 backdrop-blur-md">
          <div className="w-full flex my-10 w-full ml- md:ml-[17vw] lg:ml-[25vw]">
            <div className="w-full md:w-[50vw] lg:w-[30vw] h-[30vh] bg-white dark:bg-[#121212] border-2 dark:border dark:border-opacity-20 border-gray-300 rounded-lg p-4">
              <div className="flex justify-center items-center">
                <h3 className="font-semibold text-center w-full">Deposit</h3>
                <X
                  size={30}
                  onClick={() => setDeposit(false)}
                  className="flex justify-end"
                />
              </div>
              <div className="my-6">
                <p className="text-sm italic">
                  Transfer to the Admin wallet address
                </p>
                <div className="w-full flex border-2 border-green-500 py-2 px-2">
                  {TYPE === 'ADMIN' ? (
                    <input
                      type="text"
                      value={account}
                      onChange={(e: any) => setAccount(e.target.value)}
                      className="w-full font-bold focus:outline-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={account}
                      className="w-full font-bold focus:outline-none"
                      readOnly
                    />
                  )}

                  {copy ? (
                    <Check
                      className="border-l-2 border-green-900/50 px-4 cursor-pointer"
                      size={55}
                    />
                  ) : (
                    <Copy
                      className="border-l-2 border-green-900/50 px-4 cursor-pointer"
                      onClick={() => handleCopy(account)}
                      size={55}
                    />
                  )}
                </div>

                {TYPE === 'ADMIN' && (
                  <>
                    {isLoading ? (
                      <div className="w-full bg-green-900 text-white font-bold rounded-md p-2 my-4 flex items-center justify-center cursor-wait">
                        <Image
                          src={'/loader.png'}
                          alt="Loading..."
                          width={25}
                          height={25}
                          className="animate-spin"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAccountEdit}
                        className="w-full bg-green-900 text-white font-bold rounded-md p-2 my-4"
                      >
                        Edit
                      </button>
                    )}
                  </>
                )}
              </div>              
            </div>
          </div>
        </section>
      )}

      {withdrawal && (
        <section className="fixed w-full h-full bg-white dark:bg-[#121212] bg-opacity-50 dark:bg-opacity-30 backdrop-blur-md">
          <div className="w-full flex my-10 w-full ml- md:ml-[17vw] lg:ml-[25vw] ">
            <div className="w-full md:w-[50vw] lg:w-[30vw] h-[30vh] bg-white dark:bg-[#121212] border-2 dark:border dark:border-opacity-20 border-gray-300 rounded-lg p-4">
              <div className="flex justify-center items-center">
                <h3 className="font-semibold text-center w-full">Withdrawal</h3>
                <X
                  size={30}
                  onClick={() => setWithdrawal(false)}
                  className=" flex justify-end"
                />
              </div>
              <div className="my-2">
                <p className="text-md">Amount:</p>
                <input
                  type="number"
                  value={amountReq}
                  onChange={(event) => setAmountReq(event.target?.value)}
                  className={`w-full flex border-2 border-green-500 py-2 px-2 rounded ${
                    amountReq > getESTIMATE ? 'text-red-500' : null
                  }`}
                />
                <div className="w-full flex justify-end italic text-sm">
                  Wallet Balance - $
                  <span
                    onClick={() => setAmountReq(getESTIMATE)}
                    className="cursor-pointer hover:underline"
                  >
                    {getESTIMATE}
                  </span>
                </div>
                {amountReq > getESTIMATE ? (
                  <div className="w-full border-2 bg-red-500 p-2 my-2 border-none rounded text-white font-semibold text-center cursor-not-allowed">
                    Not enough balance
                  </div>
                ) : (
                  <button onClick={makeWithdrawalRequest} className="w-full border-2 bg-green-500 p-2 my-2 border-none rounded text-white font-semibold">
                    Make Withdrawal Request
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {transfer && (
        <section className="fixed w-full h-full bg-white dark:bg-[#121212] dark:bg-opacity-30 bg-opacity-50 backdrop-blur-md">
          <div className="w-full flex my-10 w-full ml- md:ml-[17vw] lg:ml-[25vw] ">
            <div className="w-full md:w-[50vw] lg:w-[30vw] h-[50vh] md:h-[50vh] bg-white dark:bg-[#121212] border-2 dark:border dark:border-opacity-30 border-gray-300 rounded-lg p-4">
              <div className="flex justify-center items-center">
                <h3 className="font-semibold text-center w-full">Transfer</h3>
                <X
                  size={30}
                  onClick={() => setTransfer(false)}
                  className=" flex justify-end"
                />
              </div>
              <div className="my-2">
                <p className="text-md">To:</p>
                <input
                  type="text"
                  value={receipient}
                  onChange={(event) => setReceipient(event.target?.value)}
                  className="w-full flex border-2 border-green-500 py-2 px-2 focus:outline-none rounded"
                />
              </div>
              <div className="my-2">
                <p className="text-md">Amount:</p>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  className="w-full flex border-2 border-green-500 py-2 px-2 focus:outline-none rounded"
                />
                <div className="w-full flex justify-end italic text-sm">
                  Wallet Balance - $
                  <span
                    onClick={() => setAmount(getESTIMATE)}
                    className="cursor-pointer hover:underline"
                  >
                    {getESTIMATE}
                  </span>
                </div>
              </div>
              {TYPE === 'ADMIN' ? (
                <>
                  <button
                    onClick={handleTransfer}
                    className="w-full border-2 bg-green-500 p-2 my-2 border-none rounded text-white font-semibold"
                  >
                    Transfer
                  </button>
                </>
              ) : (
                <>
                  {amount > getESTIMATE ? (
                    <div className="w-full border-2 bg-red-500 p-2 my-2 border-none rounded text-white font-semibold text-center cursor-not-allowed">
                      Not enough balance
                    </div>
                  ) : (
                    <button
                      onClick={handleTransfer}
                      className="w-full border-2 bg-green-500 p-2 my-2 border-none rounded text-white font-semibold"
                    >
                      Transfer
                    </button>
                  )}
                </>
              )}

              <p className="text-red-500 italic text-sm">
                <span className="font-semibold">Warning:</span> Wallet to wallet
                transfer can only be done between wallet addresses generated
                from the organization&apos;s database. Not adhering to this
                might lead to loss of asset.
              </p>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between ">
          <h1 className="w-7/12 text-xl lg:text-4xl font-bold p-4">
            Wallet Overview
          </h1>
          {menu ? (
            <X
              className="flex cursor-pointer lg:hidden m-4 "
              onClick={() => isOpen(false)}
            />
          ) : (
            <AlignLeft
              className="flex cursor-pointer lg:hidden m-4 "
              onClick={() => isOpen(true)}
            />
          )}

          <div
            className={`block lg:hidden w-full absolute bg-white dark:bg-[#121212] transition-all ease-in-out duration-300 ${
              menu ? 'mt-60' : 'mt-[-25rem]'
            }`}
            onClick={() => isOpen(false)}
          >
            <ul className="grid w-full justify-center text-center font-semibold p-6 leading-loose">
              {Menu.map((menu) => (
                <li
                  key={menu.name}
                  className="hover:text-green-900 cursor-pointer"
                  onClick={() =>
                    menu.onClick &&
                    menu.onClick(
                      menu.name === 'Deposit'
                        ? setDeposit
                        : menu.name === 'Withdraw'
                        ? setWithdrawal
                        : setTransfer,
                    )
                  }
                >
                  {menu.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-4/12 font-semibold hidden lg:flex justify-between lg:px-4 dark:text-[#121212]">
            <button
              type="button"
              className="bg-gray-200 hover:bg-green-200 px-6 py-2 border-2 border-green-900/50 rounded-lg"
              onClick={() => setDeposit(true)}
            >
              Deposit
            </button>
            <button
              type="button"
              className="bg-gray-200 hover:bg-green-200 px-4 py-2 border-2 border-green-900/50 rounded-lg"
              onClick={() => setWithdrawal(true)}
            >
              Withdrawal
            </button>
            <button
              type="button"
              className="bg-gray-200 hover:bg-green-200 px-6 py-2 border-2 border-green-900/50 rounded-lg"
              onClick={() => setTransfer(true)}
            >
              Transfer
            </button>
          </div>
        </div>
      </section>
      <Toaster />
    </div>
  )
}

export default Head
