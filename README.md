# vue-dpicker

A versatile and customizable datepicker component for Vue 3, built with Day.js and Tailwind CSS.

## Features

- Single date and range selection
- Time picking capabilities
- Date presets for quick selections
- Inline and popover modes
- Customizable output format
- Lightweight and dependency-free (except for Day.js)

## Installation

To install dependencies:

```bash
bun install
```

To run the example:

```bash
cd example
bun run dev
```

## Component Reference

### `DatePicker.vue`

The main component that wraps the calendar, time picker, and presets.

**Props**

| Prop           | Type                                                                         | Default | Description                                                                                    |
| -------------- | ---------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `modelValue`   | `String` \| `Date` \| `{ start: Date \| null, end: Date \| null }` \| `null` | `null`  | The selected date or range.                                                                    |
| `inline`       | `Boolean`                                                                    | `false` | If `true`, the datepicker is displayed inline.                                                 |
| `enableTime`   | `Boolean`                                                                    | `false` | If `true`, the time picker is enabled.                                                         |
| `range`        | `Boolean`                                                                    | `false` | If `true`, range selection is enabled.                                                         |
| `presets`      | `Array<{ label: string, range: { start: Date, end: Date } }>`                | `[]`    | An array of preset ranges to display.                                                          |
| `outputFormat` | `String` \| `(date: Date) => string` \| `null`                               | `null`  | The format for the outputted date string. Can be a `dayjs` format string or a custom function. |
| `is24hr`       | `Boolean`                                                                    | `true`  | If `true`, the time picker uses a 24-hour format.                                              |
| `calendars`    | `Number`                                                                     | `2`     | The number of calendars to display side-by-side.                                               |
| `disabled`     | `Boolean`                                                                    | `false` | If `true`, the datepicker is disabled.                                                         |
| `minDate`      | `String` \| `Date` \| `null`                                                 | `null`  | The minimum selectable date.                                                                   |
| `maxDate`      | `String` \| `Date` \| `null`                                                 | `null`  | The maximum selectable date.                                                                   |

**Events**

| Event               | Payload                                | Description                                      |
| ------------------- | -------------------------------------- | ------------------------------------------------ |
| `update:modelValue` | `Date` \| `{ start: Date, end: Date }` | Emitted when the selected date or range changes. |
| `on-open`           | `undefined`                            | Emitted when the datepicker is opened.           |
| `on-close`          | `undefined`                            | Emitted when the datepicker is closed.           |
| `date-selected`     | `Date`                                 | Emitted when a single date is selected.          |
| `range-selected`    | `{ start: Date, end: Date }`           | Emitted when a date range is selected.           |

**Slots**

This component does not have any slots.

---

### `Calendar.vue`

Displays the calendar grid for a single month.

**Props**

| Prop          | Type                                                   | Default      | Description                                       |
| ------------- | ------------------------------------------------------ | ------------ | ------------------------------------------------- |
| `modelValue`  | `Date` \| `{ start: Date \| null, end: Date \| null }` | `null`       | The selected date or range.                       |
| `range`       | `Boolean`                                              | `false`      | If `true`, range selection is enabled.            |
| `currentDate` | `Date`                                                 | `new Date()` | The date that determines the month to display.    |
| `hidePrev`    | `Boolean`                                              | `false`      | If `true`, the "previous month" button is hidden. |
| `hideNext`    | `Boolean`                                              | `false`      | If `true`, the "next month" button is hidden.     |

**Events**

| Event               | Payload                                | Description                                          |
| ------------------- | -------------------------------------- | ---------------------------------------------------- |
| `update:modelValue` | `Date` \| `{ start: Date, end: Date }` | Emitted when the selected date or range changes.     |
| `prev-month`        | `undefined`                            | Emitted when the "previous month" button is clicked. |
| `next-month`        | `undefined`                            | Emitted when the "next month" button is clicked.     |

**Slots**

This component does not have any slots.

---

### `TimePicker.vue`

Displays controls for selecting the time.

**Props**

| Prop         | Type                                 | Default | Description                                       |
| ------------ | ------------------------------------ | ------- | ------------------------------------------------- |
| `modelValue` | `{ hours: number, minutes: number }` | `N/A`   | The selected time. (Required)                     |
| `is24hr`     | `Boolean`                            | `true`  | If `true`, the time picker uses a 24-hour format. |

**Events**

| Event               | Payload                              | Description                             |
| ------------------- | ------------------------------------ | --------------------------------------- |
| `update:modelValue` | `{ hours: number, minutes: number }` | Emitted when the selected time changes. |

**Slots**

This component does not have any slots.

---

### `Presets.vue`

Displays a list of preset date ranges.

**Props**

| Prop      | Type                                                          | Default | Description                           |
| --------- | ------------------------------------------------------------- | ------- | ------------------------------------- |
| `presets` | `Array<{ label: string, range: { start: Date, end: Date } }>` | `[]`    | An array of preset ranges to display. |

**Events**

| Event    | Payload                      | Description                              |
| -------- | ---------------------------- | ---------------------------------------- |
| `select` | `{ start: Date, end: Date }` | Emitted when a preset range is selected. |

**Slots**

This component does not have any slots.
