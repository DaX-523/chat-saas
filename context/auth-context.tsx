"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  AuthState,
  AuthContextType,
  LoginCredentials,
  SignupCredentials,
  AuthUser,
} from "@/lib/auth-types";
import { authUsers } from "@/lib/auth-data";
import { supabase } from "@/lib/supabase";
import { genSalt, compare, hash } from "bcrypt";

// Initial auth state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const router = useRouter();

  // Check for stored auth on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("auth_user");

        if (storedUser) {
          const user = JSON.parse(storedUser) as AuthUser;
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Authentication failed",
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      if (error) {
        throw new Error("Invalid email or password");
      }
      const response = await supabase
        .from("users")
        .select()
        .eq("id", data?.user?.id);

      if (response.error) {
        throw response.error;
      }
      if (response.data) {
        const user = response?.data[0];
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        // Store auth in localStorage if remember is checked
        if (credentials.remember) {
          localStorage.setItem("auth_user", JSON.stringify(user));
        }

        // Redirect to chat app
        router.push("/");
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Login failed",
      }));
    }
  };

  // Signup function
  const signup = async (credentials: SignupCredentials) => {
    try {
      // Validate password match
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.name,
          },
        },
      });
      if (error) {
        if (error.code === "23505") {
          console.error("Email already exists. Please log in.");
        } else {
          console.error("Signup error:", error.message);
        }
        throw error;
      }

      // Create new user
      const newUser: AuthUser = {
        id: data?.user?.id as string,
        name: credentials.name,
        isOnline: true,
        created_at: data?.user?.created_at as string,
      };

      const response = await supabase.from("users").insert(newUser);

      if (response.error) {
        throw response.error;
      }

      if (response.status === 201) {
        setAuthState({
          user: newUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        localStorage.setItem("auth_user", JSON.stringify(newUser));

        router.push("/");
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Signup failed",
      }));
    }
  };

  // Logout function
  const logout = () => {
    // Clear stored auth
    localStorage.removeItem("auth_user");

    // Reset state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    // Redirect to login
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ authState, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
