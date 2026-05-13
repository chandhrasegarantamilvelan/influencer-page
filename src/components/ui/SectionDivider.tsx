export function SectionDivider() {
  return (
    <div className="flex justify-center py-8" aria-hidden="true">
      <div
        className="h-px w-full max-w-[200px]"
        style={{
          background:
            "linear-gradient(to right, transparent, #D6B24C, transparent)",
        }}
      />
    </div>
  );
}
