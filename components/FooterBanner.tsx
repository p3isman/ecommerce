import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { useNextSanityImage } from 'next-sanity-image';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '../lib/client';
import { IBanner } from '../sanity_ecommerce/schema';

type Props = {
  footerBanner: IBanner;
};

const FooterBanner = ({
  footerBanner: {
    discount,
    largeText1,
    largeText2,
    saleTime,
    smallText,
    midText,
    desc,
    product,
    buttonText,
    image
  }
}: Props) => {
  const imageProps = useNextSanityImage(client, image as SanityImageSource);

  return (
    <div className='footer-banner-container'>
      <div className='banner-desc'>
        <div className='left'>
          <p>{discount}</p>
          <h3>{largeText1}</h3>
          <h3>{largeText2}</h3>
          <p>{saleTime}</p>
        </div>
        <div className='right'>
          <p>{smallText}</p>
          <h3>{midText}</h3>
          <p>{desc}</p>
          <Link href={`/product/${product}`}>
            <button type='button'>{buttonText}</button>
          </Link>
        </div>
        <div className='footer-banner-image'>
          <Image {...imageProps} alt={product} />
        </div>
      </div>
    </div>
  );
};

export default FooterBanner;
