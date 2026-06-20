"use client";

import React, { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { useAddClothing } from '@/hooks/use-clothes';
import { useToast } from '@/hooks/useToast';
import imageCompression from 'browser-image-compression';
import { clothesApi } from '@/api/clothes';

const AddClothesModal = dynamic(
    () => import('@/components/modals/AddClothesModal/AddClothesModal').then(mod => mod.AddClothesModal),
    { ssr: false }
);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export default function AddClothesPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customImageUrl, setCustomImageUrl] = useState<string | null>(null);
    const [isCustomUploading, setIsCustomUploading] = useState(false);
    const { toast } = useToast();

    const { data: clothesData, mutate: addClothing, isPending: isUploading, isSuccess: uploadSuccess, reset: resetUpload } = useAddClothing();
    const fileInputRef = React.useRef<HTMLInputElement>(null);


    const validateFile = useCallback((file: File) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error('Please select a JPG or PNG image.');
            return false;
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size should not exceed 10 MB.');
            return false;
        }
        return true;
    }, [toast]);

    const handleFile = useCallback((selectedFile: File) => {
        if (validateFile(selectedFile)) {
            resetUpload();
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    }, [validateFile, resetUpload]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) handleFile(droppedFile);
    }, [handleFile]);

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) handleFile(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        resetUpload();
    };

    const handleUpload = async () => {
        if (!file) return;

        addClothing(file, {
            onSuccess: () => {
                toast.success('Clothes analyzed successfully! Please select a photo.');
                setIsModalOpen(true);
            },
            onError: (err) => {
                toast.error(getErrorMessage(err) || 'Failed to upload clothes');
            }
        });
    };

    const getErrorMessage = (err: unknown) => {
        if (!err) return null;
        if (typeof err === 'object' && 'response' in err) {
            const axiosError = err as { response: { data: { message?: string } } };
            return axiosError.response?.data?.message || 'Upload failed. Please try again.';
        }
        return err instanceof Error ? err.message : String(err);
    };

    const handleCustomUpload = async () => {
        if (!file) return;
        setIsCustomUploading(true);
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            const { uploadUrl, fileUrl } = await clothesApi.getPresignedUrl(file.name, compressedFile.type);
            await clothesApi.uploadToS3(uploadUrl, compressedFile);
            setCustomImageUrl(fileUrl);
            setIsModalOpen(true);
        } catch (err) {
            console.error('Custom upload error:', err);
            toast.error('Failed to upload custom image. Please try again.');
        } finally {
            setIsCustomUploading(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCustomImageUrl(null);
        removeFile();
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2 text-center">
                <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl">
                    Add clothes
                </h1>
                <p className="text-zinc-400">Upload a photo of your wardrobe item</p>
            </div>

            <div className="relative">
                {!preview ? (
                    <div
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={`
                            h-[380px]
                            relative group cursor-pointer
                            border-2 border-dashed rounded-3xl p-12
                            flex flex-col items-center justify-center gap-4
                            transition-all duration-300 ease-out
                            ${isDragging 
                                ? 'border-accent bg-accent/5 scale-[1.02] shadow-[0_0_30px_rgba(168,85,247,0.15)]' 
                                : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50'}
                        `}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/jpeg, image/png"
                            onChange={handleInputChange}
                        />
                        
                        <div className={`
                            w-16 h-16 rounded-2xl flex items-center justify-center
                            bg-zinc-900 border border-zinc-800
                            transition-all duration-300 group-hover:scale-110
                            ${isDragging ? 'bg-accent/10 border-accent/30 text-accent' : 'text-zinc-400'}
                        `}>
                            <Upload className="w-8 h-8" />
                        </div>
                        
                        <div className="text-center space-y-1">
                            <p className="text-foreground font-medium">
                                Click or drag and drop a photo
                            </p>
                            <p className="text-sm text-zinc-500">
                                PNG, JPG up to 10 MB
                            </p>
                        </div>

                        {isDragging && (
                            <div className="absolute inset-0 rounded-3xl pointer-events-none border-2 border-accent animate-pulse" />
                        )}
                    </div>
                ) : (
                    <div className="relative group rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/50 aspect-square sm:aspect-video flex items-center justify-center">
                        <Image
                            src={preview} 
                            alt="Preview" 
                            fill
                            unoptimized
                            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        <div className="absolute right-0 top-0 bg-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
                            <button
                                onClick={removeFile}
                                className="p-3 cursor-pointer bg-red-500/20 hover:bg-red-500/40 text-red-500 rounded-full transition-colors backdrop-blur-md"
                                title="Remove"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {file && (
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleUpload}
                        disabled={isUploading || isCustomUploading || uploadSuccess}
                        className={`
                            flex-1 py-4 rounded-2xl font-semibold text-lg transition-all duration-300
                            flex items-center justify-center gap-2 cursor-pointer
                            ${isUploading || isCustomUploading || uploadSuccess
                                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                : 'bg-primary text-background hover:bg-primary-hover active:scale-[0.98] shadow-lg shadow-primary/10'
                            }
                        `}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing...
                            </>
                        ) : uploadSuccess ? (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                Done
                            </>
                        ) : (
                            <>
                                <ImageIcon className="w-5 h-5" />
                                Find similar (AI)
                            </>
                        )}
                    </button>
                    
                    <button
                        onClick={handleCustomUpload}
                        disabled={isUploading || isCustomUploading || uploadSuccess}
                        className={`
                            flex-1 py-4 rounded-2xl font-semibold text-lg transition-all duration-300
                            flex items-center justify-center gap-2 cursor-pointer
                            border border-zinc-800 bg-zinc-900/50 text-white
                            ${isUploading || isCustomUploading || uploadSuccess
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-zinc-800 hover:border-zinc-700 active:scale-[0.98]'
                            }
                        `}
                    >
                        {isCustomUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Use this photo directly
                            </>
                        )}
                    </button>
                </div>
            )}

            <AddClothesModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal} 
                searchResults={clothesData?.searchResults || []}
                ticker={clothesData?.ticker}
                initialImageUrl={customImageUrl || undefined}
            />
        </div>
    );
}