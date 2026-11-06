export default function LogListLoading() {
  return (
    <div role="status">
      <span className="sr-only">Loading practice logs</span>
      <div aria-hidden="true">
        <div className="flex items-center justify-between border-b border-foreground/10 px-8 py-4">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-8 w-24 rounded bg-muted" />
        </div>
        <div className="divide-y divide-foreground/10">
          {[0, 1, 2].map((row) => (
            <div key={row} className="px-8 py-7">
              <div className="h-9 w-52 max-w-full rounded bg-muted" />
              <div className="mt-1 h-5 w-28 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
