/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Users() {
    const router = useRouter();
    const [fetchedData, setFetchedData] = useState<Array<any>>([]);
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    useEffect(() => {
        const storedUser = localStorage.getItem('User');

        if (!storedUser) {
            router.replace('/login');
            return;
        }
        try {
            const user = JSON.parse(storedUser);
            if (user?.role === 'SA') {
                setIsAuthorized(true);
            } else {
                router.replace('/dashboard');
            }
        } catch (err) {
            console.error("Failed to parse user data:", err);
            router.replace('/login');
        }
    }, []);
    console.log('fetchedData', fetchedData)
    const fetchData = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setFetchedData(data.users);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (userId: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to delete user");
            }
            toast.success("User delete successfully!");
            // Refresh the list
            fetchData();
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Error in user delete!");
        }
    };


    if (!isAuthorized) {
        return <div className="font-bold">Sorry, this page is restricted to authorized users only.</div>;
    }
    return (
        <main className="overflow-auto md:w-full bg-white rounded-md h-[calc(100%-60px)] py-2 px-5">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold mb-6">User List</h1>
                <div>
                    <Link href="register" className="bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
                        Add User
                    </Link>
                </div>
            </div>
            <table className="min-w-full bg-white/50 rounded-md shadow-black/30 shadow-md">
                <thead>
                    <tr className=" border-b border-border">
                        <th className="py-2 px-4">Name</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Company</th>
                        <th className="py-2 px-4">Role</th>
                        <th className="py-2 px-4">Action</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    <>
                        {
                            fetchedData
                                .slice()
                                .reverse()
                                .map((user, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-gray-300"
                                    >
                                        <td className="py-2 px-4 align-middle">
                                            {user.name}
                                        </td>
                                        <td className="py-2 px-4 align-middle">
                                            {user.email}
                                        </td>
                                        <td className="py-2 px-4 align-middle">
                                            {user.Company.name}
                                        </td>
                                        <td className="">
                                            <span className="py-1 px-2 align-middle bg-gray-400 rounded-full">
                                                {user.role === "SA" ? "Super admin" : user.role}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 align-middle space-x-2">
                                            {/* Edit button */}
                                            <button
                                                onClick={() => router.push(`/register/${user.id}`)}
                                                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>

                                            {/* Delete button */}
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        }
                    </>
                </tbody>
            </table>
        </main>
    );
}
