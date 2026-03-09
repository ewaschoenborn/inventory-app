import { useEffect, useState } from 'react';
import { Modal, Alert } from 'react-bootstrap';
import { Html5Qrcode } from 'html5-qrcode';

type BarcodeScannerModalProps = {
    show: boolean;
    onClose: () => void;
    onDetected: (code: string) => Promise<void> | void;
    title?: string;
    readerId?: string;
    helpText?: string;
};

export default function BarcodeScannerModal({
    show,
    onClose,
    onDetected,
    title = 'Barcode scannen',
    readerId = 'barcode-reader',
    helpText = 'Kamera auf den Barcode halten.',
}: BarcodeScannerModalProps) {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!show) return;

        const html5QrCode = new Html5Qrcode(readerId);
        let isCancelled = false;

        const startScanner = async () => {
            setError(null);

            try {
                await html5QrCode.start(
                    { facingMode: 'environment' },
                    {
                        fps: 10,
                        qrbox: { width: 260, height: 160 },
                        disableFlip: true,
                    },
                    async (decodedText) => {
                        if (isCancelled) return;

                        try {
                            if (html5QrCode.isScanning) {
                                await html5QrCode.stop();
                            }
                            await html5QrCode.clear();
                        } catch {}

                        await onDetected(decodedText.trim());
                        onClose();
                    },
                    () => {}
                );
            } catch (e: any) {
                setError(e?.message ?? 'Kamera konnte nicht gestartet werden.');
            }
        };

        startScanner();

        return () => {
            isCancelled = true;
            (async () => {
                try {
                    if (html5QrCode.isScanning) {
                        await html5QrCode.stop();
                    }
                    await html5QrCode.clear();
                } catch {}
            })();
        };
    }, [show, onClose, onDetected, readerId]);

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <div
                    id={readerId}
                    style={{
                        width: '100%',
                        minHeight: 320,
                        borderRadius: 8,
                        overflow: 'hidden',
                        background: 'var(--color-bg-accent, #f5f5f5)',
                    }}
                />
                <div style={{ marginTop: 12, fontSize: 14, color: 'var(--color-font-secondary, #666)' }}>
                    {helpText}
                </div>
            </Modal.Body>
        </Modal>
    );
}
