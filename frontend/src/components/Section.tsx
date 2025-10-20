export default function Section({ title, children, className = "" }: any) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-semibold mb-6 text-champagne-contrast">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
