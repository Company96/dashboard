import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { setCookie } from 'cookies-next';
import { LOGIN, VERIFY_USER } from '@/graphql/mutation/auth';
import { useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination } from 'swiper/modules';

export default function Login() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, isLoading]=useState<boolean>(false);

  const VerificationLink = useSearchParams();

  const Verification = VerificationLink.get('verifier')

const [Verify, {loading: loadVerifier}] = useMutation(VERIFY_USER, {
  variables : {uniqueverifier: Verification }
})

  const [login, loading] = useMutation(LOGIN, {
    variables: {
      email,
      password,
    },
    onCompleted: async (data) => {
      const token = data?.login;
      await Verify()
      isLoading(false)
      setCookie('token', data.login);
        window.location.href = '/';
    },
    onError: (error) => {
      console.error('Login failed', error);
      isLoading(false)
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((graphQLError) => {
          console.error('GraphQL Error:', graphQLError.message);
          toast.error('Access denied: Invalid credentials');
        });
      }
      if (error.networkError) {
        console.error('Network Error:', error.networkError);
        toast.error('Operation failed: Network Error!');
      }
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email === '' || password === '') {
      console.log('Empty fields are not allowed');
      toast.error('Empty fields are not allowed');
      return;
    }
    isLoading(true)
    login();
  };

  return (
    <div className='w-full min-h-full flex flex-1 flex-col justify-center md:py-40 dark:text-white'>
      <section className=' h-[57vh] md:hidden'>
      <div className='w-full fixed z-10 flex md:hidden items-center justify-end pr-2 my-4'>
          <img src={'/aramco.png'} alt='Logo' className='w-3/6' />
        </div>
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper relative -z-1"
        >
          <SwiperSlide
            style={{
              backgroundImage: `url('/aramco%20(2).jpg')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
            }}
          >
            <div className="w-full h-full flex items-center bg-black bg-opacity-50">
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5, duration: 1 },
                }}
                className="z-10 mt-40 mx-2 font-semibold"
              >
                Aramco was established to assist individuals, both wealthy and those with fewer resources in growing their wealth.
              </motion.p>
            </div>
          </SwiperSlide>
          <SwiperSlide
            style={{
              backgroundImage: `url('/aramco%20(1).jpg')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
            }}
          >
            <div className="w-full h-full flex items-center bg-black bg-opacity-50">
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5, duration: 1 },
                }}
                className="z-10 mt-40 mx-2 font-semibold"
              >
                Our focus spans multiple sectors, including oil and gas, real estate management, gold mining, life insurance and agriculture. 
              </motion.p>
            </div>
          </SwiperSlide>
          <SwiperSlide
            style={{
              backgroundImage: `url('/aramco%20(6).jpg')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
            }}
          >
            <div className="w-full h-full flex items-center bg-black bg-opacity-50">
              <motion.p
                initial={{ opacity: 0, y: -50 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5, duration: 1 },
                }}
                className="z-10 mt-40 mx-2 font-semibold"
              >
                We are passionate about empowering people to achieve financial success.
              </motion.p>
            </div>
          </SwiperSlide>
          <SwiperSlide
            style={{
              backgroundImage: `url('/aramco%20(7).jpg')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
            }}
          >
            <div className="w-full h-full flex items-center bg-black bg-opacity-50">
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5, duration: 1 },
                }}
                className="z-10 mt-40 mx-2 font-semibold"
              >
                We aim to provide the knowledge and support necessary for individuals to thrive in today&apos;s diverse business landscape.
              </motion.p>
            </div>
          </SwiperSlide>
          <SwiperSlide
            style={{
              backgroundImage: `url('/aramco%20(10).jpg')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
            }}
          >
            <div className="w-full h-full flex items-center bg-black bg-opacity-50">
              <motion.p
                initial={{ opacity: 0, x: 50 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.5, duration: 1 },
                }}
                className="z-10 mt-40 mx-2 font-semibold"
              >
                At Aramco, we understand that financial success is not just about accumulating wealth, it&apos;s about achieving personal goals.
              </motion.p>
            </div>
          </SwiperSlide>
          <SwiperSlide
            style={{
              backgroundImage: `url('/aramco%20(4).jpg')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
            }}
          >
            <div className="w-full h-full flex items-center bg-black bg-opacity-50">
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5, duration: 1 },
                }}
                className="z-10 mt-40 mx-2 font-semibold"
              >
                Our approach ensures that individuals are inspired to make confident decisions that lead to lasting prosperity.
              </motion.p>
            </div>
          </SwiperSlide>
          <SwiperSlide
            style={{
              backgroundImage: `url('/aramco%20(5).jpg')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
            }}
          >
            <div className="w-full h-full flex items-center bg-black bg-opacity-50">
              <motion.p
                initial={{ opacity: 0, y: -50 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.5, duration: 1 },
                }}
                className="z-10 mt-40 mx-2 font-semibold"
              >
                Together, we are dedicated to helping people thrive in today&apos;s diverse and ever-evolving business landscape.
              </motion.p>
            </div>
          </SwiperSlide>
          <SwiperSlide
            style={{
              backgroundImage: `url('/aramco%20(3).jpg')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
            }}
          >
            <div className="w-full h-full flex items-center bg-black bg-opacity-50">
              <motion.p
                initial={{ opacity: 0, x: 50 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 0.5, duration: 1 },
                }}
                className="z-10 mt-40 mx-2 font-semibold"
              >
                 With Aramco by your side, you can embark on a transformative journey toward financial independence and success.
              </motion.p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
      <form onSubmit={handleSubmit} className='sm:mx-auto sm:w-full sm:max-w-md sm:border-2 rounded-lg p-4 dark:bg-white dark:bg-opacity-5'>
      <div className='w-full hidden md:flex items-center justify-center my-4'>
          <img src={'/aramco.png'} alt='Logo' className='w-3/6' />
        </div>
        <p className='text-center'>Welcome Back!</p>
        <section>
          <div className='my-2'>
            <label htmlFor='email'>Email:</label>
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
          <div className='my-2'>
            <label htmlFor='password'>Password:</label>
            <div className='w-full flex items-center p-1 border-2 border-green-900/90 rounded-lg'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                id='password'
                value={password}
                onChange={(event) => setPassword(event.target?.value)}
                placeholder='Enter Password'
                className='w-full focus:outline-none p-2'
              />
              {showPassword ? (
                <EyeOff className='cursor-pointer text-green-900' onClick={() => setShowPassword(false)} />
              ) : (
                <Eye className='cursor-pointer text-green-900' onClick={() => setShowPassword(true)} />
              )}
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
        <div className="w-full flex items-center md:justify-end underline-none font-bold text-blue-500">
            <a href={'/auth/reset_password'}>Forgot Password?</a>
          </div>
          <p>
            Don&apos;t have an account?{' '}
            <Link
              href={'/auth/signup'}
              className="text-blue-600/90 underline mx-2 font-bold"
            >
              Sign up
            </Link>
          </p>
        </section>
      </form>
      <Toaster />
    </div>
  );
}
