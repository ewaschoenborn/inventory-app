import { useMemo, useState, type ComponentType } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    ArrowDownAZ,
    ArrowDownNarrowWide,
    ChevronLeft,
    ClipboardList,
    Download,
    FolderSync,
    FileUp,
    Image as ImageIcon,
    ListChecks,
    MousePointerClick,
    Package,
    PlusCircle,
    Search,
    SquarePen,
    CheckCircle2,
    TriangleAlert,
    Upload,
} from 'lucide-react';

import { Card, Container } from '../../styles/components';
import { theme } from '../../styles/theme';

const FIND_ITEM_SCREENSHOT_SRC = '/guide/find-item.png';
const ADD_ITEM_SCREENSHOT_SRC = '/guide/AddItem.jpeg';
const ADD_ITEM_SAVE_SCREENSHOT_SRC = '/guide/Hinzufungen.jpeg';
const IMPORT_EXPORT_SCREENSHOT_SRC = '/guide/ImportExport.jpeg';
const IMPORT_EXPORT_CONFIRMATION_SCREENSHOT_SRC = '/guide/ImportConfirmation.jpeg';
const IMPORT_IN_PROCESS_SCREENSHOT_SRC = '/guide/ImportInProcess.jpeg';
const PACKING_PLANS_SCREENSHOT_SRC = '/guide/PackPlan.jpeg';
const PACKING_PLANS_SCREENSHOT_2_SRC = '/guide/PackPlan2.jpeg';
const PACKING_PLANS_SCREENSHOT_3_SRC = '/guide/PackPlan3.jpeg';

type GuideTopicId = 'find-item' | 'add-item' | 'import-export' | 'packing-plans';

type GuideTopic = {
    id: GuideTopicId;
    title: string;
    description: string;
    icon: ComponentType<{ size?: number }>;
    available: boolean;
};

const Guide = () => {
    return (
        <Routes>
            <Route index element={<GuideListScreen />} />
            <Route path="find-item" element={<FindItemGuideScreen />} />
            <Route path="add-item" element={<AddItemGuideScreen />} />
            <Route path="import-export" element={<ImportExportGuideScreen />} />
            <Route path="packing-plans" element={<PackingPlansGuideScreen />} />
        </Routes>
    );
};

const GuideListScreen = () => {
    const navigate = useNavigate();

    // Central list for the guide tiles and their availability in the UI.
    const topics = useMemo<GuideTopic[]>(
        () => [
            {
                id: 'find-item',
                title: 'So finden Sie einen Artikel',
                description: 'Suchen, filtern, sortieren und Artikeldetails öffnen.',
                icon: Package,
                available: true,
            },
            {
                id: 'add-item',
                title: 'So fügen Sie einen Artikel hinzu',
                description: 'Einen neuen Inventareintrag erstellen.',
                icon: PlusCircle,
                available: true,
            },
            {
                id: 'import-export',
                title: 'Daten importieren / exportieren',
                description: 'Sichern Sie Ihr Inventar und stellen Sie es aus Excel wieder her.',
                icon: FileUp,
                available: true,
            },
            {
                id: 'packing-plans',
                title: 'Packing-Pläne',
                description: 'Artikel auswählen, Mengen festlegen und Pläne speichern.',
                icon: ClipboardList,
                available: true,
            },
        ],
        []
    );

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <IntroCard>
                    <IntroTitle>Anleitungen</IntroTitle>
                    <IntroText>
                        Erfahren Sie, wie Sie die Inventar-App nutzen, Artikel verwalten, Packing-Pläne organisieren und
                        bei Einsätzen effizient arbeiten.
                    </IntroText>

                    <TopicGrid>
                        {topics.map((t) => {
                            const Icon = t.icon;
                            const onClick = () => {
                                if (!t.available) return;
                                navigate(t.id);
                            };

                            return (
                                <TopicButton
                                    key={t.id}
                                    type="button"
                                    onClick={onClick}
                                    disabled={!t.available}
                                    $available={t.available}
                                >
                                    <TopicHeader>
                                        <TopicIcon>
                                            <Icon size={18} />
                                        </TopicIcon>
                                        <TopicTitleRow>
                                            <TopicTitle>{t.title}</TopicTitle>
                                        </TopicTitleRow>
                                    </TopicHeader>
                                    <TopicDescription>{t.description}</TopicDescription>
                                    {!t.available && (
                                        <TopicUnavailableHint>Anleitung noch nicht verfügbar</TopicUnavailableHint>
                                    )}
                                </TopicButton>
                            );
                        })}
                    </TopicGrid>
                </IntroCard>
            </StyledContainer>
        </div>
    );
};

