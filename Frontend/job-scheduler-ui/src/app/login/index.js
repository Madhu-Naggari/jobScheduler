"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { default as Cookies } from "js-cookie";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CardDemo() {
  const router = useRouter();
  useEffect(() => {
    const token = Cookies.get("jwtToken");
    if (token) {
      router.replace("/");
    }
  }, [router]);
  const [User, setUser] = useState({
    email: "",
    password: "",
  });
  const [isError, setIsError] = useState({
    isError: false,
    errorMessage: "",
  });
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsError(() => ({ isError: false, errorMessage: "" }));
    try {
      const userDetails = {
        email: User.email,
        password: User.password,
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      };
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        options
      );
      const data = await res.json();
      if (res.ok) {
        Cookies.set("jwtToken", data.token);
        console.log(data.token);
        router.push("/");
        setIsError(() => ({ isError: false, errorMessage: "" }));
      } else {
        setIsError(() => ({ isError: true, errorMessage: data.message }));
      }
    } catch (err) {
      setIsError(() => ({ isError: true, errorMessage: err.message }));
    }
  };
  return (
    <div className="flex h-dvh w-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">
              <Link href="/register">Sign up</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitForm}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) =>
                    setUser((userDetails) => ({
                      ...userDetails,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  onChange={(e) =>
                    setUser((userDetails) => ({
                      ...userDetails,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
              <p className="text-red-600">
                {isError.isError && isError.errorMessage}
              </p>
              <div className="grid gap-2">
                <CardFooter className="flex-col gap-2">
                  <Button type="submit" className="w-full max-w-sm">
                    Login
                  </Button>
                </CardFooter>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CardDemo;
