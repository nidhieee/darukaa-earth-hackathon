import { motion } from 'framer-motion';

export default function GlareHover({ children, background = 'var(--color-primary)', borderRadius = '9999px', style = {}, className = '' }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background,
        borderRadius,
        display: 'inline-block',
        ...style
      }}
      className={`glare-hover-container ${className}`}
    >
      {children}
      <motion.div
        className="glare-effect"
        initial={{ x: '-100%' }}
        whileHover={{ x: '150%' }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.25) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 10
        }}
      />
    </motion.div>
  );
}
