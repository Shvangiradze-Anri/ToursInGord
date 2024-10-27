import { FormEvent, useEffect, useState } from "react";
import { axiosAdmin } from "../../../api/axios";
import { QueryObserverResult } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { clearUserProfile, fetchUser } from "../../../redux/getUser";
import { AppDispatch, RootState } from "../../../redux/redux";

type User = {
  _id?: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  image?: string | ArrayBuffer | null;
  birthday: string;
  gender: string;
  role: string;
};

type EditUsersProps = {
  users: User;
  refetch: () => Promise<QueryObserverResult<User[], Error>>;
};

const EditUsers: React.FC<EditUsersProps> = ({ users, refetch }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);

  const userA = useSelector((state: RootState) => state.user.user);
  console.log("useraa", userA);

  const [user, setUser] = useState<User>({ ...users });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setUser({ ...users, password: "", image: "" });
  }, [users]);

  const transformFile = (file: File | undefined) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setUser((prevUser) => ({ ...prevUser, image: reader.result }));
      };
    } else {
      setUser((prevUser) => ({ ...prevUser, image: null }));
    }
  };

  const generateSecretKey = () => {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, (byte) =>
      ("0" + (byte & 0xff).toString(16)).slice(-2)
    ).join("");
  };

  const handleEdit = async (
    e: FormEvent<HTMLFormElement>,
    id: string | undefined
  ) => {
    e.preventDefault();

    try {
      console.log(user);
      const { default: CryptoJS } = await import("crypto-js");

      const editSecretKey = generateSecretKey();
      const encryptedEditData = CryptoJS.AES.encrypt(
        JSON.stringify({
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          password: user.password,
          image: user.image,
          birthday: user.birthday,
          gender: user.gender,
          role: user.role,
        }),
        editSecretKey
      ).toString();

      const res = await axiosAdmin.put(`/users/update/${id}`, {
        encryptedEditData,
        editSecretKey,
      });

      if (res.data.error) {
        import("react-toastify").then(({ toast }) =>
          toast.error(res.data.error)
        );
      } else {
        import("react-toastify").then(({ toast }) =>
          toast.success("Successfully updated")
        );
        dispatch(fetchUser());
        setShowEditDialog(false);
        refetch();
        if (userA?.[0]?.role !== "admin") {
          try {
            const res = await axiosAdmin.post("/logout", {
              withCredentials: true,
            });
            console.log("log out", res);
            dispatch(clearUserProfile());
            localStorage.removeItem("expDate");
            window.location.replace("/ ");
          } catch (error) {
            console.error("Logout error:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error during update:", error);
      import("react-toastify").then(({ toast }) =>
        toast.error("Update failed")
      );
    }
  };

  return (
    <>
      <button
        onClick={() => setShowEditDialog((prev) => !prev)}
        className="bg-sky-300 dark:bg-purple-400 px-2 py-1 rounded-lg text-res-sm"
      >
        Edit
      </button>
      {showEditDialog && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-70">
          <div className="bg-sky-300 dark:bg-purple-400 p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={(e) => handleEdit(e, users._id)}>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="off"
                  value={user.name}
                  onChange={(e) =>
                    setUser((prevUser) => ({
                      ...prevUser,
                      name: e.target.value,
                    }))
                  }
                  className="border px-2 py-2 w-full bg-transparent outline-none focus:border-sky-200 dark:focus:border-purple-200 rounded-lg border-sky-400 dark:border-purple-300"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastname">Lastname</label>
                <input
                  id="lastname"
                  type="text"
                  value={user.lastname}
                  autoComplete="off"
                  onChange={(e) =>
                    setUser((prevUser) => ({
                      ...prevUser,
                      lastname: e.target.value,
                    }))
                  }
                  className="border px-2 py-2 w-full bg-transparent outline-none focus:border-sky-200 dark:focus:border-purple-200 rounded-lg border-sky-400 dark:border-purple-300"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  autoComplete="off"
                  onChange={(e) =>
                    setUser((prevUser) => ({
                      ...prevUser,
                      email: e.target.value,
                    }))
                  }
                  className="border px-2 py-2 w-full bg-transparent outline-none focus:border-sky-200 dark:focus:border-purple-200 rounded-lg border-sky-400 dark:border-purple-300"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={user.password}
                  autoComplete="off"
                  onChange={(e) =>
                    setUser((prevUser) => ({
                      ...prevUser,
                      password: e.target.value,
                    }))
                  }
                  placeholder="New password"
                  className="border px-2 py-2 w-full bg-transparent outline-none focus:border-sky-200 dark:focus:border-purple-200 rounded-lg border-sky-400 dark:border-purple-300"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="birthday">Birthday</label>
                <input
                  id="birthday"
                  type="text"
                  value={user.birthday}
                  autoComplete="off"
                  onChange={(e) =>
                    setUser((prevUser) => ({
                      ...prevUser,
                      birthday: e.target.value,
                    }))
                  }
                  className="border px-2 py-2 w-full bg-transparent outline-none focus:border-sky-200 dark:focus:border-purple-200 rounded-lg border-sky-400 dark:border-purple-300"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="gender">Gender</label>
                <input
                  id="gender"
                  type="text"
                  value={user.gender}
                  autoComplete="off"
                  onChange={(e) =>
                    setUser((prevUser) => ({
                      ...prevUser,
                      gender: e.target.value,
                    }))
                  }
                  className="border px-2 py-2 w-full bg-transparent outline-none focus:border-sky-200 dark:focus:border-purple-200 rounded-lg border-sky-400 dark:border-purple-300"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="role">Role</label>
                <input
                  id="role"
                  type="text"
                  value={user.role}
                  autoComplete="off"
                  onChange={(e) =>
                    setUser((prevUser) => ({
                      ...prevUser,
                      role: e.target.value,
                    }))
                  }
                  className="border px-2 py-2 w-full bg-transparent outline-none focus:border-sky-200 dark:focus:border-purple-200 rounded-lg border-sky-400 dark:border-purple-300"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="img"
                  className="inline-block text-center text-black py-1 px-1 bg-sky-400 dark:bg-purple-500 rounded-lg text-res-sm select-none cursor-pointer transition-shadow duration-300 hover:shadow-lg hover:shadow-sky-600 dark:hover:shadow-purple-900"
                >
                  <div className="flex items-center min-600:p-1">
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
                    </svg>{" "}
                    <p className="text-res-sm h-fit">Upload Image</p>
                  </div>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  id="img"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.type.substring(0, 5) === "image") {
                      transformFile(file);
                      e.target.value = "";
                    } else {
                      return null;
                    }
                  }}
                  className="hidden"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditDialog(false)}
                  className="mr-4 px-4 py-2 bg-blue-200 dark:bg-purple-200 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 text-white dark:bg-purple-700 rounded-md"
                >
                  Edit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditUsers;
