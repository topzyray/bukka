import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition({
  children,
  routeKey,
  variants,
}: {
  children: React.ReactNode;
  routeKey?: string;
  variants?: any;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        variants={variants}

        // key={router.route}
        // initial="hidden"
        // animate="show"
        // exit="exit"
        // variants={fadeInUp}
        // transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
