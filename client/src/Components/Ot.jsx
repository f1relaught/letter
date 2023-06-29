function Ot ({ title }) {
    if( title !== " ") {
        return <button>{title}</button>
    } else {
        return <span>&nbsp;&nbsp;</span>
    }
}