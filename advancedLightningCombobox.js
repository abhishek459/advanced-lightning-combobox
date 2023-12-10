import { LightningElement, api, track } from 'lwc';

export default class AdvancedLightningCombobox extends LightningElement {
    inputIsFocused = false;
    @api items;
    @api label;
    @track dropdownItems = [];
    @track filteredDropdownItems = [];
    selectedItemsCounter = 0;

    get noItemsInDropdown() {
        return this.filteredDropdownItems.length === 0 ? true : false;
    }

    get placeholder() {
        return this.selectedItemsCounter + ' selected';
    }

    connectedCallback() {
        setTimeout(() => {
            this.dropdownItems = JSON.parse(JSON.stringify(this.items));
            let counter = 0;
            this.dropdownItems.forEach(item => {
                item.selected = false;
                item.index = counter;
                counter++;
            })
            this.filteredDropdownItems = this.dropdownItems;
        }, 1);
    }

    inputChange(event) {
        const searchValue = event.target.value;

        this.filteredDropdownItems = this.dropdownItems.filter(item => item.label.toLowerCase().includes(searchValue.toLowerCase()));
    }

    itemClicked(event) {
        try {
            const index = event.currentTarget.dataset.index;
            const selected = this.dropdownItems[index].selected;
            this.dropdownItems[index].selected = !selected;
            this.updateCounter(!selected);
            this.onchangeEvent();
        } catch (error) {
            console.log(error);
        }
    }

    updateCounter(selected) {
        if (selected)
            this.selectedItemsCounter++;
        else
            this.selectedItemsCounter--;
    }

    onchangeEvent() {
        let checkedItems = [];
        this.dropdownItems.forEach(element => {
            if (element.selected)
                checkedItems.push({
                    'label': element.label,
                    'value': element.value
                });
        });
        this.dispatchEvent(
            new CustomEvent('change', {
                detail: JSON.stringify(checkedItems)
            })
        );
    }
}