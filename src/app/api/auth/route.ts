import { getInternalToken } from '@/services/aps';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const res = await getInternalToken();
  return Response.json(res);
}
