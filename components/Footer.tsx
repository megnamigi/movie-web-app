import { Film, Mail, Phone } from "lucide-react";
export default function Footer() {
  return <footer className="w-full bg-[#4338CA] text-white">
    <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] gap-x-6 gap-y-8 px-5 py-8 md:grid-cols-[2.8fr_1fr_1fr] md:gap-10 md:px-20 md:pb-24 md:pt-10">
      <div className="col-span-2 md:col-span-1"><div className="flex items-center gap-2"><Film size={20} strokeWidth={1.8} /><span className="text-lg font-bold italic md:text-xl">Movie Z</span></div><p className="mt-3 text-sm">© 2024 Movie Z. All Rights Reserved.</p></div>
      <div><h3 className="mb-4 text-sm font-normal">Contact Information</h3><div className="space-y-5 text-sm">
        <div className="flex items-start gap-3"><Mail size={16} className="mt-1 shrink-0" /><div className="min-w-0"><p>Email:</p><a href="mailto:support@movieZ.com" className="break-words">support@movieZ.com</a></div></div>
        <div className="flex items-start gap-3"><Phone size={16} className="mt-1 shrink-0" /><div><p>Phone:</p><a href="tel:+976111234567">+976 (11) 123-4567</a></div></div>
      </div></div>
      <div><h3 className="mb-4 text-sm font-normal">Follow us</h3><div className="flex flex-col gap-3 text-sm md:flex-row md:flex-wrap md:gap-4"><a href="https://facebook.com">Facebook</a><a href="https://instagram.com">Instagram</a><a href="https://twitter.com">Twitter</a><a href="https://youtube.com">Youtube</a></div></div>
    </div>
  </footer>;
}
