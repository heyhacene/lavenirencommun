import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeSVGProps {
  text: string;
  size?: number;
  className?: string;
}

export const QRCodeSVG = ({ text, size = 220, className = '' }: QRCodeSVGProps) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(text, {
      width: size * 2,
      margin: 2,
      color: {
        dark: '#070114',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
      .then(url => {
        if (isMounted) {
          setDataUrl(url);
          setError(false);
        }
      })
      .catch(err => {
        console.error('[AEC] Failed to generate QR Code:', err);
        if (isMounted) setError(true);
      });

    return () => {
      isMounted = false;
    };
  }, [text, size]);

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className="bg-purple-950/40 border border-purple-500/30 rounded-2xl flex flex-col items-center justify-center p-4 text-center text-xs text-purple-300"
      >
        <span className="text-xl mb-1">📱</span>
        <span>Lien : {text}</span>
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className="bg-white/10 rounded-2xl animate-pulse flex items-center justify-center text-xs text-purple-300 border border-purple-400/20"
      >
        Génération du QR Code...
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <img
        src={dataUrl}
        alt={`QR Code pour ${text}`}
        width={size}
        height={size}
        className="rounded-2xl shadow-2xl border-4 border-white select-none pointer-events-none bg-white p-1"
      />
      {/* Central Phi badge */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-[#0c0017] border-2 border-purple-500 shadow-md flex items-center justify-center p-1.5 pointer-events-none">
        <img src="/logo-fi.png" alt="Phi" className="w-full h-full object-contain" />
      </div>
    </div>
  );
};
