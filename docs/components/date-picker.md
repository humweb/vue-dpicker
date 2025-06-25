&lt;script setup&gt;
import DatePickerExample from './DatePickerExample.vue'
&lt;/script&gt;

# DatePicker

### `DatePicker.vue`

This is the main component that orchestrates the date picking functionality.

**Props**

| Prop           | Type                                         | Default | Description                                                                                  |
| :------------- | :------------------------------------------- | :------ | :------------------------------------------------------------------------------------------- |
| `modelValue`   | `ModelValue`                                 | `null`  | The selected date or date range. Can be a `Date` object, a string, or a range object.        |
| `inline`       | `boolean`                                    | `false` | If `true`, the datepicker is rendered directly in the page flow. Otherwise, it's a dropdown. |
| `enableTime`   | `boolean`                                    | `false` | If `true`, a time picker is included for single date selections.                             |
| `range`        | `boolean`                                    | `false` | If `true`, allows for the selection of a date range.                                         |
| `presets`      | `Preset[]`                                   | `[]`    | An array of predefined date ranges that the user can select from.                            |
| `outputFormat` | `string \| ((date: Date) => string) \| null` | `null`  | The format of the emitted date string. Can be a `dayjs` format string or a custom function.  |
| `is24hr`       | `boolean`                                    | `true`  | If `true`, the time picker uses a 24-hour format. Otherwise, it uses AM/PM.                  |
| `calendars`    | `number`                                     | `2`     | The number of calendars to display simultaneously.                                           |
| `disabled`     | `boolean`                                    | `false` | If `true`, the datepicker input is disabled.                                                 |
| `minDate`      | `string \| Date \| null`                     | `null`  | The earliest date that can be selected.                                                      |
| `maxDate`      | `string \| Date \| null`                     | `null`  | The latest date that can be selected.                                                        |

**Events**

| Event               | Payload                                           | Description                                      |
| :------------------ | :------------------------------------------------ | :----------------------------------------------- |
| `update:modelValue` | `ModelValue`                                      | Emitted when the selected date or range changes. |
| `on-open`           | `undefined`                                       | Emitted when the datepicker popover is opened.   |
| `on-close`          | `undefined`                                       | Emitted when the datepicker popover is closed.   |
| `date-selected`     | `string \| Date`                                  | Emitted when a single date is selected.          |
| `range-selected`    | `{ start: string \| Date; end: string \| Date; }` | Emitted when a date range is fully selected.     |

**Slots**

This component does not provide any slots.

---

### `Calendar.vue`

This sub-component displays a single month calendar.

**Props**

| Prop          | Type                        | Default      | Description                                                          |
| :------------ | :-------------------------- | :----------- | :------------------------------------------------------------------- |
| `modelValue`  | `Date \| DateRange \| null` | `null`       | The currently selected date or date range.                           |
| `range`       | `boolean`                   | `false`      | If `true`, the calendar supports range selection.                    |
| `currentDate` | `Date`                      | `new Date()` | The date that determines which month and year the calendar displays. |
| `hidePrev`    | `boolean`                   | `false`      | If `true`, the "previous month" navigation button is hidden.         |
| `hideNext`    | `boolean`                   | `false`      | If `true`, the "next month" navigation button is hidden.             |

**Events**

| Event               | Payload             | Description                                          |
| :------------------ | :------------------ | :--------------------------------------------------- |
| `update:modelValue` | `Date \| DateRange` | Emitted when a date is clicked.                      |
| `prev-month`        | `undefined`         | Emitted when the "previous month" button is clicked. |
| `next-month`        | `undefined`         | Emitted when the "next month" button is clicked.     |

**Slots**

This component does not provide any slots.

---

### `TimePicker.vue`

This sub-component allows for the selection of a specific time.

**Props**

| Prop         | Type                                  | Default | Description                                                                   |
| :----------- | :------------------------------------ | :------ | :---------------------------------------------------------------------------- |
| `modelValue` | `{ hours: number; minutes: number; }` |         | An object containing the selected hours and minutes.                          |
| `is24hr`     | `boolean`                             | `true`  | If `true`, the time is displayed in 24-hour format. Otherwise, it uses AM/PM. |

**Events**

| Event               | Payload                               | Description                    |
| :------------------ | :------------------------------------ | :----------------------------- |
| `update:modelValue` | `{ hours: number; minutes: number; }` | Emitted when the time changes. |

**Slots**

This component does not provide any slots.

---

### `Presets.vue`

This sub-component displays a list of predefined date ranges.

**Props**

| Prop      | Type       | Default | Description                                   |
| :-------- | :--------- | :------ | :-------------------------------------------- |
| `presets` | `Preset[]` | `[]`    | An array of `Preset` objects to be displayed. |

- **`Preset` type:** `{ label: string; range: { start: Date; end: Date; } }`

**Events**

| Event    | Payload                       | Description                              |
| :------- | :---------------------------- | :--------------------------------------- |
| `select` | `{ start: Date; end: Date; }` | Emitted when a preset range is selected. |

**Slots**

This component does not provide any slots.

## Examples

Here is a basic example of the `DatePicker` component.

<DatePickerExample />
