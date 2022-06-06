import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { CartProduct } from '../../context/StateContext';
import { urlFor } from '../../lib/client';

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2020-08-27'
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1L7HsQFIQivAYf1qlh8eLTyR' },
          { shipping_rate: 'shr_1L7HsyFIQivAYf1qzL5Skt1H' }
        ],
        line_items: req.body.cartItems.map(
          (item: CartProduct): Stripe.Checkout.SessionCreateParams.LineItem => {
            const imgUrl = urlFor(item.image![0]).url();
            return {
              price_data: {
                currency: 'eur',
                product_data: {
                  name: item.name!,
                  images: [imgUrl]
                },
                unit_amount: item.price! * 100
              },
              adjustable_quantity: {
                enabled: true,
                minimum: 1
              },
              quantity: item.quantity
            };
          }
        ),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/`
      };

      // Create Checkout Sessions from body params.
      const session: Stripe.Checkout.Session =
        await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json(err.message);
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
