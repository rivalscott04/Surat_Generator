
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
      setLetters(JSON.parse(storedLetters));
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
  
  return { letters, addLetter, getLetter };
}

export function createLetterHistoryFromForm(formData: FormData): Omit<LetterHistory, "id" | "createdAt"> {
  const letterNumber = formatLetterNumber(
    formData.nomor,
    formData.subcategory,
    formData.month,
    formData.year,
    formData.category
  );
  
  // Extract title from menimbang or untuk
  const title = formData.untuk.split(".")[0] || formData.menimbangA.split(".")[0] || "Surat Tugas";
  
  return {
    letterNumber,
    category: formData.category,
    subcategory: formData.subcategory,
    people: formData.people.map(p => p.nama),
    title,
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
    people: [formData.person.nama], // Use the single person in SuratKeputusan
    title: formData.tentang,
  };
}
