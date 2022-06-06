import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  AiOutlineDelete,
  AiOutlineLeft,
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineShopping
} from 'react-icons/ai';
import Stripe from 'stripe';
import { AppContext } from '../context/StateContext';
import { urlFor } from '../lib/client';
import getStripe from '../lib/getStripe';

const Cart = () => {
  const cartRef = useRef<HTMLDivElement>(null);
  const {
    totalItemsAmount,
    totalPrice,
    cartItems,
    setShowCart,
    changeItemQuantity,
    onDelete
  } = useContext(AppContext);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCart(false);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartRef, setShowCart]);

  const handleCheckout = async () => {
    // Load stripe client
    const stripe = await getStripe();

    // Call POST method on our backend with our cartItems
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cartItems })
    });

    if (response.status === 500) {
      toast.error(`An error ocurred: ${response.statusText}`);
      return;
    }

    const data: Stripe.Checkout.Session = await response.json();
    toast.loading('Redirecting...');

    stripe?.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <div className='cart-wrapper'>
      <div className='cart-container' ref={cartRef}>
        <button
          type='button'
          className='cart-heading'
          onClick={() => setShowCart(false)}>
          <AiOutlineLeft />
          <span className='heading'>Your Bag</span>
          <span className='cart-num-items'>
            ({totalItemsAmount} {totalItemsAmount === 1 ? 'item' : 'items'})
          </span>
        </button>

        {/* Cart is empty */}
        {cartItems.length < 1 && (
          <div className='empty-cart'>
            <AiOutlineShopping size={150} />
            <h3>Your shopping Bag is empty.</h3>
            <Link href='/'>
              <button
                type='button'
                className='btn'
                onClick={() => setShowCart(false)}>
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        {/* Cart has items */}
        <div className='product-container'>
          {cartItems.length > 0 &&
            cartItems.map(item => (
              <div className='product' key={item._id}>
                <div className='cart-image-container'>
                  <Image
                    className='cart-product-image'
                    src={urlFor(item.image![0]).url()}
                    alt={item.name}
                    width={200}
                    height={200}
                  />
                </div>
                <div className='item-desc'>
                  <div className='flex top'>
                    <h5>{item.name}</h5>
                    <h4 className='cart-price'>{item.price}</h4>
                  </div>
                  <div className='flex bottom'>
                    <div>
                      <p className='quantity-text'>Quantity:</p>
                      <p className='quantity-desc'>
                        <span
                          className='minus'
                          onClick={() => {
                            changeItemQuantity(item._id, 'dec');
                          }}>
                          <AiOutlineMinus />
                        </span>
                        <span className='num'>{item.quantity}</span>
                        <span
                          className='plus'
                          onClick={() => {
                            changeItemQuantity(item._id, 'inc');
                          }}>
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type='button'
                      className='remove-item'
                      onClick={() => {
                        onDelete(item);
                      }}>
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems.length > 0 && (
          <div className='cart-bottom'>
            <div className='total'>
              <h3>Subtotal:</h3>
              <h3 className='cart-price'>{totalPrice}</h3>
            </div>
            <div className='btn-container'>
              <button type='button' className='btn' onClick={handleCheckout}>
                Proceed To Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
