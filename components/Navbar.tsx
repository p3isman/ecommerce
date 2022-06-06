import Link from 'next/link';
import { useContext } from 'react';
import { AiOutlineShopping } from 'react-icons/ai';
import { AppContext } from '../context/StateContext';
import Cart from './Cart';

const Navbar = () => {
  const { totalItemsAmount, showCart, setShowCart } = useContext(AppContext);
  return (
    <div className='navbar-container'>
      <p className='logo'>
        <Link href='/'>Boat Headphones</Link>
      </p>

      <button
        type='button'
        className='cart-icon'
        onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className='cart-item-qty'>{totalItemsAmount}</span>
      </button>

      {showCart && <Cart />}
    </div>
  );
};

export default Navbar;
