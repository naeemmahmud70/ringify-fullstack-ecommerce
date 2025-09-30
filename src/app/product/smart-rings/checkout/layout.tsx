export const metadata = {
  title: "Ringify | Checkout",
};

export default function CheckoutLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div>{children}</div>
      {modal}
    </div>
  );
}
