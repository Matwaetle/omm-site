import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function InstallLayout({
  children,
}: LayoutProps<"/install">) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
