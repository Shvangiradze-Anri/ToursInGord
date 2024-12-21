import { axiosAdmin } from "../../../api/axios";
import { lazy, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/redux";
import { fetchUsersAdmin } from "../../../redux/getAdminUsers";

const EditUsers = lazy(() => import("./editUser"));

function FetchAdminUsers() {
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
  const { adminUsers, error } = useSelector(
    (state: RootState) => state.adminUsers
  );

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsersAdmin());
  }, [dispatch]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    const truncatedText = text.substring(0, maxLength).trim();
    return truncatedText + "...";
  };

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const response = await axiosAdmin.delete(`/users/delete/${id}`);

        const { toast } = await import("react-toastify");
        if (response.status === 200) {
          toast.success("User deleted");
          dispatch(fetchUsersAdmin());
        } else {
          toast.error("Server error");
        }
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  if (error) {
    return (
      <tbody>
        <tr>
          <td colSpan={8}>Error fetching users</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {adminUsers && adminUsers.length > 0
        ? adminUsers.map((user: User, index: number) => (
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
                <EditUsers users={user} />
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
        : null}
    </tbody>
  );
}

export default FetchAdminUsers;
