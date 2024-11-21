import React from 'react'

import  BodyCard  from '@/components/BodyElement/body'
import History from '@/components/BodyElement/history'
import { cards } from '@/utils/nav'

interface USERID {
  authenticatedUserID: string;
}

const Body : React.FC<USERID> = ({authenticatedUserID}) => {
  return (
    <div>
        <BodyCard authenticatedUserID={authenticatedUserID} />
        <History authenticatedUserID={authenticatedUserID} />
    </div>
  )
}

export default Body;