import { useEffect, useRef, useState } from "react";

const NominalInput = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hideHeader, setHideHeader] = useState(false);
  const lastScroll = useRef(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const current = el.scrollTop;
    setHideHeader(current > lastScroll.current && current > 20);
    lastScroll.current = current;
  };
  return (
    <div className="w-[480px] relative min-h-screen bg-[linear-gradient(225deg,_#BAE6E9_10%,_#FFFFFF_50%,_#FAF2C0_100%)]">
      <div className="h-screen relative bg-cyan-100">
        <Header hide={hideHeader} />

        {/* Scroll Area */}
        <div
          id="scrollable"
          className={`h-full overflow-y-auto transition-all duration-300
      ${hideHeader ? "pt-0" : "pt-14"}
    `}
        >
          <ScrollableList />
        </div>
      </div>
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

type Props = {
  hide: boolean;
};

function Header({ hide }: Props) {
  return (
    <div
      className={`absolute top-0 left-0 right-0 z-20 transition-all duration-300 ${
        hide ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      } `}
    >
      <div className="h-14 bg-white flex items-center px-4 rounded-b-xl shadow">
        Header
      </div>
    </div>
  );
}

function List() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="h-20 rounded-lg bg-gray-100 flex items-center px-4"
        >
          Item {i + 1}
        </div>
      ))}
    </div>
  );
}

function ScrollableList() {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="h-20 bg-gray-100 rounded-lg flex items-center px-4"
        >
          Item {i + 1}
        </div>
      ))}
    </div>
  );
}
