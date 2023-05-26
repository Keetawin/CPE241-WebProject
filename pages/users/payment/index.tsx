import MenuBar from "@/components/account_menu";
import ProfileCard from "@/components/profile_card";
import TabBar from "@/components/show_ticket";
import React from "react";
import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import axios from "axios";
import { Button } from "@mui/material";
import { useRouter } from "next/router";

export default function PaymentMethod({userPayment}) {
  const router = useRouter()
  // console.log(userPayment)
  return (
    <main>
      <div className="container mx-auto px-10">
        <h1 className=" text-2xl font-bold py-6">Payment</h1>
        <div className="flex">
          <div className="flex flex-col">
            <ProfileCard />
            <div className="my-4">
              <MenuBar />
            </div>
          </div>
          <div className="pl-10 w-full">
            <div className="flex justify-end mb-4">
              <Button onClick={()=>{router.push("/users/payment/add")}} variant="contained" color="primary" style={{ backgroundColor: '#E90064' }}>Add New Payment</Button>
            </div>
            <div className="flex flex-col ">
              {userPayment.length == 0 &&
              <div className="flex flex-col justify-center items-center mt-20">
                <h2 className="text-md">No Payment information</h2>
                <h1 className="font-semibold text-2xl text-[#060047]">Please add new payment</h1>
              </div>
              }
              {userPayment && userPayment.map((payment)=>{
                if(payment.payment_method == "Credit Card"){
                  return (
                      <div className="flex shadow-lg bg-gray-100 p-4 w-full rounded-md mb-4">
                        <img className="mr-10" src="/masterCardIcon.svg" alt="" width={100} height={100} />
                        <div className="flex flex-col">
                          <h4 className="text-sm font-light">Credit/Debit Card</h4>
                          <h2 className="text-3xl font-semibold text-[#060047]">{payment.payment_name}</h2>
                          <h3 className="text-xl">{payment.card_id}</h3>
                          <h3 className="text-sm">expired date: {payment.expired_date.split('T')[0]}</h3>
                        </div>
                      </div>
                  )
                }
                if(payment.payment_method == "Prompt Pay"){
                  return (
                      <div className="flex shadow-lg bg-gray-100 p-4 w-full rounded-md mb-4">
                        <img className="mr-10" src="/promptPayIcon.svg" alt="" width={100} height={100} />
                        <div className="flex flex-col">
                          <h4 className="text-sm font-light">Prompt Pay</h4>
                          <h2 className="text-3xl font-semibold text-[#060047]">{payment.payment_name}</h2>
                          <h3 className="text-xl">{payment.prompt_pay}</h3>
                        </div>
                      </div>
                  )
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  // console.log("test", session)
  const user_id = session?.user?.user_id;
  // console.log(user_id)

  try {
    const response = await axios.get(
      `https://ticketapi.fly.dev/get_user_payment?user_id=${user_id}`
    );
    const userPayment = response.data;

    return {
      props: {
        userPayment,
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        userPayment: null, // or handle error case as desired
      },
    };
  }
};