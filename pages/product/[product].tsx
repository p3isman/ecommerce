import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useNextSanityImage } from 'next-sanity-image';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';
import Stripe from 'stripe';
import { Product } from '../../components';
import { AppContext, CartProduct } from '../../context/StateContext';
import { client, urlFor } from '../../lib/client';
import getStripe from '../../lib/getStripe';
import { IProduct } from '../../sanity_ecommerce/schema';

type Props = {
  product: IProduct;
  products: IProduct[];
};

const ProductDetails: NextPage<Props> = ({ product, products }) => {
  const { name, image, price, details } = product;

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);

  const { onAdd } = useContext(AppContext);

  // Reset quantity when navigating through products
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prevQuantity => {
      if (prevQuantity === 1) return prevQuantity;
      return prevQuantity - 1;
    });
  };

  const handleAdd = () => {
    setQuantity(1);
    onAdd(product, quantity);
  };

  const handleBuyNow = async () => {
    const item: CartProduct = { ...product, quantity: 1 };
    const cartItems: CartProduct[] = [item];

    const stripe = await getStripe();

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
    <div>
      <div className='product-detail-container'>
        <div>
          <div>
            <Image
              {...useNextSanityImage(client, image![selectedImage])}
              alt={product.name}
              className='product-detail-image'
              width={400}
              height={400}
            />
          </div>
          <div className='small-images-container'>
            {image?.map((item, i) => (
              <Image
                alt={name}
                key={item._key}
                src={urlFor(item).url()}
                width={150}
                height={150}
                className={
                  selectedImage === i
                    ? 'small-image selected-image'
                    : 'small-image'
                }
                onMouseEnter={() => setSelectedImage(i)}
              />
            ))}
          </div>
        </div>

        <div className='product-detail-desc'>
          <h1>{name}</h1>
          <div className='reviews'>
            <div>
              <BsStarFill />
              <BsStarFill />
              <BsStarFill />
              <BsStarFill />
              <BsStarHalf />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details:</h4>
          <p>{details}</p>
          <p className='price'>{price}</p>
          <p className='available'>In Stock</p>
          <div className='quantity'>
            <h3>Quantity: </h3>
            <p className='quantity-desc'>
              <span className='minus' onClick={decreaseQuantity}>
                <AiOutlineMinus />
              </span>
              <span className='num'>{quantity}</span>
              <span className='plus' onClick={increaseQuantity}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className='buttons'>
            <button type='button' className='add-to-cart' onClick={handleAdd}>
              Add to Cart
            </button>
            <button type='button' className='buy-now' onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className='maylike-products-wrapper'>
        <h2>You may also like...</h2>
        <div className='marquee'>
          <div className='maylike-products-container track'>
            {products.map(item => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }`;

  type Product = {
    slug: {
      current: string;
    };
  };

  const products: Product[] = await client.fetch(query);
  const paths = products.map(product => ({
    params: {
      product: product.slug.current
    }
  }));

  return {
    paths,
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "product" && slug.current == '${
    params!.product
  }'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { product, products }
  };
};

export default ProductDetails;
