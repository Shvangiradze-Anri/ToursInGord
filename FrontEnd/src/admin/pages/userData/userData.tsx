import { useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FetchUsers from "./fetchUsers";
import { Helmet } from "react-helmet-async";
import { RootState } from "../../../redux/redux";

function UserData() {
  const user = useSelector((state: RootState) => state.user.users);

  const queryClient = new QueryClient({});
  return (
    <QueryClientProvider client={queryClient}>
      <Helmet>
        <title>User Data</title>
        <meta name="description" content="Users data" />
        <link rel="canonical" href="/UsersData" />
      </Helmet>
      {user &&
      user[0].role === "admin" &&
      location.pathname.startsWith("/admin") ? (
        <section className="bg-sky-500 dark:bg-purple-700 min-h-[100dvh] p-4 min-800:p-6">
          <div className="place-items-center">
            <div className="w-full">
              <div className="grid justify-center text-res-base">
                <p className="w-fit h-fit text-res-md p-2 min-600:p-4 bg-sky-400 dark:bg-purple-500 rounded-lg">
                  Users Data
                </p>
              </div>
              <div className="w-full bg-sky-400 dark:bg-purple-500 mt-12 p-2 min-600:p-4 rounded-lg overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-sky-300 dark:bg-purple-400 rounded-lg">
                    <tr className="text-res-md-sm">
                      <th className="text-start px-3 py-2 rounded-tl-lg">
                        name
                      </th>
                      <th className="text-start px-3 py-2">last name</th>
                      <th className="text-start px-3 py-2">email</th>
                      <th className="text-start px-3 py-2">birthday</th>
                      <th className="text-start px-3 py-2">gender</th>
                      <th className="text-start px-3 py-2 rounded-tr-lg">
                        role
                      </th>
                    </tr>
                  </thead>
                  <FetchUsers />
                </table>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </QueryClientProvider>
  );
}

export default UserData;
