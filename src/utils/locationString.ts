export function parseLocationStringRaw(locationString: string) {
    const pattern = /^(\d+)?-?([RG])?(\d+)?\.?(\d+)?-?(\d+)?$/;

    if (!locationString || locationString.trim() === '') {
        throw new Error('Location string is empty');
    }

    const match = locationString.match(pattern);

    if (!match) {
        throw new Error(
            `Invalid location format: "${locationString}". Expected format: [Layer]-[Type][ContainerNum].[SubcontainerNum]-[ToolNum]`
        );
    }

    const [, layer, typeCode, containerNumber, subcontainerNumber, toolNumber] = match;

    return {
        layer: layer,
        type: typeCode,
        containerNumber: containerNumber,
        subcontainerNumber: subcontainerNumber,
        toolNumber: toolNumber,
    };
}

export function parseLocationString(locationString: string) {
    const pattern = /^(\d+)?-?([RG])?(\d+)?\.?(\d+)?-?(\d+)?$/;

    if (!locationString || locationString.trim() === '') {
        throw new Error('Location string is empty');
    }

    const match = locationString.match(pattern);

    if (!match) {
        throw new Error(
            `Invalid location format: "${locationString}". Expected format: [Layer]-[Type][ContainerNum].[SubcontainerNum]-[ToolNum]`
        );
    }

    const [, layer, typeCode, containerNumber, subcontainerNumber, toolNumber] = match;

    return {
        layer: layer ?? '-',
        type: typeCode === 'R' ? 'Rolling Container' : typeCode === 'G' ? 'Box (EU-Palette)' : '-',
        containerNumber: containerNumber ?? '-',
        subcontainerNumber: subcontainerNumber ?? '-',
        toolNumber: toolNumber ?? '-',
    };
}

export function mapLocationKey(locationKey: string) {
    const translation = {
        layer: 'Ebene',
        type: 'Containertyp',
        containerNumber: 'Container-Nr.',
        subcontainerNumber: 'Subcontainer-Nr.',
        toolNumber: 'Werkzeug-Nr.',
    };

    return translation[locationKey as keyof typeof translation] || locationKey;
}
