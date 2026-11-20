// Every section renders on the single page at `/`; old routes redirect via public/_redirects.
export default function PagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main id="main-content" className="site-main">{children}</main>;
}
