import "./AddLuggage.scss";
import { ChangeEvent, useState } from "react";
// Services
import luggageService from "../../../../Services/LuggageService";
import notifyService from "../../../../Services/NotifyService";

type AddLuggageProps = {
    onClick: () => void;
  };

function AddLuggage({onClick}:AddLuggageProps): JSX.Element {
    
    // Country luggage state
    const [luggageName, setLuggageName] = useState<string>('');

    // Handle luggage name input change
    function handleInputChange (event: ChangeEvent<HTMLInputElement>):void {
        const words = event.target.value.split(" ");
        for (let i = 0; i < words.length; i++) {
            if (words[i] !== "and") {
              words[i] = words[i][0].toUpperCase() + words[i].slice(1);
            }
          }
        const luggage = words.join(" ");
        setLuggageName(luggage);
      };
          
    // Send luggage server
     async function send():Promise<void> {
        try{        
            await luggageService.addLuggage(luggageName);
            notifyService.success("success");
            onClick()
        }
        catch(err:any){
            alert(err);
        }
    };
    
    
    return (
        <div className="AddLuggage">

            <label>Added Luggage Option:</label>
            <div className="luggage-name">
                <input type="string" required min={3} max={30} onChange={handleInputChange} />
                <button className="blue-btn send-luggage" onClick={send}>Send</button>
            </div>
			
        </div>
    );
}

export default AddLuggage;
