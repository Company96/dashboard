import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Body from "@/components/Body";

interface USERID {
  authenticatedUserID: string;
}

const Home: React.FC<USERID> = ({authenticatedUserID}) => {
  return (
    <main className="">
        <Body authenticatedUserID={authenticatedUserID}  />
    </main>
  );
}

export default Home;
