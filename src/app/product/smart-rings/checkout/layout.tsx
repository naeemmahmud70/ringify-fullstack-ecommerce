export default function CheckoutLayout({
  children,
  modal, // parallel route slot
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* Main Checkout Content */}
      <div>{children}</div>

      {/* Parallel Modal Slot (renders if route matches) */}
      {modal}
    </div>
  );
}
