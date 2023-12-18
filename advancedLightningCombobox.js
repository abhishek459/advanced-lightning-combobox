import { LightningElement, api, track } from 'lwc';

export default class AdvancedLightningCombobox extends LightningElement {
    inputIsFocused = false;

    /**
     * An array of dropdown items received from parent component in the format:
     * [{label: 'Abhishek Thulasi', value: 'Abhishek Thulasi'}]
     */
    @api get items() {
        return this.dropdownItems;
    }

    /**
     * An array of dropdown items in the format [{label: 'Abhishek Thulasi', value: 'Abhishek Thulasi'}]
     */
    set items(value) {
        if (this.dropdownItems !== value) {
            this.prepareDropdownItemsData(value);
            this.filteredDropdownItems = this.dropdownItems;
            this.selectedItemsCounter = 0;
        }
    };

    @api label; // Stores the displayed label for the combobox
    @track dropdownItems = []; // An array of objects representing dropdown items (label, value, isSelected and counter)
    @track filteredDropdownItems = []; // A filtered version of dropdownItems based on user search
    selectedItemsCounter = 0; // Track the number of currently selected items
    selectedItemsString = ''; // String displayed on hover showing selected items


    get noItemsInDropdown() {
        return this.filteredDropdownItems.length === 0 && !this.searching ? true : false;
    }

    get placeholder() {
        return this.selectedItemsCounter + ' selected';
    }

    /**
     * Processes the dropdown items from the parent component, adding attributes like isSelected and index.
     * @param value An array passed from parent component in the format [{label: 'Abhishek Thulasi', value: 'Abhishek Thulasi'}].
     */
    prepareDropdownItemsData(value) {
        this.dropdownItems = JSON.parse(JSON.stringify(value));
        let counter = 0;
        this.dropdownItems.forEach(item => {
            item.isSelected = false;
            item.index = counter;
            counter++;
        });
    }

    timeout; // Timeout for key debouncing while user searches for an option
    searching = false; // Loading indicator displayed while searching

    /**
     * Handles user input in the search box, filters filteredDropdownItems, and shows a loading indicator
     */
    inputChange(event) {
        const searchValue = event.target.value;
        this.searching = true; // Enabling loading indicator
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.filteredDropdownItems = this.dropdownItems.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()));
            this.searching = false;
        }, 200);
    }

    /**
    * Toggles the selection of a clicked item, updates counter, string, and sends a CustomEvent to the parent
    */
    itemClicked(event) {
        const itemIndex = event.currentTarget.dataset.index;
        this.toggleSelectedItem(itemIndex);
        this.updateCounter(itemIndex);
        const selectedItemsList = this.dropdownItems.filter(item => item.isSelected);
        this.selectedItemsString = this.buildSelectedItemsString(selectedItemsList);
        this.updateParentComponent(selectedItemsList);
    }

    /**
     * Inverts the isSelected flag of the item at the given index
     */
    toggleSelectedItem(itemIndex) {
        this.dropdownItems[itemIndex].isSelected = !this.dropdownItems[itemIndex].isSelected;
    }

    /**
     * Increments or decrements selectedItemsCounter based on item selection
     */
    updateCounter(itemIndex) {
        const isSelected = this.dropdownItems[itemIndex].isSelected;
        isSelected ? this.selectedItemsCounter++ : this.selectedItemsCounter--;
    }

    /**
     * Joins the labels of selected items with commas and spaces
     */
    buildSelectedItemsString(selectedItems) {
        return selectedItems.map(item => item.label).join(', '); // Add comma and space before slicing
    }

    /**
     * Prepares values for the parent component and dispatches a change CustomEvent.
     */
    updateParentComponent(checkedItems) {
        const values = this.prepareParentComponentData(checkedItems);
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: {
                    values: values
                }
            })
        );
    }

    /**
     * Generates a semicolon-separated string of selected item values for the parent component.
     */
    prepareParentComponentData(checkedItems) {
        let values = '';
        checkedItems.forEach(item => {
            values += item.value + ';';
        });
        values = values.slice(0, -1);
        return values;
    }
}