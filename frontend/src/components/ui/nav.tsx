import React, { useState } from "react";


const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className={`flex w-full items-center bg-neutral-950 border-b border-gray-500 dark:bg-dark`}>
      <div className="container">
        <div className="relative -mx-4 flex items-center justify-between">
          <div className="w-60 max-w-full px-4">
            <a href="/#" className="block w-full py-5 flex">
              <img
                src="public/logo.svg"
                alt="logo"
                className="dark:hidden"
              />
              <img
                src="public/logo.svg"
                alt="logo"
                className="hidden dark:block"
              />
              <span className="text-gray-700 hover:text-white px-4 text-xl">/</span>
            </a>
            
          </div>
          <div className="flex w-full items-center justify-items-end" >
            <div className="flex items-center w-full justify-end">
              <div>
                <button
                  onClick={() => setOpen(!open)}
                  id="navbarToggler"
                  className={` ${
                    open && "navbarTogglerActive"
                  } absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden`}
                >
                  <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color "></span>
                  <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color "></span>
                  <span className="relative my-[6px] block h-[2px] w-[30px] bg-body-color "></span>
                </button>
                <nav
                  // :className="!navbarOpen && 'hidden' "
                  id="navbarCollapse"
                  className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg text-slate-400  px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:shadow-none lg:dark:bg-transparent ${
                    !open && "hidden"
                  } `}
                >
                  <ul className="block lg:flex">
                    <ListItem NavLink="/#">Home</ListItem>
                    <ListItem NavLink="/#">Payment</ListItem>
                    <ListItem NavLink="/#">About</ListItem>
                    <ListItem NavLink="/#">Blog</ListItem>
                  </ul>
                </nav>
              </div>
              <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
                <a
                  href="/#"
                  className="rounded-md px-7 py-3 text-base font-medium border border-gray-400 text-white  hover:bg-gray-900"
                >
                  Sign In
                </a>
                <a
                  href="/#"
                  className="rounded-md ml-2 px-7 py-3 text-base font-medium border border-gray-400 text-primary bg-white  hover:bg-gray-200"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

const ListItem = ({ children, NavLink }: { children: React.ReactNode, NavLink: string }) => {
  return (
    <>
      <li>
        <a
          href={NavLink}
          className="flex py-2 text-base font-light text-body-color hover:text-dark dark:text-dark-6 text-gray-400 hover:text-white dark:hover:text-white lg:ml-12 lg:inline-flex"
        >
          {children}
        </a>
      </li>
    </>
  );
};
