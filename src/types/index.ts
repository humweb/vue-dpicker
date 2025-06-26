export interface DateRange {
    start: Date | null;
    end: Date | null;
}

export type ModelValue = string | Date | { start: string | Date | null; end: string | Date | null } | null;

export interface Preset {
    label: string;
    range: {
        start: Date;
        end: Date;
    };
}

export interface DatePickerProps {
    modelValue?: ModelValue;
    inline?: boolean;
    enableTime?: boolean;
    range?: boolean;
    presets?: Preset[];
    outputFormat?: 'object' | string | ((date: Date) => string) | null;
    is24hr?: boolean;
    calendars?: number;
    disabled?: boolean;
    minDate?: string | Date | null;
    maxDate?: string | Date | null;
}
