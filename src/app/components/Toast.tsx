import { useEffect } from 'react';
import { CheckCircle, Info } from 'lucide-react';

export function Toast({ message, type = 'success' }: { message: string; type?: 'success' | 'info' }) {
  useEffect(() => {
    document.body.style.overflow = '';
  }, []);

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, background: '#211D18', border: `1px solid ${type === 'success' ? '#C9A84C' : '#4A9B8E'}`,
      borderRadius: 4, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 32px rgba(0,0,0,.5)', animation: 'toastIn .3s ease',
      maxWidth: '90vw',
    }}>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
      {type === 'success' ? <CheckCircle size={18} style={{ color: '#C9A84C', flexShrink: 0 }} /> : <Info size={18} style={{ color: '#4A9B8E', flexShrink: 0 }} />}
      <span style={{ fontSize: 13, color: '#F5F0E8', fontFamily: 'DM Sans,sans-serif' }}>{message}</span>
    </div>
  );
}
