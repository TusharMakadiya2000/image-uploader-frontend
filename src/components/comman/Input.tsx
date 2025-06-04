/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "react";
import { useState } from "react";

const Input = (props: any) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
        <div className="">
            {props.label && (
                <label
                    htmlFor={props.id}
                    className="block text-sm text-text font-medium leading-6"
                >
                    {props.label}
                    {props.required && (
                        <span className="text-red-600 ml-1">*</span>
                    )}
                </label>
            )}
            <div className="relative">
                <input
                    type={
                        (props.type === "password"
                            ? !showPassword
                                ? props.type
                                : "text"
                            : props.type) || "text"
                    }
                    name={props.name}
                    className={`w-full p-1.5 rounded-md border ring-0 border-border outline-none text-text placeholder:text-gray-400 sm:text-sm ${
                        props.class ? props.class : ""
                    } ${props.preIcon ? "pl-10" : ""}`}
                    placeholder={props.placeholder || ""}
                    onChange={props.onChange}
                    disabled={props.disabled}
                    {...(props.register &&
                        props.register(props.name, {
                            onChange: (e: any) => {
                                props.setValue &&
                                    props.setValue(props.name, e.target.value);

                                props.trigger && props.trigger(props.name);
                            },
                        }))}
                />
                {props.error && (
                    <div className="text-red-600">{props.error}</div>
                )}
            </div>
        </div>
    );
};

export default Input;