const FindItemGuideScreen = () => {
    const navigate = useNavigate();
    const [hasScreenshot, setHasScreenshot] = useState(true);

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <DetailHeader>
                    <BackToGuidesButton type="button" onClick={() => navigate('/guide')}>
                        <ChevronLeft size={18} />
                        <span>Guides</span>
                    </BackToGuidesButton>
                </DetailHeader>

                <TaskCard $withLeftBorder $leftBorderColor={theme.colors.primary}>
                    <TaskHeader>
                        <TaskTitle>
                            <IconPill>
                                <ListChecks size={16} />
                            </IconPill>
                            <span>So finden Sie einen Artikel</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            Nutzen Sie Suche, Filter und Sortierung, um einen Artikel schnell zu finden, und klicken Sie
                            ihn anschließend an, um die Details zu öffnen.
                        </TaskSubtitle>
                    </TaskHeader>

                    <FindItemTaskGrid>
                        <FindItemSteps>
                            <FindItemStep>
                                <StepIcon>
                                    <Package size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>„Inventar“ öffnen</StepTitle>
                                    <StepText>Öffnen Sie über die Sidebar-Navigation die Inventarliste.</StepText>
                                </div>
                            </FindItemStep>

                            <FindItemStep>
                                <StepIcon>
                                    <Search size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Suchen</StepTitle>
                                    <StepText>
                                        Geben Sie ein, was Sie wissen (z. B. Inventarnummer, Name, ID), um die Liste
                                        einzugrenzen.
                                    </StepText>
                                </div>
                            </FindItemStep>

                            <FindItemStep>
                                <StepIcon>
                                    <ArrowDownNarrowWide size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Filtern</StepTitle>
                                    <StepText>
                                        Nutzen Sie Filter (z. B. Schadensstufe oder Standort), um die Ergebnisse weiter
                                        zu reduzieren.
                                    </StepText>
                                </div>
                            </FindItemStep>

                            <FindItemStep>
                                <StepIcon>
                                    <ArrowDownAZ size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Sortieren</StepTitle>
                                    <StepText>
                                        Klicken Sie auf eine Spaltenüberschrift (z. B. Inventar-Nr., Name, Standort), um
                                        die Liste zu sortieren.
                                    </StepText>
                                </div>
                            </FindItemStep>

                            <FindItemStep>
                                <StepIcon>
                                    <MousePointerClick size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Details öffnen</StepTitle>
                                    <StepText>
                                        Klicken Sie auf eine Artikelzeile/-karte, um die Detailseite zu öffnen. Dort
                                        sehen Sie u. a. Mengen, Status, Standort und weitere Informationen.
                                    </StepText>
                                </div>
                            </FindItemStep>
                        </FindItemSteps>

                        <FindItemVisualColumn>
                            {hasScreenshot ? (
                                <ScreenshotFigure aria-label="Screenshot der Inventarliste">
                                    <FindItemScreenshotImage
                                        src={FIND_ITEM_SCREENSHOT_SRC}
                                        alt="Inventarliste mit Suche, Artikelübersicht und Aktionen"
                                        loading="lazy"
                                        decoding="async"
                                        // Fallback to placeholder if the public screenshot is missing.
                                        onError={() => setHasScreenshot(false)}
                                    />
                                </ScreenshotFigure>
                            ) : (
                                <ScreenshotPlaceholder aria-label="Platzhalter für Screenshot der Inventarliste">
                                    <ScreenshotTopBar>
                                        <Dot $color="#ef4444" />
                                        <Dot $color="#f59e0b" />
                                        <Dot $color="#10b981" />
                                    </ScreenshotTopBar>

                                    <ScreenshotBody>
                                        <PlaceholderIcon>
                                            <ImageIcon size={28} />
                                        </PlaceholderIcon>
                                        <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                        <PlaceholderText>
                                            Fügen Sie <code>public/guide/find-item.png</code> hinzu, um den Screenshot
                                            der Inventarliste anzuzeigen.
                                        </PlaceholderText>
                                    </ScreenshotBody>
                                </ScreenshotPlaceholder>
                            )}
                        </FindItemVisualColumn>
                    </FindItemTaskGrid>
                </TaskCard>
            </StyledContainer>
        </div>
    );
};

