import "./AddCountry.scss";
import { ChangeEvent, useState } from "react";
// Services
import countriesService from "../../../../Services/CountriesService";
import notifyService from "../../../../Services/NotifyService";

type AddCountryProps = {
    onClick: () => void;
  };

function AddCountry({onClick}:AddCountryProps): JSX.Element {
    
    // Country name state
    const [countryName, setCountryName] = useState<string>('');

    // Handle country name input change
    function handleInputChange (event: ChangeEvent<HTMLInputElement>):void {
        const name = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
        setCountryName(name);
      };
          
    // Send country to server
     async function send():Promise<void> {
        try{        
            await countriesService.addCountry(countryName);
            notifyService.success("success");
            onClick()
        }
        catch(err:any){
            alert(err);
        }
    };
    
    
    return (
        <div className="AddCountry">

            <label>Added Country Name:</label>
            <div className="country-name">
                <input type="string" required min={3} max={30} onChange={handleInputChange} />
                <button className="blue-btn send-country" onClick={send}>Send</button>
            </div>
			
        </div>
    );
}

export default AddCountry;
