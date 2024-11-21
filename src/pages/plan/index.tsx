import React, { ReactEventHandler, useState } from 'react';
import { CheckCircle, Edit2, Trash2, X } from 'lucide-react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_TYPE, GET_PLAN } from '@/graphql/query/user';
import { CREATE_PLAN, UPDATE_PLAN, DELETE_PLAN } from '@/graphql/mutation/user';
import toast, { Toaster } from 'react-hot-toast';

interface USERID {
    authenticatedUserID: string;
  }
  
  const Index: React.FC<USERID> = ({ authenticatedUserID }) => {
    const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
    const [create, setCreate] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [confDelID, setConfDelID] = useState('');
    const [del, setDeletion] = useState<boolean>(false)

    const [formValues, setFormValues] = useState({
        title: '',
        amount: '',
        return: '',
        duration: '',
        referalBonus: '',
        description: [{ id: '', point: '' }],
    });

    const [formValues2, setFormValues2] = useState({
        title: '',
        amount: '',
        return: '',
        duration: '',
        referalBonus: '',
        description: [{ id: '', point: '' }],
    });

    const {data: getType, loading: typeLoading} = useQuery(GET_USER_TYPE, {
        variables: { userID: authenticatedUserID },
      })
    
      const TYPE = getType?.getUser.type || '';

    const { data, loading, refetch } = useQuery(GET_PLAN);
    
    const [createPlan, { loading: createLoading }] = useMutation(CREATE_PLAN, {
        onCompleted: async () => {
            toast.success('Successfully created plan');
            setCreate(false);
            await refetch()
        },
        onError: (error) => {
            toast.error('Failed to create plan');
        },
    });

    const [updatePlan, { loading: editLoading }] = useMutation(UPDATE_PLAN, {
        onCompleted: async () => {
            toast.success('Successfully updated plan');
            setEdit(false);
            await refetch();
        },
        onError: (error) => {
            toast.error('Failed to update plan');
        },
    });

    const Plan = data?.getAllPlans || [];

    const handleEditClick = (plan: any) => {
        setSelectedPlan(plan);
        setFormValues({
            title: plan.title,
            amount: plan.amount,
            return: plan.return,
            duration: plan.duration,
            referalBonus: plan.referalBonus,
            description: plan.description.map((desc: any) => ({ id: desc.id, point: desc.point })),
        });
        setEdit(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    };

    const handleInputChange2 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormValues2((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));
    };

    const handleDescriptionChange = (index: number, value: string) => {
        setFormValues((prevValues) => {
            const updatedDescriptions = [...prevValues.description];
            updatedDescriptions[index] = { ...updatedDescriptions[index], point: value };
            return { ...prevValues, description: updatedDescriptions };
        });
    };

    const handleAddDescription = () => {
        setFormValues((prevValues) => ({
            ...prevValues,
            description: [...prevValues.description, { id: '', point: '' }],
        }));
    };

    const handleRemoveDescription = (index: number) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            description: prevValues.description.filter((_, i) => i !== index),
        }));
    };

    //
    const handleDescriptionChange2 = (index: number, value: string) => {
        setFormValues2((prevValues) => {
            const updatedDescriptions = [...prevValues.description];
            updatedDescriptions[index] = { ...updatedDescriptions[index], point: value };
            return { ...prevValues, description: updatedDescriptions };
        });
    };

    const handleAddDescription2 = () => {
        setFormValues2((prevValues) => ({
            ...prevValues,
            description: [...prevValues.description, { id: '', point: '' }],
        }));
    };

    const handleRemoveDescription2 = (index: number) => {
        setFormValues2((prevValues) => ({
            ...prevValues,
            description: prevValues.description.filter((_, i) => i !== index),
        }));
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await updatePlan({
                variables: {
                    planID: selectedPlan?.id,
                    input: {
                        title: formValues.title,
                        amount: formValues.amount,
                        return: formValues.return,
                        duration: formValues.duration,
                        referalBonus: formValues.referalBonus,
                        description: formValues.description.map(desc => ({point: desc.point})),
                    },
                },
            });
        } catch (error) {
            console.error('Error updating plan:', error);
            toast.error("Failed to update plan")
        }
    };

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await createPlan({
                variables: {
                    input: {
                        title: formValues2.title,
                        amount: formValues2.amount,
                        return: formValues2.return,
                        duration: formValues2.duration,
                        referalBonus: formValues2.referalBonus,
                        description: formValues2.description.map(desc => ({point: desc.point})),
                    },
                },
            });
            
        } catch (error) {
            console.error('Error creating plan:', error);
            toast.error('Error creating plan')
        }
    };

    const [deletePlan, { loading: deleteLoading }] = useMutation(DELETE_PLAN, {
        onCompleted: async () => {
            toast.success('Successfully deleted plan');
            setDeletion(false)
            await refetch();
        },
        onError: (error) => {
            toast.error('Failed to delete plan');
        },
    });

    const handleConfirmDelete = (id: any) => {
        setConfDelID(id)
        setDeletion(true)
    }

    const handleDelete = async (planID: string) => {
        try {
            await deletePlan({
                variables: { planID },
            });
        } catch (error) {
            console.error('Error deleting plan:', error);
            toast.error('Failed to delete plan')
        }
    };

    const handleCancel = () => {
        setDeletion(false)
    }

    return (
        <div className='lg:flex leading-loose lg:overflow-y-hidden dark:text-white'>
            {del && (
                <section className='fixed w-[90vw] flex items-center justify-center py-60  '>
                    {Plan.map((plan: any) => (
                        <div key={plan.id} className='bg-white dark:bg-black w-3/12 border-2 border-red-500 rounded-lg p-8 my-2 '>
                            {confDelID === plan.id && (
                                <div className='text-center'>
                                    <h2 className='font-semibold'>Confirm to delete <span className='text-red-500 font-bold'> &quot;{plan.title}&quot;</span></h2>
                                    <p className='italic text-red-500'><span className='font-bold'>Warning: </span> Once deleted, data cannot be recovered!</p>
                                    <div className='flex w-full gap-x-4 items-center justify-center mt-4'>
                                        <button className='bg-green-500 hover:bg-green-400 text-white font-bold border-none p-2 px-4 rounded-md' onClick={handleCancel}>Cancel</button>
                                        <button className='bg-red-500 hover:bg-red-400 text-white font-bold border-none p-2 px-4 rounded-md' onClick={() => handleDelete(plan.id)}>Delete</button>
                                    </div>
                                </div>
                            )}                            
                        </div>
                    ))}
                </section>
            )}
            {edit && (
                <section className='fixed w-full h-full bg-white dark:bg-[#121212] dark:bg-opacity-20 bg-opacity-50 backdrop-blur-md'>
                    <div className='w-full flex w-full ml- md:ml-[17vw] lg:ml-[25vw]'>
                        <div className='w-full md:w-[50vw] lg:w-[30vw] h-[90svh] bg-white dark:bg-black border-2 border-gray-300 dark:border-opacity-20 rounded-lg p-4'>
                            <div className='flex justify-center items-center'>
                                <h3 className='font-semibold text-center w-full'>Edit Plan</h3>
                                <X size={30} onClick={() => setEdit(false)} className='flex justify-end' />
                            </div>
                            <form onSubmit={handleUpdate} className='overflow-auto h-[80svh]'>
                                <div>
                                    <label htmlFor='title'>Title:</label>
                                    <input
                                        type='text'
                                        id='title'
                                        value={formValues.title}
                                        onChange={handleInputChange}
                                        className='w-full border border-green-900 rounded-lg p-2'
                                    />
                                    <label htmlFor='amount'>Amount:</label>
                                    <input
                                        type='text'
                                        id='amount'
                                        value={formValues.amount}
                                        onChange={handleInputChange}
                                        className='w-full border border-green-900 rounded-lg p-2'
                                    />
                                    <label htmlFor='return'>Return:</label>
                                    <input
                                        type='text'
                                        id='return'
                                        value={formValues.return}
                                        onChange={handleInputChange}
                                        className='w-full border border-green-900 rounded-lg p-2'
                                    />
                                    <label htmlFor='duration'>Duration:</label>
                                    <input
                                        type='text'
                                        id='duration'
                                        value={formValues.duration}
                                        onChange={handleInputChange}
                                        className='w-full border border-green-900 rounded-lg p-2'
                                    />
                                    <label htmlFor='referalBonus'>Referral Bonus:</label>
                                    <input
                                        type='text'
                                        id='referalBonus'
                                        value={formValues.referalBonus}
                                        onChange={handleInputChange}
                                        className='w-full border border-green-900 rounded-lg p-2'
                                    />
                                    <label htmlFor='description'>Description:</label>
                                    {formValues.description.map((desc, index) => (
                                        <div key={index} className='mb-2'>
                                            <textarea
                                                id={`description-${index}`}
                                                value={desc.point}
                                                onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                className='w-full border border-green-900 rounded-lg p-2'
                                                rows={3}
                                            />
                                            <button
                                                type='button'
                                                onClick={() => handleRemoveDescription(index)}
                                                className='text-red-500'
                                            >
                                                Remove Description
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type='button'
                                        onClick={handleAddDescription}
                                        className='w-full bg-green-900 hover:bg-green-950 rounded-lg text-white font-bold p-2 my-4'
                                    >
                                        Add Description
                                    </button>
                                    <button
                                        type='submit'
                                        className='w-full bg-green-900 hover:bg-green-950 rounded-lg text-white font-bold p-2 my-4 flex items-center justify-center'
                                        disabled={editLoading}
                                    >
                                        {editLoading ? <img src={'/loader.png'} alt='Loading...' width={25} height={25} className='animate-spin ' /> : 'Update Plan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            )}
            {create && (
                <section className='fixed w-full h-full bg-white dark:bg-[#121212] dark:bg-opacity-90 bg-opacity-50 backdrop-blur-md'>
                    <div className='w-full flex w-full ml- md:ml-[17vw] lg:ml-[25vw]'>
                        <div className='w-full md:w-[50vw] lg:w-[30vw] h-[90svh] bg-white dark:bg-black border-2 border-gray-300 dark:border-opacity-20 rounded-lg p-4'>
                            <div className='flex justify-center items-center'>
                                <h3 className='font-semibold text-center w-full'>Create Plan</h3>
                                <X size={30} onClick={() => setCreate(false)} className='flex justify-end' />
                            </div>
                            <form onSubmit={handleCreate} className='overflow-auto h-[80svh]'>
                                <div>
                                    <label htmlFor='title'>Title:</label>
                                    <input
                                        type='text'
                                        id='title'
                                        value={formValues2.title}
                                        onChange={handleInputChange2}
                                        className='w-full border border-green-900 rounded-lg p-2'
                                    />
                                    <label htmlFor='amount'>Amount:</label>
                                    <input
                                        type='text'
                                        id='amount'
                                        value={formValues2.amount}
                                        onChange={handleInputChange2}
                                        className='w-full border border-green-900 rounded-lg p-2'
                                    />
                                    <label htmlFor='return'>Return:</label>
                                    <input
                                        type='text'
                                        id='return'
                                        value={formValues2.return}
                                        onChange={handleInputChange2}
                                        className='w-full border border-green-900 rounded-lg p-2'
                                    />
                                    <label htmlFor='duration'>Duration:</label>
                                    <input
                                        type='text'
                                        id='duration'
                                        value={formValues2.duration}
                                        onChange={handleInputChange2}
                                        className='w-full border border-green-900 rounded-lg p-2'
                                    />
                                    <label htmlFor='referalBonus'>Referral Bonus:</label>
                                    <input
                                        type='text'
                                        id='referalBonus'
                                        value={formValues2.referalBonus}
                                        onChange={handleInputChange2}
                                        className='w-full border border-green-900 rounded-lg p-2'
                                    />
                                    <label htmlFor='description'>Description:</label>
                                    {formValues2.description.map((desc, index) => (
                                        <div key={index} className='mb-2'>
                                            <textarea
                                                id={`description-${index}`}
                                                value={desc.point}
                                                onChange={(e) => handleDescriptionChange2(index, e.target.value)}
                                                className='w-full border border-green-900 rounded-lg p-2'
                                                rows={3}
                                            />
                                            <button
                                                type='button'
                                                onClick={() => handleRemoveDescription2(index)}
                                                className='text-red-500'
                                            >
                                                Remove Description
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type='button'
                                        onClick={handleAddDescription2}
                                        className='w-full bg-green-900 hover:bg-green-950 rounded-lg text-white font-bold p-2 my-4'
                                    >
                                        Add Description
                                    </button>
                                    <button
                                        type='submit'
                                        className='w-full bg-green-900 hover:bg-green-950 rounded-lg text-white font-bold p-2 my-4 flex items-center justify-center'
                                        disabled={createLoading}
                                    >
                                        {createLoading ? <img src={'/loader.png'} alt='Loading...' width={25} height={25} className='animate-spin ' /> : 'Create Plan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            )}
            <section className='w-full lg:border-r border-green-900 p-2'>
                <div className='w-full flex items-center justify-between px-4'>
                    <h1 className='w-7/12 text-lg lg:text-xl font-bold my-4'>Select Plan</h1>
                   {TYPE == "ADMIN" && (
                    <button
                    onClick={() => setCreate(true)}
                    className='font-bold border-2 border-green-900 dark:bg-green-700 dark:text-white hover:border-green-500 rounded-md text-green-900 hover:text-green-500 py-2 md:py-1 text-sm md:text-lg px-4 md:px-8'>
                        + Create Plan
                    </button>
                    )}
                </div>
                <section className='grid grid-cols-[repeat(auto-fit,minmax(300px,2fr))] lg:grid-cols-[repeat(auto-fit,minmax(400px,2fr))] lg:overflow-y-scroll lg:h-[70svh] lg:px-4 gap-x-4'>
                    {Plan.map((plan: any) => (
                        <div key={plan.id} className='bg-gray-200 dark:bg-white dark:bg-opacity-10 hover:bg-gray-300 border-2 dark:border dark:border-opacity-30 rounded-md p-8 my-2'>
                           {TYPE == "ADMIN" && (
                            <div className='flex md:hidden w-full items-center justify-end gap-x-4 mb-2'>
                                <Edit2
                                    size={20}
                                    className='font-bold text-blue-500'
                                    onClick={() => handleEditClick(plan)}
                                />
                                <Trash2 size={20} 
                                className='font-bold text-red-500'
                                onClick={() => handleConfirmDelete(plan.id)}
                                />
                            </div>
                           )}
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center pb-3'>
                                    <div className='leading-none'>
                                        <h3 className='text-green-900 dark:text-green-600 text-xl font-semibold mb-1'>{plan.title}</h3>
                                        <p className='text-gray-500 text-md lg:text- dark:text-white'>{plan.return} returns every {plan.duration}</p>
                                    </div>
                                </div>
                                <div className='leading-none'>
                                    <p className='text-green-900 dark:text-green-600 text-md lg:text-xl font-semibold mb-1'>{plan.amount}</p>
                                    <p className='text-gray-500 text-md lg:text- dark:text-white'>{plan.referalBonus} Referral bonus</p>
                                </div>
                            </div>
                            <div className='bg-green-900 h-0.5 my-4 rounded-full' />
                            <div className='my-4'>
                                {plan.description.map((desc: any) => (
                                    <ul key={desc.id} className='flex'>
                                        <CheckCircle className='text-green- dark:text-green-600 mr-2 p-1' />
                                        <li>{desc.point}</li>
                                    </ul>
                                ))}
                            </div>
                            {TYPE == "ADMIN" && (
                            <div className='hidden md:flex w-full items-center justify-center gap-x-6 mt-10'>
                                <button
                                    className='px-4 font-bold text-blue-500 border-2 border-blue-500 rounded-md flex items-center justify-center'
                                    onClick={() => handleEditClick(plan)}
                                >
                                    <Edit2 size={15} className='mr-2' /> Edit
                                </button>
                                <button
                                    className='px-4 font-bold text-red-500 border-2 border-red-500 rounded-md flex items-center justify-center'
                                    onClick={() => handleConfirmDelete(plan.id)}
                                >
                                    <Trash2 size={15} className='mr-2' /> Delete
                                </button>
                            </div>
                            )}
                        </div>
                    ))}
                </section>
            </section>
            <Toaster />
        </div>
    );
}

export default Index;