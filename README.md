
# Advanced Lightning Combobox

This readme provides instructions on how to use the `advancedLightningCombobox`, a custom LWC component offering multi-select and search functionalities to the standard `lightning-combobox`.

## 1. Create a new LWC Component

- In your Salesforce Org, create a new Lightning Web Component
- Enter a descriptive name, for example `advancedLightningCombobox`
- Copy paste the entire HTML, CSS and JavaScript code for your custom LWC Component into this file and replace the existing code.

## 2. Refer Your Child Component in the Parent Component

- In your Parent Component where you want to use the `advancedLightningCombobox` add the following code:

```html
<template>
    <c-advanced-lightning-combobox
    ></c-advanced-lightning-combobox>
</template>
```
- The above code imports the `advancedLightningCombobox` component and renders it within your existing component.
- Please note that no attributes haven't been added yet. We'll define them in the next steps.

## 3. Pass Dropdown Options to the Child Component

- Define an array of objects in your parent component's JavaScript file to represent the dropdown options. This format should mimic the format you use to pass data to a standard lightning-combobox component as shown below.

```javaScript
import { LightningElement } from "lwc";

export default class ParentComponent extends LightningElement {
    dropdownItems = [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' }
    ];

    label = 'Select Contacts';
}
```

- In your parent component's HTML file, provide the `dropdownItems` array to the `items` property exposed by the `c-advanced-lightning-combobox` component and set the `label` attribute with a short descriptive text.

```html
<template>
    <c-advanced-lightning-combobox
    label={label}
    items={dropdownItems}
    ></c-advanced-lightning-combobox>
</template>
```

## 4. Implement Selection Handling

- In the HTML file of your Parent Component, add the `onchange` attribute to the `c-advanced-lightning-combobox` component.

```html
<template>
    <c-advanced-lightning-combobox
    label={label}
    items={dropdownItems}
    onchange={handleSelectionChange}
    ></c-advanced-lightning-combobox>
</template>
```

- This binds the `handleSelectionChange` method to the change event emitted by the `c-advanced-lightning-combobox` component.
- Define the `handleSelectionChange` method in your parent component's JavaScript file as shown below.

```javascript
handleSelectionChange(event) {
    const selectedValuesString = event.detail.values;
    const selectedValuesArray = selectedValuesString.split(';');
}
```

- The `event.detail.values` property in the change event holds the selected values, delivered as a semicolon-separated string.
- The split() method then splits this string into an array of individual values.
- You can now utilize this array of selected values within your parent component's logic.
