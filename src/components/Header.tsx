import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { GET_USER, GET_USER_NOTIFICATION } from '@/graphql/query/user'
import { Bell, Search, UserIcon } from 'lucide-react'
import { getCookie, deleteCookie } from 'cookies-next'
import { Web3Button } from '@web3modal/react'

interface HeaderProps {
  authenticatedUserID: string
}

const Header: React.FC<HeaderProps> = ({ authenticatedUserID }) => {
  const [userName, setUserName] = useState('')
  const [userImage, setUserImage] = useState<string | undefined>(undefined)
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)
  const [mobile, setOptions] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  const { data: userData } = useQuery(GET_USER, {
    variables: { userID: authenticatedUserID },
  })

  const { data: notificationsData } = useQuery(GET_USER_NOTIFICATION, {
    variables: { userID: authenticatedUserID },
  })

  useEffect(() => {
    if (userData?.getUser) {
      const { firstName, lastName, userImage } = userData.getUser
      setUserName(`${firstName} ${lastName}`)
      setUserImage(userImage)
    }
  }, [userData])

  useEffect(() => {
    if (notificationsData?.getUserNotifications) {
      const unreadCount = notificationsData.getUserNotifications.filter(
        (notification: any) => !notification.seen,
      ).length
      setUnreadNotificationsCount(unreadCount)
    }
  }, [notificationsData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSearch = () => {
    const trimmedQuery = query.trim()
    if (trimmedQuery) {
      router.push(`/search?q=${trimmedQuery}&userID=${authenticatedUserID}`)
    }
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const language = e.target.value
    const googleTranslateElement = window.google?.translate.TranslateElement

    if (googleTranslateElement) {
      const translateElement = new googleTranslateElement(
        { pageLanguage: 'en', includedLanguages: language },
        'google_translate_element',
      )
      const select = document.querySelector(
        '.goog-te-combo',
      ) as HTMLSelectElement
      if (select) {
        select.value = language
        select.dispatchEvent(new Event('change'))
      }
    }
  }

  const handleLogout = () => {
    deleteCookie('token')
    router.push('/auth/login')
  }

  const toggleMobileOptions = () => {
    setOptions((prevState) => !prevState)
  }

  return (
    <div>
      <section
        className={`bg-transparent h-full w-full z-0 ${
          mobile ? 'fixed' : 'hidden'
        }`}
        onClick={() => setOptions(false)}
      ></section>
      <div className="bg-transparent backdrop-blur flex items-center h-16 border-b border-green-900 dark:text-white">
        <section className="m-4 ml-10 lg:ml-4 w-8/12 lg:w-6/12 flex p-3 items-center bg-transparent border-2 border-green-900/50 rounded-lg">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            className="w-full focus:outline-none bg-transparent"
            placeholder="Search..."
            aria-label="Search"
          />
          <Search
            className="cursor-pointer text-green-900/90"
            onClick={handleSearch}
          />
        </section>
        <section className="flex items-center justify-end w-4/12 lg:w-5/12 px-2">
          <div className="w-full flex items-center">
            <div className="relative">
              <Link href={'/notification'}>
                <Bell
                  className={` md:mx-6 w-10 md:w-10 ${
                    unreadNotificationsCount > 0
                      ? 'text-red-500'
                      : 'text-green-900/90'
                  }`}
                />
                {unreadNotificationsCount > 0 && (
                  <div className="absolute -top-2 right-3 md:right-7 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center font-bold text-white">
                    {unreadNotificationsCount}
                  </div>
                )}
              </Link>
            </div>
            <div className="md:w-[3rem] lg:w-full flex items-center">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  width={50}
                  height={50}
                  className="rounded-full w-full md:w-12 h-12 border border-green-900/90 cursor-pointer"
                  onClick={toggleMobileOptions}
                />
              ) : (
                <UserIcon
                  className="w-full md:w-16 h-12 text-green-900 rounded-full border border-green-900/90 cursor-pointer"
                  onClick={toggleMobileOptions}
                />
              )}
              {mobile && (
                <ul className="bg-white dark:bg-[#121212] absolute -ml-28 md:ml-0 mt-52 p-4 space-y-2 z-30">
                  <Link href={'/account'}>
                    <li className="cursor-pointer">{userName}</li>
                  </Link>
                  <li className="cursor-pointer" onClick={handleLogout}>
                    Logout
                  </li>
                  <select
                    onChange={handleLanguageChange}
                    className="w-20 focus:outline-none"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                    <option value="ja">Japanese</option>
                    <option value="zh-CN">Chinese (Simplified)</option>
                    <option value="zh-TW">Chinese (Traditional)</option>
                    <option value="pt-BR">Portuguese (Brazil)</option>
                    <option value="ru">Russian</option>
                    <option value="vi">Vietnamese</option>
                    <option value="pl">Polish</option>
                    <option value="nl">Dutch</option>
                    <option value="sv">Swedish</option>
                    <option value="da">Danish</option>
                    <option value="fi">Finnish</option>
                    <option value="no">Norwegian</option>
                    <option value="cs">Czech</option>
                    <option value="el">Greek</option>
                    <option value="tr">Turkish</option>
                    <option value="he">Hebrew</option>
                    <option value="id">Indonesian</option>
                    <option value="th">Thai</option>
                    <option value="ur">Urdu</option>
                    <option value="ar">Arabic</option>
                    <option value="bg">Bulgarian</option>
                    <option value="hr">Croatian</option>
                    <option value="et">Estonian</option>
                    <option value="hu">Hungarian</option>
                    <option value="is">Icelandic</option>
                    <option value="lt">Lithuanian</option>
                    <option value="lv">Latvian</option>
                    <option value="mk">Macedonian</option>
                    <option value="mt">Maltese</option>
                    <option value="no">Norwegian Bokmål</option>
                    <option value="ro">Romanian</option>
                    <option value="sk">Slovak</option>
                    <option value="sl">Slovenian</option>
                    <option value="sq">Albanian</option>
                    <option value="sr">Serbian</option>
                    <option value="uk">Ukrainian</option>
                    <option value="vi">Vietnamese</option>
                  </select>
                </ul>
              )}

              <p className="hidden lg:flex w-full px-2">{userName}</p>
            </div>
          </div>
          <div className="flex md:mr-0 w-52 hidden md:flex justify-end">
            <select
              onChange={handleLanguageChange}
              className="w-20 focus:outline-none"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="ja">Japanese</option>
              <option value="zh-CN">Chinese (Simplified)</option>
              <option value="zh-TW">Chinese (Traditional)</option>
              <option value="pt-BR">Portuguese (Brazil)</option>
              <option value="ru">Russian</option>
              <option value="vi">Vietnamese</option>
              <option value="pl">Polish</option>
              <option value="nl">Dutch</option>
              <option value="sv">Swedish</option>
              <option value="da">Danish</option>
              <option value="fi">Finnish</option>
              <option value="no">Norwegian</option>
              <option value="cs">Czech</option>
              <option value="el">Greek</option>
              <option value="tr">Turkish</option>
              <option value="he">Hebrew</option>
              <option value="id">Indonesian</option>
              <option value="th">Thai</option>
              <option value="ur">Urdu</option>
              <option value="ar">Arabic</option>
              <option value="bg">Bulgarian</option>
              <option value="hr">Croatian</option>
              <option value="et">Estonian</option>
              <option value="hu">Hungarian</option>
              <option value="is">Icelandic</option>
              <option value="lt">Lithuanian</option>
              <option value="lv">Latvian</option>
              <option value="mk">Macedonian</option>
              <option value="mt">Maltese</option>
              <option value="no">Norwegian Bokmål</option>
              <option value="ro">Romanian</option>
              <option value="sk">Slovak</option>
              <option value="sl">Slovenian</option>
              <option value="sq">Albanian</option>
              <option value="sr">Serbian</option>
              <option value="uk">Ukrainian</option>
              <option value="vi">Vietnamese</option>
            </select>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Header
