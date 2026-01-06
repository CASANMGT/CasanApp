const NominalInput = () => {
  return (
    <div className="w-[480px] relative min-h-screen bg-[linear-gradient(225deg,_#BAE6E9_10%,_#FFFFFF_50%,_#FAF2C0_100%)]">
    </div>
  );
  return (
    <div className="w-[480px] min-h-screen bg-gradient-to-b from-sky-200 via-white to-yellow-50">
      <input
        type="number"
        placeholder="Masukan Nominal"
        className="w-full px-4 py-3 pr-10 bg-gray-100 rounded-xl text-center text-gray-500 placeholder:text-gray-500 outline-none"
      />
    </div>
  );
};

export default NominalInput;
