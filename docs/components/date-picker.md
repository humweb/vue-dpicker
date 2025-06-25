# DatePicker

This is the documentation for the DatePicker component.

## Props

The `DatePicker` component accepts the following properties:

| Prop name      | Type                                         | Default | Description                             |
| -------------- | -------------------------------------------- | ------- | --------------------------------------- |
| `modelValue`   | `ModelValue`                                 | `null`  | The value of the date picker.           |
| `inline`       | `boolean`                                    | `false` | Display the calendar inline.            |
| `enableTime`   | `boolean`                                    | `false` | Enable time picker.                     |
| `range`        | `boolean`                                    | `false` | Enable date range selection.            |
| `presets`      | `Preset[]`                                   | `[]`    | An array of preset ranges.              |
| `outputFormat` | `string \| ((date: Date) => string) \| null` | `null`  | The format of the output date.          |
| `is24hr`       | `boolean`                                    | `false` | Use 24-hour format for the time picker. |
| `calendars`    | `number`                                     | `1`     | The number of calendars to display.     |
| `disabled`     | `boolean`                                    | `false` | Disable the date picker.                |
| `minDate`      | `string \| Date \| null`                     | `null`  | The minimum selectable date.            |
| `maxDate`      | `string \| Date \| null`                     | `null`  | The maximum selectable date.            |

## Examples

Here is a basic example of the `DatePicker` component.

<DatePickerExample />
