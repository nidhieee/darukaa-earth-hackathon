export default function HealthBadge({ score }) {
  const getColors = () => {
    switch (score) {
      case 'green': return { bg: '#dcfce7', text: '#166534' };
      case 'yellow': return { bg: '#fef9c3', text: '#854d0e' };
      case 'red': return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };
  
  const colors = getColors();
  
  return (
    <span style={{
      backgroundColor: colors.bg,
      color: colors.text,
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '500',
      textTransform: 'capitalize'
    }}>
      {score}
    </span>
  );
}
