import MenuBar from "@/components/account_menu";
import ProfileCard from "@/components/profile_card";
import TabBar from "@/components/show_ticket";
import React from "react";

export default function Tickets() {
  return (
    <main>
      <div className="container mx-auto px-10">
        <h1 className=" text-2xl font-bold py-6">My Tickets</h1>
        <div className="flex">
          <div className="flex flex-col">
            <ProfileCard />
            <div className="my-4">
              <MenuBar />
            </div>
          </div>
          <div className="pl-10 w-full">
            <TabBar />
          </div>
        </div>
      </div>
    </main>
  );
}
