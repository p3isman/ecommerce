import type {
  SanityBlock,
  SanityDocument,
  SanityGeoPoint,
  SanityImageAsset,
  SanityImageCrop,
  SanityImageDimensions,
  SanityImageHotspot,
  SanityImageMetadata,
  SanityImagePalette,
  SanityImagePaletteSwatch,
  SanityKeyed,
  SanityKeyedReference,
  SanityReference
} from 'sanity-codegen';

export type {
  SanityReference,
  SanityKeyedReference,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch
};

/**
 * Product
 *
 *
 */
export interface IProduct extends SanityDocument {
  _type: 'product';

  /**
   * Image — `array`
   *
   *
   */
  image?: Array<
    SanityKeyed<{
      _type: 'image';
      asset: SanityReference<SanityImageAsset>;
      crop?: SanityImageCrop;
      hotspot?: SanityImageHotspot;
    }>
  >;

  /**
   * Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Slug — `slug`
   *
   *
   */
  slug?: { _type: 'slug'; current: string };

  /**
   * Price — `number`
   *
   *
   */
  price?: number;

  /**
   * Details — `string`
   *
   *
   */
  details?: string;
}

/**
 * Banner
 *
 *
 */
export interface IBanner extends SanityDocument {
  _type: 'banner';

  /**
   * Image — `image`
   *
   *
   */
  image?: {
    _type: 'image';
    asset: SanityReference<SanityImageAsset>;
    crop?: SanityImageCrop;
    hotspot?: SanityImageHotspot;
  };

  /**
   * ButtonText — `string`
   *
   *
   */
  buttonText?: string;

  /**
   * Product — `string`
   *
   *
   */
  product?: string;

  /**
   * Desc — `string`
   *
   *
   */
  desc?: string;

  /**
   * SmallText — `string`
   *
   *
   */
  smallText?: string;

  /**
   * MidText — `string`
   *
   *
   */
  midText?: string;

  /**
   * LargeText1 — `string`
   *
   *
   */
  largeText1?: string;

  /**
   * LargeText2 — `string`
   *
   *
   */
  largeText2?: string;

  /**
   * Discount — `string`
   *
   *
   */
  discount?: string;

  /**
   * SaleTime — `string`
   *
   *
   */
  saleTime?: string;
}

export type Documents = IProduct | IBanner;
