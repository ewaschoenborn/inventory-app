export function addMonths(date: Date, months: number): Date {
    const d = new Date(date.getTime());
    const day = d.getDate();

    d.setDate(1);
    d.setMonth(d.getMonth() + months);
    const daysInTargetMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, daysInTargetMonth));
    return d;
}

export function calculateNextInspectionDate(
    lastInspection: string | undefined,
    inspectionIntervalMonths: number | undefined
): Date | null {
    if (!lastInspection || !inspectionIntervalMonths) {
        return null;
    }
    return addMonths(new Date(lastInspection), inspectionIntervalMonths);
}
