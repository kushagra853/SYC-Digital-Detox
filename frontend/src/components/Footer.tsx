import { motion } from "framer-motion"; // Corrected import
import { Heart, MapPin, Phone, Instagram, Linkedin } from "lucide-react";

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
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src="/logo.png" alt="Digital Detox Logo" className="w-8 h-8" />
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
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-green-300 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">ABESEC, Ghaziabad</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">+91 XXX XXX XXXX</span>
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
            <div className="flex gap-3">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white/10 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white/10 hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-sm text-gray-300">
              <p className="text-green-300 mb-2">Organized by:</p>
              <p>Sanjeevani and Yoga Club</p>
              <p className="text-xs text-gray-400 mt-1">
                The Fitness Club of ABESEC
              </p>
              <br />
              <p>Ms. Aditi Karn</p>
              <p>(General Secretary)</p>
              <br />
              <p>Ms. Shweta Choudhary</p>
              <p>(Club Counsellor)</p>
            </div>
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
