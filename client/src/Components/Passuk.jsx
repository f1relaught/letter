function Ot ({ ot, handleBuyLetter, setShowPopup, setShowCantBuyPopup }) {

  if( ot.ot !== " ") {
    return <button 
            className="flex p-4 border rounded-xl bg-slate-50" 
            onClick={ ot.status ? setShowPopup : setShowCantBuyPopup }>{ot.ot}</button>
  } else {
    return <span>&nbsp;&nbsp;</span>
}}

export default function Passuk({
  passuk,
  handleBuyLetter,
  setShowPopup,
  setShowCantBuyPopup
}) {
  let displayOtyot;
  if (passuk.otyot.length > 0) {
    displayOtyot = passuk.otyot.map((ot, key) => {
      return (
        <Ot
          key={ot._id}
          ot={ot}
          handleBuyLetter={handleBuyLetter}
          setShowPopup={setShowPopup}
          setShowCantBuyPopup={setShowCantBuyPopup}
        />
      );
    });
  } else {
    displayOtyot = <div>אין פסוקים</div>;
  }

  return (
    <div className="flex flex-wrap m-10 p-5 border rounded-xl">
      {displayOtyot}
    </div>
  );
}
