
export { auth as proxy} from '@/auth';

//skip static assets/images so auth + cookie logic doesn't run on every asset request
export const config = {
  matcher: ['/((?!_next/static|_next/image|images/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};