'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signInWithCredentials } from '@/lib/actions/user.actions';

const initialState = {
    success: false,
    message: '',
};

const SignInPage = () => {
  const [data, action, pending] = useActionState(signInWithCredentials, initialState)


    return (
        <form action={action} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="you@example.com"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Enter your password"
                />
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
                {pending ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className='text-sm text-center text-muted-foreground'>
                Dont&apos;t have an account?{' '}
                <Link href='/sign-up' target='_self' className='link'>Sign Up</Link>
            </div>
            { data && !data.success && (
               <p className='text-center text-destructive'>{data.message}</p>
            ) }
        </form>
    );
};

export default SignInPage;