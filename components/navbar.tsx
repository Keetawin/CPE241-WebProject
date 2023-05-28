import { Fragment, useState } from "react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import { Link } from "@nextui-org/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import SearchIcon from '@mui/icons-material/Search';
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { IconButton, InputBase, Paper } from "@mui/material";

const products = [
  {
    name: "Analytics",
    description: "Get a better understanding of your traffic",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "Speak directly to your customers",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "Your customers’ data will be safe and secure",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "Connect with third-party tools",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "Build strategic funnels that will convert",
    href: "#",
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("")
  const { data: session, status } = useSession();
  const router = useRouter();
  // console.log(session)

  const handleSignOut = async () => {
    await router.push("/");
    signOut();
  };

  return (
    <header className="bg-[#060047]">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <img className="h-10 w-auto" src="/brand.svg" alt="" />
          </Link>
        </div>
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            value={search}
            placeholder="Event search"
            inputProps={{ 'aria-label': 'Search for Event' }}
            onKeyDown={(e)=>{
              if (e.key === 'Enter') {
                e.preventDefault()
                const queryParam = encodeURIComponent(search);
                if(queryParam.length !==0){
                  router.push(`/events?name=${queryParam}`);
                }else{
                  router.push(`/events?name=${null}`);
                }
              }
            }}
            onChange={(e)=>{setSearch(e.target.value)}}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={(e)=>{
              const queryParam = encodeURIComponent(search);
              if(queryParam.length !==0){
                router.push(`/events?name=${queryParam}`);
              }else{
                router.push(`/events?name=${null}`);
              }
            }

          }>
            <SearchIcon />
          </IconButton>
        </Paper>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="flex  mr-10 justify-center align-middle mt-2">
            <Link href="/organize" >
              <span className=" font-semibold text-xl text-white">
                Organize
              </span>
            </Link>
          </div>
          {!session && (
            <Link
              href="#"
              className="text-sm font-semibold leading-6 text-white"
              onClick={() => signIn("google")}
            >
              <p className="text-white">Log in with Google</p>
              <span className="text-white" aria-hidden="true">
                &nbsp;&rarr;
              </span>
            </Link>
          )}
          {session?.user?.user_id && (
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button className="bg-gray-800 text-white px-3 py-2 rounded-md flex items-center justify-center">
                    <Image
                      className="rounded-full"
                      src={session?.user?.image}
                      alt={session?.user?.name}
                      width={24}
                      height={24}
                    />
                    &ensp;
                    <div className=" font-medium">{session.user?.name}</div>
                    <ChevronDownIcon
                      className="h-5 w-5 ml-2"
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100 transform"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75 transform"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Popover.Panel static className="popover-dropdown">
                      <div className="py-1">
                        <Link
                          href="/users/ticket"
                          className="popover-dropdown-item min-w-full"
                        >
                          My Tickets
                        </Link>
                        <Link
                          href="/organize"
                          className="popover-dropdown-item min-w-full"
                        >
                          Create Event
                        </Link>
                        <Link
                          href="/users/setting"
                          className="popover-dropdown-item min-w-full"
                        >
                          Account settings
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleSignOut()}
                          className="popover-dropdown-item w-full text-left"
                        >
                          Logout
                        </button>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            // <Link
            //   href="#"
            //   className="text-sm font-semibold leading-6 text-white"
            //   onClick={() => signOut()}
            // >
            //   Log out <span aria-hidden="true">&rarr;</span>
            // </Link>
          )}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src="./logo.svg" alt="" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6"></div>
              <div className="py-6">
                {!session && (
                  <Link
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => signIn("google")}
                  >
                    Log in
                  </Link>
                )}
                {session && (
                  <Link
                    href="#"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => handleSignOut()}
                  >
                    Log out
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
