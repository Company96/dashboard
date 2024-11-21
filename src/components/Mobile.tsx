import React, { useEffect, useState } from 'react'
import { Nav, adminNav } from '@/utils/nav'
import Link  from 'next/link'
import { usePathname } from 'next/navigation'
import { getCookie, deleteCookie } from 'cookies-next'
import { AlignLeft, LogOut, X, Sun, Moon } from 'lucide-react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client';
import { GET_USER_TYPE } from '@/graphql/query/user';
import { useTheme } from 'next-themes';

interface HeaderProps {
  authenticatedUserID: string;
}

const Mobile: React.FC<HeaderProps> = ({ authenticatedUserID }) => {
    const [bar, isOpen] = useState<boolean>(false)
    const router = useRouter()
    const path = usePathname()
    const { theme, setTheme } = useTheme(); 

    useEffect(()=>{
      const token = getCookie('token')
      if(!token){
        router.push('/auth/login')
      }
    }, [router])

    const handleLogout = () => {
      deleteCookie('token')
      router.push('/auth/login')
    }

    const {data: getType, loading} = useQuery(GET_USER_TYPE, {
      variables: { userID: authenticatedUserID },
    })
  
    const TYPE = getType?.getUser.type || '';

  return (
    <div className='dark:text-white'>
    <div className={`fixed top-0 left-0 w-full h-full flex transition-all ease-in-out duration-500  ${!bar ? 'bg-transparent z-0' : 'bg-green-500/50 dark:bg-black dark:bg-opacity-20  backdrop-blur  z-20 '}`} onClick={() => isOpen(false)} >
        <div className={`flex w-full ${!bar ? 'opacity-0' : 'opacity-1'}`}>
        <div className={`bg-white dark:bg-[#121212] w-5/6 h-full transition-all ease-in-out duration-300 ${!bar ? 'ml-[-26rem]' : null}`} onClick={() => isOpen(false)} >
            <section className='py-4 h-[6rem] px-4 border-b border-green-900 flex items-center justify-between'>
                <img src={'/aramco.png'} alt='aramco' className='w-5/6 p-2'/>
            </section>
            <section className='mt-2 '>
            {TYPE == "ADMIN" ? (
              <>
              {adminNav.map(nav => (
                <Link key={nav.link} href={nav.link}>
                    <li className={`flex p-4 font-bold text-xl ${path === nav.link ? 'bg-green-900 text-white hover:bg-gradient-to-l transition-all ease-in-out delay-300 duration-400' : null}`}><span className='mx-4'>{nav.icon}</span> <p className={``}>{nav.name}</p></li>
                </Link>
            ))}
              </>
            ):(
              <>
              {Nav.map(nav => (
                <Link key={nav.link} href={nav.link}>
                    <li className={`flex p-4 font-bold text-xl ${path === nav.link ? 'bg-green-900 text-white hover:bg-gradient-to-l transition-all ease-in-out delay-300 duration-400' : null}`}><span className='mx-4'>{nav.icon}</span> <p className={``}>{nav.name}</p></li>
                </Link>
            ))}
              </>
            )}
                
            </section>

            <section className='mt-5 mx-4 flex items-center p-4 font-bold text-xl'>
                  <div className="flex items-center space-x-4">
                  <Sun className={`text-yellow-500 ${theme === 'dark' ? 'opacity-50' : 'opacity-100'}`} />
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={theme === 'dark'}
                      onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full"></div>
                    <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform transform" 
                      style={{ transform: theme === 'dark' ? 'translateX(100%)' : 'translateX(0)' }}
                    />
                  </label>
                  <Moon className={`text-blue-500 ${theme === 'dark' ? 'opacity-100' : 'opacity-50'}`} />
                </div>
            </section>


            <div className='grid items-end mt-5 cursor-pointer' onClick={handleLogout}>
            <p className={`flex items-center p-4 font-bold text-xl`}><span><LogOut className='mx-4'/></span> Logout </p>
        </div>
      </div>
      <div className='cursor-pointer mt-2 p-3 text-green-900 w-2/12  flex justify-end '>    
        <X  onClick={() => isOpen(!bar)} />
      </div>
    </div>

    </div>

    <div className={`cursor-pointer mt-2 p-3 text-green-900 absolute  flex justify-end ${!bar ? 'z-20' : 'z-10' } `}>    
      <AlignLeft  onClick={() => isOpen(!bar)} />
    </div>
    </div>
  )
}

export default Mobile