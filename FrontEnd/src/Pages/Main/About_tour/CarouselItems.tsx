import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../../../redux/redux";

type Image = {
  _id: string;
  image: {
    public_id: string;
    url: string;
  };
  page: string;
};

type Images = {
  items: { public_id: string; url: string };
  image?: Image[];
};

const CarouselItems: React.FC<Images> = ({ items, image }) => {
  const user = useSelector((state: RootState) => state.user.users);

  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  // Memoize the deletion handler to avoid unnecessary re-renders
  const handleDelete = useCallback(
    (imageToDelete: Image) => {
      console.log("Image to delete:", imageToDelete);
      import("../../../redux/getImages").then(({ deleteImage }) => {
        dispatch(deleteImage(imageToDelete));
      });
    },
    [dispatch] // Dependencies
  );

  // Memoize the user role and pathname check to optimize conditional rendering
  const isAdminPage = useMemo(
    () => user[0]?.role === "admin" && location.pathname.startsWith("/admin"),
    [user, location.pathname]
  );

  return (
    <div className="relative w-full h-full">
      {image && isAdminPage ? (
        <svg
          onClick={() => handleDelete(image[0])}
          className="absolute right-1 top-1 bg-[#faf7f796] dark:bg-[#c298fc96] rounded-md p-1 cursor-pointer z-10"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998"
            stroke="#1B1B1B"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
            stroke="#1B1B1B"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.8499 9.14001L18.1999 19.21C18.0899 20.78 17.9999 22 15.2099 22H8.7899C5.9999 22 5.9099 20.78 5.7999 19.21L5.1499 9.14001"
            stroke="#1B1B1B"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.3296 16.5H13.6596"
            stroke="#1B1B1B"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 12.5H14.5"
            stroke="#1B1B1B"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
      <img src={items?.url} alt="Tour Images" className="w-full h-full" />
    </div>
  );
};

export default React.memo(
  CarouselItems,
  (prevProps, nextProps) =>
    prevProps.items === nextProps.items && prevProps.image === nextProps.image
);
