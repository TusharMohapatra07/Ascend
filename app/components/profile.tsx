"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  LocationOn,
  Email,
  GitHub,
  Language,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  // Fallback values in case session data is unavailable
  const profileImage = session?.user?.image || "/default-profile.jpg";
  const name = session?.user?.name || "John Doe";
  const username = session?.user?.email?.split("@")[0] || "johndoe";
  const email = session?.user?.email || "johndoe@example.com";

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
        <Image
          src={profileImage}
          className="w-[296px] h-[296px] rounded-full border border-gray-300 dark:border-gray-700"
          width={296}
          height={296}
          alt="profile picture"
        />
      </motion.div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {name}
        </h1>
        <p className="text-xl font-light text-gray-600 dark:text-gray-400">
          @{username}
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
            <span>India</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Email fontSize="small" />
            <a
              href={`mailto:${email}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {email}
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
