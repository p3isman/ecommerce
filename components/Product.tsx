import { useNextSanityImage } from 'next-sanity-image';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '../lib/client';
import { IProduct } from '../types';

type Props = {
  product: IProduct;
};

const Product = ({ product: { name, image, slug, price } }: Props) => {
  const imageProps = useNextSanityImage(client, image![0]);

  return (
    <div>
      <Link href={`/product/${slug?.current}`}>
        <div className='product-card'>
          <div className='product-image'>
            <Image {...imageProps} alt={name} />
          </div>
          <p className='product-name'>{name}</p>
          <p className='product-price'>${price}</p>
        </div>
      </Link>
    </div>
  );
};

export default Product;
