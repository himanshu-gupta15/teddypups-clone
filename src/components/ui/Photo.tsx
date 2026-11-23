import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { Media } from '@/lib/types';

type Props = {
  media: Media;
  sizes: string;
  /** "fill" crops around the focal point, "natural" keeps the photo's own ratio. */
  layout?: 'fill' | 'natural';
  alt?: string;
  eager?: boolean;
  preload?: boolean;
  quality?: 75 | 85;
  className?: string;
  style?: CSSProperties;
};

export function Photo({ media, sizes, layout = 'fill', alt = media.alt, eager, preload, quality, className, style }: Props) {
  const shared = {
    src: media.src,
    sizes,
    quality,
    preload,
    loading: preload ? undefined : eager ? ('eager' as const) : ('lazy' as const),
    className,
  };
  if (layout === 'natural')
    return (
      <Image
        {...shared}
        alt={alt}
        width={media.width}
        height={media.height}
        style={{ width: '100%', height: 'auto', backgroundColor: media.color, ...style }}
      />
    );
  return (
    <Image
      {...shared}
      alt={alt}
      fill
      style={{
        objectFit: 'cover',
        objectPosition: `${media.focalX * 100}% ${media.focalY * 100}%`,
        backgroundColor: media.color,
        ...style,
      }}
    />
  );
}
