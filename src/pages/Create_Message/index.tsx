import React, { useState } from 'react';
import { Clock, Save, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '@/graphql/query/user';
import { CREATE_MESSAGE } from '@/graphql/mutation/user';
import toast, {Toaster} from 'react-hot-toast';
import { usePathname } from 'next/navigation';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false, 
});

const Index = () => {
    const navigate = usePathname()
    const [title, setTitiel] = useState('')
    const [value, setValue] = useState('');
    const [receiver, setReceiver] = useState('');

    console.log("Receiver: ", receiver )

    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
    ];
  
    const modules = {
      toolbar: toolbarOptions,
    };

    const { data, loading} = useQuery(GET_ALL_USERS)

    const USERS = data?.getAllUsers || []

    const [sendMessage] = useMutation(CREATE_MESSAGE,{
      variables:{userID: receiver, title: title, message: value},
      onCompleted: () => {
        toast.success("Message sent successfully")
        setValue("")
        setTitiel("")
      }
    },

  )

    const handleSubmit = async () => {
      if(!value || !title || !receiver){
        toast.error("Message body cannot be empty")
        return;
      }
      await sendMessage();
    };
     

  return (
    <div className='dark:text-white p-4 '>
        <h1 className='text-xl lg:text-2xl font-bold mb-4'>Write Message</h1>
        <div className='lg:flex gap-x-2'>
            <section className='w-full lg:w-8/12'>
                <input type='text' value={title} onChange={(event) => setTitiel(event.target.value)} placeholder='Title...' className='w-full focus:outline-none border-b-2 border-black dark:border-white lg:mt-8 mb-2' />
                <div className='flex items-center justify-between mb-[9rem] md:mb-[6rem]'>
                <ReactQuill
                    modules={modules}
                    theme="snow"
                    value={value}
                    onChange={setValue}
                    className="h-[48vh]"
                />
                </div>
                <button onClick={handleSubmit} className='w-full md:w-0 bg-green-900 hover:bg-transparent border-2 border-green-900 p-4 px-20 rounded-md my-2 font-bold text-white hover:text-green-900 flex items-center justify-center'>Send</button>
            </section>
            <section className='w-full lg:w-4/12 mt-10 md:mt-0'>
                <div className='mb-2'>
                <div className='w-full bg-green-900 text-white p-4 font-bold mb-4' >
                    <p>Select Reciepient</p>
                </div>
                    <select onChange={(event) => setReceiver(event.target.value)} className='w-full border-b-2 border-black focus:outline-none'>
                    <option value="">Select Recipient</option>
                    <option value="all">All</option>
                    {USERS.map((user: any) => (
                        <option key={user.userID} value={user.userID}>
                        {`${user.firstName} ${user.lastName}`}
                        </option>
                    ))}
                    </select>
                </div>
                <div className='w-full bg-green-900 text-white p-4 font-bold mb-4' >
                    <p>More Options</p>
                </div>
                <button className='w-full border-2 border-green-500 hover:border-green-900 p-4 my-2 font-bold flex items-center justify-center'><Save className='mr-2' /> Save Draft</button>
                <button className='w-full border-2 border-blue-500 hover:border-blue-900 p-4 my-2 font-bold flex items-center justify-center'><Clock className='mr-2'/> Schedule</button>
                <button className='w-full border-2 border-red-500 hover:border-red-900 p-4 my-2 font-bold flex items-center justify-center'><Trash2 className='mr-2'/> Discard</button>
            </section>
       </div>
       <Toaster />
    </div>
  )
}

export default Index
