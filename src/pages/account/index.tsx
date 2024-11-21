import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, UserIcon, X } from 'lucide-react';
import { GET_USER_FOR_ACCOUNT, VERIFY_EMAIL, GET_UNIQUE_VERIFIER } from '@/graphql/query/user';
import { RESET_PASSWORD } from '@/graphql/mutation/user';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_USER } from '@/graphql/mutation/user';
import toast, { Toaster } from 'react-hot-toast';
import {resendAccountVerification} from '@/lib/api'

interface Props {
    authenticatedUserID: string;
}

const Index: React.FC<Props> = ({ authenticatedUserID }) => {
    const { data: userData, loading: userLoading, refetch } = useQuery(GET_USER_FOR_ACCOUNT, {
        variables: { userID: authenticatedUserID },
    });

    const USER = userData?.getUser || {};

    const [userImage, setUserImage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [wallet, setWallet] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [load, isLoading] = useState<boolean>(false);
    const [changePassword, setChangePassword] = useState<boolean>(false);
    const [password, setPassword] = useState('');
    const [conPassword, setConPassword] = useState('');
    const [loader, isLoader] = useState<boolean>(false);
    const [Verified, setVerified] = useState(true)


    const { data: isVerified, loading: isLoadingVerify} = useQuery(GET_UNIQUE_VERIFIER, {
        variables: { email: USER.email}
    })

    const verifier = isVerified?.getUserVerificationToken.uniqueverifier || ''

    const verified = isVerified?.getUserVerificationToken.verified

    useEffect(() => {
            setVerified(verified)
    },[verified])

    

    // console.log("Verifier: ", verified)

    const [editUser, { loading: editLoading }] = useMutation(UPDATE_USER, {
        onCompleted: () => {
            toast.success('User updated successfully');
            isLoading(false);
            refetch();
        },
        onError: (error) => {
            isLoading(false);
            console.error(error);
            toast.error('Failed to update user');
        },
    });

    const { data: verifyData, loading: verifyLoading } = useQuery(VERIFY_EMAIL, {
        variables: { email: email },
        // skip: !email,
    });

    useEffect(() => {
        if (!userLoading && userData) {
            setUserImage(USER.userImage);
            setFirstName(USER.firstName);
            setLastName(USER.lastName);
            setEmail(USER.email);
            setWallet(USER.wallet)
            setPhone(USER.phone);
            setCity(USER.city);
            setCountry(USER.country);
        }
    }, [userData, userLoading]);


    const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        isLoading(true);
        if (isFormChanged()) {
            editUser({
                variables: {
                    userID: authenticatedUserID,
                    input: {
                        userImage: userImage,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        wallet: wallet,
                        phone: phone,
                        city: city,
                        country: country,
                    },
                },
            });
        } else {
            isLoading(false);
            toast('No changes detected.');
        }
    };

    const isFormChanged = () => {
        return (
            userImage !== USER.userImage ||
            firstName !== USER.firstName ||
            lastName !== USER.lastName ||
            email !== USER.email ||
            wallet !== USER.wallet ||
            phone !== USER.phone ||
            city !== USER.city ||
            country !== USER.country
        );
    };

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
            setUserImage(imageUrl);
        }
    };

    const [resetPassword, { loading: resetPasswordLoading }] = useMutation(RESET_PASSWORD, {
        variables: {
          email,
          newPassword: password
        },
        onCompleted: async(data) => {
        //   console.log(data);
          toast.success('Password reset successfully.');
          isLoader(false)
          setChangePassword(false)
          setPassword('')
          setConPassword('')
        },
        onError: (error) => {
          isLoader(false);
          console.error(error);
          toast.error('Failed to reset password');
        },
      })

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
    
        isLoader(true)
        
        resetPassword()
    
      }

      const cancelReset = () => {
        setChangePassword(false)
        setPassword('')
        setConPassword('')
      }


      const sendVerification = async () => {
        try{
            await resendAccountVerification(USER.email, USER.firstName, verifier)
            toast.success('Verification email sent successfully. Proceed to your inbox to verify your account')
        }catch(error){
            toast.error('Failed to send verification email')
        }
      }

    return (
        <div className='m-4 py-4 md:border rounded-lg  dark:bg-white dark:bg-opacity-5 md:pr-10 lg:m- dark:text-white relative overflow-hidden'>
            {changePassword && (
                <section className='absolute w-full h-full bg-transparent z-20 flex items-center justify-center  backdrop-blur-sm'>
                    <form onSubmit={handleSubmitNewPassword} className='sm:mx-auto w-full max-w-md sm:border-2 rounded-lg p-4 bg-white dark:bg-[#121212]'>
                    <div className='w-full flex justify-end '>
                    <X size={25} className='cursor-pointer' onClick={cancelReset}/>
                    </div>
                    <p className='text-center font-bold'>CREATE NEW PASSWORD</p>
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
                </section>
            )}
            {!Verified && (
                <div className='border border-red-500 w-[98%] md:w-full md:flex justify-center my-2 mx-2 p-2 text-sm italic'>
                    <span className='text-red-500 font-bold mr-2'>Warning: </span> Your Email is not yet verified. Check your inbox to verify your email address or click <a onClick={sendVerification} className='font-bold cursor-pointer text-green-900 underline mx-2'>HERE</a> to resend verification mail.
                </div>
            )}
            <section className='grid justify-center'>
                <form action="" onSubmit={handleSave}>
                    <div className='md:flex items-end'>
                        <div className='flex w-full justify-center'>
                            <div className='flex items-end justify-center w-[10rem] border-4 border-green-900/90 rounded-full'>
                                {userImage ? (
                                    <img src={userImage} onClick={handleCameraClick} className='rounded-full w-[10rem] md:w-[20rem]' alt="User" />
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
                        <div className='w-full mx-2 md:ml-6 my-4'>
                            <label htmlFor='firstName'>First Name:</label>
                            <input
                                type='text'
                                value={firstName}
                                onChange={(event) => setFirstName(event.target.value)}
                                className='p-2 mt-2 rounded-lg w-full h-10 border-2 border-green-900/50 focus:outline-none bg-transparent'
                            />
                        </div>
                        <div className='w-full mx-2 md:ml-6 my-4 -mr-5'>
                            <label htmlFor='lastName'>Last Name:</label>
                            <input
                                type='text'
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                                className='p-2 mt-2 rounded-lg w-full h-10 border-2 border-green-900/50 focus:outline-none bg-transparent'
                            />
                        </div>
                    </div>
                    <div className=''>
                        <div className='w-full mx-2 md:ml-6 my-4'>
                            <label htmlFor='email'>Email:</label>
                            <input
                                type='email'
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className='p-2 mt-2 rounded-lg w-full h-10 border-2 border-green-900/50 focus:outline-none bg-transparent'
                            />
                        </div>
                        <div className='w-full mx-2 md:ml-6 my-4'>
                            <label htmlFor='email'>Wallet address:</label>
                            <input
                                type='text'
                                value={wallet}
                                onChange={(event) => setWallet(event.target.value)}
                                className='p-2 mt-2 rounded-lg w-full h-10 border-2 border-green-900/50 focus:outline-none bg-transparent'
                            />
                        </div>
                        <div className='w-full mx-2 md:ml-6 my-4'>
                            <label htmlFor='phone'>Phone number:</label>
                            <input
                                type='text'
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                className='p-2 mt-2 rounded-lg w-full h-10 border-2 border-green-900/50 focus:outline-none bg-transparent'
                            />
                        </div>
                        <div className='w-full mx-2 md:ml-6 my-4'>
                            <label htmlFor='city'>City:</label>
                            <input
                                type='text'
                                value={city}
                                onChange={(event) => setCity(event.target.value)}
                                className='p-2 mt-2 rounded-lg w-full h-10 border-2 border-green-900/50 focus:outline-none bg-transparent'
                            />
                        </div>
                        <div className='w-full mx-2 md:ml-6 my-4'>
                            <label htmlFor='country'>Country:</label>
                            <input
                                type='text'
                                value={country}
                                onChange={(event) => setCountry(event.target.value)}
                                className='p-2 mt-2 rounded-lg w-full h-10 border-2 border-green-900/50 focus:outline-none bg-transparent'
                            />
                        </div>
                        <div className='w-full flex mx-2 md:ml-6 my-4'>
                            <label htmlFor='password'>Password:</label>
                            <div onClick={() => setChangePassword(true)} className='italic underline text-blue-500 mx-2 cursor-pointer'>Change password</div>
                        </div>
                        <div className='w-full mx-2 md:ml-6'>
                            {load ? (
                                <div className='w-full p-4 rounded-lg bg-green-900 hover:bg-green-950 text-white font-bold flex items-center justify-center cursor-wait'>
                                    <Image src={'/loader.png'} alt='Loading...' width={25} height={25} className='animate-spin' />
                                </div>
                            ) : (
                                <button type='submit' className='w-full p-4 rounded-lg bg-green-900 hover:bg-green-950 text-white font-bold' disabled={editLoading}>Save</button>
                            )}
                        </div>
                    </div>
                </form>
            </section>
            <Toaster />
        </div>
    );
}

export default Index;
