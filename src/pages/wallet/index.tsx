
import Head from '@/components/wallet/Head'
import Card from '@/components/wallet/Card'
import History from '@/components/wallet/History'

interface USERID {
  authenticatedUserID: string;
}

const Index: React.FC<USERID> = ({ authenticatedUserID }) => {
  return (
    <div className=' py-4'>
        <Head authenticatedUserID={authenticatedUserID} /> 
        <Card authenticatedUserID={authenticatedUserID} />
        <History authenticatedUserID={authenticatedUserID} />
    </div>
  )
}

export default Index;
