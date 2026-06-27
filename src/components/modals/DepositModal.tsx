import React, { useState } from 'react';
import { X, QrCode, CreditCard, ChevronDown, Copy, ArrowLeft } from 'lucide-react';
import QRCode from 'react-qr-code';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress?: string;
}

export function DepositModal({ 
  isOpen, 
  onClose, 
  walletAddress = '5aW1rMbCFtSdY53gn4VDJKQZsHPEYJ2L1YXE7neLDCGZ' 
}: DepositModalProps) {
  const [view, setView] = useState<'select' | 'qr'>('select');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-[#0A0D14] w-[420px] rounded-2xl border border-white/[0.04] shadow-2xl overflow-hidden flex flex-col">
        {view === 'select' ? (
          <>
            {/* Header */}
            <div className="relative p-5 text-center">
              <h2 className="text-[15px] font-semibold text-white">Deposit with</h2>
              <button 
                onClick={onClose}
                className="absolute right-5 top-5 text-[#8F9BB3] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-5 pb-6 flex flex-col gap-3">
              {/* Option 1: Crypto */}
              <button 
                onClick={() => setView('qr')}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors group cursor-pointer"
              >
                <div className="flex flex-col items-start text-left">
                  <span className="text-[14px] text-white font-medium">Crypto</span>
                  <span className="text-[12px] text-[#8F9BB3] mt-0.5 tracking-tight">Transfer USDC from a crypto wallet</span>
                </div>
                <QrCode className="w-5 h-5 text-[#8F9BB3] group-hover:text-white transition-colors" />
              </button>

              {/* Option 2: Credit/Debit */}
              <button 
                disabled
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] transition-colors cursor-not-allowed opacity-60"
              >
                <div className="flex flex-col items-start text-left">
                  <span className="text-[14px] text-white font-medium">Credit or debit</span>
                  <span className="text-[12px] text-[#8F9BB3] mt-0.5 tracking-tight">Coming soon!</span>
                </div>
                <CreditCard className="w-5 h-5 text-[#8F9BB3]" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-center relative p-5">
              <button 
                onClick={() => setView('select')}
                className="absolute left-5 text-[#8F9BB3] hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-[15px] font-semibold text-white">Deposit with crypto</h2>
            </div>

            {/* Network Selector */}
            <div className="flex justify-center mt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.04] text-[13px] text-white">
                {/* Solana SVG Icon */}
                <svg width="14" height="14" viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="#00FFA3"/>
                  <path d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="#00FFA3"/>
                  <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="#DC1FFF"/>
                </svg>
                Solana
                <ChevronDown className="w-4 h-4 ml-1 text-[#8F9BB3]" />
              </div>
            </div>

            {/* Instructions */}
            <div className="px-6 mt-4">
              <p className="text-[13px] text-[#8F9BB3] text-center leading-relaxed tracking-tight">
                Send any token on the Solana network to this address. Send <span className="inline-flex items-center gap-1 font-medium text-white"><svg width="12" height="12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0"><circle cx="16" cy="16" r="16" fill="#2775CA"/><path d="M19.78 18.06c0-2.45-1.74-3.14-4.83-3.69l-1.39-.24c-1.63-.3-2.18-.73-2.18-1.52 0-.89.87-1.46 2.22-1.46 1.34 0 2.27.49 2.58 1.45l2.25-1.01c-.55-1.64-1.95-2.67-3.8-2.94V6.5h-2.52v2.09c-1.84.23-3.35 1.18-3.35 3.09 0 2.37 1.76 3.12 4.75 3.65l1.47.26c1.7.3 2.26.79 2.26 1.6 0 .97-1 1.55-2.42 1.55-1.56 0-2.61-.63-3.03-1.81l-2.31 1.05c.67 1.96 2.27 3.06 4.3 3.34v2.17h2.52v-2.15c2.04-.26 3.48-1.3 3.48-3.28z" fill="white"/></svg>USDC</span> to add to your cash balance.
              </p>
            </div>

            {/* QR Code */}
            <div className="mt-6 mx-auto bg-white p-3 rounded-xl w-[200px] h-[200px] flex items-center justify-center">
              <QRCode 
                value={walletAddress}
                size={176}
                level="L"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>

            {/* Address Copy Box */}
            <div 
              onClick={handleCopy}
              className="mt-6 mx-6 mb-6 flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-colors cursor-pointer group"
            >
              <span className="text-[12px] font-mono text-[#8F9BB3] group-hover:text-white break-all tracking-tight">
                {walletAddress}
              </span>
              <Copy className="w-4 h-4 shrink-0 text-[#8F9BB3] group-hover:text-white transition-colors ml-3" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
