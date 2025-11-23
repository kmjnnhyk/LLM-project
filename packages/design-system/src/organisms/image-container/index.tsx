import { FC } from 'react';
import { SvgProps } from 'react-native-svg';

import { Box } from '../../components/box';
import { Image, ImageProps } from '../../components/image';

interface ImageContainerProps {
  src: ImageProps['source'] | FC<SvgProps>;
  alt?: string;
  size?: ImageProps['size'];
  align?: 'start' | 'center' | 'end';
}

const ImageContainer = ({
  src,
  alt = 'image',
  size = 'md',
  align = 'center',
}: ImageContainerProps) => {
  const isSvgComponent = typeof src === 'function';
  if (isSvgComponent) {
    const SvgComponent = src as FC<SvgProps>;

    return (
      <Box className={`items-${align} w-full`}>
        <SvgComponent />
      </Box>
    );
  }

  return (
    <Box className={`items-${align} w-full`}>
      <Image size={size} source={src} alt={alt} />
    </Box>
  );
};

export { ImageContainer };
