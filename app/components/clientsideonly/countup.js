import { useEffect, useState } from "react";

// client-side only compoent -  dynamic Javascript count-up of numbers
export default  function Countup(props) {
  const [count, setCount] = useState(0);
  const [value, setValue] = useState("");
  const speed = 1000 / props.end;
  
  useEffect(() => {
    if (count < props.end && count < 1000) {
      const timeout = setTimeout(() => {
        setCount((prevCount) => prevCount + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setValue(props.end.toString());
    }
  }, [count, props.end, speed]);
  
  return <> <span className={props.className}>{value || count }</span> </>;
}