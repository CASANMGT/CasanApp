const Test = () => {
  // const targetDate = new Date("2025-01-18T00:00:00").getTime();

  return (
    <div className="container-screen">
      {/* <CountdownTimer targetDate={targetDate} />; */}

      {false && (
        <div className="flex items-center justify-center min-h-screen bg-black">
          <div className="relative center">
            {/* Outer Pulsing Ring */}
            <div className="absolute w-52 h-52 rounded-full border-4 border-blue-500 opacity-50 animate-pulseRing"></div>

            {/* Rotating Gradient Ring */}
            <div className="absolute w-48 h-48 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 animate-rotateGradient">
              <div className="absolute inset-0 m-4 bg-black rounded-full"></div>
            </div>

            {/* Inner Circle with Percentage */}
            <div className="relative w-40 h-40 flex items-center justify-center bg-red rounded-full">
              <p className="text-4xl font-bold text-white">
                12<span className="text-2xl">%</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {true && (
        <div className="h-screen w-screen overflow-hidden">
          <h1 className="text-center text-3xl">Zoom Disabled</h1>
          <input
            type="text"
            className="p-2 border rounded mt-5"
            placeholder="Try zooming here!"
          />
        </div>
      )}
    </div>
  );
};

export default Test;
