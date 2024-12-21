import { useMemo, useState, useCallback, useEffect } from "react";

import { axiosUser } from "../../../api/axios";
import CarouselItems from "./CarouselItems";

function Carousel() {
  type Image = {
    _id: string;
    image: {
      public_id: string;
      url: string;
    };
    page: string;
  };

  type ImagesState = {
    images: Image[];
    error: string | null;
  };

  const [tourImages, setTourImages] = useState<ImagesState>({
    images: [],
    error: null,
  });

  useEffect(() => {
    const fetchTourImages = async () => {
      try {
        const response = await axiosUser.get("/tourimages");
        setTourImages({
          images: response.data,
          error: null,
        });
      } catch (err) {
        setTourImages({
          images: [],
          error: "Failed to load hotel images",
        });
      }
    };

    fetchTourImages();
  }, []);

  const filteredImageNotFound = {
    public_id: "not_found",
    url: "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1730293799/Site%20Images/istockphoto-1409329028-612x612_bvpfff.jpg",
  };

  const memoizedTourImages = useMemo(
    () => tourImages.images,
    [tourImages.images]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const updateIndex = useCallback(
    (newIndex: number) => {
      if (newIndex < 0) {
        newIndex = 0;
      } else if (newIndex >= memoizedTourImages.length) {
        newIndex = memoizedTourImages.length - 1;
      }
      setActiveIndex(newIndex);
    },
    [memoizedTourImages.length]
  );

  return (
    <div className="flex flex-col gap-y-2 h-min justify-center rounded-2xl overflow-hidden w-full min-400:w-4/5 min-700:w-3/4 min-800:w-2/3 min-900:w-[35rem]">
      <div
        style={{ transform: `translate(-${activeIndex * 100}%)` }}
        className="whitespace-nowrap transition-transform duration-300 [&>div]:inline-flex"
      >
        {!tourImages.error && memoizedTourImages.length > 0 ? (
          memoizedTourImages.map((item) => (
            <CarouselItems
              key={item._id} // Using _id as key
              items={item.image ? item.image : filteredImageNotFound} // Pass only the URL
            />
          ))
        ) : (
          <CarouselItems items={filteredImageNotFound} />
        )}
      </div>
      <div className="flex gap-x-4">
        <button
          onClick={() => {
            updateIndex(activeIndex - 1);
          }}
        >
          <svg
            className="w-6 h-fit min-500:w-8 min-1200:w-9 min-1400:w-10"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M2.14941 12C2.14941 11.5858 2.4852 11.25 2.89941 11.25H20.8994C21.3136 11.25 21.6494 11.5858 21.6494 12C21.6494 12.4142 21.3136 12.75 20.8994 12.75H2.89941C2.4852 12.75 2.14941 12.4142 2.14941 12Z"
              fill={activeIndex <= 0 ? "grey" : "white"}
            />
            <path
              d="M9.42973 5.46967C9.72262 5.76256 9.72262 6.23744 9.42973 6.53033L3.96007 12L9.42973 17.4697C9.72262 17.7626 9.72262 18.2374 9.42973 18.5303C9.13683 18.8232 8.66196 18.8232 8.36907 18.5303L2.36908 12.5303C2.07619 12.2374 2.07619 11.7626 2.36908 11.4697L8.36907 5.46967C8.66196 5.17678 9.13683 5.17678 9.42973 5.46967Z"
              fill={activeIndex <= 0 ? "grey" : "white"}
            />
          </svg>
        </button>
        <button
          onClick={() => {
            updateIndex(activeIndex + 1);
          }}
        >
          <svg
            className="w-6 h-fit min-500:w-8 min-1200:w-9 min-1400:w-10"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M2.25 12C2.25 11.5858 2.58579 11.25 3 11.25H21C21.4142 11.25 21.75 11.5858 21.75 12C21.75 12.4142 21.4142 12.75 21 12.75H3C2.58579 12.75 2.25 12.4142 2.25 12Z"
              fill={
                activeIndex >= memoizedTourImages.length - 1 ? "grey" : "white"
              }
            />
            <path
              d="M14.4697 5.46967C14.7626 5.17678 15.2374 5.17678 15.5303 5.46967L21.5303 11.4697C21.8232 11.7626 21.8232 12.2374 21.5303 12.5303L15.5303 18.5303C15.2374 18.8232 14.7626 18.8232 14.4697 18.5303C14.1768 18.2374 14.1768 17.7626 14.4697 17.4697L19.9393 12L14.4697 6.53033C14.1768 6.23744 14.1768 5.76256 14.4697 5.46967Z"
              fill={
                activeIndex >= memoizedTourImages.length - 1 ? "grey" : "white"
              }
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Carousel;
