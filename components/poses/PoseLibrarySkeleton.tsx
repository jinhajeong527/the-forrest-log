export default function PoseLibrarySkeleton() {
  return (
    <div role="status">
      <span className="sr-only">Loading poses</span>
      <div aria-hidden="true">
        <div className="border-b border-foreground/10">
          <div className="mx-auto max-w-5xl px-4 pt-5 pb-3">
            <div className="flex gap-2 overflow-hidden">
              {[14, 28, 30, 25, 32, 33, 26, 20, 19].map((width) => (
                <div
                  key={width}
                  className="h-[42px] shrink-0 rounded-sm bg-muted"
                  style={{ width: `${width / 4}rem` }}
                />
              ))}
            </div>
          </div>
          <div className="border-t border-foreground/10">
            <div className="mx-auto flex max-w-5xl justify-end px-4 py-2">
              <div className="h-8 w-44 rounded-sm bg-muted" />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {[0, 1, 2, 3].map((card) => (
              <div
                key={card}
                className="flex aspect-[2/3] flex-col rounded-sm border border-foreground/25 px-2 py-3"
              >
                <div className="mx-auto mb-2 w-3/4 flex-1 rounded-sm bg-muted" />
                <div className="border-t border-foreground/12 pt-2">
                  <div className="mx-auto h-[17.5px] w-1/2 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
