import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Camera, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { SIGNUP, LINK } from '@/graphql/mutation/auth';
import { useMutation } from '@apollo/client';
import {useQuery} from '@apollo/client';
import {GET_UNIQUE_VERIFIER} from '@/graphql/query/user'
import { useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import {sendEmail} from '@/lib/api'

export default function Join() {
  const [userImage, setSelectedImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');
  const [phone, setPhone] = useState('');
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [password, setPassword] = useState('');
  const [conPassword, setConPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loader, isLoading]=useState<boolean>(false);

  const ReferralLink = useSearchParams();

  const Referral = ReferralLink.get('link')

  const {data} = useQuery(GET_UNIQUE_VERIFIER,{
    variables:{
      email:email
    }
  })

  const verifier = data?.getUserVerificationToken.uniqueverifier

  useEffect(() => {
    axios.get('https://countriesnow.space/api/v0.1/countries')
      .then(response => {
        setCountries(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
        country: selectedCountry
      })
        .then(response => {
          setCities(response.data.data);
        })
        .catch(error => {
          console.error("Error fetching cities:", error);
        });
    }
  }, [selectedCountry]);

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  function convertImage(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };
      fileReader.onerror = () => {
        reject(fileReader.error);
      };
    });
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = await convertImage(file);
      // console.log(imageUrl);
      setSelectedImage(imageUrl);
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
    setSelectedCity('');
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const [referalBonus, {loading: refLoading}] = useMutation(LINK, {
    variables: {
        link: Referral
    }
  })


  const [signup, {loading}] = useMutation(SIGNUP, {
    variables: {
      input: {
        userImage,
        firstName,
        lastName,
        email,
        wallet,
        phone,
        country: selectedCountry,
        city: selectedCity,
        password,
      }
    },
    onCompleted: async (data) => {
      // console.log(data);
      toast.success('Account created successfully');

      try {
        await verifier
        referalBonus()
        sendEmail(email, firstName, verifier)
      } catch (error) {
        console.error('Account created but failed to send verification mail. ', error);
      }

      isLoading(false)
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 5000);
    },
    onError: (error) => {
      toast.error("Account creation was not successful because email address already exist.");
      console.log("Account creation was not successful because email address already exist.");
      isLoading(false)
    }
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!firstName || !lastName || !email) {
      toast.error('All fields are required');
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
    signup();
  };

  return (
    <div className='w-full min-h-full flex flex-1 flex-col justify-center py-5 dark:text-white'>
      <form onSubmit={handleSubmit} className='sm:mx-auto sm:w-full sm:max-w-md sm:border-2 rounded-lg dark:bg-white dark:bg-opacity-5 p-4'>
        <div className='w-full flex items-center justify-center my-4'>
          <img src={'/aramco.png'} alt='Logo' className='w-3/6' />
        </div>
        <p className='text-center'>Create an account</p>
        <div className='flex w-full justify-center mt-4'>
          <div className='flex items-end justify-center w-[10rem] h-[10rem] border-4 border-green-900/90 rounded-full'>
            {userImage ? (
              <div
                onClick={handleCameraClick}
                style={{ backgroundImage: `url(${userImage || ''})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
                className="w-full h-full rounded-full cursor-pointer"
              />
            ) : (
              <UserIcon onClick={handleCameraClick} className='w-full font-bold' size={150} />
            )}
            <div className='z-10 w-10 h-10 bg-green-900 text-white rounded-full p-2 mt-10 -ml-10 cursor-pointer '>
              <Camera onClick={handleCameraClick} className='cursor-pointer' />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept=".jpeg, .png, .jpg"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>

        <section>
          <div className='my-2'>
            <label htmlFor='firstName' className=''>First name:</label>
            <input type='text'
              name='firstName'
              id='firstName'
              value={firstName}
              onChange={(event) => setFirstName(event.target?.value)}
              placeholder='Enter First Name'
              required
              className='w-full p-3 border-2 border-green-900/90 focus:outline-none rounded-lg' />
          </div>
          <div className='my-2'>
            <label htmlFor='lastName' className=''>Last name:</label>
            <input type='text'
              name='lastName'
              id='lastName'
              value={lastName}
              onChange={(event) => setLastName(event.target?.value)}
              placeholder='Enter Last Name'
              required
              className='w-full p-3 border-2 border-green-900/90 focus:outline-none rounded-lg' />
          </div>
          <div className='my-2'>
            <label htmlFor='email' className=''>Email:</label>
            <input type='text'
              name='email'
              id='email'
              value={email}
              onChange={(event) => setEmail(event.target?.value)}
              placeholder='Enter Email Address'
              required
              className='w-full p-3 border-2 border-green-900/90 focus:outline-none rounded-lg' />
          </div>
          <div className='my-2'>
            <label htmlFor='wallet' className=''>Wallet address:</label>
            <input type='text'
              name='wallet'
              id='wallet'
              value={wallet}
              onChange={(event) => setWallet(event.target?.value)}
              placeholder='Enter Wallet Address'
              className='w-full p-3 border-2 border-green-900/90 focus:outline-none rounded-lg' />
          </div>
          <div className='my-2'>
            <label htmlFor='phone' className=''>Phone number:</label>
            <input type='text'
              name='phone'
              id='phone'
              value={phone}
              onChange={(event) => setPhone(event.target?.value)}
              placeholder='Enter Phone number'
              className='w-full p-3 border-2 border-green-900/90 focus:outline-none rounded-lg' />
          </div>

          <div className='my-2'>
            <label htmlFor='country' className=''>Country:</label>
            <select 
              id='country'
              value={selectedCountry}
              onChange={handleCountryChange}
              className='w-full p-3 border-2 border-green-900/90 focus:outline-none rounded-lg'>
              <option value='' disabled>Select Country</option>
              {countries.map((count) => (
                <option key={count.iso3} value={count.country}>{count.country}</option>
              ))}
            </select>
          </div>

          <div className='my-2'>
            <label htmlFor='city' className=''>City:</label>
            <select 
              id='city'
              value={selectedCity}
              onChange={handleCityChange}
              className='w-full p-3 border-2 border-green-900/90 focus:outline-none rounded-lg'>
              <option value='' disabled>Select City</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className='my-2'>
            <label htmlFor='password' className=''>Password:</label>
            <div className='w-full flex items-center p-1 border-2 border-green-900/90 rounded-lg'>
              <input type='password'
                name='password'
                id='password'
                value={password}
                onChange={(event) => setPassword(event.target?.value)}
                placeholder='Enter Password'
                className='w-full focus:outline-none p-2' />
            </div>
          </div>
          <div className='my-2'>
            <label htmlFor='conPassword' className=''>Confirm password:</label>
            <div className='w-full flex items-center p-1 border-2 border-green-900/90 rounded-lg'>
              <input type='password'
                name='conPassword'
                id='conPassword'
                value={conPassword}
                onChange={(event) => setConPassword(event.target?.value)}
                placeholder='Re-enter your password'
                className='w-full focus:outline-none p-2' />
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
          
          
          <p>Have an account? <Link href={'/auth/login'} className='text-blue-900/90 underline mx-2 font-bold'>Login</Link></p>
        </section>
      </form>
      <Toaster />
    </div>
  )
}


