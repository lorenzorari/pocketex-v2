import { type ImgHTMLAttributes, useState } from 'react';
import { Loader } from '@/components/ui/Loader';
import { cn } from '@/utils/classnames';

type Props = ImgHTMLAttributes<HTMLImageElement>;

export const Image = (props: Props) => {
  const { className, ...imgProps } = props;

  const [isLoading, setIsLoading] = useState<boolean>(true);

  function handleLoad() {
    setIsLoading(false);
  }

  return (
    <>
      {isLoading && (
        <div className="flex h-full items-center justify-center text-white">
          <Loader />
        </div>
      )}
      <img
        className={cn({ hidden: isLoading }, className)}
        onLoad={handleLoad}
        {...imgProps}
      />
    </>
  );
};
