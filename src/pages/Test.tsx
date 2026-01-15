import { useEffect, useRef, useState } from "react";

const NominalInput = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScroll = useRef(0);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const [hideHeader, setHideHeader] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    const sentinel = topSentinelRef.current;
    if (!el || !sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHideHeader(!entry.isIntersecting);
      },
      {
        root: el,
        threshold: 1,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto pt-14 w-[400px]">
      <div ref={topSentinelRef} className="h-1 bg-red" />
      <ScrollableList />
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