const AddItemGuideScreen = () => {
    const navigate = useNavigate();
    const [hasAddItemScreenshot, setHasAddItemScreenshot] = useState(true);
    const [hasHinzufugenScreenshot, setHasHinzufugenScreenshot] = useState(true);

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <DetailHeader>
                    <BackToGuidesButton type="button" onClick={() => navigate('/guide')}>
                        <ChevronLeft size={18} />
                        <span>Guides</span>
                    </BackToGuidesButton>
                </DetailHeader>

                <TaskCard $withLeftBorder $leftBorderColor={theme.colors.primary}>
                    <TaskHeader>
                        <TaskTitle>
                            <IconPill>
                                <PlusCircle size={16} />
                            </IconPill>
                            <span>So fügen Sie einen Artikel hinzu</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            Fügen Sie einen neuen Inventareintrag aus der „Inventar“-Liste hinzu. Sie müssen eine
                            eindeutige ID und einen Namen angeben.
                        </TaskSubtitle>
                    </TaskHeader>

                    <AddItemTaskGrid>
                        <AddItemSteps>
                            <AddItemStep>
                                <StepIcon>
                                    <Package size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>„Inventar“ öffnen</StepTitle>
                                    <StepText>Öffnen Sie über die Sidebar-Navigation die Inventarliste.</StepText>
                                </div>
                            </AddItemStep>

                            <AddItemStep>
                                <StepIcon>
                                    <PlusCircle size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Auf „Item“ klicken</StepTitle>
                                    <StepText>
                                        Klicken Sie in der fixierten Filterleiste auf die Schaltfläche{' '}
                                        <strong>Item</strong> (Plus-Symbol), um das Formular zum Hinzufügen zu öffnen.
                                    </StepText>
                                </div>
                            </AddItemStep>

                            <MobileOnly>
                                {hasAddItemScreenshot ? (
                                    <ScreenshotFigure aria-label="Screenshot: Artikel hinzufügen">
                                        <AddItemScreenshotImage
                                            src={ADD_ITEM_SCREENSHOT_SRC}
                                            alt="Formular zum Hinzufügen eines Artikels mit Pflichtfeldern und Hinzufügen-Schaltfläche"
                                            loading="lazy"
                                            decoding="async"
                                            // Fallback to placeholder if the public screenshot is missing.
                                            onError={() => setHasAddItemScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Platzhalter für Screenshot: Artikel hinzufügen">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/AddItem.jpeg</code> hinzu, um den Screenshot
                                                des Formulars zum Hinzufügen anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </MobileOnly>

                            <AddItemStep>
                                <StepIcon>
                                    <SquarePen size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Pflichtfelder ausfüllen</StepTitle>
                                    <StepText>
                                        Geben Sie <strong>Name</strong> und <strong>Identifikationsnummer (ID)</strong>{' '}
                                        ein. Die ID muss eindeutig sein.
                                    </StepText>
                                </div>
                            </AddItemStep>

                            <AddItemStep>
                                <StepIcon>
                                    <ArrowDownNarrowWide size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Details ergänzen (optional)</StepTitle>
                                    <StepText>
                                        Ergänzen Sie bei Bedarf Inventar-/Gerätenummern, Mengen (Soll/Ist/Verfügbarkeit),
                                        Standort und Prüfinformationen.
                                    </StepText>
                                </div>
                            </AddItemStep>

                            <AddItemStep>
                                <StepIcon>
                                    <CheckCircle2 size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Speichern</StepTitle>
                                    <StepText>
                                        Klicken Sie auf <strong>Hinzufügen</strong>. Nach dem Speichern gelangen Sie
                                        direkt zur Artikeldetailseite.
                                    </StepText>
                                </div>
                            </AddItemStep>

                            <MobileOnly>
                                {hasHinzufugenScreenshot ? (
                                    <ScreenshotFigure aria-label="Screenshot: Artikel speichern">
                                        <AddItemScreenshotImage
                                            src={ADD_ITEM_SAVE_SCREENSHOT_SRC}
                                            alt="Ansicht „Artikel hinzufügen“ mit der Aktion „Hinzufügen“"
                                            loading="lazy"
                                            decoding="async"
                                            // Fallback to placeholder if the public screenshot is missing.
                                            onError={() => setHasHinzufugenScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Platzhalter für Screenshot: Speichern">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/Hinzufungen.jpeg</code> hinzu, um den
                                                Screenshot der Aktion „Hinzufügen“ anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </MobileOnly>

                            <AddItemStep>
                                <StepIcon>
                                    <Search size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Prüfen</StepTitle>
                                    <StepText>
                                        Gehen Sie zurück zu „Inventar“ und suchen Sie nach der neuen ID/dem Namen, um zu
                                        bestätigen, dass der Eintrag in der Liste ist.
                                    </StepText>
                                </div>
                            </AddItemStep>
                        </AddItemSteps>

                        <DesktopOnly>
                            <AddItemVisualColumn>
                                {hasAddItemScreenshot ? (
                                    <ScreenshotFigure aria-label="Screenshot: Artikel hinzufügen">
                                        <AddItemScreenshotImage
                                            src={ADD_ITEM_SCREENSHOT_SRC}
                                            alt="Formular zum Hinzufügen eines Artikels mit Pflichtfeldern und Hinzufügen-Schaltfläche"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasAddItemScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Platzhalter für Screenshot: Artikel hinzufügen">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/AddItem.jpeg</code> hinzu, um den Screenshot
                                                des Formulars zum Hinzufügen anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}

                                {hasHinzufugenScreenshot ? (
                                    <ScreenshotFigure aria-label="Screenshot: Artikel speichern">
                                        <AddItemScreenshotImage
                                            src={ADD_ITEM_SAVE_SCREENSHOT_SRC}
                                            alt="Ansicht „Artikel hinzufügen“ mit der Aktion „Hinzufügen“"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasHinzufugenScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Platzhalter für Screenshot: Speichern">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/Hinzufungen.jpeg</code> hinzu, um den
                                                Screenshot der Aktion „Hinzufügen“ anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </AddItemVisualColumn>
                        </DesktopOnly>
                    </AddItemTaskGrid>
                </TaskCard>
            </StyledContainer>
        </div>
    );
};

const ImportExportGuideScreen = () => {
    const navigate = useNavigate();
    const [hasImportExportScreenshot, setHasImportExportScreenshot] = useState(true);
    const [hasImportConfirmationScreenshot, setHasImportConfirmationScreenshot] = useState(true);
    const [hasImportInProcessScreenshot, setHasImportInProcessScreenshot] = useState(true);

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <DetailHeader>
                    <BackToGuidesButton type="button" onClick={() => navigate('/guide')}>
                        <ChevronLeft size={18} />
                        <span>Guides</span>
                    </BackToGuidesButton>
                </DetailHeader>

                <TaskCard $withLeftBorder $leftBorderColor={theme.colors.primary}>
                    <TaskHeader>
                        <TaskTitle>
                            <IconPill>
                                <FileUp size={16} />
                            </IconPill>
                            <span>Daten importieren / exportieren</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            Exportieren Sie eine Excel-Sicherung des Inventars oder importieren Sie neue Daten aus Excel.
                            Der Import kann die aktuelle Datenbank erweitern oder überschreiben.
                        </TaskSubtitle>
                    </TaskHeader>

                    <ImportExportTaskGrid>
                        <ImportExportSteps>
                            <ImportExportStep>
                                <StepIcon>
                                    <FolderSync size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>„Import / Export“ öffnen</StepTitle>
                                    <StepText>
                                        Öffnen Sie über die Sidebar (oder „Mehr“) den Bereich Import / Export.
                                    </StepText>
                                </div>
                            </ImportExportStep>

                            <MobileOnly>
                                {hasImportExportScreenshot ? (
                                    <ScreenshotFigure aria-label="Import / Export screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_EXPORT_SCREENSHOT_SRC}
                                            alt="Import/Export-Ansicht mit Dateiauswahl und Import/Export-Aktionen"
                                            loading="lazy"
                                            decoding="async"
                                            // Fallback to placeholder if the public screenshot is missing.
                                            onError={() => setHasImportExportScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for import / export">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/ImportExport.jpeg</code> hinzu, um den
                                                Import/Export-Screenshot anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </MobileOnly>

                            <ImportExportStep>
                                <StepIcon>
                                    <Download size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Backup exportieren (empfohlen)</StepTitle>
                                    <StepText>
                                        Klicken Sie auf <strong>Exportieren</strong>, um vor größeren Änderungen ein{' '}
                                        <code>.xlsx</code>-Backup herunterzuladen.
                                    </StepText>
                                </div>
                            </ImportExportStep>

                            <ImportExportStep>
                                <StepIcon>
                                    <Upload size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Excel-Datei auswählen</StepTitle>
                                    <StepText>
                                        Klicken Sie auf <strong>Durchsuchen</strong> und wählen Sie eine Excel-Datei (
                                        <code>.xlsx</code>, <code>.xls</code> oder <code>.csv</code>).
                                    </StepText>
                                </div>
                            </ImportExportStep>

                            <ImportExportStep>
                                <StepIcon>
                                    <MousePointerClick size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Import starten</StepTitle>
                                    <StepText>
                                        Klicken Sie auf <strong>Importieren</strong>. Der Fortschritt wird angezeigt,
                                        während der Import läuft.
                                    </StepText>
                                </div>
                            </ImportExportStep>

                            <MobileOnly>
                                {hasImportInProcessScreenshot ? (
                                    <ScreenshotFigure aria-label="Import progress screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_IN_PROCESS_SCREENSHOT_SRC}
                                            alt="Import mit Fortschrittsanzeige"
                                            loading="lazy"
                                            decoding="async"
                                            // Fallback to placeholder if the public screenshot is missing.
                                            onError={() => setHasImportInProcessScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for import progress">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/ImportInProcess.jpeg</code> hinzu, um den
                                                Screenshot des laufenden Imports anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </MobileOnly>

                            <ImportExportStep>
                                <StepIcon>
                                    <TriangleAlert size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Erweitern oder überschreiben wählen</StepTitle>
                                    <StepText>
                                        Wenn bereits Einträge existieren, wählen Sie <strong>Erweitern</strong> (bestehende
                                        behalten + neue hinzufügen) oder <strong>Überschreiben</strong> (bestehende löschen
                                        + ersetzen). Zum Überschreiben müssen Sie <strong>überschreiben</strong> eingeben.
                                    </StepText>
                                </div>
                            </ImportExportStep>

                            <MobileOnly>
                                {hasImportConfirmationScreenshot ? (
                                    <ScreenshotFigure aria-label="Import confirmation screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_EXPORT_CONFIRMATION_SCREENSHOT_SRC}
                                            alt="Import-Bestätigung mit den Optionen Erweitern und Überschreiben"
                                            loading="lazy"
                                            decoding="async"
                                            // Fallback to placeholder if the public screenshot is missing.
                                            onError={() => setHasImportConfirmationScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for import confirmation">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/ImportConfirmation.jpeg</code> hinzu, um den
                                                Bestätigungs-Screenshot anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </MobileOnly>

                            <ImportExportStep>
                                <StepIcon>
                                    <Search size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Ergebnis prüfen</StepTitle>
                                    <StepText>
                                        Gehen Sie zu „Inventar“ und suchen Sie nach einigen bekannten Artikeln, um den
                                        Import zu prüfen.
                                    </StepText>
                                </div>
                            </ImportExportStep>
                        </ImportExportSteps>

                        <DesktopOnly>
                            <ImportExportVisualColumn>
                                {hasImportExportScreenshot ? (
                                    <ScreenshotFigure aria-label="Import / Export screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_EXPORT_SCREENSHOT_SRC}
                                            alt="Import/Export-Ansicht mit Dateiauswahl und Import/Export-Aktionen"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasImportExportScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for import / export">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/ImportExport.jpeg</code> hinzu, um den
                                                Import/Export-Screenshot anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}

                                {hasImportConfirmationScreenshot ? (
                                    <ScreenshotFigure aria-label="Import confirmation screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_EXPORT_CONFIRMATION_SCREENSHOT_SRC}
                                            alt="Import-Bestätigung mit den Optionen Erweitern und Überschreiben"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasImportConfirmationScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for import confirmation">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/ImportConfirmation.jpeg</code> hinzu, um den
                                                Bestätigungs-Screenshot anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}

                                {hasImportInProcessScreenshot ? (
                                    <ScreenshotFigure aria-label="Import progress screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_IN_PROCESS_SCREENSHOT_SRC}
                                            alt="Import mit Fortschrittsanzeige"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasImportInProcessScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for import progress">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/ImportInProcess.jpeg</code> hinzu, um den
                                                Screenshot des laufenden Imports anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </ImportExportVisualColumn>
                        </DesktopOnly>
                    </ImportExportTaskGrid>
                </TaskCard>
            </StyledContainer>
        </div>
    );
};

const PackingPlansGuideScreen = () => {
    const navigate = useNavigate();
    const [hasPackPlanScreenshot, setHasPackPlanScreenshot] = useState(true);
    const [hasPackPlan2Screenshot, setHasPackPlan2Screenshot] = useState(true);
    const [hasPackPlan3Screenshot, setHasPackPlan3Screenshot] = useState(true);

    return (
        <div>
            <StyledContainer $maxWidth="960px">
                <DetailHeader>
                    <BackToGuidesButton type="button" onClick={() => navigate('/guide')}>
                        <ChevronLeft size={18} />
                        <span>Guides</span>
                    </BackToGuidesButton>
                </DetailHeader>

                <TaskCard $withLeftBorder $leftBorderColor={theme.colors.primary}>
                    <TaskHeader>
                        <TaskTitle>
                            <IconPill>
                                <ClipboardList size={16} />
                            </IconPill>
                            <span>Packing-Pläne erstellen</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            Erstellen Sie einen Packing-Plan, indem Sie im „Pack“-Modus Artikel auswählen, Mengen
                            festlegen, speichern und anschließend prüfen.
                        </TaskSubtitle>
                    </TaskHeader>

                    <PackingPlansTaskGrid>
                        <PackingPlansSteps>
                            <PackingPlansStep>
                                <StepIcon>
                                    <Package size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>„Inventar“ öffnen</StepTitle>
                                    <StepText>Öffnen Sie über die Sidebar-Navigation die Inventarliste.</StepText>
                                </div>
                            </PackingPlansStep>

                            <PackingPlansStep>
                                <StepIcon>
                                    <Package size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>„Pack“-Modus aktivieren</StepTitle>
                                    <StepText>
                                        Klicken Sie in der oberen Leiste auf <strong>Pack</strong>. Die UI wechselt in
                                        den Auswahlmodus.
                                    </StepText>
                                </div>
                            </PackingPlansStep>

                            <PackingPlansStep>
                                <StepIcon>
                                    <MousePointerClick size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Artikel auswählen</StepTitle>
                                    <StepText>
                                        Klicken Sie Artikelzeilen/-karten an, um sie für den Plan auszuwählen.
                                        Ausgewählte Artikel werden hervorgehoben.
                                    </StepText>
                                </div>
                            </PackingPlansStep>

                            <MobileOnly>
                                {hasPackPlanScreenshot ? (
                                    <ScreenshotFigure aria-label="Packing plans screenshot">
                                        <ScreenshotImage
                                            src={PACKING_PLANS_SCREENSHOT_SRC}
                                            alt="Pack-Modus mit ausgewählten Artikeln, Planname und Speichern-Aktion"
                                            loading="lazy"
                                            decoding="async"
                                            // Fallback to placeholder if the public screenshot is missing.
                                            onError={() => setHasPackPlanScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for packing plans">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/PackPlan.jpeg</code> hinzu, um den
                                                Packing-Plan-Screenshot anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </MobileOnly>

                            <PackingPlansStep>
                                <StepIcon>
                                    <ArrowDownNarrowWide size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Mengen festlegen</StepTitle>
                                    <StepText>
                                        Nutzen Sie die Mengensteuerung (Spinner), um die{' '}
                                        <strong>benötigte Menge</strong> pro ausgewähltem Artikel zu setzen.
                                    </StepText>
                                </div>
                            </PackingPlansStep>

                            <PackingPlansStep>
                                <StepIcon>
                                    <SquarePen size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Plan benennen</StepTitle>
                                    <StepText>
                                        Tragen Sie im Feld <strong>Plan name…</strong> einen Namen ein (sichtbar im
                                        Pack-Modus).
                                    </StepText>
                                </div>
                            </PackingPlansStep>

                            <PackingPlansStep>
                                <StepIcon>
                                    <CheckCircle2 size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Speichern</StepTitle>
                                    <StepText>
                                        Klicken Sie auf <strong>Save</strong>. Die App erstellt den Plan und öffnet die
                                        Detailseite.
                                    </StepText>
                                </div>
                            </PackingPlansStep>

                            <MobileOnly>
                                {hasPackPlan2Screenshot ? (
                                    <ScreenshotFigure aria-label="Packing plans screenshot 2">
                                        <ScreenshotImage
                                            src={PACKING_PLANS_SCREENSHOT_2_SRC}
                                            alt="Packing-Plan Schritt 2"
                                            loading="lazy"
                                            decoding="async"
                                            // Fallback to placeholder if the public screenshot is missing.
                                            onError={() => setHasPackPlan2Screenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for packing plans step 2">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/PackPlan2.jpeg</code> hinzu, um den
                                                Screenshot des Packing-Plans (Schritt 2) anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </MobileOnly>

                            <PackingPlansStep>
                                <StepIcon>
                                    <ClipboardList size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Packing-Pläne öffnen</StepTitle>
                                    <StepText>
                                        Klicken Sie in der Sidebar auf <strong>Packing Plans</strong> (Tab mit Listen-Icon),
                                        um die Übersicht der gespeicherten Pläne zu öffnen.
                                    </StepText>
                                </div>
                            </PackingPlansStep>

                            <MobileOnly>
                                {hasPackPlan3Screenshot ? (
                                    <ScreenshotFigure aria-label="Packing plans screenshot 3">
                                        <ScreenshotImage
                                            src={PACKING_PLANS_SCREENSHOT_3_SRC}
                                            alt="Packing-Plan Schritt 3"
                                            loading="lazy"
                                            decoding="async"
                                            // Fallback to placeholder if the public screenshot is missing.
                                            onError={() => setHasPackPlan3Screenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for packing plans step 3">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/PackPlan3.jpeg</code> hinzu, um den
                                                Screenshot des Packing-Plans (Schritt 3) anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </MobileOnly>

                            <PackingPlansStep>
                                <StepIcon>
                                    <MousePointerClick size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Gespeicherten Plan öffnen</StepTitle>
                                    <StepText>
                                        Wählen Sie einen Plan aus der Liste, um die Details erneut zu öffnen.
                                    </StepText>
                                </div>
                            </PackingPlansStep>
                        </PackingPlansSteps>

                        <DesktopOnly>
                            <PackingPlansVisualColumn>
                                {hasPackPlanScreenshot ? (
                                    <ScreenshotFigure aria-label="Packing plans screenshot">
                                        <ScreenshotImage
                                            src={PACKING_PLANS_SCREENSHOT_SRC}
                                            alt="Pack-Modus mit ausgewählten Artikeln, Planname und Speichern-Aktion"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasPackPlanScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for packing plans">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/PackPlan.jpeg</code> hinzu, um den
                                                Packing-Plan-Screenshot anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}

                                {hasPackPlan2Screenshot ? (
                                    <ScreenshotFigure aria-label="Packing plans screenshot 2">
                                        <ScreenshotImage
                                            src={PACKING_PLANS_SCREENSHOT_2_SRC}
                                            alt="Packing-Plan Schritt 2"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasPackPlan2Screenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for packing plans step 2">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/PackPlan2.jpeg</code> hinzu, um den
                                                Screenshot des Packing-Plans (Schritt 2) anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}

                                {hasPackPlan3Screenshot ? (
                                    <ScreenshotFigure aria-label="Packing plans screenshot 3">
                                        <ScreenshotImage
                                            src={PACKING_PLANS_SCREENSHOT_3_SRC}
                                            alt="Packing-Plan Schritt 3"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasPackPlan3Screenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for packing plans step 3">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Hier kommt ein Screenshot hin</PlaceholderTitle>
                                            <PlaceholderText>
                                                Fügen Sie <code>public/guide/PackPlan3.jpeg</code> hinzu, um den
                                                Screenshot des Packing-Plans (Schritt 3) anzuzeigen.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </PackingPlansVisualColumn>
                        </DesktopOnly>
                    </PackingPlansTaskGrid>
                </TaskCard>
            </StyledContainer>
        </div>
    );
};

const StyledContainer = styled(Container)`
    padding: 0 ${theme.spacing.xl} ${theme.spacing.xxl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xl};
`;

const IntroCard = styled(Card)`
    padding: ${theme.spacing.xl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
`;

const IntroTitle = styled.h3`
    margin: 0;
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semibold};
`;

const IntroText = styled.p`
    margin: 0;
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.base};
`;

const DetailHeader = styled.div`
    margin-bottom: ${theme.spacing.md};
`;

const BackToGuidesButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: none;
    background: transparent;
    padding: 6px 0;
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.medium};
    cursor: pointer;

    &:hover {
        color: ${theme.colors.primary};
    }
`;

const TopicGrid = styled.div`
    margin-top: ${theme.spacing.sm};
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: ${theme.spacing.md};

    @media (max-width: ${theme.breakpoints.md}) {
        grid-template-columns: 1fr;
    }
`;

const TopicButton = styled.button<{ $available: boolean }>`
    text-align: left;
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border.default};
    background: ${theme.colors.background.white};
    padding: ${theme.spacing.lg};
    box-shadow: ${theme.shadows.sm};
    cursor: ${({ $available }) => ($available ? 'pointer' : 'not-allowed')};
    opacity: ${({ $available }) => ($available ? 1 : 0.65)};
    transition: ${theme.transitions.default};

    &:hover {
        transform: ${({ $available }) => ($available ? 'translateY(-1px)' : 'none')};
        box-shadow: ${({ $available }) => ($available ? theme.shadows.md : theme.shadows.sm)};
        border-color: ${({ $available }) => ($available ? theme.colors.primary : theme.colors.border.default)};
    }

    &:disabled {
        cursor: not-allowed;
    }
`;

const TopicHeader = styled.div`
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing.md};
    margin-bottom: ${theme.spacing.sm};
`;

const TopicIcon = styled.div`
    width: 36px;
    height: 36px;
    border-radius: ${theme.borderRadius.lg};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.background.light};
    border: 1px solid ${theme.colors.border.default};
    color: ${theme.colors.text.secondary};
    flex-shrink: 0;
`;

const TopicTitleRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.spacing.sm};
    width: 100%;
`;

const TopicTitle = styled.div`
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    font-size: ${theme.typography.fontSize.md};
`;

const TopicDescription = styled.div`
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.base};
    line-height: 1.5;
`;

const TopicUnavailableHint = styled.div`
    margin-top: ${theme.spacing.sm};
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.sm};
`;

const TaskCard = styled(Card)`
    padding: ${theme.spacing.xl};
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.xl};
`;

const TaskHeader = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
`;

const TaskTitle = styled.div`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeight.semibold};
    font-size: ${theme.typography.fontSize.lg};
`;

const IconPill = styled.span`
    width: 32px;
    height: 32px;
    border-radius: ${theme.borderRadius.round};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.primaryLight};
    color: ${theme.colors.primary};
`;

const TaskSubtitle = styled.p`
    margin: 0;
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.base};
`;

const TaskGrid = styled.div`
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: ${theme.spacing.xl};

    @media (max-width: ${theme.breakpoints.lg}) {
        grid-template-columns: 1fr;
    }
`;

const Steps = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
`;

const Step = styled.div`
    display: flex;
    gap: ${theme.spacing.md};
    align-items: flex-start;
`;

const MobileOnly = styled.div`
    display: none;

    @media (max-width: ${theme.breakpoints.lg}) {
        display: block;
    }
`;

const DesktopOnly = styled.div`
    @media (max-width: ${theme.breakpoints.lg}) {
        display: none;
    }
`;

// Desktop-only layout polish for the Find-Item guide (mobile stays unchanged)
const FindItemTaskGrid = styled(TaskGrid)`
    @media (min-width: ${theme.breakpoints.lg}) {
        grid-template-columns: minmax(0, 1fr) 420px;
        align-items: start;
    }
`;

const FindItemSteps = styled(Steps)`
    @media (min-width: ${theme.breakpoints.lg}) {
        gap: ${theme.spacing.md};
    }
`;

const FindItemStep = styled(Step)`
    @media (min-width: ${theme.breakpoints.lg}) {
        padding: ${theme.spacing.md};
        border-radius: ${theme.borderRadius.lg};
        border: 1px solid ${theme.colors.border.default};
        background: ${theme.colors.background.white};
        box-shadow: ${theme.shadows.sm};
    }
`;

// Desktop-only layout polish for the Add-Item guide (mobile stays unchanged)
const AddItemTaskGrid = styled(TaskGrid)`
    @media (min-width: ${theme.breakpoints.lg}) {
        grid-template-columns: minmax(0, 1fr) 420px;
        align-items: start;
    }
`;

const AddItemSteps = styled(Steps)`
    @media (min-width: ${theme.breakpoints.lg}) {
        gap: ${theme.spacing.md};
    }
`;

const AddItemStep = styled(Step)`
    @media (min-width: ${theme.breakpoints.lg}) {
        padding: ${theme.spacing.md};
        border-radius: ${theme.borderRadius.lg};
        border: 1px solid ${theme.colors.border.default};
        background: ${theme.colors.background.white};
        box-shadow: ${theme.shadows.sm};
    }
`;

// Desktop-only layout polish for the Import/Export guide (mobile stays unchanged)
const ImportExportTaskGrid = styled(TaskGrid)`
    @media (min-width: ${theme.breakpoints.lg}) {
        grid-template-columns: minmax(0, 1fr) 420px;
        align-items: start;
    }
`;

const ImportExportSteps = styled(Steps)`
    @media (min-width: ${theme.breakpoints.lg}) {
        gap: ${theme.spacing.md};
    }
`;

const ImportExportStep = styled(Step)`
    @media (min-width: ${theme.breakpoints.lg}) {
        padding: ${theme.spacing.md};
        border-radius: ${theme.borderRadius.lg};
        border: 1px solid ${theme.colors.border.default};
        background: ${theme.colors.background.white};
        box-shadow: ${theme.shadows.sm};
    }
`;

const ImportExportVisualColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};

    @media (min-width: ${theme.breakpoints.lg}) {
        position: sticky;
        top: 96px;
    }
`;

// Desktop-only layout polish for the Packing Plans guide (mobile stays unchanged)
const PackingPlansTaskGrid = styled(TaskGrid)`
    @media (min-width: ${theme.breakpoints.lg}) {
        grid-template-columns: minmax(0, 1fr) 420px;
        align-items: start;
    }
`;

const PackingPlansSteps = styled(Steps)`
    @media (min-width: ${theme.breakpoints.lg}) {
        gap: ${theme.spacing.md};
    }
`;

const PackingPlansStep = styled(Step)`
    @media (min-width: ${theme.breakpoints.lg}) {
        padding: ${theme.spacing.md};
        border-radius: ${theme.borderRadius.lg};
        border: 1px solid ${theme.colors.border.default};
        background: ${theme.colors.background.white};
        box-shadow: ${theme.shadows.sm};
    }
`;

const PackingPlansVisualColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};

    @media (min-width: ${theme.breakpoints.lg}) {
        position: sticky;
        top: 96px;
    }
`;

// NOTE: Don't extend `VisualColumn` / `ScreenshotImage` here because they are defined later in the file.
// Extending forward-referenced consts can crash at runtime (white screen).
const AddItemVisualColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};

    @media (min-width: ${theme.breakpoints.lg}) {
        position: sticky;
        top: 96px;
    }
`;

const AddItemScreenshotImage = styled.img`
    width: 100%;
    height: auto;
    display: block;

    @media (min-width: ${theme.breakpoints.lg}) {
        box-sizing: border-box;
        border: 1px solid ${theme.colors.border.default};
        border-radius: ${theme.borderRadius.lg};
        height: 260px;
        object-fit: contain;
    }
`;

const StepIcon = styled.div`
    width: 32px;
    height: 32px;
    border-radius: ${theme.borderRadius.lg};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.background.light};
    border: 1px solid ${theme.colors.border.default};
    color: ${theme.colors.text.secondary};
    flex-shrink: 0;
`;

const StepTitle = styled.div`
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
    margin-bottom: 2px;
`;

const StepText = styled.div`
    color: ${theme.colors.text.secondary};
    font-size: ${theme.typography.fontSize.base};
    line-height: 1.5;
`;

const VisualColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
`;

const FindItemVisualColumn = styled(VisualColumn)`
    @media (min-width: ${theme.breakpoints.lg}) {
        position: sticky;
        top: 96px;
    }
`;

const ScreenshotPlaceholder = styled.div`
    border-radius: ${theme.borderRadius.lg};
    border: 1px dashed ${theme.colors.border.default};
    background: ${theme.colors.background.light};
    overflow: hidden;
    box-shadow: ${theme.shadows.sm};
`;

const ScreenshotFigure = styled.figure`
    margin: 0;
    border-radius: ${theme.borderRadius.lg};
    border: 1px solid ${theme.colors.border.default};
    background: ${theme.colors.background.white};
    overflow: hidden;
    box-shadow: ${theme.shadows.sm};

    /* Desktop: don't draw the "frame" around image + caption */
    @media (min-width: ${theme.breakpoints.lg}) {
        border: none;
    }
`;

const ScreenshotImage = styled.img`
    width: 100%;
    height: auto;
    display: block;

    /* Desktop: put the border around the image only (caption stays clean) */
    @media (min-width: ${theme.breakpoints.lg}) {
        box-sizing: border-box;
        border: 1px solid ${theme.colors.border.default};
        border-radius: ${theme.borderRadius.lg};
    }
`;

const FindItemScreenshotImage = styled(ScreenshotImage)`
    @media (min-width: ${theme.breakpoints.lg}) {
        height: 520px;
        object-fit: contain;
    }
`;

const ScreenshotTopBar = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 12px;
    border-bottom: 1px solid ${theme.colors.border.default};
    background: ${theme.colors.background.white};
`;

const Dot = styled.span<{ $color: string }>`
    width: 10px;
    height: 10px;
    border-radius: ${theme.borderRadius.round};
    background: ${({ $color }) => $color};
    opacity: 0.9;
`;

const ScreenshotBody = styled.div`
    padding: 18px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
`;

const PlaceholderIcon = styled.div`
    width: 56px;
    height: 56px;
    border-radius: ${theme.borderRadius.round};
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${theme.colors.background.white};
    border: 1px solid ${theme.colors.border.default};
    color: ${theme.colors.text.muted};
`;

const PlaceholderTitle = styled.div`
    font-weight: ${theme.typography.fontWeight.semibold};
    color: ${theme.colors.text.primary};
`;

const PlaceholderText = styled.p`
    margin: 0;
    color: ${theme.colors.text.muted};
    font-size: ${theme.typography.fontSize.sm};
    line-height: 1.5;
`;

export default Guide;
