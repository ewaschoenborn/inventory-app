import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportExcel, importExcel } from '../../db/utils/excel';
import { inventoryApi } from '../../app/api';
import styled from 'styled-components';
import { Upload, Download, ChevronLeft, CheckCircle } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Card, Button, Container, BackButton, Header, ControlsWrapper } from '../../styles/components';
import IconContainer from '../../utils/IconContainer';

const StyledContainer = styled(Container)`
    padding-top: 8px;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: ${theme.spacing.xl};
    max-width: 720px;
    margin: 0 auto;
`;

const StyledCard = styled(Card)`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
    padding: ${theme.spacing.xl};
`;

const FileInputWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    background: ${theme.colors.background.light};
    border: 1px solid ${theme.colors.border.default};
    border-radius: ${theme.borderRadius.md};
    padding: ${theme.spacing.sm} 10px;
    position: relative;

    &:focus-within {
        border-color: ${theme.colors.primary};
        background: ${theme.colors.background.white};
    }
`;

const FileInputLabel = styled.div<{ $hasFile?: boolean }>`
    flex: 1;
    font-size: ${theme.typography.fontSize.sm};
    color: ${({ $hasFile }) => ($hasFile ? theme.colors.text.primary : theme.colors.text.placeholder)};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const HiddenFileInput = styled.input`
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    top: 0;
    left: 0;
`;

const FileInputButton = styled.button`
    padding: ${theme.spacing.xs} 10px;
    border: none;
    border-radius: ${theme.borderRadius.sm};
    background-color: ${theme.colors.primary};
    color: white;
    font-size: ${theme.typography.fontSize.xs};
    font-weight: ${theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: ${theme.transitions.default};
    flex-shrink: 0;

    &:hover {
        background-color: ${theme.colors.primaryHover};
    }
`;

const StyledButtonGroup = styled.div`
    display: flex;
    gap: ${theme.spacing.sm};
    align-items: center;
    padding-top: ${theme.spacing.sm};
    border-top: 1px solid ${theme.colors.border.default};
`;

const StyledPrimaryButton = styled(Button)`
    flex: 1;
    height: 36px;
    padding: 0 ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
`;

const StyledSecondaryButton = styled(Button)`
    flex: 1;
    height: 36px;
    padding: 0 ${theme.spacing.lg};
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
`;

const StyledHeader = styled(Header)`
    padding: ${theme.spacing.md} ${theme.spacing.lg} ${theme.spacing.md} 0;
    margin-bottom: 0;
    margin-left: 0;
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
`;

const StyledBackButton = styled(BackButton)`
    padding-left: 0;
    margin-left: 0;
`;
const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalBox = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 480px;
    width: 100%;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
    margin: 0 0 10px 0;
`;

const ModalText = styled.div`
    margin: 0 0 16px 0;
`;

const ModalButtons = styled.div`
    display: flex;
    gap: 8px;
    justify-content: flex-end;
`;

const ConfirmationInput = styled.input`
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
`;

const WarningText = styled.div`
    color: #f00;
    font-weight: bold;
