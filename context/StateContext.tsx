import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState
} from 'react';
import toast from 'react-hot-toast';
import { IProduct } from '../types';

interface AppContext {
  showCart: boolean;
  cartItems: CartProduct[];
  totalPrice: number;
  totalItemsAmount: number;
  setShowCart: Dispatch<SetStateAction<boolean>>;
  setCartItems: Dispatch<SetStateAction<CartProduct[]>>;
  setTotalPrice: Dispatch<SetStateAction<number>>;
  setTotalItemsAmount: Dispatch<SetStateAction<number>>;
  onAdd(product: IProduct, quantity: number): void;
  onDelete(product: CartProduct): void;
  changeItemQuantity(id: string, action: 'inc' | 'dec'): void;
}

export interface CartProduct extends IProduct {
  quantity: number;
}

export const AppContext = createContext<AppContext>({} as AppContext);

type Props = {
  children: JSX.Element;
};

const StateContext = ({ children }: Props) => {
  const [showCart, setShowCart] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalItemsAmount, setTotalItemsAmount] = useState<number>(0);

  // Load localStorage items
  useEffect(() => {
    setCartItems(JSON.parse(localStorage.getItem('cartItems') ?? '[]'));
    setTotalPrice(JSON.parse(localStorage.getItem('totalPrice') ?? '0'));
    setTotalItemsAmount(
      JSON.parse(localStorage.getItem('totalItemsAmount') ?? '0')
    );
  }, []);

  const changeItemQuantity = (id: string, action: 'inc' | 'dec') => {
    const product = cartItems.find(item => item._id === id);
    const productIndex = cartItems.findIndex(item => item._id === id);
    if (!product) return;

    const newCartItems = cartItems.filter(item => item._id !== id);

    if (action === 'inc') {
      // Replace old item with new item with updated quantity
      newCartItems.splice(productIndex, 0, {
        ...product,
        quantity: product.quantity + 1
      });
      setCartItems(newCartItems);
      setTotalPrice(prevTotalPrice => prevTotalPrice + product.price!);
      setTotalItemsAmount(prevTotalItemsAmount => prevTotalItemsAmount + 1);
      localStorage.setItem(
        'totalPrice',
        JSON.stringify(totalPrice + product.price!)
      );
      localStorage.setItem(
        'totalItemsAmount',
        JSON.stringify(totalItemsAmount + 1)
      );
    } else if (action === 'dec') {
      if (product.quantity > 1) {
        newCartItems.splice(productIndex, 0, {
          ...product,
          quantity: product.quantity - 1
        });
        setCartItems(newCartItems);
        setTotalPrice(prevTotalPrice => prevTotalPrice - product.price!);
        setTotalItemsAmount(prevTotalItemsAmount => prevTotalItemsAmount - 1);
        localStorage.setItem(
          'totalPrice',
          JSON.stringify(totalPrice - product.price!)
        );
        localStorage.setItem(
          'totalItemsAmount',
          JSON.stringify(totalItemsAmount - 1)
        );
      }
    }
    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
  };

  const onAdd = (product: IProduct, quantity: number) => {
    setTotalPrice(prevTotalPrice => prevTotalPrice + product.price! * quantity);
    setTotalItemsAmount(
      prevTotalItemsAmount => prevTotalItemsAmount + quantity
    );

    localStorage.setItem(
      'totalPrice',
      JSON.stringify(totalPrice + product.price! * quantity)
    );
    localStorage.setItem(
      'totalItemsAmount',
      JSON.stringify(totalItemsAmount + quantity)
    );

    const checkProductInCart = cartItems.find(item => item._id === product._id);
    if (checkProductInCart) {
      const updatedCartItems = cartItems.map(item => {
        if (item._id === product._id)
          return { ...item, quantity: item.quantity + quantity };
        return item;
      });

      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } else {
      const newItem: CartProduct = { ...product, quantity };
      setCartItems(prevCartItems => [...prevCartItems, newItem]);
      localStorage.setItem(
        'cartItems',
        JSON.stringify([...cartItems, newItem])
      );
    }

    toast.success(`${quantity} ${product.name} added to the cart.`);
  };

  const onDelete = (product: CartProduct) => {
    const newCartItems = cartItems.filter(item => item._id !== product._id);
    setTotalPrice(
      prevTotalPrice => prevTotalPrice - product.price! * product.quantity
    );
    setTotalItemsAmount(
      prevTotalItemsAmount => prevTotalItemsAmount - product.quantity
    );
    setCartItems(newCartItems);

    localStorage.setItem('cartItems', JSON.stringify(newCartItems));
    localStorage.setItem(
      'totalPrice',
      JSON.stringify(totalPrice - product.price! * product.quantity)
    );
    localStorage.setItem(
      'totalItemsAmount',
      JSON.stringify(totalItemsAmount - product.quantity)
    );
  };

  return (
    <AppContext.Provider
      value={{
        showCart,
        cartItems,
        totalPrice,
        totalItemsAmount,
        setShowCart,
        setCartItems,
        setTotalPrice,
        setTotalItemsAmount,
        onAdd,
        onDelete,
        changeItemQuantity
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default StateContext;
