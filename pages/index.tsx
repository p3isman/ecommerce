import type { GetStaticProps, NextPage } from 'next';
import { FooterBanner, HeroBanner, Product } from '../components/index';
import { client } from '../lib/client';
import { IBanner, IProduct } from '../sanity_ecommerce/schema';

type Props = {
  products: IProduct[];
  bannerData: IBanner[];
};

const Home: NextPage<Props> = ({ products, bannerData }) => {
  return (
    <>
      <HeroBanner heroBanner={bannerData[1]} />
      <div className='products-heading'>
        <h2>Discover Our Products</h2>
        <p>Hear with the best quality</p>
      </div>
      <div className='products-container'>
        {products?.map(product => (
          <Product key={product._id} product={product} />
        ))}
      </div>
      <FooterBanner footerBanner={bannerData[0]} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const productsQuery = '*[_type == "product"]';
  const products = await client.fetch(productsQuery);
  const bannerQuery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products, bannerData }
  };
};

export default Home;
