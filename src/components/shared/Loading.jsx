import { motion as Motion } from 'framer-motion';

export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-audible-orange border-t-transparent rounded-full"></div>
      </Motion.div>
      <p className="mt-4 text-gray-600 font-medium">{text}</p>
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((i) => (
        <Motion.div
          key={i}
          className="w-2 h-2 bg-audible-orange rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
}
