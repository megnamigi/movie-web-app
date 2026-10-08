import { Film, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#4338CA] text-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-6 pt-10 pb-24 md:grid-cols-[2.8fr_1fr_1fr] md:px-20">
        {/* Logo */}
        <div>
        <div className="flex items-center gap-2">
            <Film size={22} strokeWidth={1.8} />
            <span className="text-xl font-bold italic">
                Movie Z
            </span>
        </div>
          <p className="mt-3 text-sm text-white/80">
            © 2024 Movie Z. All Rights Reserved.
          </p>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="mb-4 text-sm font-medium">
            Contact Information
          </h3>

          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={17} />
              <div>
                <p>Email:</p>
                <a href="mailto:support@movieZ.com">
                  support@movieZ.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={17} />
              <div>
                <p>Phone:</p>
                <a href="tel:+976111234567">
                  +976 (11) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="mb-4 text-sm font-medium">
            Follow us
          </h3>

          <div className="flex flex-wrap gap-4 text-sm">
            <a href="https://facebook.com">Facebook</a>
            <a href="https://instagram.com">Instagram</a>
            <a href="https://twitter.com">Twitter</a>
            <a href="https://youtube.com">Youtube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
