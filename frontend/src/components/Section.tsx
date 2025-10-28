export default function Section({
  title,
  children,
  className = "",
  bandClass = "",
}: any) {
  // If bandClass is provided, render a centered decorative band behind the container
  return (
    <section className={`py-16 ${className}`}>
      {bandClass ? (
        <div className="relative">
          <div
            aria-hidden
            className="absolute inset-0 flex justify-center -z-0"
          >
            <div className={`w-full max-w-7xl h-full ${bandClass}`} />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {title && (
              <h2 className="text-3xl font-semibold mb-6 text-champagne-contrast">
                {title}
              </h2>
            )}
            {children}
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4">
          {title && (
            <h2 className="text-3xl font-semibold mb-6 text-champagne-contrast">
              {title}
            </h2>
          )}
          {children}
        </div>
      )}
    </section>
  );
}
