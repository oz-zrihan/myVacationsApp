import "./AddAirline.scss";
import { ChangeEvent, useState } from "react";
// Services
import airlinesService from "../../../../Services/AirlinesService";
import notifyService from "../../../../Services/NotifyService";

type AddAirlineProps = {
    onClick: () => void;
  };

function AddAirline({onClick}:AddAirlineProps): JSX.Element {
    
    // Country airline state
    const [airlineName, setAirlineName] = useState<string>('');

    // Handle airline name input change
    function handleInputChange (event: ChangeEvent<HTMLInputElement>):void {
        const airline =event.target.value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        setAirlineName(airline);
      };
          
    // Send  airline server
     async function send():Promise<void> {
        try{        
            await airlinesService.addAirline(airlineName);
            notifyService.success("success");
            onClick()
        }
        catch(err:any){
            alert(err);
        }
    };
    
    
    return (
        <div className="AddAirline">

            <label>Added Airline Name:</label>
            <div className="airline-name">
                <input type="string" required min={3} max={30} onChange={handleInputChange} />
                <button className="blue-btn send-airline" onClick={send}>Send</button>
            </div>
			
        </div>
    );
}

export default AddAirline;
