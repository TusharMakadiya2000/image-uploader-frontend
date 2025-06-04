/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import ImageUploadModal from '../../components/ImageUploadModal';

const ImageUploaderPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [role, setRole] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [companyList, setCompanyList] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');

    const fetchImages = async (companyIdParam = '') => {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api/images/`;

        if (role === 'user' && companyIdParam) {
            url += `?companyId=${companyIdParam}`;
        }

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const data = await res.json();
        setImages(data);
    };

    const fetchCompanyList = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/company`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        const companydata = await res.json();
        console.log('companydata', companydata)
        setCompanyList(companydata);
    };
    console.log('images', images)
    const init = () => {
        const userString = localStorage.getItem('User');
        console.log('userString', userString)
        if (!userString) return;
        const user = JSON.parse(userString);
        setRole(user.role);
        setCompanyId(user.companyId);

        if (user.role === 'SA'){
             fetchImages(),
             fetchCompanyList();
        }
        else if
            (user.role === 'admin'){ fetchImages(user.companyId)}
        else if (user.role === 'user'){ fetchCompanyList()};
    };

    console.log('role', role)
    console.log('companyList', companyList)

    useEffect(() => {
        init();
    }, []);

    return (
        <div className="p-4">
            {(role === 'SA' || role === 'admin') && (
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Upload Image
                    </button>

                    <ImageUploadModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            fetchImages(companyId);
                        }}
                        company={companyList}
                        role={role}
                    />
                </div>
            )}

            {role === 'user' && (
                <div className="mb-4">
                    <select
                        className="border px-4 py-2 rounded"
                        value={selectedCompany}
                        onChange={(e) => {
                            setSelectedCompany(e.target.value);
                            fetchImages(e.target.value);
                        }}
                    >
                        <option value="">Select a company</option>
                        {companyList?.map((company:any) => (
                            <option key={company?.id} value={company?.id}>
                                {company?.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="grid grid-cols-3 gap-4 h-[calc(100vh-216px)] overflow-y-auto">
                {images.map((img: any) => {
                    const baseUrl = process.env.NEXT_PUBLIC_TEBI_CLOUD_FRONT_PROFILE_S3_URL?.replace(/\/$/, "");
                    const fullUrl = `${baseUrl}/${img.url}`;
                    return (
                        <div key={img.id} className="group [perspective:300px] w-[300px] h-[300px]">
                            <div className="relative h-[300px] w-[300px] cursor-pointer transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

                                <div className="absolute inset-0">
                                    <img
                                        src={fullUrl}
                                        alt="uploaded"
                                        className="w-[300px] h-[300px] object-cover rounded-lg shadow-md"
                                    />
                                </div>

                                <div className="absolute inset-0 bg-gray-500 rounded-lg px-4 py-6 text-center flex flex-col justify-center items-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                                    <div>
                                    <span className='font-bold'>User Name:</span>
                                    <p className="font-semibold text-lg text-white">
                                        {img?.User?.name}
                                    </p>
                                    </div>
                                    <div>
                                    <span className='font-bold'>Company Name:</span>
                                    <p className="text-md text-white">
                                        {img?.Company?.name}
                                    </p>
                                    </div>
                                    <div>
                                    <span className='font-bold'>Date:</span>
                                    <p className="text-sm text-white mt-2">
                                        {new Date(img.createdAt).toLocaleDateString()}
                                    </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    );
                })}
            </div>
        </div>
    );
};

export default ImageUploaderPage;
