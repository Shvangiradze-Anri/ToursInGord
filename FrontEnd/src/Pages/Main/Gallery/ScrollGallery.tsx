import React from "react";

type Images = {
  items: string;
  setImageURL: (url: string) => void;
};

const ScrollGallery: React.FC<Images> = React.memo(({ items, setImageURL }) => {
  return (
    <img
      loading="lazy"
      decoding="async"
      src={items}
      alt="TourImages"
      className=" w-full h-full cursor-pointer hover:scale-125 transition duration-500 rounded"
      onClick={() => setImageURL(items)}
    />
  );
});

export default ScrollGallery;
