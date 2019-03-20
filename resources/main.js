require('./bundle.scss');
import ('./template.html');

const LSController = (function () {


    return {

    }
})();

const budgetController = (function () {
    const data = {
        items: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0,
        percentage: -1,
    };

    const Expense = function (id, desc, val) {
        this.id = id;
        this.value = val;
        this.description = desc;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage
    };

    const Income = function (id, desc, val) {
        this.id = id;
        this.value = val;
        this.description = desc;
    };

    function calculateTotal (type) {
        data.totals[type] = data.items[type].reduce((acc, item) => acc + item.value, 0);
    }

    return {
        addItem: function ({type, desc, val}) {
            let newItem;
            let ID;
            // Get new id based on id of last element in type array plus 1
            if (data.items[type].length > 0) {
                ID = data.items[type][data.items[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create item based on type 'exp' or 'inc'
            if (type === 'exp') {
                newItem = new Expense(ID, desc, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, desc, val);
            }

            // Add item to their type array
            data.items[type].push(newItem);

            //Add value to their type statement
            data.totals[type] += +val;

            return newItem;
        },

        deleteItem: function (type, id) {
            const ids = data.items[type].map(item => item.id);
            const itemPos = ids.indexOf(id);

            if (itemPos !== -1) {
                data.items[type].splice(itemPos, 1);
            }
        },

        calculateBudget: function () {

            // 1. Calculate total income & expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // 2. Calculate budget: income - budget
            data.budget = data.totals.inc - data.totals.exp;

            // 3.1 Check total inc on exist because we don't want infinity result
            if (data.totals.inc > 0) {
                // 3. Calculate the percentage of income that we spent
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                // Set percentage to -1 that means don't calculate percentage
                data.percentage = -1;
            }

        },

        updatePercentages: function () {
            // 1. Recalculate percentages
            data.items.exp.forEach(el => el.calcPercentage(data.totals.inc))
        },

        getPercentages: function () {
          return data.items.exp.map((el) => el.getPercentage());
        },

        test: function () {
            console.log(data);
        },

        getBudget: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                exp: data.totals.exp,
                inc: data.totals.inc
            }
        }
    };
})();

const UIController = (function () {

    const DOMElements = {
        selectType: document.querySelector('[name=type]'),
        inputDescription: document.querySelector('[name=description]'),
        inputValue: document.querySelector('[name=value]'),
        form: document.querySelector('.add .add__form'),
        expList: document.querySelector('.expenses__list'),
        incList: document.querySelector('.income__list'),
        budgetLabel: document.querySelector('.budget__value'),
        incomeLabel: document.querySelector('div.budget__income--value'),
        expensesLabel: document.querySelector('div.budget__expenses--value'),
        percentageLabel: document.querySelector('div.budget__expenses--percentage'),
        monthLabel: document.querySelector('span.budget__title--month'),
        listsContainer: document.getElementById('Lists')
    };

    const DOMStrings = {
        expensesPercentageLabels: '.expenses .item__percentage'
    };

    function formatNumber (num) {
        const fixedNum = num.toFixed(2);
        const splitNum = fixedNum.split('.');
        const intPart = splitNum[0];
        const decPart =  splitNum[1];

        let formattedNum;

        if (intPart.length > 3 && intPart.length < 7) {
            formattedNum = intPart.substr(0, intPart.length - 3)  + ', ' + intPart.substr(-3) + '.' + decPart;
        } else if (intPart.length > 6 && intPart.length < 10) {
            formattedNum = intPart.substr(0, intPart.length - 6)  + ', ' + intPart.substr(-6, 3) + ' ' + intPart.substr(-3) + '.' + decPart;
        } else {
            formattedNum = intPart + '.' + decPart;
        }

        return formattedNum;
    }

    return {
        // Getters
        getFormData: function () {
            const type = DOMElements.selectType.value; // It can be 'exp' or 'inc'
            const description = DOMElements.inputDescription.value;
            const value = parseFloat(DOMElements.inputValue.value);

            return {
                type: type,
                desc: description,
                val: value
            };
        },

        getDOMElements: function () {
            return DOMElements;
        },

        // Setters

        setCurrentMonth: function () {
            const date = new Date();  // 2009-11-10
            DOMElements.monthLabel.textContent = date.toLocaleString('en-us', {month: 'long', year: 'numeric'});
        },

        // Functions

        clearFields () {
            const inputFields = [DOMElements.inputDescription, DOMElements.inputValue];

            inputFields.forEach((el) => {
                el.value = '';
            });

            inputFields[0].focus();
        },

        addListItem: function (obj, type) {
            let htmlString;

            if (type === 'inc') {
                htmlString = `<div class="item" data-id=inc-${obj.id}>
                                <div class="item__description">${obj.description}</div>
                                <div class="item__delete">
                                    <button class="item__delete-btn">
                                        <svg class="item__delete-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                                            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="item__info">
                                    <div class="item__value">+ ${formatNumber(obj.value)}</div>
                                </div>
                            </div>`;
            } else if (type === 'exp') {
                htmlString = `<div class="item" data-id=exp-${obj.id}>
                                <div class="item__description">${obj.description}</div>
                                <div class="item__delete">
                                    <button class="item__delete-btn">
                                        <svg class="item__delete-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
                                            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
                                        </svg>
                                    </button>
                                </div>
                                <div class="item__info">
                                    <div class="item__value">- ${formatNumber(obj.value)}</div>
                                    <div class="item__percentage">21%</div>
                                </div>
                            </div>`;
            }

            DOMElements[type + 'List'].insertAdjacentHTML('beforeend', htmlString);
        },

        deleteListItem: function (el) {
            el.remove();
        },

        displayBudget: function (obj) {
            DOMElements.budgetLabel.textContent = formatNumber(obj.budget) + ' $';
            DOMElements.percentageLabel.textContent = obj.percentage > 0 ? obj.percentage + '%' : '-';
            DOMElements.expensesLabel.textContent = '- ' + formatNumber(obj.exp);
            DOMElements.incomeLabel.textContent = '+ ' + formatNumber(obj.inc);
        },
        
        displayPercentages: function (percentages) {
            const percentagesLabels = document.querySelectorAll(DOMStrings.expensesPercentageLabels);
            [...percentagesLabels].forEach((label, index) => {
                label.textContent = percentages[index] > 0
                    ? percentages[index] + '%'
                    : '-';
            })


        }
    };
})();

const controller = (function (budgetCtrl, UICtrl, LSCtrl) {

    function setupEventListeners () {
        const DOM = UICtrl.getDOMElements();

        DOM.form.addEventListener('submit', ctrlAddItem);

        DOM.listsContainer.addEventListener('click', ctrlDeleteItem);
    }

    function updateBudget () {
        let budget;

        // 1. Calculate budget
        budgetCtrl.calculateBudget('inc');

        // 2. Return the budget
        budget = budgetCtrl.getBudget();

        // 3. Display budget on UI
        UICtrl.displayBudget(budget);
    }

    function updatePercentages () {
        let percentages;

        // 1. Calculate percentages
        budgetCtrl.updatePercentages();

        // 2. Read percentages from budgetctrl
        percentages = budgetCtrl.getPercentages();

        // 3. Update UI with new percentages
        UICtrl.displayPercentages(percentages);
        console.log(percentages);

    }

    function formDataValidate ({desc, val}) {
        const DOM = UICtrl.getDOMElements();
        let descPass = desc.length > 0;
        let valPass = val > 0;

        if (!descPass) {
            DOM.inputDescription.classList.add('is-invalid');
        } else {
            DOM.inputDescription.classList.remove('is-invalid');
        }

        if (!valPass) {
            DOM.inputValue.classList.add('is-invalid');
        } else {
            DOM.inputValue.classList.remove('is-invalid');
        }

        return descPass && valPass;
    }

    function ctrlAddItem (e) {
        e.preventDefault();
        // 1. Get form data
        const itemData = UICtrl.getFormData(); // It will be an object with 3 properties

        // 2. Validate data

        const isDataValid = formDataValidate(itemData); // Data is valid if fn return true

        if (isDataValid) {
            // 3. Add item to budget controller
            const newItem = budgetCtrl.addItem(itemData); // Fn will return created object item

            // 4. Clear form inputs
            UICtrl.clearFields();

            // 5. Add item to UI
            UICtrl.addListItem(newItem, itemData.type);

            // 6. Update budget
            updateBudget();

            // 7. Calculate and update percentages
            updatePercentages();

        } else {
            console.log('Invalid data');
        }
    }

    function ctrlDeleteItem (e) {
        let itemEl;
        let itemID;
        let splitID;
        let type;
        let id;

        // 1. Retrieve id information
        if (e.target.closest('button.item__delete-btn')) {
            itemEl = e.target.closest('div.item');
            itemID = itemEl.dataset.id;

            if (itemID) {
                splitID = itemID.split('-');
                type = splitID[0];
                id = +splitID[1];

                // 2. Delete item from budget
                budgetCtrl.deleteItem(type, id);
                budgetCtrl.test();

                // 3. Delete item from UI
                UICtrl.deleteListItem(itemEl);

                // 4. Update budget
                updateBudget();

                // 5. Calculate and update percentages
                updatePercentages();
            }
        }
    }

    return {
        init: function () {
            let budget;
            console.log('App is started');

            // 1. Set current Month
            UICtrl.setCurrentMonth();

            // 2. Display current budget
            budget = budgetCtrl.getBudget();
            UICtrl.displayBudget(budget);

            // 3. Setup events
            setupEventListeners();
        }
    };
})(budgetController, UIController, LSController);

controller.init();