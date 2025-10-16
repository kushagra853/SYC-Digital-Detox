import { motion } from "framer-motion";
import { User, MapPin, Phone } from "lucide-react";
import Instagram from "../assets/instagram.svg";
import WhatsApp from "../assets/whatsapp.svg";
import Linkedin from "../assets/linkedin.svg";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-green-600/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div
          className="absolute w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-800 via-white/10 to-zinc-700/10 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                <img
                  src="/logo.webp"
                  alt="Digital Detox Logo"
                  className="w-11 h-11"
                />
              </div>
              <div>
                <div className="text-lg">Digital Detox</div>
                <div className="text-xs text-green-300">SYC Initiative</div>
              </div>
            </div>
            <p className="text-sm text-gray-300">
              "Unplug to Recharge: Balance Your Screen, Reclaim Your Life"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-green-300 mb-4">Organized by</h3>
            <div className="text-sm text-gray-300">
              <p>Sanjeevani and Yoga Club</p>
              <p className="text-xs text-gray-400 mt-1">
                The Fitness Club of ABESEC
              </p>
              <div className="mt-4">
                <p>Ms. Shweta Choudhary</p>
                <p className="text-xs text-gray-400 mt-1">(Club Counsellor)</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-green-300 font-semibold mb-4">Contact</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                <span className="leading-relaxed">ABESEC, Ghaziabad</span>
              </li>

              <li className="space-y-2">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-200">Ms. Aditi Karn</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      (General Secretary)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <a
                    href="tel:+918076599167"
                    className="hover:text-green-300 transition-colors"
                  >
                    +91 80765 99167
                  </a>
                </div>
              </li>

              <li className="space-y-2">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-green-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-200">Mr. Vivek</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <a
                    href="tel:+918368357994"
                    className="hover:text-green-300 transition-colors"
                  >
                    +91 83683 57994
                  </a>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-green-300 mb-4">Follow Us</h3>
            <div className="flex gap-3 mb-6">
              <motion.a
                href="https://www.instagram.com/syc_abesec/"
                target="_blank"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              >
                <img src={Instagram} alt="Instagram" className="w-8 h-8" />
              </motion.a>
              <motion.a
                href="https://chat.whatsapp.com/IWsftEIpf0iErfQo34ho6s?mode=wwc"
                target="_blank"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              >
                <img src={WhatsApp} alt="WhatsApp" className="w-8 h-8" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/syc-abesec-655878216/"
                target="_blank"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
              >
                <img src={Linkedin} alt="Linkedin" className="w-8 h-8" />
              </motion.a>
            </div>

            {/* <div className="grid grid-cols-2 gap-4">
              <div className="relative p-2 bg-white rounded-xl shadow-lg transform rotate-3 hover:rotate-6 transition-transform group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 opacity-20 rounded-xl blur-sm group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-white p-2 rounded-lg flex flex-col items-center justify-center aspect-square">
                  <img
                    src="/InstagramQR.png"
                    alt="Instagram QR"
                    className="w-24 h-24"
                  />
                </div>
              </div>
              <div className="relative p-2 bg-white rounded-xl shadow-lg transform -rotate-3 hover:-rotate-6 transition-transform group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-600 opacity-20 rounded-xl blur-sm group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-white p-2 rounded-lg flex flex-col items-center justify-center aspect-square">
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                    <img src="/WhatsAppQR.png" alt="WhatsApp QR" />
                  </div>
                </div>
              </div>
            </div> */}
          </motion.div>
        </div>

        <div className="border-t border-white/10 pt-6 mt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>Made with ❤️ by SYC Club</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
