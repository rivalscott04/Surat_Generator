import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { LetterHistory, LetterHistoryStore } from "@/types/letter-history";
import { FormData } from "@/types/surat-tugas";
import { SuratKeputusanData } from "@/types/surat-keputusan";
import { formatLetterNumber } from "@/utils/letter-utils";

// Gunakan localStorage untuk menyimpan data
const STORAGE_KEY = "letter_history";

export function useLetterStore(): LetterHistoryStore {
  const [letters, setLetters] = useState<LetterHistory[]>([]);
  
  // Load data from localStorage on initial load
  useEffect(() => {
    const storedLetters = localStorage.getItem(STORAGE_KEY);
    if (storedLetters) {
      const parsedLetters = JSON.parse(storedLetters);
      // Filter out old data that doesn't have documentType
      const validLetters = parsedLetters.filter((letter: any) => letter.documentType);
      setLetters(validLetters);
      // Update localStorage with cleaned data
      if (validLetters.length !== parsedLetters.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validLetters));
      }
    }
  }, []);
  
  // Save data to localStorage whenever letters change
  useEffect(() => {
    if (letters.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
    }
  }, [letters]);
  
  const addLetter = (letter: Omit<LetterHistory, "id" | "createdAt">) => {
    const newLetter: LetterHistory = {
      ...letter,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    
    setLetters(prevLetters => [...prevLetters, newLetter]);
  };
  
  const getLetter = (id: string) => {
    return letters.find(letter => letter.id === id);
  };

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLetters([]);
  };
  
  return { letters, addLetter, getLetter, clearStorage };
}

export function createLetterHistoryFromForm(formData: FormData): Omit<LetterHistory, "id" | "createdAt"> {
  const letterNumber = formatLetterNumber(
    formData.nomor,
    formData.subcategory,
    formData.month,
    formData.year,
    formData.category
  );
  // Extract title from menimbang atau untuk
  const title = formData.untuk.split(".")[0] || (formData.menimbang && formData.menimbang[0]) || "Surat Tugas";
  // Validasi menimbang
  const menimbang = Array.isArray(formData.menimbang)
    ? formData.menimbang.filter((item) => item && item.trim() !== "").slice(0, 2)
    : [formData.menimbangA].filter(Boolean);
  if (menimbang.length === 0) throw new Error("Menimbang minimal 1 poin");
  return {
    letterNumber,
    category: formData.category,
    subcategory: formData.subcategory,
    documentType: "Surat Tugas",
    people: formData.people,
    title,
    useTableFormat: formData.useTableFormat,
    menimbang,
    dasar: formData.dasar,
  };
}

// Add a new function specifically for SuratKeputusanData
export function createLetterHistoryFromSuratKeputusan(formData: SuratKeputusanData): Omit<LetterHistory, "id" | "createdAt"> {
  const letterNumber = formatLetterNumber(
    formData.nomor,
    formData.subcategory,
    formData.month,
    formData.year,
    formData.category
  );
  
  return {
    letterNumber,
    category: formData.category,
    subcategory: formData.subcategory,
    documentType: "Surat Keputusan",
    people: [formData.person],
    title: formData.tentang,
  };
}
