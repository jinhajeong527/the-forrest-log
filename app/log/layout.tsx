import PageHeader from "@/components/common/PageHeader";

export default function LogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col bg-background">
      <PageHeader title="Practice Log" />
      {children}
    </div>
  );
}
