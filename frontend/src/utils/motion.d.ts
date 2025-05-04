// src/utils/motion.d.ts
export declare const textVariant: (delay: number) => {
    hidden: {
      y: number;
      opacity: number;
    };
    show: {
      y: number;
      opacity: number;
      transition: {
        type: string;
        duration: number;
        delay: number;
      };
    };
  };
  
  export declare const fadeIn: (
    direction: "left" | "right" | "up" | "down",
    type: string,
    delay: number,
    duration: number
  ) => {
    hidden: {
      x: number;
      y: number;
      opacity: number;
    };
    show: {
      x: number;
      y: number;
      opacity: number;
      transition: {
        type: string;
        delay: number;
        duration: number;
        ease: string;
      };
    };
  };
  
  export declare const zoomIn: (
    delay: number,
    duration: number
  ) => {
    hidden: {
      scale: number;
      opacity: number;
    };
    show: {
      scale: number;
      opacity: number;
      transition: {
        type: string;
        delay: number;
        duration: number;
        ease: string;
      };
    };
  };
  
  export declare const slideIn: (
    direction: "left" | "right" | "up" | "down",
    type: string,
    delay: number,
    duration: number
  ) => {
    hidden: {
      x: string | number;
      y: string | number;
    };
    show: {
      x: string | number;
      y: string | number;
      transition: {
        type: string;
        delay: number;
        duration: number;
        ease: string;
      };
    };
  };
  
  export declare const staggerContainer: (
    staggerChildren: number,
    delayChildren?: number
  ) => {
    hidden: {};
    show: {
      transition: {
        staggerChildren: number;
        delayChildren: number;
      };
    };
  };
  