import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";

const CheckoutPage = () => {
  const router = useRouter();
  const { id, eventName, ticketType } = router.query;
  const [voucherData, setVoucherData] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState(false);
  const [paymentOption, setPaymentOption] = useState("mastercard");
  const [cvv, setCVV] = useState("");
  const [promptPayNumber, setPromptPayNumber] = useState("");
  const { data: session } = useSession();
  const [paymentData, setPaymentData] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedPaymentInfo, setSelectedPaymentInfo] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get(
          `https://ticketapi.fly.dev/get_user_payment?user_id=${session?.user?.user_id}`
        );
        setPaymentData(response.data);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchPaymentData();
  }, [session]);

  const selectedTickets = ticketType ? JSON.parse(ticketType) : [];
  const [refundableChecked, setRefundableChecked] = useState(false);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    let tax = 0;
    let subtotal = 0;
    let sub = 0;
    let grandtotal = 0;
    selectedTickets.forEach((ticket) => {
      totalPrice += ticket.price * ticket.quantity;
      grandtotal += ticket.price * ticket.quantity;
      subtotal += ticket.price * ticket.quantity;
      tax = totalPrice * 0.3;
      sub = (grandtotal * 7) / 100;
    });
    if (refundableChecked) {
      totalPrice = grandtotal * 0;
      grandtotal += sub;
      subtotal += sub;
      grandtotal += tax; // Add 30% to the total price for refundable tickets
    } else {
      totalPrice = grandtotal * 0.3;
      grandtotal += sub;
      subtotal += sub;
    }
    return { totalPrice, subtotal, tax, sub, grandtotal };
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();

    if (paymentOption === "mastercard") {
      if (mastercardNumber && cardname && expirationDate && cvv) {
        alert("Mastercard payment processed successfully.");
      } else {
        alert("Please fill in all required fields for Mastercard payment.");
      }
    }
  };

  const handleVoucherRedeem = () => {
    if (voucherCode) {
      axios
        .get(
          `https://ticketapi.fly.dev/validate_voucher?event_id=${id}&voucher_code=${voucherCode}`
        )
        .then((res) => {
          setVoucherData(res.data);
          setVoucher(true);
        })
        .catch((error) => {
          setVoucherData([]);
          setVoucher(false);
        });
    } else {
      alert("Please enter a voucher code.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;
    return `${month.toString().padStart(2, "0")}/${year
      .toString()
      .padStart(2, "0")}`;
  };

  const mastercardNumber =
    selectedPaymentInfo && selectedPaymentInfo.card_id
      ? selectedPaymentInfo.card_id
          .replace(/\s/g, "")
          .replace(/(\d{4})/g, "$1 ")
      : "";
  const cardname = selectedPaymentInfo ? selectedPaymentInfo.payment_name : "";
  const expirationDate = selectedPaymentInfo
    ? formatDate(selectedPaymentInfo.expired_date)
    : "";

  const formattedMastercardNumber = mastercardNumber
    .replace(/(\d{4})/g, "$1 ")
    .trim();

  const formattedExpirationDate = expirationDate
    .replace(/[^0-9]/g, "")
    .slice(0, 4)
    .replace(/(\d{2})(\d{2})/, "$1/$2");

  return (
    <div className="mt-10 mx-16 text-left">
      <h2 className="text-2xl font-bold py-4">Ticket</h2>
      <div className="border-2 border-gray-200 p-4 bg-white shadow rounded">
        <ul>
          {selectedTickets.map((ticket, index) => {
            if (ticket.quantity !== 0) {
              return (
                <li
                  key={index}
                  className="flex justify-between items-center my-2"
                >
                  <span className="font-semibold">{ticket.name}</span>
                  <span className="font-semibold">{ticket.price}</span>
                  <span className="text-red-600 text-sm mb-1 font-semibold">
                    x {ticket.quantity}
                  </span>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold py-4">Choose Refundable Tickets</h2>
        <input
          type="checkbox"
          id="refundableCheckbox"
          checked={refundableChecked}
          onChange={() => setRefundableChecked(!refundableChecked)}
          className="mr-2"
        />
        <label
          htmlFor="refundableCheckbox"
          className="text-xl font-semibold py-4"
        >
          Refundable Tickets
        </label>
        <span className="text-xl font-semibold py-4">
          {calculateTotalPrice().tax}
        </span>
        <p className="mt-2">
          Lorem ipsum dolor sit amet consectetur. Libero malesuada elit in arcu
          placerat. Elementum suspendisse pellentesque sed sit id vitae
          consequat. Quis turpis
        </p>
      </div>

      <h2 className="mt-8 text-2xl font-bold py-4">Voucher</h2>
      <div className="border-2 border-gray-200 p-4 bg-white shadow rounded">
        {voucher ? (
          <>
            {voucherData.length > 0 ? (
              <>
                <p>Voucher Details:</p>
                {voucherData.map((voucher) => (
                  <div key={voucher.voucher_id}>
                    <p>Voucher Code: {voucher.voucher_code}</p>
                    <p>Expire Date: {voucher.expire_date}</p>
                    <p>Amount: {voucher.amount}</p>
                    {/* Render other voucher details as needed */}
                  </div>
                ))}
              </>
            ) : (
              <>
                <p>Voucher Code:</p>
                <div className="flex">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="border-2 border-gray-300 bg-white rounded px-2 py-1 mr-2"
                  />
                  <button
                    type="button"
                    onClick={handleVoucherRedeem}
                    className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-semibold py-1 px-4 rounded"
                  >
                    Add
                  </button>
                </div>
                <p>No voucher details available</p>
              </>
            )}
          </>
        ) : (
          <>
            <p>Voucher Code:</p>
            <div className="flex">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="border-2 border-gray-300 bg-white rounded px-2 py-1 mr-2"
                placeholder=" Add voucher"
              />
              <button
                type="button"
                onClick={handleVoucherRedeem}
                className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-semibold py-1 px-4 rounded"
              >
                Add
              </button>
            </div>
          </>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold py-4">Select Payment Method</h2>
        <h2 className="text-red-600 text-xl font-semibold py-4">
          Credit card / Debit Card
        </h2>
        <h1 className="text-xl font-semibold mt-2">Existing Card</h1>
        <select
          value={paymentOption}
          onChange={(e) => {
            const selectedPaymentInfo = paymentData.find(
              (payment) => payment.payment_name === e.target.value
            );
            setSelectedPaymentInfo(selectedPaymentInfo);
          }}
          className="border-2 border-gray-300 bg-white rounded px-2 py-1 mt-2"
        >
          <option value="mastercard">Credit Card / Debit Card</option>
          {paymentData
            .filter((payment) => payment.payment_method === "Credit Card")
            .map((payment) => (
              <option
                key={payment.payment_info_id}
                value={payment.payment_name}
              >
                {payment.card_id}
              </option>
            ))}
        </select>
        <div>
          <div className="mt-4">
            <label className="font-semibold">Card Number</label>
            <div>
              <input
                type="text"
                value={mastercardNumber}
                onChange={(e) =>
                  setSelectedPaymentInfo({
                    ...selectedPaymentInfo,
                    card_id: e.target.value.replace(/\s/g, ""),
                  })
                }
                maxLength={19}
                placeholder="0000 0000 0000 0000"
                className="border-2 border-gray-300 bg-white rounded px-2 py-1"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="font-semibold">Card Name</label>
            <div>
              <input
                type="text"
                value={cardname}
                onChange={(e) =>
                  setSelectedPaymentInfo({
                    ...selectedPaymentInfo,
                    payment_name: e.target.value,
                  })
                }
                placeholder="Card Name"
                className="border-2 border-gray-300 bg-white rounded px-2 py-1"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="font-semibold">Card Expiry Date</label>
            <label className="float-right">CVV</label>
            <div className="flex">
              <input
                type="text"
                value={expirationDate}
                onChange={(e) =>
                  setSelectedPaymentInfo({
                    ...selectedPaymentInfo,
                    expired_date: e.target.value,
                  })
                }
                maxLength={5}
                placeholder="MM/YY"
                className="border-2 border-gray-300 bg-white rounded px-2 py-1 mr-2"
              />
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCVV(e.target.value)}
                maxLength={3}
                className="border-2 border-gray-300 bg-white rounded px-2 py-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold py-4">Review Order Summary</h2>
        <div className="mt-6">
          <div className="border-2 border-gray-200 p-4 bg-white shadow rounded">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Item</span>
              <span className="font-semibold">Price</span>
              <span className="font-semibold">Fee (Incl. VAT)</span>
              <span className="font-semibold">Quantity</span>
              <span className="font-semibold">Subtotal</span>
            </div>
            <hr className="border-gray-400 my-4" />
            <ul>
              {selectedTickets.map((ticket, index) => {
                if (ticket.quantity !== 0) {
                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center mb-2"
                    >
                      <span className="font-semibold">{ticket.name}</span>
                      <span className="font-semibold">{ticket.price}</span>
                      <span className="font-semibold">
                        {(ticket.price * 7) / 100}
                      </span>
                      <span className="font-semibold">{ticket.quantity}</span>
                      <span className="font-semibold">
                        {ticket.price * 1.07 * ticket.quantity}
                      </span>
                    </li>
                  );
                }
                return null;
              })}
            </ul>
            <hr className="border-gray-400 mt-4 mb-4" />
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="font-semibold">
                {calculateTotalPrice().subtotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Refundable Tickets</span>
              <span className="font-semibold">
                {calculateTotalPrice().tax - calculateTotalPrice().totalPrice}
              </span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-2xl font-semibold">Grand Total</span>
              <span className="text-red-600 text-xl font-semibold">
                {calculateTotalPrice().grandtotal}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handlePaymentSubmit}
        className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-bold py-1 px-6 rounded-full mt-8"
      >
        Confirm
      </button>
    </div>
  );
};

export default CheckoutPage;
