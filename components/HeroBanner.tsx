import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { useNextSanityImage } from 'next-sanity-image';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '../lib/client';
import { IBanner } from '../sanity_ecommerce/schema';

type Props = {
  heroBanner: IBanner;
};

const HeroBanner = ({ heroBanner }: Props) => {
  // Needed to get Image source
  const imageProps = useNextSanityImage(
    client,
    heroBanner.image as SanityImageSource
  );

  return (
    <div className='hero-banner-container'>
      <div>
        <p className='beats-solo'>{heroBanner.smallText}</p>
        <h3>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText1}</h1>
        <div className='hero-banner-image'>
          <Image {...imageProps} alt='headphones' />
        </div>
        <div>
          <Link href={`/product/${heroBanner.product}`}>
            <button type='button'>{heroBanner.buttonText}</button>
          </Link>
          <div className='desc'>
            <p>{heroBanner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
