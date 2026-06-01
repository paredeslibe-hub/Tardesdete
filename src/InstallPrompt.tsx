import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // No mostrar si ya está corriendo en modo standalone (instalada)
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Limpiar al instalar exitosamente
    window.addEventListener('appinstalled', () => setDeferred(null));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') setDeferred(null);
  };

  if (!deferred) return null;

  return (
    <button onClick={handleInstall} style={styles.btn} aria-label="Instalar aplicación">
      <span style={styles.icon}>⬇</span>
      Instalar App
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  btn: {
    position: 'fixed',
    bottom: '1.5rem',
    right: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.65rem 1.25rem',
    background: '#FF5A00',
    color: '#ffffff',
    border: '2.5px solid #FF5A00',
    borderRadius: '24px',
    fontFamily: "'Fredoka', sans-serif",
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '4px 4px 0 0 #5a2d0c',
    zIndex: 9999,
    transition: 'transform 0.1s, box-shadow 0.1s',
  },
  icon: {
    fontSize: '0.9rem',
    lineHeight: 1,
  },
};
