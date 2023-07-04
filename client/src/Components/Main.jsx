import Passuk from "./Passuk";
import { useEffect, useState } from "react";
import Axios from "axios";

export default function Main() {

    const [psukim, setPsukim] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [showCantBuyPopup, setShowCantBuyPopup] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    
    useEffect(() => {
      Axios.get("http://localhost:3001/getPsukim").then((response) => {
        setPsukim(response.data);
      });
    }, []);
    
    const handleChange = async () => {
        try {
          const response = await Axios.get(`http://localhost:3001/getOtyot?ot=${searchInput}`);
          const otyot = response.data;
        
          if (otyot) {
            const status = otyot[0].status;
            
            if (status) {
              setShowPopup(true);
            } else {
              setShowCantBuyPopup(true);
            }
          } 
        } catch (error) {
          console.error('Error:', error);
          // Handle error
        }
      };
      
      const handleBuyLetter = async () => {
        try {
          // Update the client-side state and display success message
          setSuccessMessage("You have successfully bought the letter.");
          setShowPopup(false);
          setSearchInput("");
        } catch (error) {
          console.error('Error:', error);
          // Handle error
        }
      };

    return (
      <>
        <div>
            <h1>חפש לפי אותיות פנויות</h1>
            <div>
                <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="הכנס אותיות פנויות"
                />
                <button onClick={handleChange}>חפש</button>
            </div>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-4">Buy Letter</h2>
                        <p className="mb-4">Are you sure you want to buy this letter?</p>
                        <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={handleBuyLetter}
                        >
                        Buy
                        </button>
                    </div>
                </div>
            )}
            {showCantBuyPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow">
                        <h2 className="text-2xl font-bold mb-4">Can't Buy Letter</h2>
                        <p className="mb-4">!This letter is not available to be bought</p>
                    </div>
                </div>
            )}
            {successMessage && (
                <div className="success-message text-center">{successMessage}</div>
            )}
            
            {/* Render the Passuk components */}
            {psukim.map((passuk) => {
                return <Passuk key={passuk._id} passuk={passuk} />;
            })}
        </div>
    </>
    );
}