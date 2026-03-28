
import { useEffect } from "react";

export const useTitle = (title: string) => {
  useEffect(() => {
    const originalTitle = document.title;
    document.title = title; 
  }, [title])
}