`;

const ImportExportScreen = () => {
    const navigate = useNavigate();
    // UI state for the import/export flow (file selection, progress, confirmations).
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showOverwriteConfirmation, setShowOverwriteConfirmation] = useState(false);
    const [overwriteConfirmationInput, setOverwriteConfirmationInput] = useState('');
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [importProgress, setImportProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load current items to decide whether import needs a confirmation step.
    const inventoryItems = inventoryApi.useItems(); // fetch current items

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] ?? null);
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportClick = async () => {
        if (!file) {
            alert('Select a file first.');
            return;
        }

        // If items exist, require user to choose extend vs overwrite.
        if ((inventoryItems?.length ?? 0) > 0) {
            setPendingFile(file);
            setShowConfirm(true);
            return;
        }
        await performImport(file, /* extend */ true);
    };

    const performImport = async (f: File, extend: boolean, overwriteConfirmed: boolean = false) => {
        setImporting(true);
        setImportProgress(0);
        setShowConfirm(false);

        const handleProgress = (percentage: number) => {
            setImportProgress(percentage);
        };
        try {
            if (!extend) {
                // Overwrite path requires explicit confirmation.
                if (!overwriteConfirmed) {
                    setShowOverwriteConfirmation(true);
                    return;
                }
                await inventoryApi.clearAll();
            }
            await importExcel(f, handleProgress);

            setSuccessMessage('Daten erfolgreich importiert!');
            setFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            alert('Import failed: ' + (err as Error).message);
        } finally {
            setImporting(false);
            setPendingFile(null);
            setShowConfirm(false);
        }
    };

    const handleConfirmChoice = async (choice: 'extend' | 'overwrite' | 'cancel') => {
        if (choice === 'cancel') {
            setShowConfirm(false);
            setPendingFile(null);
            return;
        }
        if (!pendingFile) {
            setShowConfirm(false);
            return;
        }

        if (choice === 'overwrite') {
            setShowOverwriteConfirmation(true);
        } else {
            await performImport(pendingFile, true);
        }
    };

    const handleOverwriteConfirmation = async () => {
        // Require the exact keyword before clearing the database.
        if (overwriteConfirmationInput === 'überschreiben') {
            performImport(pendingFile!, false, true);
            setShowOverwriteConfirmation(false);
            setOverwriteConfirmationInput('');
        }
    };

    const handleExportClick = async () => {
        setExporting(true);
        try {
            const blob = await exportExcel(inventoryItems);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Generate filename with date and time suffix
            const now = new Date();
            const dateStr = now.toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_');
            a.download = `inventory_${dateStr}.xlsx`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccessMessage('Daten erfolgreich exportiert!');
        } catch (err) {
            alert('Export failed: ' + (err as Error).message);
        } finally {
            setExporting(false);
        }
    };

    return (
        <StyledContainer>
            <StyledHeader>
                <StyledBackButton onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} />
                </StyledBackButton>
            </StyledHeader>
            <ControlsWrapper>
                <StyledCard>
                    <FileInputWrapper>
                        <Upload size={18} color={theme.colors.text.muted} />
                        <FileInputLabel $hasFile={!!file}>
                            {file ? file.name : 'Excel-Datei auswählen (.xlsx)'}
                        </FileInputLabel>
                        <HiddenFileInput
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleFileChange}
                        />
                        <FileInputButton type="button" onClick={handleBrowseClick}>
                            Durchsuchen
                        </FileInputButton>
                    </FileInputWrapper>
                    <StyledButtonGroup>
                        <StyledPrimaryButton
                            $variant="primary"
                            onClick={handleImportClick}
                            disabled={importing || !file}
                        >
                            <Upload size={14} />
                            <span>{importing ? 'Import läuft…' : 'Importieren'}</span>
                        </StyledPrimaryButton>
                        <StyledSecondaryButton $variant="ghost" onClick={handleExportClick} disabled={exporting}>
                            <Download size={14} />
                            <span>{exporting ? 'Export läuft…' : 'Exportieren'}</span>
                        </StyledSecondaryButton>
                    </StyledButtonGroup>
                </StyledCard>
                {(importing || successMessage) && (
                    <SuccessWrapper
                        $withLeftBorder={!!successMessage}
                        $leftBorderColor="#10b981"
                        $isProgress={importing}
                    >
                        {importing ? (
                            <>
                                <ProgressLabel>
                                    Importiere... <strong>{importProgress}%</strong>
                                </ProgressLabel>
                                <ProgressBar value={importProgress} max={100} />
                            </>
                        ) : (
                            <>
                                <IconContainer icon={CheckCircle} />
                                <span>{successMessage}</span>
                            </>
                        )}
                    </SuccessWrapper>
                )}
                {showConfirm && (
                    <ModalOverlay>
                        <ModalBox role="dialog" aria-modal="true" aria-labelledby="import-confirm-title">
                            <ModalTitle id="import-confirm-title">Die Datenbank enthält bereits Elemente</ModalTitle>
                            <ModalText>
                                Die aktuelle Datenbank enthält bereits Einträge. Möchten Sie die vorhandenen Daten
                                erweitern (aktuelle Einträge beibehalten und neue hinzufügen) oder die Datenbank
                                überschreiben (vorhandene Einträge löschen und nur die neuen importieren)?
                            </ModalText>
                            <ModalButtons>
                                <StyledPrimaryButton onClick={() => handleConfirmChoice('extend')}>
                                    Erweitern
                                </StyledPrimaryButton>
                                <StyledSecondaryButton onClick={() => handleConfirmChoice('overwrite')}>
                                    Überschreiben
                                </StyledSecondaryButton>
                                <StyledSecondaryButton $variant="ghost" onClick={() => handleConfirmChoice('cancel')}>
                                    Abbrechen
                                </StyledSecondaryButton>
                            </ModalButtons>
                        </ModalBox>
                    </ModalOverlay>
                )}
                {showOverwriteConfirmation && (
                    <ModalOverlay>
                        <ModalBox role="dialog" aria-modal="true" aria-labelledby="overwrite-confirm-title">
                            <ModalTitle id="overwrite-confirm-title">Datenbanküberschreiben bestätigen</ModalTitle>
                            <ModalText>
                                <WarningText>
                                    WARNUNG: Diese Aktion kann nicht rückgängig gemacht werden! Exportiere die
                                    Datenbank, um sie zu speichern.
                                </WarningText>
                                Bitte geben Sie "überschreiben" ein, um zu bestätigen, dass Sie die vorhandene Datenbank
                                löschen und durch die neuen Daten ersetzen möchten.
                            </ModalText>
                            <ConfirmationInput
                                type="text"
                                value={overwriteConfirmationInput}
                                onChange={(e) => setOverwriteConfirmationInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && overwriteConfirmationInput === 'überschreiben') {
                                        handleOverwriteConfirmation();
                                    }
                                }}
                                placeholder='Geben Sie "überschreiben" ein'
                            />
                            <ModalButtons>
                                <StyledPrimaryButton
                                    onClick={handleOverwriteConfirmation}
                                    disabled={overwriteConfirmationInput !== 'überschreiben'}
                                >
                                    Bestätigen
                                </StyledPrimaryButton>
                                <StyledSecondaryButton
                                    $variant="ghost"
                                    onClick={() => {
                                        setShowOverwriteConfirmation(false);
                                        setOverwriteConfirmationInput('');
                                    }}
                                >
                                    Abbrechen
                                </StyledSecondaryButton>
                            </ModalButtons>
                        </ModalBox>
                    </ModalOverlay>
                )}
            </ControlsWrapper>
        </StyledContainer>
    );
};
const SuccessWrapper = styled(Card)<{ $isProgress: boolean }>`
    margin-top: 8px;

    font-size: ${theme.typography.fontSize.sm};

    display: ${({ $isProgress }) => ($isProgress ? 'flex' : 'flex')};
    flex-direction: ${({ $isProgress }) => ($isProgress ? 'column' : 'row')};
    gap: ${({ $isProgress }) => ($isProgress ? theme.spacing.md : '8px')};
    color: #64748b;
    align-items: ${({ $isProgress }) => ($isProgress ? 'stretch' : 'center')};

    padding: ${({ $isProgress }) => ($isProgress ? '8px 12px' : '12px')};
`;

const ProgressLabel = styled.p`
    margin: 0;
    font-size: ${theme.typography.fontSize.sm};
    font-weight: ${theme.typography.fontWeight.medium};
    color: ${theme.colors.text.secondary};
    letter-spacing: ${theme.typography.letterSpacing.tight};
`;

const ProgressBar = styled.progress`
    width: 100%;
    height: 8px;
    border: none;
    border-radius: ${theme.borderRadius.full};
    background-color: ${theme.colors.background.gray};
    overflow: hidden;
    appearance: none;
    -webkit-appearance: none;

    &::-webkit-progress-bar {
        background-color: ${theme.colors.background.gray};
        border-radius: ${theme.borderRadius.full};
        box-shadow: ${theme.shadows.sm};
    }

    &::-webkit-progress-value {
        background: linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.primaryHover} 100%);
        border-radius: ${theme.borderRadius.full};
        transition: ${theme.transitions.default};
    }

    &::-moz-progress-bar {
        background: linear-gradient(90deg, ${theme.colors.primary} 0%, ${theme.colors.primaryHover} 100%);
        border-radius: ${theme.borderRadius.full};
        transition: ${theme.transitions.default};
    }
`;

export default ImportExportScreen;
