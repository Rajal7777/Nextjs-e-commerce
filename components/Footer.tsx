import {APP_NAME } from '@/lib/constants/index';

const Footer = () => {
    const currenYear = new Date().getFullYear();
    return ( 
    <footer className='border-t flex items-end'>
      <div className="p-5 flex-center">
        {APP_NAME} {currenYear}. All Rights Reserved
      </div>
    </footer> 
    );
}
 
export default Footer;