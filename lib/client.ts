import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = sanityClient({
  projectId: 'vac1zklg',
  dataset: 'production',
  apiVersion: '2022-03-10',
  useCdn: true
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: SanityImageSource) => builder.image(source);
