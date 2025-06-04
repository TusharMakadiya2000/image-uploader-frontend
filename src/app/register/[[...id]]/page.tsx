/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import Input from "../../../components/comman/Input";
import { toast } from "react-toastify";
import { use } from "react";

interface FormData {
  name: string;
  email: string;
  company: string;
  role: string;
  password?: string;
  confirmPassword?: string;
}

const Register = ({ params: paramsPromise }: { params: Promise<{ id: number | number[] }> }) => {
   const { id: rawId } = use(paramsPromise);
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const isEditMode = Boolean(id);
  console.log('id', id)
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const schema = yup.object().shape({
  name: yup.string().required("Name is required").min(2, "Name too short"),
  email: yup.string().email("Invalid email").required("Email required"),
  company: yup.string().required("Company is required").min(2, "Company too short"),
  role: yup.string().required("Role is required"),
   ...(isEditMode
      ? {} // don't require password fields on update
      : {
          password: yup
            .string()
            .required("Password is required")
            .matches(
              /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
              "Password must contain at least 8 characters, one uppercase, one number, and one special character"
            ),
          confirmPassword: yup
            .string()
            .required("Confirm Password is required")
            .oneOf([yup.ref("password")], "Your passwords do not match."),
        }),
});



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

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
  const fetchUser = async () => {
    if (id) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/getuser?id=${id}`,
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
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const item = await res.json();
        console.log('item', item)
        setValue("name", item.name);
        setValue("email", item.email);
        setValue("company", item.Company.name);
        setValue("role", item.role);
        trigger();
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    } else {
      setValue("name", "");
      setValue("company", "");
      setValue("email", "");
      setValue("role", "");
      setValue("password", "");
      setValue("confirmPassword", "");
    }
  };

  fetchUser();
}, [id, setValue, trigger]);


  const onSubmit = async (data: FormData) => {
    try {
      console.log('data', data)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payload } = data;
      const requestMethod = id ? "PUT" : "POST";
      const url = id
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/update?id=${encodeURIComponent(id)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/users/register`;
        console.log('url', url)
      const res = await fetch(url, {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Registration failed");
        return;
      }

      toast.success("User registered successfully!");
      if (isAuthorized) {

        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  if (!isAuthorized) {
    return <div className="font-bold">Sorry, this page is restricted to authorized users only.</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md h-[calc(100vh-120px)] overflow-auto mx-auto p-4 space-y-4">
      <h2 className="text-center text-2xl font-bold">Register</h2>

      <Input
        label="Name"
        type="text"
        name="name"
        register={register}
        error={errors.name?.message}
        placeholder="Your full name"
      />

      <Input
        label="Email"
        type="email"
        name="email"
        register={register}
        error={errors.email?.message}
        placeholder="Your email"
      />

      <Input
        label="Company"
        type="text"
        name="company"
        register={register}
        error={errors.company?.message}
        placeholder="Your company name"
      />

      <select
        {...register("role")}
        className={`w-full p-2 border rounded ${errors.role ? "border-red-500" : "border-gray-300"
          }`}
      >
        <option value="">Select role</option>
        <option value="SA">Super Admin</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      {errors.role && <p className="text-red-600 text-sm">{errors.role.message}</p>}
{!isEditMode && (
  <>
      <Input
        label="Password"
        type="password"
        name="password"
        register={register}
        error={errors.password?.message}
        placeholder="Enter password"
      />

      <Input
        label="Confirm Password"
        type="password"
        register={register}
        name="confirmPassword"
        error={errors.confirmPassword?.message}
        placeholder="Confirm password"
      />
      </>
)}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
