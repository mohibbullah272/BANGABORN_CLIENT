import { redirect } from 'next/navigation';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { fetchAdminOrders, fetchAdminProducts, verifyAdminToken } from '@/actions/Admin.action';
import { AdminDashboard } from '@/components/AdminDashboard';



async function getAdminEmail(): Promise<string> {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) return '';
  try {
    const decoded = jwt.decode(token) as { email?: string };
    return decoded?.email ?? '';
  } catch {
    return '';
  }
}

export default async function WebManagementPage() {
  // Auth guard
  const isAuth = await verifyAdminToken();
  if (!isAuth) {
    redirect('/admin/web-management/login');
  }

  // Parallel data fetching
  const [ordersRes, productsRes, adminEmail] = await Promise.all([
    fetchAdminOrders({ page: 1, limit: 50 }),
    fetchAdminProducts({ limit: "50" }),
    getAdminEmail(),
  ]);

  return (
    <AdminDashboard
      orders={ordersRes.orders ?? []}
      ordersTotal={ordersRes.orders.length ?? 0}
      products={productsRes.products ?? []}
      productsTotal={productsRes.products.length?? 0}
      adminEmail={adminEmail}
    />
  );
}

export const metadata = {
  title: 'Web Management · Bangaborn',
  robots: { index: false, follow: false },
};