"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  CaretLeft,
  CaretRight,
  X,
  Image as ImageIcon,
  ArrowUp,
  CircleNotch,
  PlayCircle,
  CheckCircle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  src: string;
  year: string;
  title: string;
  desc: string;
  thumbnail?: string;
}

interface CloudinaryResource {
  public_id: string;
  version: number;
  format: string;
  type?: string;
  asset_folder?: string;
  context?: {
    custom?: {
      alt?: string;
      caption?: string;
    };
  };
}

// Helper function to extract Google Drive file ID and convert it to a direct embed link
function getDirectImageUrl(src: string) {
  if (src.startsWith("/") || !src.includes("drive.google.com")) {
    return src;
  }
  const matchId = src.match(/\/d\/([a-zA-Z0-9_-]+)/) || src.match(/id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) {
    return `https://lh3.googleusercontent.com/d/${matchId[1]}`;
  }
  return src;
}

// Helper function to extract Google Drive video file ID and convert it to a direct embed preview link
function getDirectVideoEmbedUrl(src: string) {
  if (!src.includes("drive.google.com")) {
    return src;
  }
  const matchId = src.match(/\/d\/([a-zA-Z0-9_-]+)/) || src.match(/id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) {
    return `https://drive.google.com/file/d/${matchId[1]}/preview`;
  }
  return src;
}

// Helper function to extract years (2019-2026) from folder paths in Cloudinary or Drive URLs
function getMediaYear(src: string): string {
  // 1. Check for explicit 4-digit year (2019-2026) in folder path or public_id
  const yearMatch = src.match(/(201[9]|202[0-6])/);
  if (yearMatch) return yearMatch[1];

  // 2. Map SIO's "The Stretch Out" (TSO) editions to their respective years
  const tsoMatch = src.match(/TSO\s*([1-8])\.0/i) || src.match(/Stretch\s*Out\s*([1-8])/i);
  if (tsoMatch) {
    const edition = parseInt(tsoMatch[1], 10);
    switch (edition) {
      case 1:
      case 2:
        return "2019";
      case 3:
        return "2020";
      case 4:
      case 5:
        return "2021";
      case 6:
        return "2023";
      case 7:
        return "2024";
      case 8:
        return "2025";
    }
  }

  return "Other";
}

