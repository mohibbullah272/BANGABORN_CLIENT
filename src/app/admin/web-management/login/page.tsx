import { verifyAdminToken } from '@/actions/Admin.action';
import { AdminLoginForm } from '@/components/AdminLoginForm';
import { redirect } from 'next/navigation';


export default async function AdminLoginPage() {
  // If already authenticated, redirect to dashboard
  const isAuth = await verifyAdminToken();
  if (isAuth) {
    redirect('/admin/web-management');
  }

  return <AdminLoginForm />;
}

export const metadata = {
  title: 'Admin Login · Bangaborn',
  robots: { index: false, follow: false },
};