'use client';

import MainLayout from '@/app/components/layout/MainLayout';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
