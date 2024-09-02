import { useDispatch, useSelector } from "react-redux";
import CarouselItems from "../../../Pages/Main/About_tour/CarouselItems";
import { ThreeDots } from "react-loader-spinner";
import { useCallback, useEffect, useState } from "react";
import { AppDispatch } from "../../../redux/redux";

type Page = {
  page: string;
};

function DisplayedImages({ page }: Page) {
  type Image = {
    id: number;
    image: {
      secure_url: string;
    };
    page: string;
  };

  type ImagesState = {
    loading: boolean;
    images: Image[];
    error: string | null;
  };

  type ImageFile = {
    image: string | ArrayBuffer | null; // Assuming this is the data URL of the image
    page: string; // Assuming this is the page number associated with the image
  };

  const [image, setIMG] = useState<ImageFile>({ image: "", page: page });
  const [loadingUpload, setLoadingUpload] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const { loading, images, error } = useSelector(
    (state: { images: ImagesState }) => state.images
  );

  const transformFile = (file: File | undefined) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setIMG({ ...image, image: reader.result });
      };
    } else {
      setIMG({ image: "", page: page });
    }
  };
  
  const handleSubmit = useCallback(async () => {
    setLoadingUpload(true);
    const { uploadImage } = await import("../../../redux/getImages");
    dispatch(uploadImage({ image, setLoadingUpload }));
  }, [dispatch, image, setLoadingUpload]);
  
  useEffect(() => {
    if (image.image !== "") {
      handleSubmit();
    }
  }, [handleSubmit, image.image]);

  const filteredImages = images.filter((item) => item.page === page);

  return (
    <section className="flex flex-col w-full place-items-center">
      <form className="grid gap-2 p-6 min-400:p-8">
        <label
          htmlFor="img"
          className="inline-block uppercase text-center text-black py-2 px-2 bg-sky-400 dark:bg-purple-500 rounded-lg tracking-wider text-res-sm select-none cursor-pointer transition-shadow duration-300  hover:shadow-lg hover:shadow-sky-600 dark:hover:shadow-purple-900 "
        >
          {!loadingUpload ? (
            <div className="flex items-center  min-600:p-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 15V18H6V15H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15H18ZM7 9L8.41 10.41L11 7.83V16H13V7.83L15.59 10.41L17 9L12 4L7 9Z"
                  fill="black"
                />
              </svg>
              <p className="text-res-sm h-fit">Upload Image</p>
            </div>
          ) : (
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          )}
        </label>

        <input
          type="file"
          accept="image/*"
          id="img"
          required
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.type.substring(0, 5) === "image") {
              transformFile(file);
            } else {
              return null;
            }
          }}
          className="[display:none]"
        />
      </form>
      <div className="grid gap-4 relative grid-cols-1 min-500:grid-cols-2 min-800:grid-cols-3 min-1200:grid-cols-4 min-2000:grid-cols-5 [&>div>img]:h-full [&>div>img]:rounded-lg ">
        {!error &&
          !loading &&
          filteredImages.map((item, index) => (
            <CarouselItems
              key={index}
              image={item}
              items={item.image.secure_url}
            />
          ))}
      </div>
    </section>
  );
}

export default DisplayedImages;
