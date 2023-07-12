import Passuk from "./Passuk";
import { debounce } from 'lodash';
import { useEffect, useState } from "react";
import Axios from "axios";

export default function Main() {
  const [psukim, setPsukim] = useState([]);
  const [ot, setOt] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [displayResults, setDisplayResults] = useState(false);
  const [showCantBuyPopup, setShowCantBuyPopup] = useState(false);

  useEffect(() => {
    Axios.get("https://ytzba.com/api/getPsukim")
      .then((response) => {
        setPsukim(response.data.psukim);
      })
      .catch((error) => {
        console.error("Error:", error);
        
      });
  }, []);

  const debouncedSearch = debounce(() => {
    Axios.get(`https://ytzba.com/api/searchOtyot?input=${searchInput}`)
      .then((response) => {
        setDisplayResults(true)
        setOt(response.data)
      })
      .catch((error) => {
        console.error("Error:", error);
        return(
          <div>"השם לא קיים עוד"</div>
        )
      });
  }, 300); // Debounce delay of 300ms

  const handleSearch = () => {
    debouncedSearch();
  };

  const handleBuyLetter = async () => {
    try {
      // Update the client-side state and display success message
      setSuccessMessage("You have successfully bought the letter.");
      setShowPopup(false);
      setSearchInput("");
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  return (
    <div className="flex-row items-center">
      <div className="flex items-center text-center">
        <div className="w-1/4 border rounded-xl">
          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="הכנס אותיות פנויות"
          />
          <button onClick={handleSearch}>חפש</button>
          {searchInput && ot.length > 0 && <div className="text-center text-black font-bold">{searchInput}</div>}
          { displayResults &&
            ot.slice(0, 5).map((otItem) => {
              return (
                <div className="px-5 py-2 w-auto bg-sky-200 border rounded-sm" key={otItem._id}>
                  <div>{otItem.passuk.passuk}</div>
                </div>
              );
            })
          }

        </div>
      </div>
      {showPopup && (
        <div className=">fixed inset-0 flex items-center justify-center z-50">
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
      {psukim.map((passuk, key) => {
        return (
        <Passuk 
        key={passuk._id} 
        passuk={passuk}
        handleBuyLetter={handleBuyLetter}
        setShowPopup={setShowPopup}
        setShowCantBuyPopup={setShowCantBuyPopup} />
        );
      })}
   </div>
  );
}
