export default function ReadField({ label, value }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: 'var(--color-ink-soft)', margin: '0 0 5px',
      }}>
        {label}
      </p>
      <p style={{ fontSize: 15, color: 'var(--color-ink)', margin: 0 }}>
        {value || value === 0 ? value : '—'}
      </p>
    </div>
  );
}
