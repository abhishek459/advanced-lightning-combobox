import { LightningElement, api, track } from 'lwc';

export default class AdvancedLightningCombobox extends LightningElement {
    inputIsFocused = false;
    set items(value) {
        if (this.dropdownItems !== value) {
            this.prepareDropdownItemsData(value);
            this.filteredDropdownItems = this.dropdownItems;
            this.selectedItemsCounter = 0;
        }
    };

    @api get items() {
        return this.dropdownItems;
    }
    @api label;
    @track dropdownItems = [];
    @track filteredDropdownItems = [];
    selectedItemsCounter = 0;
    selectedItemsString = '';

    get noItemsInDropdown() {
        return this.filteredDropdownItems.length === 0 && !this.searching ? true : false;
    }

    get placeholder() {
        return this.selectedItemsCounter + ' selected';
    }

    prepareDropdownItemsData(value) {
        this.dropdownItems = JSON.parse(JSON.stringify(value));
        let counter = 0;
        this.dropdownItems.forEach(item => {
            item.selected = false;
            item.index = counter;
            counter++;
        });
    }

    timeout;
    searching = false;
    inputChange(event) {
        const searchValue = event.target.value;
        this.searching = true;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.filteredDropdownItems = this.dropdownItems.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()));
            this.searching = false;
        }, 200);
    }

    itemClicked(event) {
        const itemIndex = event.currentTarget.dataset.index;
        this.toggleSelectedItem(itemIndex);
        this.updateCounter(itemIndex);
        const selectedItemsList = this.dropdownItems.filter(item => item.selected);
        this.selectedItemsString = this.buildSelectedItemsString(selectedItemsList);
        this.updateParentComponent(selectedItemsList);
    }

    toggleSelectedItem(itemIndex) {
        this.dropdownItems[itemIndex].selected = !this.dropdownItems[itemIndex].selected;
    }

    updateCounter(itemIndex) {
        const isSelected = this.dropdownItems[itemIndex].selected;
        isSelected ? this.selectedItemsCounter++ : this.selectedItemsCounter--;
    }

    buildSelectedItemsString(selectedItems) {
        return selectedItems.map(item => item.label).join(', '); // Add comma and space before slicing
    }

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

    prepareParentComponentData(checkedItems) {
        let values = '';
        checkedItems.forEach(item => {
            values += item.value + ';';
        });
        values = values.slice(0, -1);
        return values;
    }
}