import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '@/graphql/mutation/user';
import toast, { Toaster } from 'react-hot-toast';
import {sendOTPtoMail, verifyOTP} from '@/lib/api'

export default function Reset() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const [loader, isLoading]=useState<boolean>(false);
  const [enterMail, setEnterMail] = useState<boolean>(true)
  const [enterOTP, setEnterOTP] = useState<boolean>(false)
  const [OTP, setOTP] = useState<string[]>(Array(4).fill(''));
  const [enterPass, setEnterPass] = useState<boolean>(false)
  const [count, setCount] = useState<number>(60 * 1000);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [resendOTP, setResendOTP] = useState<boolean>(false)
  const [verifying, setVerifying] = useState<boolean>(false)


  const navigation = useRouter();

  const [resetPassword, { loading: resetPasswordLoading }] = useMutation(RESET_PASSWORD, {
    variables: {
      email,
      newPassword: password
    },
    onCompleted: async(data) => {
      // console.log(data);
      toast.success('Password reset successfully. Proceed to login with your new password');
      isLoading(false)
      setTimeout(() => {
        navigation.push('/auth/login');
      }, 5000);
    },
    onError: (error) => {
      isLoading(false);
      console.error(error);
      toast.error('Failed to reset password');
    },
  })

  useEffect(() => {
    if (count <= 0) {
      setResendOTP(true);
      return;
    }
  
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 0) {
          clearInterval(timer);
          setResendOTP(true);  
          return 0;
        }
        return prevCount - 1000;
      });
    }, 1000);
  
    return () => clearInterval(timer);
  }, [count]);
  const startCounter = () => {
    setCount(60 * 1000);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const ResetThroughMail = async () => {
    try{
      await sendOTPtoMail(email)
      setEnterMail(false)
      isLoading(false)
      setResendOTP(false)
      setEnterOTP(true)
      startCounter()
    }catch(error){
      toast.error('Failed to send OTP to mail. Please try again later.');
      console.error("Failed to send OTP to mail: ",error)
      isLoading(false)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email === '') {
      console.log('email field cannot be empty');
      toast.error('email field cannot be empty');
      return;
    }
    isLoading(true)
    ResetThroughMail();
  };
  
  useEffect(() => {
    const fullOTP = OTP.join('');
    if (fullOTP.length === 4 && OTP.every(digit => digit !== '')) {
      setVerifying(true)
      handleSubmitOTP();
    }
  }, [OTP]);
  

  const handleSubmitOTP = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    const fullOTP = OTP.join('');
    // console.log("full OTP: ", fullOTP);
    try {
      const response = await verifyOTP(fullOTP, email);

      if (!response.ok) {
        throw new Error('OTP verification failed');
      }
      toast.success('OTP verified successfully');
      setVerifying(false)
      setEnterOTP(false);
      setEnterPass(true);

    } catch (error) {
      console.error('Could not verify OTP:', error);
      toast.error('Failed to verify OTP. Please try again.');
      setVerifying(false)
    }
  };
  

  const handleOTPChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newOTP = [...OTP];
      newOTP[index] = value;
  
      setOTP(prevOTP => {
        const updatedOTP = [...prevOTP];
        updatedOTP[index] = value;
        return updatedOTP;
      });
  
      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  
  const ResendThroughMail = async () => {
    isLoading(true)
    try{
      await sendOTPtoMail(email)
      setEnterMail(false)
      isLoading(false)
      setResendOTP(false)
      setOTP(['','','',''])
      setEnterOTP(true)
      startCounter()
    }catch(error){
      toast.error('Failed to resend OTP to mail. Please try again.');
      console.error("Failed to resend OTP to mail: ",error)
      isLoading(false)
    }
  }

  const handleSubmitNewPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password === '' || conPassword === '') {
      toast.error('Password fields cannot be empty');
      return;
    }
    if(password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (password !== conPassword) {
      toast.error('Passwords do not match');
      return;
    }

    isLoading(true)
    
    resetPassword()

  }


  return (
    <div className='w-full min-h-full flex flex-1 flex-col justify-center py-60 dark:text-white'>
     {enterMail && (
      <>
      <form onSubmit={handleSubmit} className='sm:mx-auto sm:w-full sm:max-w-md sm:border-2 rounded-lg p-4 dark:bg-white dark:bg-opacity-5'>
        <div className='w-full flex items-center justify-center my-4'>
          <img src={'/aramco.png'} alt='Logo' className='w-3/6' />
        </div>
        <p className='text-center'>Enter your account&apos;s email address</p>
        <section>
          <div className='my-2'>
            <input
              type="email"
              name='email'
              id='email'
              value={email}
              onChange={(event) => setEmail(event.target?.value)}
              placeholder='Enter Email Address'
              className='w-full p-3 border-2 border-green-900/90 focus:outline-none rounded-lg'
            />
          </div>
          {loader ?(
          <div className='w-full bg-green-900 text-white font-bold rounded-md p-2 my-4 flex items-center justify-center cursor-wait'>
          <Image src={'/loader.png'} alt='Loading...' width={25} height={25} className='animate-spin' />
        </div>
        ):(
          <button type='submit' className='w-full bg-green-900 text-white font-bold rounded-md p-2 my-2'>
            Send OTP
          </button>
        )}
          <p>Don&apos;t have an account? <Link href={'/auth/signup'} className='text-blue-900/90 underline mx-2 font-bold'>Sign up</Link></p>
        </section>
      </form>
      </>
      )}
      {enterOTP && (
        <form onSubmit={(event) => handleSubmitOTP(event)} className='sm:mx-auto sm:w-full sm:max-w-md sm:border-2 rounded-lg p-4 dark:bg-white dark:bg-opacity-5 relative overflow-hidden'>
          <div className='w-full flex items-center justify-center my-4'>
            <img src={'/aramco.png'} alt='Logo' className='w-3/6' />
          </div>
          {resendOTP ? (
            <>
             {loader ?(
          <div className='w-full bg-green-900 text-white font-bold rounded-md p-2 my-4 flex items-center justify-center cursor-wait'>
          <Image src={'/loader.png'} alt='Loading...' width={25} height={25} className='animate-spin' />
        </div>
        ):(
          <>
            <p className='text-red-500 text-center font-bold'>OTP Expired!</p>
            <div onClick={() => ResendThroughMail()} className='w-full bg-green-900 text-white font-bold rounded-md p-2 my-2 text-center cursor-pointer'>
              Resend OTP
            </div>
          </>
        )}
            </>
          ):(
            <>
            {verifying && (
              <div className='w-full h-full absolute top-0 left-0  bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center'>
              <Image src={'/loader.png'} alt='Loading...' width={30} height={25} className='animate-spin' />
            </div>
            )}
            <p className='text-center'>Verify OTP</p>
            <p className='text-center italic text-sm'>
              An otp has been sent to <span className='text-green-500 underline'>{email}</span>
            </p>
            <section>
              <div className='my-2 flex space-x-2'>
                {OTP.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleOTPChange(event.target.value, index)}
                    onFocus={() => handleFocus(index)}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    className={`w-1/4 p-3 border-2 ${
                      focusedIndex === index ? 'border-green-900/90' : 'border-gray-500'
                    } focus:outline-none rounded-lg text-center`}
                  />
                ))}
                 </div>
            <div>
            <p>OTP expires in <span className='text-red-500 font-bold'>{formatTime(count)}</span></p>
            </div>
          </section>
            </>
          )}
           
        </form>
      )}
      {enterPass && (
      <>
      <form onSubmit={handleSubmitNewPassword} className='sm:mx-auto sm:w-full sm:max-w-md sm:border-2 rounded-lg p-4 dark:bg-white dark:bg-opacity-5'>
        <div className='w-full flex items-center justify-center my-4'>
          <img src={'/aramco.png'} alt='Logo' className='w-3/6' />
        </div>
        <p className='text-center'>Create a new Passwword</p>
        <section>
        <div className='my-2'>
            <label htmlFor='password'>New Password:</label>
            <div className='w-full flex items-center p-1 border-2 border-green-900/90 rounded-lg'>
              <input
                type='password'
                name='password'
                id='password'
                value={password}
                onChange={(event) => setPassword(event.target?.value)}
                placeholder='Enter Password'
                className='w-full focus:outline-none p-2'
              />
            </div>
          </div>
          <div className='my-2'>
            <label htmlFor='password'>Confirm Password:</label>
            <div className='w-full flex items-center p-1 border-2 border-green-900/90 rounded-lg'>
              <input
                type='password'
                name='password'
                id='password'
                value={conPassword}
                onChange={(event) => setConPassword(event.target?.value)}
                placeholder='Verify Password'
                className='w-full focus:outline-none p-2'
              />
            </div>
          </div>
          {loader ?(
          <div className='w-full bg-green-900 text-white font-bold rounded-md p-2 my-4 flex items-center justify-center cursor-wait'>
          <Image src={'/loader.png'} alt='Loading...' width={25} height={25} className='animate-spin' />
        </div>
        ):(
          <button type='submit' className='w-full bg-green-900 text-white font-bold rounded-md p-2 my-2'>
            Submit
          </button>
        )}
        </section>
      </form>
      </>
      )}
      <Toaster />
    </div>
  );
}