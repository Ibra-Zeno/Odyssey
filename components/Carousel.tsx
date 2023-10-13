import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Router from "next/router";
import { MessageCircle } from "lucide-react";
import Like from "../components/Like";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const Carousel: React.FC<{ topLikedPosts: any }> = ({ topLikedPosts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      navigate(1);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const navigate = (direction: number) => {
    setDirection(direction);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + direction;
      if (nextIndex >= topLikedPosts.length) {
        nextIndex = 0;
      } else if (nextIndex < 0) {
        nextIndex = topLikedPosts.length - 1;
      }
      return nextIndex;
    });
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      navigate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      navigate(-1);
    }
  };

  const visiblePosts = topLikedPosts.slice(currentIndex, currentIndex + 3);

  return (
    <div className="flex overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="flex w-full"
          drag="x"
          onDragEnd={handleDragEnd}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
        >
          {visiblePosts.map((post: any) => (
            <div
              key={post.id}
              className="mb-4 flex w-full flex-col items-baseline justify-between rounded bg-stone-50 p-2 shadow-lg"
            >
              <h2
                className="w-fit cursor-pointer font-display text-sm font-medium tracking-wide"
                onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
              >
                {post.title}
              </h2>
              <div className="flex w-full flex-row justify-between">
                <div className="ml-2 mt-4 flex flex-row gap-x-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={post?.author?.image}
                      alt={post.author?.name || "Unknown author"}
                    />
                    <AvatarFallback>
                      {post.author?.name || "Unknown author"}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-noto text-xs">
                    {post.author?.name || "Unknown author"}
                  </p>
                </div>
                <div className="flex w-fit items-end gap-x-4">
                  <Like post={post} />
                  <div className="flex flex-row items-center text-sm">
                    <MessageCircle size={16} className="fill-none" />
                    <span className="ml-1">{post.commentCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Carousel;
