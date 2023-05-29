import { MenuItem, OutlinedInput, Select } from "@mui/material";


export default function PaymentSelect({userPayment, onChange, value, required }: Props) {
  const censorValue = (value: string) => {
    const visibleDigits = 4; // Number of visible digits at the end
    const maskedValue = '*'.repeat(value.length - visibleDigits) + value.slice(-visibleDigits);
    return maskedValue;
  };

  return (
    <Select
      required={required}
      sx={{width: "45ch", backgroundColor: "#ffffff"}}
      value={value}
      onChange={onChange}
      input={<OutlinedInput label="Tag" />}
      renderValue={(selected) => {
        if(userPayment){
          let object = userPayment.find(obj => obj.payment_info_id === selected) 
          if(object){
            let id = object.payment_method == "Credit Card" ? object.card_id : object.payment_method == "Prompt Pay" ? object.prompt_pay : null 
            return `${object.payment_method}: ${censorValue(id.toString())}`
          }
        }
        }
      }
    >
      {userPayment && userPayment.map((payment)=>{
          if(payment.payment_method == "Credit Card"){
            return (
              <MenuItem key={payment.payment_info_id} value={payment.payment_info_id}>
                  <img className="mr-10" src="/masterCardIcon.svg" alt="" width={50} height={50} />
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-[#060047]">{payment.payment_name}</h2>
                    <h3 className="text-xl">{censorValue(payment.card_id.toString())}</h3>
                  </div>
              </MenuItem>
            )
          }
          if(payment.payment_method == "Prompt Pay"){
            return (
              <MenuItem key={payment.payment_info_id} value={payment.payment_info_id}>
                  <img className="mr-10" src="/promptPayIcon.svg" alt="" width={50} height={50} />
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-[#060047]">{payment.payment_name}</h2>
                    <h3 className="text-xl">{censorValue(payment.prompt_pay.toString())}</h3>
                </div>
              </MenuItem>
            )
          }
        }
      )}
    </Select>
  );
}
