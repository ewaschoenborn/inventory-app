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
                title: 'How to add an item',
                description: 'Create a new inventory entry.',
                icon: PlusCircle,
                available: true,
            },
            {
                id: 'import-export',
                title: 'Import / export data',
                description: 'Back up your inventory and restore from Excel.',
                icon: FileUp,
                available: true,
            },
            {
                id: 'packing-plans',
                title: 'Packing plans',
                description: 'Select items, set quantities, and save plans.',
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
                    <IntroTitle>Guides</IntroTitle>
                    <IntroText>
                        Learn how to use the inventory app to manage items, organize packing plans, and work efficiently
                        during operations.
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
                                        <TopicUnavailableHint>Guide not available yet</TopicUnavailableHint>
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
                            <span>How to add an item</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            Add a new inventory entry from the “Inventar” list. You must provide a unique ID and a name.
                        </TaskSubtitle>
                    </TaskHeader>

                    <AddItemTaskGrid>
                        <AddItemSteps>
                            <AddItemStep>
                                <StepIcon>
                                    <Package size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Open “Inventar”</StepTitle>
                                    <StepText>Use the sidebar navigation to open the inventory list.</StepText>
                                </div>
                            </AddItemStep>

                            <AddItemStep>
                                <StepIcon>
                                    <PlusCircle size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Click “Item”</StepTitle>
                                    <StepText>
                                        In the sticky filter bar, click the <strong>+ Item</strong> button to open the
                                        add item form.
                                    </StepText>
                                </div>
                            </AddItemStep>

                            <MobileOnly>
                                {hasAddItemScreenshot ? (
                                    <ScreenshotFigure aria-label="Add item screenshot">
                                        <AddItemScreenshotImage
                                            src={ADD_ITEM_SCREENSHOT_SRC}
                                            alt="Add item form view showing required fields and save button"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasAddItemScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for add item">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                            <PlaceholderText>
                                                Add <code>public/guide/AddItem.jpeg</code> to show the add-item form
                                                screenshot.
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
                                    <StepTitle>Fill required fields</StepTitle>
                                    <StepText>
                                        Enter <strong>Name</strong> and <strong>Identifikationsnummer (ID)</strong>. The
                                        ID must be unique.
                                    </StepText>
                                </div>
                            </AddItemStep>

                            <AddItemStep>
                                <StepIcon>
                                    <ArrowDownNarrowWide size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Add details (optional)</StepTitle>
                                    <StepText>
                                        Add inventory/device numbers, quantities (target/actual/availability), location,
                                        and inspection info if available.
                                    </StepText>
                                </div>
                            </AddItemStep>

                            <AddItemStep>
                                <StepIcon>
                                    <CheckCircle2 size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Save</StepTitle>
                                    <StepText>
                                        Click <strong>Hinzufügen</strong>. After saving you’ll be taken directly to the
                                        item details page.
                                    </StepText>
                                </div>
                            </AddItemStep>

                            <MobileOnly>
                                {hasHinzufugenScreenshot ? (
                                    <ScreenshotFigure aria-label="Save item screenshot">
                                        <AddItemScreenshotImage
                                            src={ADD_ITEM_SAVE_SCREENSHOT_SRC}
                                            alt="Add item screen showing the Hinzufügen (save) action"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasHinzufugenScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for save action">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                            <PlaceholderText>
                                                Add <code>public/guide/Hinzufungen.jpeg</code> to show the save
                                                (“Hinzufügen”) screenshot.
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
                                    <StepTitle>Verify</StepTitle>
                                    <StepText>
                                        Go back to “Inventar” and search for the new ID/name to confirm it’s in the
                                        list.
                                    </StepText>
                                </div>
                            </AddItemStep>
                        </AddItemSteps>

                        <DesktopOnly>
                            <AddItemVisualColumn>
                                {hasAddItemScreenshot ? (
                                    <ScreenshotFigure aria-label="Add item screenshot">
                                        <AddItemScreenshotImage
                                            src={ADD_ITEM_SCREENSHOT_SRC}
                                            alt="Add item form view showing required fields and save button"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasAddItemScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for add item">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                            <PlaceholderText>
                                                Add <code>public/guide/AddItem.jpeg</code> to show the add-item form
                                                screenshot.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}

                                {hasHinzufugenScreenshot ? (
                                    <ScreenshotFigure aria-label="Save item screenshot">
                                        <AddItemScreenshotImage
                                            src={ADD_ITEM_SAVE_SCREENSHOT_SRC}
                                            alt="Add item screen showing the Hinzufügen (save) action"
                                            loading="lazy"
                                            decoding="async"
                                            onError={() => setHasHinzufugenScreenshot(false)}
                                        />
                                    </ScreenshotFigure>
                                ) : (
                                    <ScreenshotPlaceholder aria-label="Screenshot placeholder for save action">
                                        <ScreenshotTopBar>
                                            <Dot $color="#ef4444" />
                                            <Dot $color="#f59e0b" />
                                            <Dot $color="#10b981" />
                                        </ScreenshotTopBar>

                                        <ScreenshotBody>
                                            <PlaceholderIcon>
                                                <ImageIcon size={28} />
                                            </PlaceholderIcon>
                                            <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                            <PlaceholderText>
                                                Add <code>public/guide/Hinzufungen.jpeg</code> to show the save
                                                (“Hinzufügen”) screenshot.
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
                            <span>Import / export data</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            Export an Excel backup of the inventory, or import new data from Excel. Import can extend
                            the current database or overwrite it.
                        </TaskSubtitle>
                    </TaskHeader>

                    <TaskGrid>
                        <Steps>
                            <Step>
                                <StepIcon>
                                    <FolderSync size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Open “Import / Export”</StepTitle>
                                    <StepText>
                                        Use the sidebar (or “Mehr”) and open the Import / Export screen.
                                    </StepText>
                                </div>
                            </Step>

                            <MobileOnly>
                                {hasImportExportScreenshot ? (
                                    <ScreenshotFigure aria-label="Import / Export screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_EXPORT_SCREENSHOT_SRC}
                                            alt="Import / Export screen showing file picker and Importieren/Exportieren buttons"
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
                                            <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                            <PlaceholderText>
                                                Add <code>public/guide/ImportExport.jpeg</code> to show the
                                                import/export screenshot.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </MobileOnly>

                            <Step>
                                <StepIcon>
                                    <Download size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Export a backup (recommended)</StepTitle>
                                    <StepText>
                                        Click <strong>Exportieren</strong> to download an <code>.xlsx</code> backup
                                        before making big changes.
                                    </StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <Upload size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Select your Excel file</StepTitle>
                                    <StepText>
                                        Click <strong>Durchsuchen</strong> and choose an Excel file (<code>.xlsx</code>,{' '}
                                        <code>.xls</code>, or <code>.csv</code>).
                                    </StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <MousePointerClick size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Start import</StepTitle>
                                    <StepText>
                                        Click <strong>Importieren</strong>. You’ll see progress while the import runs.
                                    </StepText>
                                </div>
                            </Step>

                            <MobileOnly>
                                {hasImportInProcessScreenshot ? (
                                    <ScreenshotFigure aria-label="Import progress screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_IN_PROCESS_SCREENSHOT_SRC}
                                            alt="Import in progress showing a progress indicator"
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
                                            <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                            <PlaceholderText>
                                                Add <code>public/guide/ImportInProcess.jpeg</code> to show the
                                                in-progress import screenshot.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </MobileOnly>

                            <Step>
                                <StepIcon>
                                    <TriangleAlert size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Choose extend vs overwrite</StepTitle>
                                    <StepText>
                                        If items already exist, pick <strong>Erweitern</strong> (keep existing + add
                                        new) or <strong>Überschreiben</strong> (delete existing + replace with imported
                                        data). Overwrite requires typing <strong>überschreiben</strong> to confirm.
                                    </StepText>
                                </div>
                            </Step>

                            <MobileOnly>
                                {hasImportConfirmationScreenshot ? (
                                    <ScreenshotFigure aria-label="Import confirmation screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_EXPORT_CONFIRMATION_SCREENSHOT_SRC}
                                            alt="Import confirmation modal showing extend vs overwrite options"
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
                                            <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                            <PlaceholderText>
                                                Add <code>public/guide/ImportConfirmation.jpeg</code> to show the
                                                confirmation screenshot.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </MobileOnly>

                            <Step>
                                <StepIcon>
                                    <Search size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Verify results</StepTitle>
                                    <StepText>
                                        Go to “Inventar” and search for a few known items to confirm the import worked
                                        as expected.
                                    </StepText>
                                </div>
                            </Step>
                        </Steps>

                        <DesktopOnly>
                            <VisualColumn>
                                {hasImportExportScreenshot ? (
                                    <ScreenshotFigure aria-label="Import / Export screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_EXPORT_SCREENSHOT_SRC}
                                            alt="Import / Export screen showing file picker and Importieren/Exportieren buttons"
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
                                            <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                            <PlaceholderText>
                                                Add <code>public/guide/ImportExport.jpeg</code> to show the
                                                import/export screenshot.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}

                                {hasImportConfirmationScreenshot ? (
                                    <ScreenshotFigure aria-label="Import confirmation screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_EXPORT_CONFIRMATION_SCREENSHOT_SRC}
                                            alt="Import confirmation modal showing extend vs overwrite options"
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
                                            <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                            <PlaceholderText>
                                                Add <code>public/guide/ImportConfirmation.jpeg</code> to show the
                                                confirmation screenshot.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}

                                {hasImportInProcessScreenshot ? (
                                    <ScreenshotFigure aria-label="Import progress screenshot">
                                        <ScreenshotImage
                                            src={IMPORT_IN_PROCESS_SCREENSHOT_SRC}
                                            alt="Import in progress showing a progress indicator"
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
                                            <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                            <PlaceholderText>
                                                Add <code>public/guide/ImportInProcess.jpeg</code> to show the
                                                in-progress import screenshot.
                                            </PlaceholderText>
                                        </ScreenshotBody>
                                    </ScreenshotPlaceholder>
                                )}
                            </VisualColumn>
                        </DesktopOnly>
                    </TaskGrid>
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
                            <span>Packing plans</span>
                        </TaskTitle>
                        <TaskSubtitle>
                            Create a packing plan by selecting items in “Pack” mode, set required quantities, then save
                            and review the plan.
                        </TaskSubtitle>
                    </TaskHeader>

                    <TaskGrid>
                        <Steps>
                            <Step>
                                <StepIcon>
                                    <Package size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Open “Inventar”</StepTitle>
                                    <StepText>Use the sidebar navigation to open the inventory list.</StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <Package size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Enable “Pack” mode</StepTitle>
                                    <StepText>
                                        In the top bar, click <strong>Pack</strong>. The UI switches to selection mode.
                                    </StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <MousePointerClick size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Select items</StepTitle>
                                    <StepText>
                                        Click item rows/cards to select them for the plan. Selected items are
                                        highlighted.
                                    </StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <ArrowDownNarrowWide size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Set quantities</StepTitle>
                                    <StepText>
                                        Use the quantity controls (spinner) to set the{' '}
                                        <strong>required quantity</strong> for each selected item.
                                    </StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <SquarePen size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Name the plan</StepTitle>
                                    <StepText>
                                        Enter a plan name in the <strong>Plan name…</strong> field (shown while in pack
                                        mode).
                                    </StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <CheckCircle2 size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Save</StepTitle>
                                    <StepText>
                                        Click <strong>Save</strong>. The app creates the packing plan and opens its
                                        details page.
                                    </StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <ClipboardList size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Open Packing Plan</StepTitle>
                                    <StepText>
                                        Click <strong>Packing Plans</strong> in the sidebar (tab with the list icon) to
                                        open the overview of all saved packing plans.
                                    </StepText>
                                </div>
                            </Step>

                            <Step>
                                <StepIcon>
                                    <MousePointerClick size={16} />
                                </StepIcon>
                                <div>
                                    <StepTitle>Open a saved plan</StepTitle>
                                    <StepText>Select a plan from the list to open its details again.</StepText>
                                </div>
                            </Step>
                        </Steps>

                        <VisualColumn>
                            {hasPackPlanScreenshot ? (
                                <ScreenshotFigure aria-label="Packing plans screenshot">
                                    <ScreenshotImage
                                        src={PACKING_PLANS_SCREENSHOT_SRC}
                                        alt="Inventory pack mode with selected items, plan name input, and save action"
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
                                        <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                        <PlaceholderText>
                                            Add <code>public/guide/PackPlan.jpeg</code> to show the packing plan
                                            screenshot.
                                        </PlaceholderText>
                                    </ScreenshotBody>
                                </ScreenshotPlaceholder>
                            )}

                            {hasPackPlan2Screenshot ? (
                                <ScreenshotFigure aria-label="Packing plans screenshot 2">
                                    <ScreenshotImage
                                        src={PACKING_PLANS_SCREENSHOT_2_SRC}
                                        alt="Packing plan step 2"
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
                                        <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                        <PlaceholderText>
                                            Add <code>public/guide/PackPlan2.jpeg</code> to show the packing plan (step
                                            2) screenshot.
                                        </PlaceholderText>
                                    </ScreenshotBody>
                                </ScreenshotPlaceholder>
                            )}

                            {hasPackPlan3Screenshot ? (
                                <ScreenshotFigure aria-label="Packing plans screenshot 3">
                                    <ScreenshotImage
                                        src={PACKING_PLANS_SCREENSHOT_3_SRC}
                                        alt="Packing plan step 3"
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
                                        <PlaceholderTitle>Screenshot goes here</PlaceholderTitle>
                                        <PlaceholderText>
                                            Add <code>public/guide/PackPlan3.jpeg</code> to show the packing plan (step
                                            3) screenshot.
                                        </PlaceholderText>
                                    </ScreenshotBody>
                                </ScreenshotPlaceholder>
                            )}
                        </VisualColumn>
                    </TaskGrid>
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
