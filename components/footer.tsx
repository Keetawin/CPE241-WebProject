import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#060047] py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-4">Contact Us</h3>
            <p className="text-white">
              <FaPhone className="inline-block mr-2" />
              02 470 9387
            </p>
            <p className="text-white">
              <FaEnvelope className="inline-block mr-2" />
              contact@cpe.kmutt.ac.th
            </p>
            <p className="text-white">
              <FaMapMarkerAlt className="inline-block mr-2" />
              126 Pracha Uthit Rd, Bang Mot, Thung Khru, Bangkok 10140
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-4">Explore</h3>
            <ul className="text-white">
              <li className="mb-2">
                <Link href="#" className="hover:text-gray-200">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="hover:text-gray-200">
                  Events
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="hover:text-gray-200">
                  Tickets
                </Link>
              </li>
              <li className="mb-2">
                <Link href="#" className="hover:text-gray-200">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
            <div className="flex items-center justify-center md:justify-start">
              <Link
                href="#"
                className="text-white hover:text-white mr-4"
                aria-label="Facebook"
              >
                <FaFacebook className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-white hover:text-white mr-4"
                aria-label="Linkedin"
              >
                <FaLinkedin className="h-6 w-6" />
              </Link>
              <Link
                href="#"
                className="text-white hover:text-white"
                aria-label="Instagram"
              >
                <FaInstagram className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t bg-[#060047] pt-8 mt-8 text-white text-center">
          <p>
            &copy; {new Date().getFullYear()} Evento, CPE35 REG 1005 1006 1042
            1087. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
