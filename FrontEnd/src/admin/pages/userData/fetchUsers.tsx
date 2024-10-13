import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import EditUsers from "./editUser";
import Cookies from "js-cookie";
import { axiosAdmin } from "../../../api/axios";
import { useCallback } from "react";

type User = {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  birthday: string;
  gender: string;
  role: string;
};

type FetchUsersResponse = User[];

const fetchUsers = async (): Promise<FetchUsersResponse> => {
  const accessT = Cookies.get("accessT");
  const csrfToken = Cookies.get("csrfT");

  const response = await axiosAdmin.get("/users", {
    headers: {
      "Content-Type": "application/json",
      "CSRF-Token": csrfToken,
      Authorization: `Bearer ${accessT}`,
    },
  });
  console.log(response?.data);

  return response?.data;
};

const queryOptions: UseQueryOptions<FetchUsersResponse, Error> = {
  queryKey: ["users"],
  queryFn: fetchUsers,
};

function FetchUsers() {
  const { data, refetch, isLoading, error } = useQuery(queryOptions);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    const truncatedText = text.substring(0, maxLength).trim();
    return truncatedText + "...";
  };

  const handleDelete = useCallback(
    async (id: string) => {
      const accessT = Cookies.get("accessT");
      const csrfToken = Cookies.get("csrfT");
      try {
        const response = await axiosAdmin.delete(`/users/delete/${id}`, {
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
            Authorization: `Bearer ${accessT}`,
          },
        });

        refetch();
        const { toast } = await import("react-toastify");
        if (response.status === 200) {
          toast.success("User deleted");
        } else {
          toast.error("Server error");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [refetch]
  );

  if (isLoading)
    return (
      <tbody>
        <tr>
          <td colSpan={8}>Loading...</td>
        </tr>
      </tbody>
    );
  if (error)
    return (
      <tbody>
        <tr>
          <td colSpan={8}>Error fetching users</td>
        </tr>
      </tbody>
    );

  return (
    <tbody>
      {data && data.length > 0 ? (
        data.map((user: User, index: number) => (
          <tr key={index}>
            <td className="px-3 py-2 text-res-sm border-opacity-70 border-b-[1px] border-sky-800 dark:border-purple-800">
              {user.name}
            </td>
            <td
              className="px-3 py-2 text-res-sm border-opacity-70 border-b-[1px] border-sky-800 dark:border-purple-800"
              title={user.lastname}
            >
              {user.lastname}
            </td>
            <td
              className="px-3 py-2 text-res-sm border-opacity-70 border-b-[1px] border-sky-800 dark:border-purple-800"
              title={user.email}
            >
              {truncateText(user.email, 20)}
            </td>
            <td className="px-3 py-2 text-res-sm border-opacity-70 border-b-[1px] border-sky-800 dark:border-purple-800">
              {user.birthday}
            </td>
            <td className="px-3 py-2 text-res-sm border-opacity-70 border-b-[1px] border-sky-800 dark:border-purple-800">
              {user.gender}
            </td>
            <td className="px-3 py-2 text-res-sm border-opacity-70 border-b-[1px] border-sky-800 dark:border-purple-800">
              {user.role}
            </td>
            <td className="pl-2">
              <EditUsers users={user} refetch={refetch} />
            </td>
            <td>
              <button
                onClick={() => handleDelete(user._id)}
                className="bg-sky-300 dark:bg-purple-400 px-2 py-1 rounded-lg text-res-sm"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={8}>No users found</td>
        </tr>
      )}
    </tbody>
  );
}

export default FetchUsers;
