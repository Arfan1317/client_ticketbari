import { FaBus, FaEnvelope, FaPhoneAlt, FaFacebookF, FaTwitter, FaInstagram, FaCcStripe, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FaBus className="text-3xl text-primary" />
              <span className="text-2xl font-bold text-white">TicketBari</span>
            </div>
            <p className="opacity-80 mb-6">
              Book bus, train, launch & flight tickets easily from anywhere at any time with confidence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-base-100/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FaFacebookF />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-base-100/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FaTwitter />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-base-100/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/all-tickets" className="hover:text-primary transition-colors">All Tickets</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact Info</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <FaEnvelope className="mt-1 text-primary" />
                <div>
                  <span className="block text-sm opacity-60">Email</span>
                  <a href="mailto:info@ticketbari.com" className="hover:text-primary">info@ticketbari.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaPhoneAlt className="mt-1 text-primary" />
                <div>
                  <span className="block text-sm opacity-60">Phone</span>
                  <a href="tel:+8801234567890" className="hover:text-primary">+880 1234-567890</a>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Payment Methods</h3>
            <p className="opacity-80 mb-4">We accept secure payments through</p>
            <div className="flex gap-4 text-4xl">
              <FaCcStripe className="text-blue-500 bg-white rounded-md p-1" />
              <FaCcVisa className="text-blue-800 bg-white rounded-md p-1" />
              <FaCcMastercard className="text-red-500 bg-white rounded-md p-1" />
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-focus pt-8 text-center text-sm opacity-70">
          <p>&copy; {new Date().getFullYear()} TicketBari. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
