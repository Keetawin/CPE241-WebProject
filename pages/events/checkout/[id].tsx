import { useState } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode.react';

const CheckoutPage = () => {
  const router = useRouter();
  const { eventName, ticketType, totalPrice } = router.query;

  // Decode and parse the ticketType string back to an array
  const selectedTickets = ticketType ? JSON.parse(ticketType) : [];

  // Calculate the total price
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    selectedTickets.forEach((ticket) => {
      totalPrice += ticket.price * ticket.quantity;
    });
    return totalPrice;
  };

  // Filter out ticket types with quantity > 0
  const filteredTickets = selectedTickets.filter((ticket) => ticket.quantity > 0);

  // State variables for payment information
  const [paymentOption, setPaymentOption] = useState('mastercard');
  const [mastercardNumber, setMastercardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [promptPayNumber, setPromptPayNumber] = useState('');

  // Handle payment information submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
  
    if (paymentOption === 'mastercard') {
        if (mastercardNumber && expirationDate && cvv) {
          // All required fields for Mastercard payment are filled
          alert('Mastercard payment processed successfully.');
        } else {
          // Not all required fields for Mastercard payment are filled
          alert('Please fill in all required fields for Mastercard payment.');
        }
    } 
    else if (paymentOption === 'promptpay') {
        if (promptPayNumber) {
            const amount = calculateTotalPrice(); // Use the desired amount
            const qrCodeContent = `promptpay:${promptPayNumber}?amount=${amount}`;
            const qrCodeSize = 200; // Adjust the size of the QR code as needed
            const qrCodeImage = <QRCode value={qrCodeContent} size={qrCodeSize} />;
            alert(qrCodeImage);
          } else {
            alert('Please fill in all required fields for PromptPay payment.');
          }
    }

    // Clear the input fields
    setMastercardNumber('');
    setExpirationDate('');
    setCVV('');
    setPromptPayNumber('');
  };

  // Format Mastercard number with pattern "0000 0000 0000 0000"
  const formattedMastercardNumber = mastercardNumber.replace(/(\d{4})/g, '$1 ').trim();

  // Format expiration date with pattern "00/00"
  const formattedExpirationDate = expirationDate
    .replace(/[^0-9]/g, '') // Remove non-numeric characters
    .slice(0, 4) // Limit to 4 characters
    .replace(/(\d{2})(\d{2})/, '$1/$2'); // Insert "/" between month and year

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '1', textAlign: 'left', border: '1px solid pink', padding: '10px', marginRight: '10px' }}>
        <h2>Payment Information</h2>
        <form onSubmit={handlePaymentSubmit}>
          <div>
            <input
              type="radio"
              id="mastercard"
              name="paymentOption"
              value="mastercard"
              checked={paymentOption === 'mastercard'}
              onChange={() => setPaymentOption('mastercard')}
            />
            <label htmlFor="mastercard">Mastercard</label>
          </div>
          {paymentOption === 'mastercard' && (
            <>
              <div>
                <label>Mastercard Number:</label>
                <input
                  type="text"
                  value={formattedMastercardNumber}
                  onChange={(e) => setMastercardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div>
                <label>Expiration Date:</label>
                <input
                  type="text"
                  value={formattedExpirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  maxLength={5}
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label>CVV:</label>
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCVV(e.target.value)}
                  maxLength={3}
                />
              </div>
            </>
          )}
          <div>
            <input
              type="radio"
              id="promptpay"
              name="paymentOption"
              value="promptpay"
              checked={paymentOption === 'promptpay'}
              onChange={() => setPaymentOption('promptpay')}
            />
            <label htmlFor="promptpay">PromptPay</label>
          </div>
          
          {paymentOption === 'promptpay' && (
            <div>
              <label>PromptPay Number:</label>
              <input
                type="text"
                value={promptPayNumber}
                onChange={(e) => setPromptPayNumber(e.target.value)}
                maxLength={13}
              />
            </div>
          )}
          <button type="submit" 
          className="bg-[#E90064] hover:bg-[#c60056e6] text-white font-bold py-2 px-6 rounded-full" 
          >Submit</button>
        </form>
      </div>
      <div style={{ flex: '1', textAlign: 'left', border: '1px solid pink', padding: '10px' }}>
        <h2>Checkout</h2>
        <p>Event Name: {eventName}</p>
        <p>Ticket Type:</p>
        <ul>
          {filteredTickets.map((ticket, index) => (
            <li key={index}>
              {ticket.name} - Quantity: {ticket.quantity}
            </li>
          ))}
        </ul>
        <p>Total Price: {calculateTotalPrice()}</p>
      </div>
    </div>
  );
};

export default CheckoutPage;