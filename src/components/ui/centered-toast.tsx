
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Printer, BookMarked } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CenteredToastProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint?: () => void;
}

export function CenteredToast({ isOpen, onClose, onPrint }: CenteredToastProps) {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<'saving' | 'actions'>('saving');

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setStep('actions');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleArchiveClick = () => {
    navigate('/archive');
    onClose();
  };

  const handlePrintClick = () => {
    if (onPrint) {
      onPrint();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        {step === 'saving' ? (
          <div className="flex flex-col items-center py-6">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Berhasil Disimpan!</h3>
            <p className="text-gray-500 text-center">
              Dokumen telah berhasil disimpan ke dalam arsip
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6">
            <h3 className="text-lg font-semibold mb-4">Apa yang ingin Anda lakukan selanjutnya?</h3>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handlePrintClick}
              >
                <Printer className="w-4 h-4" />
                Cetak Dokumen
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={handleArchiveClick}
              >
                <BookMarked className="w-4 h-4" />
                Lihat Arsip
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
