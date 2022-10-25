import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/client";
import { useRouter } from "next/router";
import Button from "../../Components/shared/Button";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setEmail(emailRef.current?.value!);
        setPassword(passwordRef.current?.value!);
    }, []);

    const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        try {
            const { error } = await supabase.auth.signIn(
                { email: email, password: password },
                { shouldCreateUser: false }
            );

            if (error) {
                throw error;
            }

            router.push("/admin/product/1", "/admin/product/1");
        } catch (error: any) {
            console.log("error", error.message);
        }
    };

    const handleOnChangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    };

    const handleOnChangePassword = (e: React.FormEvent<HTMLInputElement>) => {
        setPassword(e.currentTarget.value);
    };

    return (
        <div>
            <form
                className="flex w-fit flex-col items-center justify-center text-sm sm:text-base"
                onSubmit={handleOnSubmit}
            >
                <label className="block">
                    <span className="block text-base font-medium text-slate-700">
                        E-Mail
                    </span>
                    <input
                        ref={emailRef}
                        type="email"
                        className="focus:border-1 mt-1 mb-2 block w-60 rounded-md border border-solid border-slate-300 px-2 py-3 text-base font-medium text-slate-700 placeholder-slate-400 shadow-sm autofill:text-sm autofill:font-medium invalid:border-pink-500 invalid:text-pink-600 focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:invalid:border-2 focus:invalid:border-pink-500"
                        placeholder="my@email.com"
                        value={email}
                        onChange={handleOnChangeEmail}
                    ></input>
                </label>
                <label className="block">
                    <span className="block text-base font-medium text-slate-700">
                        Password
                    </span>
                    <input
                        ref={passwordRef}
                        type="password"
                        className="focus:border-1 mt-1 mb-2 block w-60 rounded-md border border-solid border-slate-300 px-2 py-3 text-base font-medium text-slate-700 placeholder-slate-400 shadow-sm autofill:text-sm autofill:font-medium invalid:border-pink-500 invalid:text-pink-600 focus:border-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-700 focus:invalid:border-2 focus:invalid:border-pink-500"
                        value={password}
                        onChange={handleOnChangePassword}
                    ></input>
                </label>
                <div className="mt-7">
                    <Button type="submit" content={"Submit"} />
                </div>
            </form>
        </div>
    );
}
