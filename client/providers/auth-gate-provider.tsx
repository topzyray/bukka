"use client";

import { motion } from "framer-motion";
import { useAuth } from "./auth-provider";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();
  // const [mounted, setMounted] = useState(false);

  // // Ensure this component only renders client-side content after mount
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // // During SSR, render nothing to avoid mismatches
  // if (!mounted)
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="border-primary mx-auto h-14 w-14 animate-spin rounded-full border-8 border-dashed"></div>
  //     </div>
  //   );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="border-primary mx-auto h-14 w-14 animate-spin rounded-full border-8 border-dashed"></div>
          <p className="mt-4 text-base font-semibold lg:text-xl lg:font-semibold">
            Loading user session...
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
