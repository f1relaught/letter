function Ot ({ title }) {
    if( title !== " ") {
        return <button className="flex p-4 border rounded-xl bg-slate-50">{title}</button>
    } else {
        return <span>&nbsp;&nbsp;</span>
    }
}

export default function Passuk({ passuk }) {
    let displayOtyot;
     console.log(passuk)
    if (passuk && typeof passuk.passuk === 'string') {
      const verse = passuk.passuk.split('');
      displayOtyot = verse.map((ot, id) => {
        return <Ot title={ot} key={id} />;
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