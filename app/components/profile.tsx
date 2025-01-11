'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPinIcon, MailIcon, LinkIcon, ChevronDownIcon, Users } from 'lucide-react';

export default function Profile() {
  return (
    <motion.aside 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full max-w-[296px] space-y-6"
    >
      <motion.div 
        className="relative group"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Image
          src="/public/file.jpg"
          alt="Profile"
          width={296}
          height={296}
          className="rounded-full ring-2 ring-border transition-all duration-200 group-hover:ring-accent/50"
        />
        <div className="absolute inset-0 rounded-full bg-accent/0 group-hover:bg-accent/5 transition-colors duration-200" />
      </motion.div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">John Doe</h1>
        <p className="text-muted-foreground">@johndoe</p>
      </div>

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-sm text-muted-foreground">Full-stack developer passionate about open source</p>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPinIcon className="w-4 h-4" />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MailIcon className="w-4 h-4" />
            <a href="mailto:johndoe@example.com" className="hover:underline">johndoe@example.com</a>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <LinkIcon className="w-4 h-4" />
            <a href="https://johndoe.com" className="hover:underline">johndoe.com</a>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>1.5k followers · 234 following</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="button-primary flex-1">Follow</button>
          <button className="button-secondary">
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-semibold text-lg">Highlights</h2>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
            Arctic Code Vault Contributor
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
            GitHub Star
          </span>
        </div>
      </motion.div>

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="font-semibold text-lg">Organizations</h2>
        <div className="flex flex-wrap gap-2">
          <Image src="@/public/globe.svg" alt="GitHub" width={32} height={32} className="rounded-md" />
          <Image src="@/public/globe.svg" alt="Vercel" width={32} height={32} className="rounded-md" />
        </div>
      </motion.div>
    </motion.aside>
  );
}

