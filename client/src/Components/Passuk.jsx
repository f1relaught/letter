function Ot ({ title }) {
  if( title !== " ") {
      return <button className="flex p-4 border rounded-xl bg-slate-50">{title}</button>
  } else {
      return <span>&nbsp;&nbsp;</span>
  }
}

export default function Passuk({ passuk }) {

//TODO: make a req for the otyto based on the passuk._id
let otyot = [];

let displayOtyot;

if (passuk) {
  const verse = passuk.passuk.split('');
  displayOtyot = verse.map((ot, id) => {
    return <Ot title={ot} />;
  });
} else {
  displayOtyot = <div>Invalid Passuk</div>;
}

return (
  <div className="flex flex-wrap m-10 p-5 border rounded-xl">
    {displayOtyot}
  </div>
  );
}