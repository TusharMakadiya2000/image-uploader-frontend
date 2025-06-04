/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { toast } from "react-hot-toast";

const filesExt = {
    image: ['jpg', 'jpeg', 'png'],
};

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    company: any;
    role: string;
}

const ImageUploadModal = ({ isOpen, onClose, company, role }: ImageUploadModalProps) => {
    const [image, setImage] = useState<File | null>(null);
    const [selectedCompany, setSelectedCompany] = useState('');
    console.log('company', company)
    console.log('selectedCompany**************8', selectedCompany)
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const ext = file.name.split('.').pop()?.toLowerCase();

            if (filesExt.image.includes(ext || '')) {
                setImage(file);
            } else {
                alert('Unsupported file type.');
                setImage(null);
            }
        } else {
            setImage(null);
        }
    };

    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(URL.createObjectURL(image));
            }
        };
    }, [image]);

    const saveImage = async () => {
        if (!image) return;

        try {
            const formData = new FormData();
            formData.append('image', image);
            formData.append('type', 'Image');
            formData.append('companyId', selectedCompany);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/upload`, {
                method: 'POST',
                headers: {
                    // "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "token"
                    )}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            console.log("Uploaded successfully:", data);
            toast.success("Image Uploaded successfully?");
            setImage(null);
            onClose();
        } catch (err) {
            toast.error("error in Image upload!");
            console.error("Image upload error:", err);
        }
    };


    const handleCancel = () => {
        setImage(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white w-full max-w-xl p-6 rounded-md shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-2xl text-gray-600 hover:text-black"
                >
                    ×
                </button>

                <div className="text-center">
                    <label
                        htmlFor="image"
                        className="cursor-pointer flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 p-6 rounded-md"
                    >
                        {image ? (
                            <img
                                src={URL.createObjectURL(image)}
                                alt="preview"
                                className="max-h-64 object-contain"
                            />
                        ) : (
                            <div className="text-gray-500 text-sm">Upload Image (JPG, JPEG, PNG)</div>
                        )}
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>

                    {image && (
                        <div className="mt-4 flex justify-center gap-4">
                            {role === 'SA' && (
                                <div className="mb-4">
                                    <select
                                        className="border px-4 py-2 rounded"
                                        value={selectedCompany}
                                        onChange={(e) => {
                                            setSelectedCompany(e.target.value);
                                        }}
                                    >
                                        <option value="">Select a company</option>
                                        {company?.map((company: any) => (
                                            <option key={company?.id} value={company?.id}>
                                                {company?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                onClick={saveImage}
                            >
                                Save
                            </button>
                            <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUploadModal;
