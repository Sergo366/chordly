'use client';

import React from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X, Upload, Tag, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { clothesApi } from '@/api/clothes';

interface UploadChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTagPhotoSelect?: (file: File) => void;
  onCustomPhotoUpload?: (url: string) => void;
}

export function UploadChoiceModal({ isOpen, onClose, onTagPhotoSelect, onCustomPhotoUpload }: UploadChoiceModalProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const generalFileInputRef = React.useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isCompressing, setIsCompressing] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setError(null);
    }
  }, [isOpen, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onTagPhotoSelect) {
      onTagPhotoSelect(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGeneralFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/heic',
        'image/heif',
        'image/heic-sequence',
        'image/heif-sequence',
      ];

      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
      const hasValidMimeType = allowedMimeTypes.includes(fileType);

      if (!hasValidExtension && !hasValidMimeType) {
        setError('Unsupported file format. Please upload a JPEG, PNG, WebP, or HEIC/HEIF image.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setError(null);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
    if (generalFileInputRef.current) {
      generalFileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    // 1. Size Validation (<= 5MB)
    const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError('File size must not exceed 5MB.');
      return;
    }

    // 2. Type Validation (jpeg, png, webp, heic, heif)
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'];
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
      'image/heic-sequence',
      'image/heif-sequence',
    ];

    const fileType = selectedFile.type.toLowerCase();
    const fileName = selectedFile.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    const hasValidMimeType = allowedMimeTypes.includes(fileType);

    if (!hasValidExtension && !hasValidMimeType) {
      setError('Unsupported file format. Please upload a JPEG, PNG, WebP, or HEIC/HEIF image.');
      return;
    }

    setError(null);
    setIsCompressing(true);

    try {
      // 3. Compression
      const options = {
        maxSizeMB: 1, // Target max size in MB after compression
        maxWidthOrHeight: 1920, // Max dimensions (aspect ratio preserved)
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(selectedFile, options);

      // 4. Get Presigned S3 Upload URL
      const { uploadUrl, fileUrl } = await clothesApi.getPresignedUrl(
        selectedFile.name,
        compressedFile.type,
      );

      // 5. Upload compressed file to S3
      await clothesApi.uploadToS3(uploadUrl, compressedFile);
      setError(null);
      if (onCustomPhotoUpload) {
        onCustomPhotoUpload(fileUrl);
      }
    } catch (err) {
      console.error('Upload/Compression error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  };
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-800 p-8 text-left align-middle shadow-2xl transition-all">
                <div className="flex items-center justify-between mb-8">
                  <DialogTitle as="h3" className="text-2xl font-light text-white">
                    Add new item
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full cursor-pointer hover:bg-white/5 transition-colors text-zinc-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  {previewUrl ? (
                    <div className="flex flex-col gap-4">
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex gap-3 mt-2">
                        <button
                          disabled={isCompressing}
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setError(null);
                          }}
                          className="flex-1 py-3 px-4 rounded-xl border border-zinc-800 bg-transparent text-white hover:bg-zinc-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={isCompressing}
                          onClick={handleUpload}
                          className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                        >
                          {isCompressing ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Compressing...
                            </>
                          ) : (
                            'Upload'
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => generalFileInputRef.current?.click()}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors group text-left cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          <Upload className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-lg">Upload your photo</h4>
                          <p className="text-sm text-zinc-400">Add an item from your camera roll</p>
                        </div>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors group text-left cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          <Tag className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-lg">Find by photo tag</h4>
                          <p className="text-sm text-zinc-400">Take a picture of the label</p>
                        </div>
                      </button>
                    </>
                  )}

                  {error && (
                    <p className="text-red-500 text-sm text-center mt-2">{error}</p>
                  )}

                  <input
                    type="file"
                    ref={generalFileInputRef}
                    className="hidden"
                    accept="image/jpeg, image/png, image/webp, image/jpg, image/heic, image/heif, .heic, .heif"
                    onChange={handleGeneralFileChange}
                  />

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg, image/png, image/webp, image/jpg, image/heic, image/heif, .heic, .heif"
                    onChange={handleFileChange}
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
