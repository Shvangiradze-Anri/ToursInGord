import { useEffect, useMemo, useState, memo, lazy } from "react";
const ScrollGallery = lazy(() => import("./ScrollGallery"));
import { axiosUser } from "../../../api/axios";

// Memoized ScrollGallery Component
const MemoizedScrollGallery = memo(ScrollGallery);

const Gallery = () => {
  type Image = {
    _id: string;
    image: {
      public_id: string;
      url: string;
    };
    page: string;
  };

  type ImagesState = {
    loading: boolean;
    images: Image[];
    error: string | null;
  };
  const [galleryImages, setGalleryImages] = useState<ImagesState>({
    loading: true,
    images: [],
    error: null,
  });

  const [selectedImageURL, setSelectedImageURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotelImages = async () => {
      try {
        const response = await axiosUser.get("/galleryimages");
        setGalleryImages({
          loading: false,
          images: response.data,
          error: null,
        });
      } catch (err) {
        setGalleryImages({
          loading: false,
          images: [],
          error: "Failed to load hotel images",
        });
      }
    };

    fetchHotelImages();
  }, []);

  const filteredImageNotFound = {
    public_id: "not_found",
    url: "https://res.cloudinary.com/dywchsrms/image/upload/f_auto,q_auto/v1730293799/Site%20Images/istockphoto-1409329028-612x612_bvpfff.jpg",
  };

  const memoizedGalleryImages = useMemo(
    () => galleryImages.images,
    [galleryImages.images]
  );

  useEffect(() => {
    const scrollers = document.querySelectorAll(".scroller");
    if (!window.matchMedia("(prefers-reduced-motion:reduce)").matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller, scrollerKey: number) => {
        scroller.setAttribute("data-animated", "true");

        const scrollerInner = scroller.querySelector(".scroller__inner");
        const scrollerContent = Array.from(scrollerInner?.children || []);

        scrollerContent.forEach((item) => {
          const dublicateItem = item.cloneNode(true) as HTMLElement;
          // Customize based on the keys
          if (scrollerKey % 2 === 0) {
            // Every even scroller
            dublicateItem.classList.add("even-scroller-item");
          } else {
            // Every odd scroller
            dublicateItem.classList.add("odd-scroller-item");
          }
          dublicateItem.addEventListener("click", handleImageClick);
          scrollerInner?.appendChild(dublicateItem);
        });
      });
    }

    function handleImageClick(event: MouseEvent) {
      const target = event.target as HTMLImageElement;
      const clickedImageURL = target.getAttribute("src");
      setSelectedImageURL(clickedImageURL);
    }
  }, [galleryImages]);

  return (
    <div className="relative">
      <section className="grid items-center bg-white dark:bg-black relative">
        <div className="max-w-[50%] h-full bg-white dark:bg-black absolute right-[2%] p-1 z-10 min-500:w-44 min-500:right-10 min-700:w-56 min-900:w-72 min-900:right-16 min-900:p-4 min-1200:w-96 min-1200:p-8 min-1200:right-28 min-1500:right-48 min-1500:w-[28rem]">
          <div className="flex flex-col h-full items-center p-1 gap-4 text-black dark:text-white border-[#7c5b32dc] border-x-4 border-dotted min-900:p-4 min-1200:p-8">
            <p className="text-res-special-galerry-title text-blue-800 dark:text-[#e89c3e]">
              Tour Gallery
            </p>
            <span className="indent-2 text-res-special-galerry-text">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maiores
              sequi beatae maxime iste vel ratione illum omnis.
              <span className="[display:none] min-900:block">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptatum rem libero esse ab voluptate exercitationem culpa
                sapiente, odio nam sed ipsum vel excepturi velit eveniet
                praesentium quia nemo id suscipit?
              </span>
            </span>
          </div>
        </div>

        <div className="scroller">
          <ul className="flex tag-list scroller__inner">
            {memoizedGalleryImages
              .filter((_, index) => index % 2 !== 0)
              .map((item, index) => (
                <li key={index} className="flex gap-8">
                  <div className="w-[23rem] aspect-video min-1200:h-60">
                    <MemoizedScrollGallery
                      items={
                        item.image.url
                          ? item.image.url
                          : filteredImageNotFound?.url
                      }
                      setImageURL={setSelectedImageURL}
                    />
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="scroller">
          <ul className="flex tag-list scroller__inner">
            {memoizedGalleryImages
              .filter((_, index) => index % 2 === 0)
              .map((item, index) => (
                <li key={index} className="flex gap-8">
                  <div className="w-[23rem] aspect-video min-1200:h-60">
                    <MemoizedScrollGallery
                      items={
                        item.image.url
                          ? item.image.url
                          : filteredImageNotFound.url
                      }
                      setImageURL={setSelectedImageURL}
                    />
                  </div>
                </li>
              ))}
          </ul>
        </div>

        {selectedImageURL && (
          <dialog
            open={!!selectedImageURL}
            className="fixed inset-0 w-full h-[100dvh] p-8 bg-[rgba(179,238,255,0.56)] dark:bg-[rgba(20,47,54,0.56)] z-50"
          >
            <div className="flex items-center justify-center w-full h-full bg-[rgba(88,183,209,0.97)] dark:bg-[rgba(62,24,77,0.97)] rounded-lg p-4">
              <img
                loading="lazy"
                decoding="async"
                src={selectedImageURL}
                alt="Full Screen"
                className="w-2/4 rounded-lg"
              />
            </div>
            <svg
              onClick={() => setSelectedImageURL(null)}
              className="absolute top-8 right-8 m-2 cursor-pointer p-2 bg-slate-300 rounded-lg"
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M18 6L6 18"
                stroke="#1B3C82"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M18 18L6 6"
                stroke="#1B3C82"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </dialog>
        )}
      </section>
    </div>
  );
};

export default Gallery;
