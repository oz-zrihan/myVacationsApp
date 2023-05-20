import "./AddBoard.scss";
import { ChangeEvent, useState } from "react";
// Services
import boardsService from "../../../../Services/BoardsService";
import notifyService from "../../../../Services/NotifyService";

type AddBoardProps = {
    onClick: () => void;
  };

function AddBoard({onClick}:AddBoardProps): JSX.Element {
    
    // Country board state
    const [boardName, setBoardName] = useState<string>('');

    // Handle board name input change
    function handleInputChange (event: ChangeEvent<HTMLInputElement>):void {
        const board =event.target.value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        setBoardName(board);
      };
          
    // Send board server
     async function send():Promise<void> {
        try{        
            await boardsService.addBoard(boardName);
            notifyService.success("success");
            onClick()
        }
        catch(err:any){
            alert(err);
        }
    };
    
    
    return (
        <div className="AddBoard">

            <label>Added Board Option:</label>
            <div className="board-name">
                <input type="string" required min={3} max={30} onChange={handleInputChange} />
                <button className="blue-btn send-board" onClick={send}>Send</button>
            </div>
			
        </div>
    );
}

export default AddBoard;
