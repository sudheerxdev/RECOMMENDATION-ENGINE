'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button';
import { authStorage } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { parseTags } from '@/lib/utils';
import type { ExperienceLevel } from '@/lib/types';

export const RegisterForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('entry');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiClient.register({
        name,
        email,
        password,
        skills: parseTags(skills),
        interests: parseTags(interests),
        experienceLevel
      });
      authStorage.setToken(response.token);
      authStorage.setUser(response.user);
      toast.success('Account created');
      router.push('/dashboard');
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Start generating personalized career recommendations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-3">
          <GoogleSignInButton label="Sign up with Google" />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="experience">Experience Level</Label>
            <Select
              id="experience"
              value={experienceLevel}
              onChange={(event) => setExperienceLevel(event.target.value as ExperienceLevel)}
            >
              <option value="entry">Entry</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="skills">Skills</Label>
            <Input
              id="skills"
              placeholder="python, sql, react"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="interests">Interests</Label>
            <Input
              id="interests"
              placeholder="ai, product building, analytics"
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
            />
          </div>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
