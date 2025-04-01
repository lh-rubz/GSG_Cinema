import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TrailerModalProps {
  show: boolean;
  onClose: () => void;
  trailerUrl: string;
  title: string;
}

export function TrailerModal({ show, onClose, trailerUrl, title }: TrailerModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Convert any YouTube URL to embed format
  const getEmbedUrl = (url: string): string => {
    let videoId = '';
    
    // Handle different YouTube URL formats
    if (url.includes('youtube.com/embed/')) {
      return url;
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split(/[?&#]/)[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1].split(/[?&#]/)[0];
    } else if (url.includes('youtube.com/watch')) {
      videoId = url.split('watch?')[1].split('&')[0].replace('v=', '');
    }

    return videoId 
      ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0` 
      : url;
  };

  const embedUrl = getEmbedUrl(trailerUrl);

  // Pause video when closing
  useEffect(() => {
    if (!show && iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo' }),
          '*'
        );
      } catch (e) {
        console.warn("Could not pause video:", e);
      }
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          {/* Click outside to close */}
          <div 
            className="absolute inset-0" 
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="relative w-full max-w-4xl mx-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute -top-12 right-0 z-20 p-2 text-white hover:text-gray-200 transition-colors"
              aria-label="Close trailer"
            >
              <CloseIcon className="w-8 h-8" />
            </motion.button>

            {/* 16:9 Aspect Ratio Container */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black">
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title={`${title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                loading="eager"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}