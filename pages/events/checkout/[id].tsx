import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import axios from 'axios';

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
        const response = await axios.get(`https://ticketapi.fly.dev/get_user_payment?user_id=${session?.user?.user_id}`);
        setPaymentData(response.data);
      } catch (error) {
        console.error('Error fetching payment data:', error);
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
        alert('Mastercard payment processed successfully.');
      } else {
        alert('Please fill in all required fields for Mastercard payment.');
      }
    } else if (paymentOption === 'promptpay') {
      if (promptPayNumber) {
        const amount = calculateTotalPrice();
        const qrCodeContent = `promptpay:${promptPayNumber}?amount=${amount}`;
        const qrCodeSize = 200;
        const qrCodeImage = <QRCode value={qrCodeContent} size={qrCodeSize} />;
        alert(qrCodeImage);
      } else {
        alert('Please fill in all required fields for PromptPay payment.');
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
                    </li>
                    );
                }
                return null;
                })}
            </ul>
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
    </div>
  );
};

export default CheckoutPage;