/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/components/comman/Input";
import { useForm } from "react-hook-form";
import { setLocalItem } from "@/utils";
interface FormDataType {
    email: string;
    password: string;
}

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const schema = yup.object().shape({
        email: yup
            .string()
            .required("Email or username is required")
            .test(
                "is-email-or-username",
                "Must be a valid email or username",
                (value) => {
                    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
                    const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;
                    return (
                        emailRegex.test(value || "") ||
                        usernameRegex.test(value || "")
                    );
                }
            ),
        password: yup
            .string()
            .required("Password is required")
            .matches(
                /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                "Password must contain at least 8 characters, one uppercase, one number, and one special character"
            ),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataType>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormDataType) => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `Login failed: ${response.status} - ${errorData.error}`
                );
            }

            const responseData = await response.json();
            const token = responseData.token;
            if(responseData.user){
                setLocalItem('User', JSON.stringify(responseData.user));
            }
            localStorage.setItem("token", token);
                  router.push("/dashboard");
        } catch (error: any) {
            console.error("Login failed:", error);
            if (error.response && error.response.status === 401) {
                console.error("Invalid username or password.");
            } else {
                console.error("Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="max-w-md mx-auto mt-20 p-4 border rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Input
                    label="Email or Username"
                    preIcon="mail"
                    name="email"
                    type="text"
                    placeholder="Enter your email or username"
                    required={true}
                    register={register}
                    error={errors?.email?.message?.toString()}
                />
                <Input
                    label="Password"
                    preIcon="lock-closed"
                    name="password"
                    type="password"
                    placeholder="Password"
                    required={true}
                    register={register}
                    error={errors?.password?.message?.toString()}
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </main>
    );
}
