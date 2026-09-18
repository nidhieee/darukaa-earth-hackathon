import { motion } from 'framer-motion';

export default function HealthBadge({ score }) {
  const getColors = () => {
    switch (score) {
      case 'green': return { bg: 'var(--color-accent-light)', text: 'var(--color-primary)' };
      case 'yellow': return { bg: '#fef9c3', text: 'var(--color-health-yellow)' };
      case 'red': return { bg: '#fee2e2', text: 'var(--color-health-red)' };
      default: return { bg: '#f3f4f6', text: 'var(--color-text-muted)' };
    }
  };
  
  const colors = getColors();
  
  const isRed = score === 'red';
  
  return (
    <motion.span 
      animate={isRed ? { opacity: [1, 0.7, 1] } : {}}
      transition={isRed ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'capitalize',
        display: 'inline-block'
      }}
    >
      {score}
    </motion.span>
  );
}
