import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

interface PINModalProps {
  galleryName: string;
  onVerify: (pin: string) => Promise<void>;
}

export const PINModal: React.FC<PINModalProps> = ({ galleryName, onVerify }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus input on mount
    inputRef.current?.focus();

    const handlePaste = (e: ClipboardEvent) => {
      const pastedData = e.clipboardData?.getData('text') || '';
      const digitsOnly = pastedData.replace(/\D/g, '').slice(0, 6);
      if (digitsOnly.length > 0) {
        setPin(digitsOnly);
        setError(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key >= '0' && e.key <= '9') {
        setPin((prev) => (prev.length < 6 ? prev + e.key : prev));
        setError(null);
      } else if (e.key === 'Backspace') {
        setPin((prev) => prev.slice(0, -1));
      }
    };

    window.addEventListener('paste', handlePaste);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) {
      setError('PIN must be 6 digits');
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      await onVerify(pin);
    } catch (err: any) {
      setError(err.message || 'Invalid PIN or access code');
      setPin('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDigitInput = (val: string) => {
    if (pin.length < 6) {
      setPin((prev) => prev + val);
      setError(null);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-xl p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-md w-full p-8 shadow-2xl text-center text-zinc-100 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400 shadow-indigo-600/20 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Protected Event Gallery</h2>
        <p className="text-sm text-zinc-400 mb-6">
          Enter the 6-digit access PIN for <span className="font-semibold text-zinc-200">"{galleryName}"</span>
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Invisible Overlay Input for Paste & Physical Keyboard Typing */}
          <div className="relative flex justify-center space-x-3 mb-6 cursor-pointer" onClick={() => inputRef.current?.focus()}>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d*"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setPin(val);
                setError(null);
              }}
              onPaste={(e) => {
                const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                if (pasted) {
                  setPin(pasted);
                  setError(null);
                }
              }}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              autoFocus
            />

            {/* Visual 6-Digit Box Indicators */}
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <div
                key={index}
                className={`w-12 h-14 rounded-2xl border flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                  pin[index]
                    ? 'border-indigo-500 bg-indigo-600/10 text-white shadow-indigo-500/20 shadow-md ring-2 ring-indigo-500/30'
                    : index === pin.length
                      ? 'border-indigo-400/80 bg-zinc-800/80 text-transparent animate-pulse'
                      : 'border-zinc-800 bg-zinc-800/40 text-zinc-600'
                }`}
              >
                {pin[index] ? '•' : ''}
              </div>
            ))}
          </div>

          {/* On-screen Keypad */}
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                type="button"
                key={digit}
                onClick={() => handleDigitInput(digit)}
                className="h-12 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-lg font-semibold text-zinc-200 active:scale-95 transition-all border border-zinc-800"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-12 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-xs font-semibold text-zinc-400 active:scale-95 transition-all border border-zinc-800"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleDigitInput('0')}
              className="h-12 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-lg font-semibold text-zinc-200 active:scale-95 transition-all border border-zinc-800"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-xs font-semibold text-zinc-400 active:scale-95 transition-all border border-zinc-800"
            >
              ⌫
            </button>
          </div>

          <button
            type="submit"
            disabled={pin.length !== 6 || isVerifying}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
          >
            <span>{isVerifying ? 'Verifying PIN...' : 'Unlock Private Gallery'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
