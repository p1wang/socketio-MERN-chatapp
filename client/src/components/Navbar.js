import { Fragment, useContext } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  ChevronDoubleLeftIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Context } from "../App";

import defaultAvatar from "../assets/images/default-avatar.jpeg";
import { Link, useMatch } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const { user, setShowMenu } = useContext(Context);
  const match = useMatch("/chatroom/*");

  const navigation = [
    {
      name: "Chats",
      href: `/chatroom`,
      show: !user ? false : true,
    },
    {
      name: "Sign In",
      href: "/auth",
      show: user ? false : true,
    },
  ];

  const handleLogOut = () => {
    localStorage.clear();
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-end">
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4 ">
                    {navigation.map(
                      (item) =>
                        item.show && (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="hover:bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                          >
                            {item.name}
                          </Link>
                        )
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                {user && (
                  <Menu as="div" className="ml-3 relative">
                    <div
                      className={
                        match
                          ? "flex items-center justify-between w-20"
                          : "flex items-center justify-end w-20"
                      }
                    >
                      <Menu.Button className="bg-gray-800 flex rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <img
                          className="h-8 w-8 rounded-full cursor-pointer object-cover"
                          src={
                            user.result.avatar
                              ? user.result.avatar
                              : defaultAvatar
                          }
                          alt=""
                        />
                      </Menu.Button>

                      {match && (
                        <button
                          className="focus:ring-2 focus:ring-white sm:hidden rounded-md"
                          onClick={() => {
                            setShowMenu(true);
                          }}
                        >
                          <ChevronDoubleLeftIcon className="block h-6 w-6 text-gray-400" />
                        </button>
                      )}
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/"
                              onClick={handleLogOut}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </Link>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map(
                (item) =>
                  item.show && (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="hover:bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                      {item.name}
                    </Disclosure.Button>
                  )
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
