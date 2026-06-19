import Image from "next/image";
import spinner from "@/public/images/loader.gif";

const LoadingPage = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <Image src={spinner} alt="loading..." height={48} width={48} />
        </div>
    );
};

export default LoadingPage;