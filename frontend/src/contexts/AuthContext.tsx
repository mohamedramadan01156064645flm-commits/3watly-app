"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { resolveDisplayName } from '@/utils/formatName';



export type UserRole = 'owner' | 'admin' | 'user';
export type AccountStatus = 'active' | 'suspended';

export interface User {
  id?: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  targetRole?: string;
  experience?: string;
  location?: string;
  phone?: string;
  createdAt?: string;
  token?: string;
  hasUploadedCv?: boolean;
  onboardingCompleted?: boolean;
  role?: UserRole;
  accountStatus?: AccountStatus;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string; onboardingCompleted?: boolean }>;
  signup: (fullName: string, email: string, password: string) => Promise<{ success: boolean; error?: string; onboardingCompleted?: boolean }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string; redirected?: boolean }>;
  signInWithLinkedIn: () => Promise<{ success: boolean; error?: string; redirected?: boolean }>;
  logout: () => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
  removeAvatar: () => Promise<void>;
  updateFullName: (name: string) => Promise<void>;
  updateTargetRole: (role: string) => Promise<void>;
  updateExperience: (experience: string) => Promise<void>;
  setOnboardingCompleted: (completed: boolean) => Promise<void>;
  deleteAccount: (confirmation?: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function resolveAvatarUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const saveUserState = useCallback((userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem('3watly_user', JSON.stringify(userData));
      if (userData.token) {
        localStorage.setItem('3watly_token', userData.token);
      }
    } catch (e) {
      console.warn('Failed to save user state to localStorage:', e);
    }
  }, []);

  // Initialize Supabase & restore session
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    const initAuth = async () => {
      try {
        // 1. Try Supabase Auth Session
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && isMounted) {
            const metadata = session.user.user_metadata || {};
            const resolvedName = resolveDisplayName({
              fullName: metadata.full_name || metadata.name,
              oauthName: metadata.preferred_username || metadata.user_name,
              email: session.user.email
            });

            // Fetch profile record from database
            let onboardingCompleted = metadata.onboarding_completed ?? false;
            let avatarUrl = metadata.avatar_url || metadata.picture || null;
            let fullName = resolvedName;
            let role: UserRole = 'user';
            let accountStatus: AccountStatus = 'active';

            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, onboarding_completed, avatar_url, role, account_status')
                .eq('id', session.user.id)
                .maybeSingle();

              if (profile) {
                if (profile.full_name) {
                  fullName = profile.full_name;
                }
                if (profile.onboarding_completed !== undefined) {
                  onboardingCompleted = profile.onboarding_completed === true;
                }
                if (profile.avatar_url) {
                  avatarUrl = profile.avatar_url;
                }
                if (profile.role) {
                  role = profile.role as UserRole;
                }
                if (profile.account_status) {
                  accountStatus = profile.account_status as AccountStatus;
                }
              }
            } catch (e) {
              console.warn('Profile fetch warning:', e);
            }

            const parsedUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              fullName,
              avatarUrl,
              targetRole: metadata.target_role || undefined,
              createdAt: session.user.created_at,
              token: session.access_token,
              onboardingCompleted,
              hasUploadedCv: metadata.has_uploaded_cv ?? false,
              role,
              accountStatus,
            };

            saveUserState(parsedUser);
            setLoading(false);
            return;
          }
        }

        // 2. Fallback to LocalStorage session
        const storedUser = localStorage.getItem('3watly_user') || localStorage.getItem('majra_user');
        if (storedUser && isMounted) {
          const parsed = JSON.parse(storedUser);
          if (parsed.fullName === 'Ahmed H.' || parsed.fullName === 'Ahmed Salah' || parsed.fullName === 'Ahmed Amr') {
            parsed.fullName = resolveDisplayName({ email: parsed.email });
          }
          setUser(parsed);
        }
      } catch (e) {
        console.error('Error restoring session:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    // Listen to Supabase auth state changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          const metadata = session.user.user_metadata || {};
          const resolvedName = resolveDisplayName({
            fullName: metadata.full_name || metadata.name,
            oauthName: metadata.preferred_username,
            email: session.user.email
          });

          let onboardingCompleted = metadata.onboarding_completed ?? false;
          let avatarUrl = metadata.avatar_url || metadata.picture || null;
          let fullName = resolvedName;
          let role: UserRole = 'user';
          let accountStatus: AccountStatus = 'active';

          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, onboarding_completed, avatar_url, role, account_status')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile) {
              if (profile.full_name) {
                fullName = profile.full_name;
              }
              if (profile.onboarding_completed !== undefined) {
                onboardingCompleted = profile.onboarding_completed === true;
              }
              if (profile.avatar_url) {
                avatarUrl = profile.avatar_url;
              }
              if (profile.role) {
                role = profile.role as UserRole;
              }
              if (profile.account_status) {
                accountStatus = profile.account_status as AccountStatus;
              }
            }
          } catch (e) {
            console.warn('Profile fetch warning in onAuthStateChange:', e);
          }

          const authenticatedUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            fullName,
            avatarUrl,
            targetRole: metadata.target_role,
            token: session.access_token,
            onboardingCompleted,
            hasUploadedCv: metadata.has_uploaded_cv ?? false,
            role,
            accountStatus,
          };

          saveUserState(authenticatedUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('3watly_user');
          localStorage.removeItem('3watly_token');
          localStorage.removeItem('majra_user');
          localStorage.removeItem('majra_token');
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      isMounted = false;
    };
  }, [saveUserState]);

  // Email & Password Login with explicit Remember Me support
  const login = async (email: string, password: string, remember: boolean = true) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password
        });

        if (!error && data.user) {
          const metadata = data.user.user_metadata || {};
          const resolvedName = resolveDisplayName({
            fullName: metadata.full_name || metadata.name,
            email: data.user.email
          });

          let onboardingCompleted = metadata.onboarding_completed === true;
          let avatarUrl = metadata.avatar_url || null;
          let fullName = resolvedName;

          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profile) {
              if (profile.full_name) {
                fullName = profile.full_name;
              }
              if (profile.onboarding_completed !== undefined) {
                onboardingCompleted = profile.onboarding_completed === true;
              }
              if (profile.avatar_url) {
                avatarUrl = profile.avatar_url;
              }
            }
          } catch (e) {
            console.warn('Error querying profiles table during login:', e);
          }

          const userData: User = {
            id: data.user.id,
            email: data.user.email || cleanEmail,
            fullName,
            avatarUrl,
            token: data.session?.access_token,
            onboardingCompleted
          };

          // Remember Me Logic:
          if (remember) {
            saveUserState(userData);
            try {
              localStorage.setItem('3watly_remember_email', cleanEmail);
            } catch {}
          } else {
            setUser(userData);
            try {
              sessionStorage.setItem('3watly_user', JSON.stringify(userData));
              localStorage.removeItem('3watly_remember_email');
            } catch {}
          }

          return { success: true, onboardingCompleted };
        }
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: false, error: 'Login failed. Please try again.' };
      }
      return { success: false, error: 'Supabase is not configured.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'An unexpected error occurred.' };
    }
  };

  // Password Reset Link
  const resetPassword = async (email: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const supabase = createClient();
      if (supabase) {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${origin}/forgot-password?mode=reset`,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send reset email.' };
    }
  };

  // Email & Password Signup (Always starts as New User)
  const signup = async (fullName: string, email: string, password: string) => {
    try {
      const resolvedName = resolveDisplayName({ fullName, email });
      const supabase = createClient();

      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: resolvedName,
              onboarding_completed: false
            }
          }
        });

        if (!error && data.user) {
          // Persist to profiles table
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: data.user.email || email,
              full_name: resolvedName,
              avatar_url: null,
              onboarding_completed: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          } catch (pErr) {
            console.warn('Profile creation fallback:', pErr);
          }

          const userData: User = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: resolvedName,
            avatarUrl: null,
            token: data.session?.access_token,
            onboardingCompleted: false
          };
          saveUserState(userData);
          return { success: true, onboardingCompleted: false };
        }
        if (error) {
          return { success: false, error: error.message };
        }
        return { success: false, error: 'Signup failed. Please try again.' };
      }
      return { success: false, error: 'Supabase is not configured.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'An unexpected error occurred during signup.' };
    }
  };

  // Google OAuth via Supabase Auth with Account Chooser Prompt
  const signInWithGoogle = async () => {
    try {
      const supabase = createClient();
      if (!supabase) {
        return { success: false, error: 'Supabase credentials are not configured.' };
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.url) {
        window.location.href = data.url;
        return { success: true, redirected: true };
      }

      return { success: false, error: 'No authorization URL received from Google provider.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to initialize Google authentication.' };
    }
  };

  // LinkedIn OAuth via Supabase Auth
  const signInWithLinkedIn = async () => {
    try {
      const supabase = createClient();
      if (!supabase) {
        return { success: false, error: 'Supabase credentials are not configured.' };
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc' as any,
        options: {
          redirectTo: `${origin}/auth/callback`
        }
      });

      if (!error && data?.url) {
        window.location.href = data.url;
        return { success: true, redirected: true };
      }

      const retry = await supabase.auth.signInWithOAuth({
        provider: 'linkedin' as any,
        options: {
          redirectTo: `${origin}/auth/callback`
        }
      });

      if (!retry.error && retry.data?.url) {
        window.location.href = retry.data.url;
        return { success: true, redirected: true };
      }

      return { success: false, error: error?.message || retry.error?.message || 'LinkedIn provider authentication failed.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to initialize LinkedIn authentication.' };
    }
  };


  const logout = async () => {
    const supabase = createClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut warning:', e);
      }
    }
    
    // Clear only session tokens and active user, preserving user-scoped CV and preferences
    setUser(null);
    localStorage.removeItem('3watly_user');
    localStorage.removeItem('3watly_token');
    localStorage.removeItem('majra_user');
    localStorage.removeItem('majra_token');
    localStorage.removeItem('3watly_cv_draft');
  };

  // Upload Avatar to permanent Supabase Storage & Profile table
  const updateAvatar = async (file: File) => {
    if (!user) return;

    try {
      // 1. Immediate optimistic preview
      const localPreviewUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      setUser((prev) => (prev ? { ...prev, avatarUrl: localPreviewUrl } : prev));

      // 2. Upload via Server API Route with Service Role Key
      const formData = new FormData();
      formData.append('file', file);
      if (user.id) {
        formData.append('userId', user.id);
      }

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.avatarUrl) {
          const finalUser = { ...user, avatarUrl: data.avatarUrl };
          saveUserState(finalUser);
          return;
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn('Avatar API upload warning:', errData.error);
      }
    } catch (err) {
      console.error('Failed to process avatar file:', err);
    }
  };

  // Remove Avatar
  const removeAvatar = async () => {
    if (!user) return;
    const updated = { ...user, avatarUrl: null };
    saveUserState(updated);

    try {
      const q = user.id ? `?userId=${encodeURIComponent(user.id)}` : '';
      await fetch(`/api/user/avatar${q}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Error calling DELETE /api/user/avatar:', e);
    }
  };

  const updateFullName = async (name: string) => {
    if (!user) return;
    const cleanName = name.trim();
    if (!cleanName) return;

    const updated = { ...user, fullName: cleanName };
    saveUserState(updated);

    const supabase = createClient();
    if (supabase && user.id) {
      try {
        await supabase.auth.updateUser({
          data: { full_name: cleanName }
        });
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: cleanName,
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Supabase name update error:', e);
      }
    }
  };

  const updateTargetRole = async (role: string) => {
    if (!user) return;
    const updated = { ...user, targetRole: role };
    saveUserState(updated);

    const supabase = createClient();
    if (supabase && user.id) {
      try {
        await supabase.auth.updateUser({
          data: { target_role: role }
        });
        await supabase.from('profiles').upsert({
          id: user.id,
          target_role: role,
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Supabase targetRole update error:', e);
      }
    }
  };

  const updateExperience = async (experience: string) => {
    if (!user) return;
    const updated = { ...user, experience };
    saveUserState(updated);

    const supabase = createClient();
    if (supabase && user.id) {
      try {
        await supabase.auth.updateUser({
          data: { experience }
        });
        await supabase.from('profiles').upsert({
          id: user.id,
          experience,
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Supabase experience update error:', e);
      }
    }
  };

  const setOnboardingCompleted = async (completed: boolean) => {
    if (!user) return;
    const updated = { ...user, onboardingCompleted: completed };
    saveUserState(updated);

    const supabase = createClient();
    if (supabase && user.id) {
      try {
        await supabase.auth.updateUser({
          data: { onboarding_completed: completed }
        });
        await supabase.from('profiles').upsert({
          id: user.id,
          onboarding_completed: completed,
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Supabase onboardingCompleted update error:', e);
      }
    }
  };

  // Permanently delete authenticated user account, related records & session
  const deleteAccount = async (confirmation: string = 'DELETE') => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      } else {
        const supabase = createClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
          }
        }
      }

      const res = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ confirmation }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          error: data?.error || 'Unable to delete your account right now. Please try again.',
        };
      }

      // Invalidate session, tokens, cookies, and client storage
      await logout();
      return { success: true };
    } catch (err: any) {
      console.error('deleteAccount error in AuthContext:', err);
      return {
        success: false,
        error: err?.message || 'A network error occurred while deleting your account.',
      };
    }
  };

  const isOwner = user?.role === 'owner';
  const isAdmin = user?.role === 'admin' || isOwner;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isOwner,
        login,
        signup,
        resetPassword,
        signInWithGoogle,
        signInWithLinkedIn,
        logout,
        updateAvatar,
        removeAvatar,
        updateFullName,
        updateTargetRole,
        updateExperience,
        setOnboardingCompleted,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