export default function Gallery() {
  const [catalog, setCatalog] = useState<{ images: GalleryItem[]; videos: GalleryItem[] }>({
    images: [],
    videos: [],
  });
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const observerTargetRef = useRef<HTMLDivElement>(null);

  // Fetch images list from Cloudinary Tag list or public gallery-images.json catalog fallback
  useEffect(() => {
    async function fetchImages() {
      try {
        // 1. Fetch images and videos lists from Cloudinary concurrently
        const [imgRes, vidRes] = await Promise.allSettled([
          fetch("https://res.cloudinary.com/dquzcqxcy/image/list/sio-gallery.json"),
          fetch("https://res.cloudinary.com/dquzcqxcy/video/list/sio-gallery.json"),
        ]);

        const imgs: GalleryItem[] = [];
        const vids: GalleryItem[] = [];

        // Parse images if fetch succeeded
        if (imgRes.status === "fulfilled" && imgRes.value.ok) {
          const imgData = await imgRes.value.json();
          if (imgData && Array.isArray(imgData.resources)) {
            imgData.resources.forEach((r: CloudinaryResource) => {
              const extension = ["heic", "heif", "tiff"].includes(r.format?.toLowerCase())
                ? "jpg"
                : r.format;
              const deliveryType = r.type || "upload";
              const url = `https://res.cloudinary.com/dquzcqxcy/image/${deliveryType}/v${r.version}/${r.public_id}.${extension}`;

              const folderStr = r.asset_folder || r.public_id || "";
              const itemYear = getMediaYear(folderStr);

              let folderTitle = "";
              if (r.asset_folder) {
                const segments = r.asset_folder.split("/");
                const lastSegment = segments[segments.length - 1];
                if (lastSegment) folderTitle = lastSegment.replace(/_/g, " ");
              }
              const filenameTitle =
                r.public_id.split("/").pop()?.replace(/_/g, " ") || "SIO Outreach";
              const customTitle = r.context?.custom?.alt || r.context?.custom?.caption;

              imgs.push({
                src: url,
                year: itemYear,
                title: customTitle || folderTitle || filenameTitle,
                desc: r.context?.custom?.caption || "",
              });
            });
          }
        }

        // Parse videos if fetch succeeded
        if (vidRes.status === "fulfilled" && vidRes.value.ok) {
          const vidData = await vidRes.value.json();
          if (vidData && Array.isArray(vidData.resources)) {
            vidData.resources.forEach((r: CloudinaryResource) => {
              const deliveryType = r.type || "upload";
              const url = `https://res.cloudinary.com/dquzcqxcy/video/${deliveryType}/v${r.version}/${r.public_id}.${r.format}`;
              const thumbnailUrl = `https://res.cloudinary.com/dquzcqxcy/video/${deliveryType}/v${r.version}/${r.public_id}.jpg`;

              const folderStr = r.asset_folder || r.public_id || "";
              const itemYear = getMediaYear(folderStr);

              let folderTitle = "";
              if (r.asset_folder) {
                const segments = r.asset_folder.split("/");
                const lastSegment = segments[segments.length - 1];
                if (lastSegment) folderTitle = lastSegment.replace(/_/g, " ");
              }
              const filenameTitle = r.public_id.split("/").pop()?.replace(/_/g, " ") || "SIO Video";
              const customTitle = r.context?.custom?.alt || r.context?.custom?.caption;

              vids.push({
                src: url,
                year: itemYear,
                title: customTitle || folderTitle || filenameTitle,
                desc: r.context?.custom?.caption || "",
                thumbnail: thumbnailUrl,
              });
            });
          }
        }

        // If we found any live media, update state and exit
        if (imgs.length > 0 || vids.length > 0) {
          setCatalog({ images: imgs, videos: vids });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Cloudinary lists fetch failed, falling back to local JSON catalog", err);
      }

      // 2. Fallback to local public/gallery-images.json list
      try {
        const res = await fetch("/gallery-images.json");
        const data = await res.json();

        if (data && typeof data === "object" && !Array.isArray(data)) {
          const parseItems = (list: (string | Partial<GalleryItem>)[]): GalleryItem[] => {
            if (!Array.isArray(list)) return [];
            return list
              .map((item) => {
                if (typeof item === "string") {
                  const yearMatch = item.match(/\/(201[9]|202[0-6])\//);
                  const filename =
                    item.split("/").pop()?.split(".")[0]?.replace(/_/g, " ") || "SIO Outreach";
                  return {
                    src: item,
                    year: yearMatch ? yearMatch[1] : "Other",
                    title: filename,
                    desc: "",
                  };
                } else if (item && typeof item === "object") {
                  const filename =
                    item.src?.split("/").pop()?.split(".")[0]?.replace(/_/g, " ") || "SIO Outreach";
                  return {
                    src: item.src || "",
                    year: item.year || "Other",
                    title: item.title || filename,
                    desc: item.desc || "",
                    thumbnail: item.thumbnail,
                  };
                }
                return { src: "", year: "Other", title: "SIO Outreach", desc: "" };
              })
              .filter((i) => i.src);
          };

          setCatalog({
            images: parseItems(data.images),
            videos: parseItems(data.videos),
          });
        }
      } catch (err) {
        console.error("Failed to load local gallery images catalog", err);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  const tabList = activeTab === "images" ? catalog.images : catalog.videos;

  // Extract unique years present in the current active media list
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    tabList.forEach((item) => {
      years.add(item.year);
    });
    // Sort years descending (e.g. 2026, 2025, 2024...)
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [tabList]);

  // Filter list by selected year
  const activeList = useMemo(() => {
    if (selectedYear === "all") return tabList;
    return tabList.filter((item) => item.year === selectedYear);
  }, [tabList, selectedYear]);

  // Intersection Observer for infinite scrolling / lazy loading more list items
  useEffect(() => {
    if (activeList.length === 0 || visibleCount >= activeList.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 4, activeList.length));
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    const currentTarget = observerTargetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [activeList, visibleCount]);

  // Back to top button visibility scroll listener
  useEffect(() => {
    function handleScroll() {
      setShowScrollTop(window.scrollY > 500);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNextImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev !== null && prev < activeList.length - 1 ? prev + 1 : 0));
  }, [activeList.length]);

  const handlePrevImage = useCallback(() => {
    setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : activeList.length - 1));
  }, [activeList.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Keyboard navigation for full-screen lightbox modal
  useEffect(() => {
    if (activeImageIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveImageIndex(null);
      } else if (e.key === "ArrowRight") {
        handleNextImage();
      } else if (e.key === "ArrowLeft") {
        handlePrevImage();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeImageIndex, handleNextImage, handlePrevImage]);

  // Switch tab and reset filters
  const handleTabChange = (tab: "images" | "videos") => {
    setActiveTab(tab);
    setSelectedYear("all");
    setVisibleCount(8);
    setActiveImageIndex(null);
  };

  // Switch year filter
  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setVisibleCount(8);
    setActiveImageIndex(null);
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  } as const;

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  } as const;

  const hasContent = catalog.images.length > 0 || catalog.videos.length > 0;

  return (
    <div className="flex flex-col w-full overflow-x-hidden bg-background min-h-screen">
      {/* 1. HERO TITLE */}
      <section className="relative py-20 px-6 lg:px-8 border-b border-border bg-gradient-to-br from-background via-background to-sio-blue/5 text-center">
        <div className="mx-auto max-w-4xl">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sio-blue dark:text-sio-teal bg-sio-blue/10 dark:bg-sio-teal/10 px-3 py-1.5 rounded-full mb-6"
          >
            <ImageIcon size={12} weight="fill" />
            Impact Photo & Video Archive
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-foreground leading-[1.1] mb-6"
          >
            Visualizing SIO Outreach
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            A dynamic documentation of academic tutoring, nutritional feeding blocks, creative
            sports mentorship, and community development across high-need communities.
          </motion.p>
        </div>
      </section>

      {/* 2. TAB TOGGLES SECTION */}
      {hasContent && !loading && (
        <section className="pt-12 px-6 flex flex-col items-center gap-6">
          {/* Main Media Tabs */}
          <div className="bg-muted border border-border rounded-full p-1.5 flex gap-2 w-full max-w-xs justify-between">
            <button
              onClick={() => handleTabChange("images")}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeTab === "images"
                  ? "bg-sio-blue text-white dark:bg-sio-teal dark:text-sio-navy shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Photos ({catalog.images.length})
            </button>
            <button
              onClick={() => handleTabChange("videos")}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                activeTab === "videos"
                  ? "bg-sio-blue text-white dark:bg-sio-teal dark:text-sio-navy shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Videos ({catalog.videos.length})
            </button>
          </div>

          {/* Year Filter Pills */}
          {availableYears.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl border-t border-border/40 pt-6">
              <button
                onClick={() => handleYearChange("all")}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                  selectedYear === "all"
                    ? "border-sio-blue bg-sio-blue/10 text-sio-blue dark:border-sio-teal dark:bg-sio-teal/10 dark:text-sio-teal"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                All Years
              </button>
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer ${
                    selectedYear === year
                      ? "border-sio-blue bg-sio-blue/10 text-sio-blue dark:border-sio-teal dark:bg-sio-teal/10 dark:text-sio-teal"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. GALLERY GRID */}
      <section className="py-12 px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-4">
            <CircleNotch size={36} className="animate-spin text-sio-blue dark:text-sio-teal" />
            <p className="text-sm font-semibold tracking-wide">Syncing cloud archives...</p>
          </div>
        ) : !hasContent ? (
          /* SETUP GUIDE / CONNECTED DASHBOARD */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="border border-border rounded-3xl bg-card max-w-2xl mx-auto p-8 sm:p-10 shadow-xl overflow-hidden text-center relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sio-blue to-sio-teal" />
            <div className="h-16 w-16 rounded-full bg-sio-teal/10 text-sio-teal flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} weight="fill" className="text-sio-blue dark:text-sio-teal" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-foreground mb-3">
              Gallery Ready for Sync
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto mb-8">
              Your website is configured to dynamically render media lists from your custom
              Cloudinary folders.
            </p>

            <div className="bg-muted/50 rounded-2xl p-6 text-left border border-border/60 space-y-4 mb-8">
              <div className="flex gap-3">
                <span className="h-6 w-6 rounded-full bg-sio-blue/10 dark:bg-sio-teal/10 text-sio-blue dark:text-sio-teal font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Upload your photos and videos to Cloudinary. Keep them grouped in subfolders named
                  after the year (e.g. <strong className="text-foreground">2019</strong> to{" "}
                  <strong className="text-foreground">2026</strong>).
                </p>
              </div>
              <div className="flex gap-3">
                <span className="h-6 w-6 rounded-full bg-sio-blue/10 dark:bg-sio-teal/10 text-sio-blue dark:text-sio-teal font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Add the public direct hotlinks into the{" "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-sio-blue dark:text-sio-teal">
                    public/gallery-images.json
                  </code>{" "}
                  file in your repository.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="h-6 w-6 rounded-full bg-sio-blue/10 dark:bg-sio-teal/10 text-sio-blue dark:text-sio-teal font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The gallery will read the folder structure inside your URLs (like{" "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-sio-blue dark:text-sio-teal">
                    /2026/
                  </code>
                  ) to create Year Filters automatically!
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button
                asChild
                className="rounded-full bg-sio-blue hover:bg-sio-blue/90 text-white dark:bg-sio-teal dark:text-sio-navy dark:hover:bg-sio-teal/90 px-8 py-2.5 text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/">Back to Homepage</Link>
              </Button>
            </div>
          </motion.div>
        ) : activeList.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card max-w-lg mx-auto px-6">
            <ImageIcon size={40} className="mx-auto text-muted-foreground opacity-40 mb-3" />
            <h4 className="text-base font-serif font-bold text-foreground mb-1">
              No Media for {selectedYear}
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto mb-4">
              There are no {activeTab === "images" ? "photos" : "videos"} matching this filter in
              your catalog.
            </p>
            <Button
              onClick={() => setSelectedYear("all")}
              variant="outline"
              className="rounded-full border-border text-xs px-5 py-1.5"
            >
              Show All
            </Button>
          </div>
        ) : (
          <>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {activeList.slice(0, visibleCount).map((item, index) => {
                if (!item) return null;
                const src = typeof item === "string" ? item : item.src;
                if (!src) return null;
                const mediaYear =
                  typeof item === "string" ? getMediaYear(item) : item.year || "Other";

                const title =
                  typeof item === "string"
                    ? src.split("/").pop()?.split(".")[0]?.replace(/_/g, " ") || "SIO Outreach"
                    : item.title;
                const desc = typeof item === "string" ? "" : item.desc;

                if (activeTab === "videos") {
                  return (
                    <motion.div
                      key={src}
                      variants={fadeInUp}
                      onClick={() => setActiveImageIndex(index)}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg hover:border-sio-blue/20 dark:hover:border-sio-teal/20 transition-all duration-300 cursor-pointer"
                    >
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-sio-navy/95 to-sio-blue/70" />
                      )}

                      {/* Centered Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/55 transition-colors duration-300 z-10">
                        <PlayCircle
                          size={52}
                          weight="fill"
                          className="text-sio-teal group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                        />
                      </div>

                      {/* Video Caption Details (always visible on mobile, hover-triggered on desktop) */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left z-20">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-sio-teal uppercase font-semibold">
                          SIO Video • {mediaYear}
                        </span>
                        <h4 className="text-xs font-serif font-bold text-white uppercase tracking-wide mt-1 capitalize leading-snug truncate">
                          {title}
                        </h4>
                        {desc && (
                          <p className="text-[10px] text-white/70 font-sans mt-0.5 line-clamp-2 leading-relaxed">
                            {desc}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key={src}
                    variants={fadeInUp}
                    onClick={() => setActiveImageIndex(index)}
                    className="group relative aspect-square rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg hover:border-sio-blue/20 dark:hover:border-sio-teal/20 transition-all duration-300 cursor-pointer"
                  >
                    <Image
                      src={getDirectImageUrl(src)}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Hover visual details overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-sio-teal uppercase">
                        SIO Archives • {mediaYear}
                      </span>
                      <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wide mt-1 capitalize leading-snug truncate">
                        {title}
                      </h4>
                      {desc && (
                        <p className="text-[11px] text-white/70 font-sans mt-1 line-clamp-2 leading-relaxed">
                          {desc}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Scroll Target for Infinite Lazy Loading */}
            {visibleCount < activeList.length && (
              <div
                ref={observerTargetRef}
                className="flex justify-center py-12 text-muted-foreground gap-2"
              >
                <CircleNotch size={20} className="animate-spin text-sio-blue dark:text-sio-teal" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Loading more...
                </span>
              </div>
            )}
          </>
        )}
      </section>

      {/* 4. LIGHTBOX MODAL OVERLAY */}
      <AnimatePresence>
        {activeImageIndex !== null && activeList.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md px-4"
          >
            {/* Background close click trigger */}
            <div
              className="absolute inset-0 cursor-default"
              onClick={() => setActiveImageIndex(null)}
            />

            {/* Top Close Button */}
            <button
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Close Lightbox"
            >
              <X size={20} weight="bold" />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Previous Media"
            >
              <CaretLeft size={24} weight="bold" />
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Next Media"
            >
              <CaretRight size={24} weight="bold" />
            </button>

            {/* Animated Media Container */}
            <motion.div
              key={`${activeTab}-${activeImageIndex}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-4xl w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black"
            >
              {(() => {
                const activeItem = activeList[activeImageIndex];
                if (!activeItem) return null;
                const activeSrc = typeof activeItem === "string" ? activeItem : activeItem.src;
                const activeTitle =
                  typeof activeItem === "string"
                    ? activeSrc.split("/").pop()?.split(".")[0]?.replace(/_/g, " ") ||
                      "SIO Outreach"
                    : activeItem.title;
                const activeDesc = typeof activeItem === "string" ? "" : activeItem.desc;
                const mediaYear =
                  typeof activeItem === "string"
                    ? getMediaYear(activeSrc)
                    : activeItem.year || "Other";

                return (
                  <>
                    {activeTab === "videos" ? (
                      activeSrc.includes("cloudinary.com") ||
                      activeSrc.endsWith(".mp4") ||
                      activeSrc.endsWith(".webm") ||
                      activeSrc.endsWith(".mov") ? (
                        <video
                          src={activeSrc}
                          controls
                          autoPlay
                          className="w-full h-full object-contain pb-24"
                        />
                      ) : (
                        <iframe
                          src={getDirectVideoEmbedUrl(activeSrc)}
                          className="w-full h-full border-none pb-24"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          title="Video Player"
                        />
                      )
                    ) : (
                      <Image
                        src={getDirectImageUrl(activeSrc)}
                        alt={activeTitle}
                        fill
                        sizes="(max-width: 1024px) 100vw, 1024px"
                        className="object-contain pb-24"
                        priority
                      />
                    )}

                    {/* Bottom Caption Overlay */}
                    {(activeTitle || activeDesc) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent p-6 pt-12 text-left z-10">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-sio-teal uppercase">
                          {mediaYear} • SIO Outreach
                        </span>
                        {activeTitle && (
                          <h3 className="text-base sm:text-lg font-serif font-bold text-white mt-1 uppercase tracking-wide">
                            {activeTitle}
                          </h3>
                        )}
                        {activeDesc && (
                          <p className="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed max-w-3xl font-sans">
                            {activeDesc}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                );
              })()}

              {/* Top media counter tag */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-[10px] font-mono font-semibold text-white/80 z-20">
                {activeImageIndex + 1} / {activeList.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 h-10 w-10 rounded-full bg-sio-blue hover:bg-sio-blue/90 dark:bg-sio-teal dark:text-sio-navy dark:hover:bg-sio-teal/90 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer z-40"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} weight="bold" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
