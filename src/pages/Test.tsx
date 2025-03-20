import React, { useEffect } from "react";

const isNumber = (value: any): boolean => {
  return !isNaN(Number(value));
};

const Test = () => {
  useEffect(() => {
    const check = isNumber('1')
    console.log("cek c", check);
  }, []);

  return <div>Test</div>;
};

export default Test;
