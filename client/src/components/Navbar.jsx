"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingIndicator from "../components/LoadingIndicater"; // Adjust the import path as necessary
import Cookies from "js-cookie";

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(null);
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    const authCookie = Cookies.get("jwt-token");
    setIsAuth(!!authCookie);
  }, [pathname]);

  const handleLogout = () => {
    Cookies.remove("jwt-token");
    Cookies.remove("email");
    setIsAuth(false);
    router.refresh();
  };

  return (
    <>
      {isAuth === null && <LoadingIndicator />}
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <Link
            href="/"
            className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="ml-3 text-xl">Course Portal</span>
          </Link>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            {isAuth ? (
              <>
                <Link href="/user/profile" className="mr-5 hover:text-gray-900">
                  Profile
                </Link>
                <Link
                  href="/user/dashboard"
                  className="mr-5 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/user/update-profile"
                  className="mr-5 hover:text-gray-900"
                >
                  Update Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/account/login"
                  className="mr-5 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/account/register"
                  className="mr-5 hover:text-gray-900"
                >
                  Register
                </Link>
              </>
            )}
            {/* <Link href="/user/product" className="mr-5 hover:text-gray-900">Products</Link>
            <Link href="/user/blog" className="mr-5 hover:text-gray-900">Blogs</Link> */}
          </nav>
          {isAuth && (
            <button
              onClick={handleLogout}
              className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-hidden hover:bg-gray-200 rounded-sm text-base mt-4 md:mt-0"
            >
              Logout
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-4 h-4 ml-1"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          )}
        </div>
      </header>
    </>
  );
};

export default Navbar;
