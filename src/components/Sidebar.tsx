import React, { useState, useEffect } from 'react';
import { Nav, adminNav } from '@/utils/nav';
import Link from 'next/link';
import { AlignLeft, AlignRight, LogOut, Sun, Moon } from 'lucide-react'; 
import { useRouter } from 'next/router'; 
import { usePathname } from 'next/navigation';
import { getCookie, deleteCookie } from 'cookies-next';
import { useQuery } from '@apollo/client';
import { GET_USER_TYPE } from '@/graphql/query/user';
import { useTheme } from 'next-themes';

interface HeaderProps {
  authenticatedUserID: string;
}

const Sidebar: React.FC<HeaderProps> = ({ authenticatedUserID }) => {
  const [bar, setBar] = useState<boolean>(true);
  const path = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    // console.log("Initial theme:", savedTheme);

    const token = getCookie('token');
    if (!token) {
      router.push('/auth/login');
    }
  }, [router, setTheme]); 

  const handleLogout = () => {
    deleteCookie('token');
    router.push('/auth/login');
  };

  const { data: getType, loading } = useQuery(GET_USER_TYPE, {
    variables: { userID: authenticatedUserID },
  });

  const TYPE = getType?.getUser.type || '';

  // console.log("TYPE from C ", TYPE);
  // useEffect(() => {
  //   console.log("Current theme:", theme);
  // }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) return null;

  return (
    <div className={`md:w-20 lg:w-full h-screen border-r border-green-900 dark:text-white ${!bar ? 'w-6' : ''}`}>
      <section className='pb-[.8rem] py-2 h-[4.05rem] border-b-2 border-green-900 flex items-center justify-between'>
        {bar ? (
          <img src={'/aramco.png'} className='w-5/6 p-2 md:hidden lg:flex' />
        ) : (
          <div className='w-full flex justify-center md:hidden lg:flex'>
            <img src={'/Logo.png'} className='w-12 m-1' />
          </div>
        )}
        <div className='md-flex lg:hidden items-center justify-center ml-4'>
          <img src={'/Logo.png'} className='w-12 m-1' />
        </div>

        <div className='cursor-pointer mt-2 text-green-900 md:hidden lg:flex'>
          {bar ? (
            <AlignLeft onClick={() => setBar(false)} />
          ) : (
            <AlignRight onClick={() => setBar(true)} />
          )}
        </div>
      </section>

      <section className='mt-2'>
        <ul>
          {TYPE === "ADMIN" ? (
            <>
              {adminNav.map(nav => (
                <Link key={nav.link} href={nav.link}>
                  <li className={`flex items-center p-4 font-bold text-xl ${path === nav.link ? 'bg-green-900 text-white hover:bg-gradient-to-l transition-all ease-in-out duration-400' : ''}`}>
                    <span className='mx-4'>{nav.icon}</span>
                    <p className={`md:hidden ${!bar ? 'hidden' : 'lg:flex'}`}>{nav.name}</p>
                  </li>
                </Link>
              ))}
            </>
          ) : (
            <>
              {Nav.map(nav => (
                <Link key={nav.link} href={nav.link}>
                  <li className={`flex items-center p-4 font-bold text-xl ${path === nav.link ? 'bg-green-900 text-white hover:bg-gradient-to-l transition-all ease-in-out duration-400' : ''}`}>
                    <span className='mx-4'>{nav.icon}</span>
                    <p className={`md:hidden ${!bar ? 'hidden' : 'lg:flex'}`}>{nav.name}</p>
                  </li>
                </Link>
              ))}
            </>
          )}
        </ul>
      </section>

      <section className={`mt-20 -mx-3 lg:mx-4 flex items-center p-4 font-bold text-xl ${bar ? null : 'pl-0'}`}>
        <div className="flex items-center space-x-4">
          <div className={`${bar ? null : 'hidden'}`}>
            <Sun className={`text-yellow-500 hidden lg:flex ${theme === 'dark' ? 'opacity-50' : 'opacity-100'}`} />
          </div>
          <label className='relative inline-flex items-center cursor-pointer'>
            <input
              type="checkbox"
              className="sr-only"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <div className="w-11 h-6 bg-black dark:bg-gray-300 rounded-full"></div>
            <span className="absolute left-0.5 top-0.5 w-5 h-5 dark:bg-black bg-white rounded-full transition-transform transform" 
              style={{ transform: theme === 'dark' ? 'translateX(100%)' : 'translateX(0)' }}
            />
          </label>
          <div className={`${bar ? null : 'hidden'}`}>
            <Moon className={`text-blue-500 hidden lg:flex ${theme === 'dark' ? 'opacity-100' : 'opacity-50'}`} />
          </div>
        </div>
      </section>

      <div className='grid items-end mt-10'>
        <div className={`flex items-center p-4 font-bold text-xl cursor-pointer`} onClick={handleLogout}>
          <span><LogOut className='mx-4' /></span>
          <p className={`md:hidden ${!bar ? 'hidden' : 'lg:flex'}`}>Logout</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
