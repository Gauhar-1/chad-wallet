import { redirect } from 'next/navigation';
import { SOL_MINT } from '@/lib/constants';

export default function TradePage() {
  // Default to SOL trading page
  redirect(`/trade/${SOL_MINT}`);
}
