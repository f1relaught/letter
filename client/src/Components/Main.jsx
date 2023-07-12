import Passuk from "./Passuk";
import { debounce } from 'lodash';
import { useEffect, useState, useCallback } from "react";
import Axios from "axios";

export default function Main() {
  const [psukim, setPsukim] = useState([]);
  const [ot, setOt] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showCantBuyPopup, setShowCantBuyPopup] = useState(false);

  useEffect(() => {
    Axios.get("https://ytzba.com/api/getPsukim")
      .then((response) => {
        setPsukim(response.data.psukim);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
      });
  }, []);

  // Define debounced version of the API call
const debouncedSearch = useCallback(debounce((ot) => {
  Axios.get(`https://ytzba.com/api/searchOtyot?ot=${ot}`)
    .then((response) => {
      setOt(response.data);
      console.log(response.data)
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}, 300), []);

  useEffect(() => {
    if (searchInput) {
      debouncedSearch(searchInput);
    } else {
      setOt([]);
    }
  }, [searchInput, debouncedSearch]);
  
  useEffect(() => {
    if (ot.length > 0) {
      const status = ot[0].status;
      console.log(ot);
      if (status) {
        setShowPopup(true);
      } else {
        setShowCantBuyPopup(true);
      }
    }
  }, [ot]);

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
    <>
      <div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="הכנס אותיות פנויות"
        />
        {/* <button onClick={handleChange}>חפש</button> */}
        {ot
  .filter(otItem => !psukim.some(psukimItem => psukimItem.passuk.passuk === otItem.passuk.passuk))
  .slice(0, 5)
  .map((otItem) => {
    return (
      <div className="px-5 bg-sky-200 border rounded-sm" key={otItem._id}>
        <div>OT: {otItem.ot}</div>
        <div>Passuk: {otItem.passuk.passuk}</div>
      </div>
    );
  })}
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
    </>
  );
}
