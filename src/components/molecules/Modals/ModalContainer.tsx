import { motion } from "framer-motion";
import { useEffect } from "react";

interface ModalContainerProps {
  isOpen: boolean;
  children: any;
  isBottom?: boolean;
  scrollable?: boolean;
  onDismiss: () => void;
  classNameBottom?: string;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  isOpen,
  classNameBottom,
  children,
  isBottom,
  scrollable,
  onDismiss,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") onDismiss();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  if (scrollable)
    return (
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-hidden `}
      >
        <div
          className={`w-auto relative bg-white h-auto max-h-[90%] rounded-xl shadow-lg transform transition-all flex flex-col overflow-hidden mx-6   ${
            isOpen ? "animate-fade-in" : "animate-fade-out"
          }`}
        >
          {/* CONTENT */}
          <div className={`overflow-y-auto scrollbar-none p-4`}>{children}</div>
        </div>
      </div>
    );

  return (
    <div
      onClick={onDismiss}
      className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 "
    >
      <div
        className={
          isBottom ? "relative h-svh w-svw sm:max-w-[480px] w-svw " : ""
        }
      >
        <motion.div
          className={` shadow-lg ${
            isBottom
              ? `absolute left-0 right-0 bottom-0 h-3/4 flex ${classNameBottom}`
              : "bg-white rounded-lg p-4 w-96 "
          }`}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default ModalContainer;
