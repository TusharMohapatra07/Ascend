"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  LocationOn,
  Email,
  Link as LinkIcon,
  People,
  GitHub,
  Language,
} from "@mui/icons-material";

export default function Profile() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-[296px] space-y-4"
    >
      <motion.div
        className="relative group"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Image src="https://avatars.githubusercontent.com/u/137442734?v=4" className="w-[296px] h-[296px] rounded-full border border-gray-300 dark:border-gray-700"  width={296} height={296} alt="profile picture"/>
          {/* <People className="w-full h-full p-16 text-gray-400" /> */}
        {/* <Image src="https://avatars.githubusercontent.com/u/137442734?v=4" alt="John Doe" width={296} height={296}  className="w-full h-full p-16 text-gray-400" /> */}
      </motion.div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          John Doe
        </h1>
        <p className="text-xl font-light text-gray-600 dark:text-gray-400">
          @johndoe
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-base text-gray-600 dark:text-gray-300">
          Full-stack developer passionate about open source
        </p>

        <button className="w-full py-1 px-3 text-sm font-semibold border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">
          Follow
        </button>

        <div className="flex flex-col gap-2 text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2 text-sm">
            <LocationOn fontSize="small" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Email fontSize="small" />
            <a
              href="mailto:johndoe@example.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              johndoe@example.com
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <LinkIcon fontSize="small" />
            <a
              href="https://johndoe.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              johndoe.com
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <People fontSize="small" />
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              <span className="font-semibold">1.5k</span> followers
            </a>
            <span>·</span>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              <span className="font-semibold">234</span> following
            </a>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h2 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
          Achievements
        </h2>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            Arctic Code Vault Contributor
          </span>
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
            GitHub Star
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h2 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
          Organizations
        </h2>
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:opacity-75 transition-opacity">
            <GitHub className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </a>
          <a href="#" className="hover:opacity-75 transition-opacity">
            <Language className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </a>
        </div>
      </div>
    </motion.aside>
  );
}
