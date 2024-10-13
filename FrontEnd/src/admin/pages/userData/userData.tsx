import { useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FetchUsers from "./fetchUsers";
import { RootState } from "../../../redux/redux";
import { lazy } from "react";

const Helmet = lazy(() =>
  import("react-helmet-async").then((module) => ({ default: module.Helmet }))
);

function UserData() {
  const user = useSelector((state: RootState) => state.user.users);
  const queryClient = new QueryClient();

  const isAdmin =
    user &&
    user.length > 0 &&
    user[0].role === "admin" &&
    location.pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <Helmet>
        <title>User Data</title>
        <meta name="description" content="Users data" />
        <link rel="canonical" href="/UsersData" />
      </Helmet>
      {isAdmin ? (
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
                        Name
                      </th>
                      <th className="text-start px-3 py-2">Last Name</th>
                      <th className="text-start px-3 py-2">Email</th>
                      <th className="text-start px-3 py-2">Birthday</th>
                      <th className="text-start px-3 py-2">Gender</th>
                      <th className="text-start px-3 py-2 rounded-tr-lg">
                        Role
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
