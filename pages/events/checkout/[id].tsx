import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
<<<<<<< HEAD
import axios from "axios";
import { v4 } from "uuid";
=======
import axios from 'axios';
>>>>>>> 7dc9b5c1108ea17735490ce11dab14f7a3c7e0e6

const CheckoutPage = () => {
  const router = useRouter();
  const { id, eventName, ticketType } = router.query;
  const [voucherData, setVoucherData] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucher, setVoucher] = useState(false);
  const [paymentOption, setPaymentOption] = useState('mastercard');
  const [cvv, setCVV] = useState('');
  const [promptPayNumber, setPromptPayNumber] = useState('');
  const { data: session } = useSession();
  const [paymentData, setPaymentData] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedPaymentInfo, setSelectedPaymentInfo] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get(
          `https://ticketapi.fly.dev/get_user_payment?user_id=${id}`
        );
=======
        const response = await axios.get(`https://ticketapi.fly.dev/get_user_payment?user_id=${session?.user?.user_id}`);
>>>>>>> 7dc9b5c1108ea17735490ce11dab14f7a3c7e0e6
        setPaymentData(response.data);
      } catch (error) {
        console.error('Error fetching payment data:', error);
      }
    };
  
    fetchPaymentData();
  }, [session]);

  const selectedTickets = ticketType ? JSON.parse(ticketType) : [];
  const [refundableChecked, setRefundableChecked] = useState(false);
  const uuid = v4();

  // Remove hyphens and convert to decimal number
  const numericUUID = parseInt(uuid.replace(/-/g, ""), 16);

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
      sub = grandtotal * 7/100;
    });
    if (refundableChecked) {
        totalPrice = grandtotal * 0;
        grandtotal += sub;
        subtotal += sub;
        grandtotal += tax; // Add 30% to the total price for refundable tickets
    }
    else {
        totalPrice = grandtotal * 0.3;
        grandtotal += sub;
        subtotal += sub;
    }
    return { totalPrice, subtotal, tax, sub, grandtotal };
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
  
    if (paymentOption === 'mastercard') {
      if (mastercardNumber && cardname && expirationDate && cvv) {
<<<<<<< HEAD
        // Create an array of ticket objects
        const ticketsData = selectedTickets.map((ticket, index) => {
          if (ticket.quantity !== 0) {
            return {
              name: ticket.name,
              price: ticket.price,
              vat: (ticket.price * 7) / 100,
              total: ticket.price * 1.07 * ticket.quantity,
            };
          }
          return null;
        });

        // Calculate the total amount
        const amount = ticketsData.reduce(
          (total, ticket) => total + ticket.total,
          0
        );

        // Create the request data object
        const requestData = {
          payment_info_id: selectedPaymentInfo?.payment_info_id, // Replace with the actual payment info ID
          amount: amount,
          booking_id: 1, // Replace with the actual booking ID
        };

        // Send the requestData object to the backend API
        axios
          .post("https://ticketapi.fly.dev/confirm_payment", requestData)
          .then((response) => {
            // Handle the response from the API
            console.log(response.data);
            alert("Mastercard payment processed successfully.");
          })
          .catch((error) => {
            // Handle errors
            console.error("Error processing payment:", error);
          });
=======
        alert('Mastercard payment processed successfully.');
>>>>>>> 7dc9b5c1108ea17735490ce11dab14f7a3c7e0e6
      } else {
        alert('Please fill in all required fields for Mastercard payment.');
      }
    } 
  };  

  const handleVoucherRedeem = () => {
    if (voucherCode) {
      axios
        .get(`https://ticketapi.fly.dev/validate_voucher?event_id=${id}&voucher_code=${voucherCode}`)
        .then((res) => {
          setVoucherData(res.data);
          setVoucher(true);
        })
        .catch((error) => {
          setVoucherData([]);
          setVoucher(false);
        });
    } else {
      alert('Please enter a voucher code.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;
    return `${month.toString().padStart(2, '0')}/${year.toString().padStart(2, '0')}`;
  };

  const mastercardNumber = selectedPaymentInfo && selectedPaymentInfo.card_id ? selectedPaymentInfo.card_id.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ') : '';
  const cardname = selectedPaymentInfo ? selectedPaymentInfo.payment_name : '';
  const expirationDate = selectedPaymentInfo ? formatDate(selectedPaymentInfo.expired_date) : '';

  const formattedMastercardNumber = mastercardNumber
  .replace(/(\d{4})/g, '$1 ')
  .trim();

  const formattedExpirationDate = expirationDate.replace(/[^0-9]/g, '').slice(0, 4).replace(/(\d{2})(\d{2})/, '$1/$2');

  return (
<<<<<<< HEAD
    <div className="container mx-auto px-10">
      <h2 className="text-2xl font-bold py-4">Ticket</h2>
      <div className="border-2 border-gray-200 p-4 bg-white shadow rounded-lg">
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

      <div className="mt-2">
        <h2 className="text-2xl font-bold py-4">Choose Refundable Tickets</h2>
        <label className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox"
            checked={refundableChecked}
            onChange={() => setRefundableChecked(!refundableChecked)}
          />
          <span className="text-xl font-semibold ml-2">Refundable Tickets</span>
        </label>
        <span className="text-xl font-semibold ml-8">
          {calculateTotalPrice().tax}
        </span>
        <p className="mt-2 ml-8 mr-52">
          Lorem ipsum dolor sit amet consectetur. Libero malesuada elit in arcu
          placerat. Elementum suspendisse pellentesque sed sit id vitae
          consequat. Quis turpis
        </p>
      </div>

      <h2 className="text-2xl font-bold py-4">Voucher</h2>
      <div className="border-2 border-gray-200 p-4 bg-white shadow rounded-lg">
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
                <p className="mt-2 ml-4">Voucher Code:</p>
                <div className="flex items-center mb-2">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="border-2 border-gray-300 bg-white py-2 px-4 mt-2 ml-4 rounded-md"
                    placeholder="Add voucher"
                  />
                  <button
                    type="button"
                    onClick={handleVoucherRedeem}
                    className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-small py-0.5 px-5 ml-4 rounded-full"
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
            <p className="mt-2 ml-4">Voucher Code:</p>
            <div className="flex items-center mb-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                className="border-2 border-gray-300 bg-white py-2 px-4 mt-2 ml-4 rounded-md"
                placeholder="Add voucher"
              />
              <button
                type="button"
                onClick={handleVoucherRedeem}
                className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-small py-0.5 px-5 ml-4 rounded-full"
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
        <h1 className="ml-4 mt-2">Existing Card</h1>
        <select
          value={paymentOption}
          onChange={(e) => {
            const selectedPaymentInfo = paymentData.find(
              (payment) => payment.payment_name === e.target.value
            );
            setSelectedPaymentInfo(selectedPaymentInfo);
          }}
          className="border-2 border-gray-300 bg-white py-2 px-4 mt-2 ml-4 rounded-md w-60"
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
          <div className="mt-4 ml-4">
            <label>Card Number</label>
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
                className="border-2 border-gray-300 bg-white py-2 px-4 mt-2 rounded-md w-60"
              />
            </div>
          </div>
          <div className="mt-4 ml-4">
            <label>Card Name</label>
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
                className="border-2 border-gray-300 bg-white py-2 px-4 mt-2 rounded-md w-60"
              />
            </div>
          </div>
          <div className="mt-4 ml-4">
            <label>Expire Date</label>

            <div>
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
                className="border-2 border-gray-300 bg-white py-2 px-4 mt-2 rounded-md w-36"
              />

              <div className="flex flex-col mt-2">
                <label>CVV</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCVV(e.target.value)}
                  maxLength={3}
                  className="border-2 border-gray-300 bg-white py-2 px-4 mt-2 rounded-md w-20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold py-4">Review Order Summary</h2>
        <div className="mt-2">
          <div className="border-2 border-gray-200 p-4 bg-white shadow rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Item</span>
              <span className="font-semibold">Price</span>
              <span className="font-semibold">Fee (Incl. VAT)</span>
              <span className="font-semibold">Quantity</span>
              <span className="font-semibold">Subtotal</span>
            </div>
            <hr className="my-2" />
            <ul className="mt-2">
              {selectedTickets.map((ticket, index) => {
                if (ticket.quantity !== 0) {
                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center my-2"
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
=======
    <div style={{ marginTop: '100px', marginLeft: '250px', marginRight: '250px', textAlign: 'left' }}>
        <h2 className="text-2xl font-bold py-4">Ticket</h2>
        <div style={{ border: '1px solid white', padding: '10px', backgroundColor: 'white', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.8)', borderRadius: '5.5px' }}>
            <ul>
                {selectedTickets.map((ticket, index) => {
                if (ticket.quantity !== 0) {
                    return (
                    <li key={index} style={{marginTop: '10px' ,marginLeft: '50px',marginBottom: '10px' ,paddingRight: '50px' }}>
                        <span style={{}} className='font-semibold'>{ticket.name}</span>
                        <span style={{ position: 'absolute', right: '500px' }} className='font-semibold'>{ticket.price}</span>
                        <span style={{ position: 'absolute', right: '320px' }} className="text-red-600 text-sm mb-1 font-semibold">x {ticket.quantity}</span>
>>>>>>> 7dc9b5c1108ea17735490ce11dab14f7a3c7e0e6
                    </li>
                    );
                }
                return null;
                })}
            </ul>
<<<<<<< HEAD
            <hr className="my-2" />
            <div className="flex justify-end">
              <span className="font-semibold">Subtotal</span>
              <span className="font-semibold ml-2">
                {calculateTotalPrice().subtotal}
              </span>
            </div>
            <div className="flex justify-end">
              <span className="font-semibold">Refundable Tickets</span>
              <span className="font-semibold ml-2">
                {calculateTotalPrice().tax - calculateTotalPrice().totalPrice}
              </span>
            </div>
            <div className="flex justify-end">
              <span className="text-2xl font-semibold">Grand Total</span>
              <span className="text-red-600 text-xl font-semibold ml-2">
                {calculateTotalPrice().grandtotal}
              </span>
=======
        </div>

        <div style={{ marginTop: '50px' }}>
            <h2 className="text-2xl font-bold py-4">Choose Refundable Tickets</h2>
            <input
            type="checkbox"
            id="refundableCheckbox"
            checked={refundableChecked}
            onChange={() => setRefundableChecked(!refundableChecked)}
            />
            <label htmlFor="refundableCheckbox" style={{ marginLeft: '10px' }} className='text-xl font-semibold py-4'>
            Refundable Tickets
            </label>
            <span style={{ position: 'absolute', right: '320px' }} className='text-xl font-semibold py-4'>{calculateTotalPrice().tax}</span>
            <p style={{ marginTop: '10px', marginLeft: '22px', marginRight: '500px' }}>
                Lorem ipsum dolor sit amet consectetur. Libero malesuada elit in arcu placerat. 
                Elementum suspendisse pellentesque sed sit id vitae consequat. Quis turpis 
            </p>
        </div>

        <h2 style={{ marginTop: '50px' }} className="text-2xl font-bold py-4">Voucher</h2>
        <div style={{ border: '1px solid white', padding: '10px', backgroundColor: 'white', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.8)', borderRadius: '5.5px' }}>
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
                        <p style={{ marginTop: '10px', marginLeft: '20px' }} >Voucher Code:</p>
                        <div style={{ marginBottom: '10px' }}>
                            <input type="text" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} 
                            style={{ border: '2px solid gray', backgroundColor: 'white', marginTop: '10px', marginLeft: '20px', borderRadius: '5px' }}
                            />
                            <button
                            type="button"
                            onClick={handleVoucherRedeem}
                            className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-small py-0.5 px-5 rounded-full"
                            style={{ marginLeft: '15px' }}
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
                    <p style={{ marginTop: '10px', marginLeft: '20px' }} >Voucher Code:</p>
                    <div style={{ marginBottom: '10px' }}>
                            <input type="text" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} 
                            style={{ border: '2px solid gray', backgroundColor: 'white', marginTop: '10px', marginLeft: '20px', borderRadius: '5px' }}
                            placeholder=" Add voucher"
                            />
                            <button
                            type="button"
                            onClick={handleVoucherRedeem}
                            className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-small py-0.5 px-5 rounded-full"
                            style={{ marginLeft: '15px' }}
                            >
                            Add
                            </button>
                    </div>
                </>
                )}
        </div>

        <div style={{ marginTop: '50px' }} >
            <h2 className="text-2xl font-bold py-4">Select Payment Method</h2>
            <h2 style={{ marginLeft: '50px' }} className="text-red-600 text-xl font-semibold py-4">Credit card / Debit Card</h2>
            <h1 style={{ marginLeft: '50px',marginTop: '10px' }}>Existing Card</h1>
            <select
                value={paymentOption}
                onChange={(e) => {
                    const selectedPaymentInfo = paymentData.find((payment) => payment.payment_name === e.target.value);
                    setSelectedPaymentInfo(selectedPaymentInfo);
                  }}
                  
                style={{
                    border: '2px solid gray',
                    backgroundColor: 'white',
                    marginTop: '2px',
                    marginLeft: '50px',
                    borderRadius: '5px',
                    width: '240px',
                }}
                >
                <option value="mastercard">Credit Card / Debit Card</option>
                {paymentData
                    .filter((payment) => payment.payment_method === 'Credit Card')
                    .map((payment) => (
                    <option key={payment.payment_info_id} value={payment.payment_name}>
                        {payment.card_id}
                    </option>
                    ))}
            </select>
            <div>
                <div style={{ marginTop: '15px', marginLeft: '50px' }}>
                    <label>Card Number</label>
                    <div>
                    <input
                        type="text"
                        value={mastercardNumber}
                        onChange={(e) =>
                            setSelectedPaymentInfo({
                            ...selectedPaymentInfo,
                            card_id: e.target.value.replace(/\s/g, ''),
                            })
                        }
                        maxLength={19}
                        placeholder="0000 0000 0000 0000"
                        style={{ border: '2px solid gray', backgroundColor: 'white', marginTop: '2px', borderRadius: '5px', width: '240px' }}
                    />
                    </div>
                    
                </div>
                <div style={{ marginTop: '15px', marginLeft: '50px' }}>
                    <label>Card Name</label>
                    <div>
                    <input
                        type="text"
                        value={cardname}
                        onChange={(e) => setSelectedPaymentInfo({ ...selectedPaymentInfo, payment_name: e.target.value })}

                        placeholder="Card Name"
                        style={{ border: '2px solid gray', backgroundColor: 'white', marginTop: '2px', borderRadius: '5px', width: '240px' }}
                    />
                    </div>
                    
                </div>
                <div style={{ marginTop: '15px', marginLeft: '50px' }}>
                    <label>Card Expiry Date</label>
                    <label style={{ position: 'absolute', right: '990px' }}>CVV</label>
                    <div>
                        <input
                            type="text"
                            value={expirationDate}
                            onChange={(e) => setSelectedPaymentInfo({ ...selectedPaymentInfo, expired_date: e.target.value })}
                            maxLength={5}
                            placeholder="MM/YY"
                            style={{ border: '2px solid gray', backgroundColor: 'white', marginTop: '2px', borderRadius: '5px', width: '170px' }}
                        />
                        <input type="text" value={cvv} onChange={(e) => setCVV(e.target.value)} maxLength={3} 
                        style={{ border: '2px solid gray', backgroundColor: 'white', marginTop: '2px', marginLeft: '20px', borderRadius: '5px', width: '50px' }}
                        />
                    </div>
                </div>    
>>>>>>> 7dc9b5c1108ea17735490ce11dab14f7a3c7e0e6
            </div>
        </div>
        <div style={{ marginTop: '50px' }}>
            <h2 className="text-2xl font-bold py-4">Review Order Summary</h2>
            <div style={{ marginTop: '180px' }} >
                
                <div style={{ border: '1px solid white', padding: '10px', backgroundColor: 'white', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.8)', borderRadius: '2px',marginLeft: '0px',marginRight: '0px',marginTop: '-150px' }}>
                    <div>
                        <span style={{marginLeft: '190px'}} className='font-semibold'>Item</span>
                        <span style={{marginLeft: '250px'}} className='font-semibold'>Price</span>
                        <span style={{marginLeft: '70px'}} className='font-semibold'>Fee (Incl. VAT)</span>
                        <span style={{marginLeft: '70px'}} className='font-semibold'>Quantity</span>
                        <span style={{marginLeft: '70px'}} className='font-semibold'>Subtotal</span>
                    </div>
                    <hr  style={{
                        color: '#000000',
                        backgroundColor: '#000000',
                        marginTop: '10px',
                        height: 1,
                        borderColor : '#000000'
                    }}/>
                    <ul style={{ marginTop: '20px' }} >
                        {selectedTickets.map((ticket, index) => {
                        if (ticket.quantity !== 0) {
                            return (
                            <li key={index} style={{marginTop: '10px' ,marginLeft: '70px',marginBottom: '10px' ,paddingRight: '50px' }}>
                                <span style={{}} className='font-semibold'>{ticket.name}</span>
                                <span style={{ position: 'absolute', right: '740px' }} className='font-semibold'>{ticket.price}</span>
                                <span style={{ position: 'absolute', right: '590px' }} className='font-semibold'>{ticket.price*7/100}</span>
                                <span style={{ position: 'absolute', right: '440px' }} className="font-semibold">{ticket.quantity}</span>
                                <span style={{ position: 'absolute', right: '290px' }} className="font-semibold">{ticket.price*1.07*ticket.quantity}</span>
                            </li>
                            );
                        }
                        return null;
                        })}
                    </ul>
                    <hr  style={{
                        color: '#000000',
                        backgroundColor: '#000000',
                        marginTop: '20px',
                        marginBottom: '20px',
                        height: 1,
                        borderColor : '#000000'
                    }}/>
                    <div>
                        <span style={{marginLeft: '780px'}} className='font-semibold'>Subtotal</span>
                        <span style={{ position: 'absolute', right: '290px' }} className="font-semibold">{calculateTotalPrice().subtotal}</span>
                    </div>
                    <div>
                        <span style={{marginLeft: '695px'}} className='font-semibold'>Refundable Tickets</span>
                        <span style={{ position: 'absolute', right: '290px' }} className="font-semibold">{calculateTotalPrice().tax - calculateTotalPrice().totalPrice}</span>

                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <span style={{marginLeft: '705px'}} className='text-2xl font-semibold'>Grand Total</span>
                        <span style={{ marginTop: '5px', position: 'absolute', right: '290px' }} className="text-red-600 text-xl font-semibold">{calculateTotalPrice().grandtotal}</span>

<<<<<<< HEAD
      <button
        onClick={handlePaymentSubmit}
        className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-bold py-1 px-6 rounded-full mt-6 mb-4 ml-auto"
      >
        Confirm
      </button>
=======
                    </div>
                  
                </div>
            </div>
        </div>
        
        <button
            onClick={handlePaymentSubmit}
            className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-bold py-1 px-6 rounded-full"
            style={{ marginTop: '30px', marginLeft: '900px', marginBottom: '30px'}}
        >
            Confirm
        </button>
>>>>>>> 7dc9b5c1108ea17735490ce11dab14f7a3c7e0e6
    </div>
  );
};

export default CheckoutPage;