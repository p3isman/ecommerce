import { AiFillInstagram, AiOutlineTwitter } from 'react-icons/ai';

const Footer = () => {
  return (
    <div className='footer-container'>
      <p>
        Copyright &copy; {new Date().getFullYear()} Boat Headphones. All rights
        reserved.
      </p>
      <p>This website is just for showcase purposes.</p>
      <p className='icons'>
        <AiFillInstagram />
        <AiOutlineTwitter />
      </p>
    </div>
  );
};

export default Footer;
