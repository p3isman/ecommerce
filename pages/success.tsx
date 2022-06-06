import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { BsBagCheckFill } from 'react-icons/bs';
import { AppContext } from '../context/StateContext';
import { runFireworks } from '../lib/utils';

const Success = () => {
  const { setCartItems, setTotalPrice, setTotalItemsAmount } =
    useContext(AppContext);

  useEffect(() => {
    localStorage.clear();
    setCartItems([]);
    setTotalPrice(0);
    setTotalItemsAmount(0);
    runFireworks();
  }, [setCartItems, setTotalPrice, setTotalItemsAmount]);

  return (
    <div className='success-wrapper'>
      <div className='success'>
        <p className='icon'>
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order!</h2>
        <p className='email-msg'>Check your email inbox for the receipt.</p>
        <p className='description'>
          If you have any questions, please email
          <a className='email' href='mailto:pedro_eisman@outlook.com'>
            pedro_eisman@outlook.com
          </a>
        </p>
        <Link href='/'>
          <button type='button' className='btn'>
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};
export default Success;
