import { motion } from "framer-motion";
import { useEffect } from "react";

interface ModalContainerProps {
  visible: boolean;
  children: any;
  onDismiss: () => void;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
  visible,
  children,
  onDismiss,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") onDismiss();
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={onDismiss}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        className="bg-white rounded-lg shadow-lg p-6 w-96 "
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ModalContainer;
