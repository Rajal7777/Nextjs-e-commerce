import { APP_NAME } from "@/lib/constants";


const Footer = () => {
  const currenYear = new Date().getFullYear();
  return (
    <footer className='border-t h-10'>
      <div className="px-5 flex-center">
        {APP_NAME} {currenYear}. All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;