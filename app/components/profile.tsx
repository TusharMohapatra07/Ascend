"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  LocationOn,
  Email,
  Link as LinkIcon,
  People,
  GitHub,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface MongoUserData {
  bio?: string;
  location?: string;
  website?: string;
  followers?: number;
  following?: number;
  achievements?: string[];
  organizations?: { name: string; link: string }[];
}

export default function Profile() {
  const { data: session } = useSession();
  const [mongoData, setMongoData] = useState<MongoUserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/user?email=${session.user.email}`);
          if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.statusText}`);
          }
          const data: MongoUserData = await response.json();
          setMongoData(data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  if (!session) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        Please sign in to view your profile.
      </p>
    );
  }

  const user = session.user;

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
          src={user.image || "/default-avatar.png"}
          className="w-[296px] h-[296px] rounded-full border border-gray-300 dark:border-gray-700"
          width={296}
          height={296}
          alt={`${user.name || "User"}'s profile picture`}
        />
      </motion.div>

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {user.name || "Anonymous"}
        </h1>
        <p className="text-xl font-light text-gray-600 dark:text-gray-400">
          @{user.name?.toLowerCase().replace(/\s+/g, "") || "unknown"}
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-base text-gray-600 dark:text-gray-300">
          {mongoData?.bio || "Full-stack developer passionate about open source"}
        </p>

        <button className="w-full py-1 px-3 text-sm font-semibold border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">
          Follow
        </button>

        <div className="flex flex-col gap-2 text-gray-600 dark:text-gray-400">
          {mongoData?.location && (
            <div className="flex items-center gap-2 text-sm">
              <LocationOn fontSize="small" />
              <span>{mongoData.location}</span>
            </div>
          )}
          {user.email && (
            <div className="flex items-center gap-2 text-sm">
              <Email fontSize="small" />
              <a
                href={`mailto:${user.email}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {user.email}
              </a>
            </div>
          )}
          {mongoData?.website && (
            <div className="flex items-center gap-2 text-sm">
              <LinkIcon fontSize="small" />
              <a
                href={mongoData.website}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {mongoData.website}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <People fontSize="small" />
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              <span className="font-semibold">
                {mongoData?.followers || 0}
              </span>{" "}
              followers
            </a>
            <span>·</span>
            <a
              href="#"
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              <span className="font-semibold">
                {mongoData?.following || 0}
              </span>{" "}
              following
            </a>
          </div>
        </div>
      </div>

      {mongoData?.achievements?.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
            Achievements
          </h2>
          <div className="flex flex-wrap gap-2">
            {mongoData.achievements.map((achievement, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
              >
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}

      {mongoData?.organizations?.length > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">
            Organizations
          </h2>
          <div className="flex flex-wrap gap-2">
            {mongoData.organizations.map((org, idx) => (
              <a
                key={idx}
                href={org.link}
                className="hover:opacity-75 transition-opacity"
              >
                <GitHub className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.aside>
  );
}
