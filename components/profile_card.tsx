import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const ProfileCard = () => {
  const { data: session, status } = useSession();
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative flex flex-col items-center rounded-[20px]  mx-auto  bg-clip-border shadow-3xl shadow-shadow-500 ">
        <div className="relative flex h-24 w-full justify-center rounded-xl bg-cover">
          <div className=" flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 ">
            <img
              className="h-full w-full rounded-full"
              src={session?.user?.image}
              alt=""
            />
          </div>
        </div>
        <div className=" flex flex-col items-center">
          <h4 className="text-xl font-bold text-black">
            {session?.user?.name}
          </h4>
          <p className="text-base font-normal text-gray-600">
            {session?.user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
