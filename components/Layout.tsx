import Head from 'next/head';
import Footer from './Footer';
import Navbar from './Navbar';

type Props = {
  children: JSX.Element | JSX.Element[];
};

const Layout = ({ children }: Props) => {
  return (
    <div className='layout'>
      <Head>
        <title>Boat Store</title>
      </Head>
      <header>
        <Navbar></Navbar>
      </header>
      <main className='main-container'>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
