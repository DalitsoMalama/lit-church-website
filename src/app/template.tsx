// Re-mounts on every navigation, giving each page a gentle CSS fade-in
// (replaces <ViewTransition>, which errored on rapid navigation).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
