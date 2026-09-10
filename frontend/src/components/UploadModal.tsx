import React, { useState, useRef } from 'react';
import { photosApi } from '../api/photos';
import { UploadCloud, X, CheckCircle, AlertCircle, RefreshCw, FileImage } from 'lucide-react';

interface UploadItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'QUEUED' | 'UPLOADING' | 'SUCCESS' | 'ERROR';
  errorMessage?: string;
  progress: number;
}

interface UploadModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ eventId, isOpen, onClose, onUploadComplete }) => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newItems: UploadItem[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'QUEUED',
      progress: 0,
    }));

    setItems((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const startUpload = async () => {
    const pendingItems = items.filter((i) => i.status === 'QUEUED' || i.status === 'ERROR');
    if (pendingItems.length === 0) return;

    setIsUploading(true);

    // Update status to uploading
    setItems((prev) =>
      prev.map((item) =>
        pendingItems.some((p) => p.id === item.id)
          ? { ...item, status: 'UPLOADING', progress: 50 }
          : item
      )
    );

    try {
      const filesToUpload = pendingItems.map((item) => item.file);
      await photosApi.uploadPhotos(eventId, filesToUpload);

      setItems((prev) =>
        prev.map((item) =>
          pendingItems.some((p) => p.id === item.id)
            ? { ...item, status: 'SUCCESS', progress: 100 }
            : item
        )
      );

      onUploadComplete();

      // Automatically close modal after successful upload
      setTimeout(() => {
        setItems([]);
        onClose();
      }, 800);
    } catch (err: any) {
      setItems((prev) =>
        prev.map((item) =>
          pendingItems.some((p) => p.id === item.id)
            ? { ...item, status: 'ERROR', errorMessage: err.message || 'Upload failed' }
            : item
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  const totalSelected = items.length;
  const totalUploaded = items.filter((i) => i.status === 'SUCCESS').length;
  const totalFailed = items.filter((i) => i.status === 'ERROR').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh] text-zinc-100">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl font-bold">Upload Photographs</h2>
            <p className="text-xs text-zinc-400 mt-1">Add event photos (JPG, PNG, WEBP max 25MB each)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="my-4 border-2 border-dashed border-zinc-700 hover:border-indigo-500 bg-zinc-800/40 hover:bg-zinc-800/80 rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 group"
        >
          <UploadCloud className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform mx-auto mb-3" />
          <p className="text-sm font-semibold text-zinc-200">Drag & drop files here, or click to browse</p>
          <p className="text-xs text-zinc-500 mt-1">Supports multiple photo uploads</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* Queue Metrics */}
        {totalSelected > 0 && (
          <div className="flex items-center justify-between text-xs px-3 py-2 bg-zinc-800/60 border border-zinc-800 rounded-xl mb-3">
            <span className="font-semibold text-zinc-300">
              {totalSelected} selected • {totalUploaded} uploaded • {totalFailed} failed
            </span>
            {totalUploaded > 0 && totalUploaded === totalSelected && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> All Uploaded!
              </span>
            )}
          </div>
        )}

        {/* File Queue List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/40 border border-zinc-800/80 hover:border-zinc-700 transition-all"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={item.previewUrl}
                  alt={item.file.name}
                  className="w-12 h-12 rounded-lg object-cover bg-zinc-800 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{item.file.name}</p>
                  <p className="text-xs text-zinc-500">{(item.file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  {item.errorMessage && <p className="text-xs text-rose-400 font-medium">{item.errorMessage}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {item.status === 'QUEUED' && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-700/60 text-zinc-300 font-medium">
                    Queued
                  </span>
                )}
                {item.status === 'UPLOADING' && (
                  <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </div>
                )}
                {item.status === 'SUCCESS' && (
                  <span className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Uploaded</span>
                  </span>
                )}
                {item.status === 'ERROR' && (
                  <button
                    onClick={() => startUpload()}
                    className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 font-medium hover:bg-rose-500/20 transition-colors border border-rose-500/20"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-800 pt-4 mt-4 flex items-center justify-between">
          <button
            onClick={() => {
              setItems([]);
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            {items.length > 0 && items.every((i) => i.status === 'SUCCESS') ? 'Close' : 'Cancel'}
          </button>
          {items.length > 0 && items.every((i) => i.status === 'SUCCESS') ? (
            <button
              onClick={() => {
                setItems([]);
                onClose();
              }}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-sm text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Done</span>
            </button>
          ) : (
            <button
              onClick={startUpload}
              disabled={isUploading || items.length === 0}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm text-white shadow-lg shadow-indigo-600/30 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : `Upload ${items.filter((i) => i.status !== 'SUCCESS').length} Photos`}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
