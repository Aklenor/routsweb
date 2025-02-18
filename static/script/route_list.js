const MULTIPLE_CHOICE_FIELDS = ["difficulty", "surface", "direction", "tags"];

/*
 * Observable classes events
 */
const RESIZE = "RESIZE";
const UPDATE = "UDPATE";
const MULTIPLE_CHOICE_OPEN = "MULTIPLE_CHOICE_OPEN";
const MULTIPLE_CHOICE_CLOSE = "MULTIPLE_CHOICE_CLOSE";
const MULTIPLE_CHOICE_IS_UPDATED = "MULTIPLE_CHOICE_IS_UPDATED";

function isArraysEqual(a, b) {
    let result = true
    if (a.length != b.length) {
        result = false;
    }
    else {
        let i = 0;
        while(result && i < a.length) {
            if (a[i] != b[i]) {
                result = false;
            }
            i += 1;
        }
    }
    return result;
}

class FilterData {
    /*
     * Route parameters data.
     */

    constructor(
        min_distance,
        max_distance,
        difficulty,
        surface,
        direction,
        tags,
        is_transport_availability,
    ) {
        this.min_distance = min_distance;
        this.max_distance = max_distance;
        this.difficulty = difficulty;
        this.surface = surface;
        this.direction = direction;
        this.tags = tags;
        this.is_transport_availability = is_transport_availability;
    }
}

class FilterChoice extends Observable {
    getSearchParams() {
        throw "Method getSearchParams not implemented!";
    }

    setChoice() {
        throw "Method setChoice not implemented!";
    }
}

class DistanceChocie extends FilterChoice {
    constructor(minDistancewidgetId, maxDistancewidgetId, prevMinDistance, prevMaxDistance) {
        super();

        this.minDistance = document.getElementById(minDistancewidgetId);
        this.maxDistance = document.getElementById(maxDistancewidgetId);
        this.prevMinDistance = prevMinDistance;
        this.prevMaxDistance = prevMaxDistance;

        this.minDistance.addEventListener("change", () => {
            if (this.isNaturalNumber(this.minDistance.value)) {
                if (parseInt(this.maxDistance.value, 10) < parseInt(this.minDistance.value, 10)) {
                    this.maxDistance.value = this.minDistance.value;
                }
                this.prevMinDistance = this.minDistance.value;
                this.notify(new Message(UPDATE, "1"));
            }
            else {
                this.minDistance.value = this.prevMinDistance;
            }
        });
    
        this.maxDistance.addEventListener("change", () => {
            if (this.isNaturalNumber(this.maxDistance.value)) {
                if (parseInt(this.maxDistance.value, 10) < parseInt(this.minDistance.value, 10)) {
                    this.minDistance.value = this.maxDistance.value;
                }
                this.prevMaxDistance = this.maxDistance.value;
                this.notify(new Message(UPDATE, "1"));
            }
            else {
                this.maxDistance.value = this.prevMaxDistance;
            }
        });
    }

    getSearchParams() {
        return `min_distance=${this.minDistance.value}&max_distance=${this.maxDistance.value}`;
    }

    setChoice(searchParams) {
        console.log("searchParams");

        let minDistance = searchParams.get("min_distance");
        if (minDistance === null) {
            minDistance = "0";
        }
        let maxDistance = searchParams.get("max_distance");
        if (maxDistance === null) {
            maxDistance = "1000";
        }
        this.minDistance.value = minDistance;
        this.maxDistance.value = maxDistance;
    }

    isNaturalNumber(n) {
        n = n.toString();
        var n1 = Math.abs(n),
            n2 = parseInt(n, 10);
        return !isNaN(n1) && n2 === n1 && n1.toString() === n;
    }
}

class MultipleChoice extends FilterChoice {
    /*
     * Drop down multiple choice controller.
     */

    constructor(widgetId, field) {
        super();
        this.widget = document.getElementById(widgetId);
        this.field = field;
        this.labels = Array.from(this.widget.getElementsByTagName("label"));
        this.checkboxes = Array.from(this.widget.getElementsByTagName("input"));
        this.checkboxesLength = this.checkboxes.length;
        this.prevCeckedChoices = this.getCheckedChoices();
    }

    setCheckedChoices(checkedChoices) {
        /*
         * Set satus of widget choices to checked or not checked.
         * Param checkedChoices is expected to be array of string.
         */

        if (checkedChoices.length == 0 || checkedChoices.length == this.checkboxesLength || checkedChoices[0] == "all") {
            this.checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        }
        else {
            this.checkboxes.forEach(checkbox => {
                if (checkedChoices.includes(checkbox.value)) {
                    checkbox.checked = true;
                }
                else {
                    checkbox.checked = false;
                }
            });
        }
    }

    open() {
        /*
         * Opens widget (make it visible);
         */

        this.widget.style.display = "block";
        this.widget.style.boxShadow = "0px 0px 5px lightgrey";
    }

    close() {
        /*
         * Closes widget (make invisible), generete close event.
         * Returns is select was changed.
         */

        this.widget.style.display = "none";
        this.widget.style.boxShadow = "0px 0px 0px lightgrey";
        let checkedChoices = this.getCheckedChoices();
        if (!isArraysEqual(checkedChoices, this.prevCeckedChoices)) {
            this.prevCeckedChoices = checkedChoices;
            this.notify(new Message(UPDATE, "1"));
        }
        this.notify(new Message(MULTIPLE_CHOICE_CLOSE, this.getCheckedChoicesLabels()));
    }

    getCheckedChoices() {
        /*
         * Get list of checked choices values.
         * Returns array of checked choices values (array of string).
         * If all checkboxes or none are checked, returns ["all"].
         */

        let checkedChoices = [];
        this.checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkedChoices.push(checkbox.value);
            }
        });
        if (checkedChoices.length == 0 || checkedChoices.length == this.checkboxesLength) {
            checkedChoices = ["all"];
        }
        return checkedChoices;
    }

    getCheckedChoicesLabels() {
        /*
         * Get list of checked choices labels.
         * Returns array of checked choices labels (array of string).
         * If all checkboxes or none are checked, returns ["all"].
         */

        let checkedChoicesLabels = [];
        for (let i = 0; i < this.checkboxesLength; i++) {
            if (this.checkboxes[i].checked) {
                checkedChoicesLabels.push(this.labels[i].innerText);
            }
        }
        if (checkedChoicesLabels.length == 0 || checkedChoicesLabels.length == this.checkboxesLength) {
            checkedChoicesLabels = ["all"];
        }
        return checkedChoicesLabels;
    }

    getSearchParams() {
        let searchParam = `${this.field}=`;
        this.getCheckedChoices().forEach(choice => {
            searchParam += `${choice}_`;
        });
        return searchParam.substring(0, searchParam.length - 1);
    }

    setChoice(searchParams) {
        let searchParam = searchParams.get(this.field);
        if (searchParam === null) {
            searchParam = [];
        }
        else {
            searchParam = searchParam.split("_");
        }
        console.log("search params: " + searchParam);
        this.setCheckedChoices(searchParam);
        this.notify(new Message(MULTIPLE_CHOICE_CLOSE, this.getCheckedChoicesLabels()));
    }
}

class MultipleChoiceHeader extends Observer {
    /*
     * Drop down multiple choice header button controller.
     */

    constructor(widgetId, multipleChoice) {
        super();
        this.widget = document.getElementById(widgetId);
        this.multipleChoice = multipleChoice;
        this.isMultipleChoiceOpened = false;
        this.widget.addEventListener("click", () => {
            if (this.isMultipleChoiceOpened) {
                this.multipleChoice.close();
                this.isMultipleChoiceOpened = false;
            }
            else {
                this.multipleChoice.open();
                this.isMultipleChoiceOpened = true;
            }
        });
    }

    open() {
        /*
         * Changes style of element, when multiple choice is opened.
         */

        this.widget.style.boxShadow = "0px 0px 5px lightgrey";
    }

    close(checkedChoicesLabels) {
        /*
         * Changes style end text of header, when multiple choice is closed.
         */
        this.widget.value = this.generateHeaderText(checkedChoicesLabels);
        this.widget.style.boxShadow = "0px 0px 0px lightgrey";
    }

    generateHeaderText(checkedChoicesLabels) {
        /*
         * Generates text from labels of checked choices;
         */

        if (checkedChoicesLabels[0] == "all") {
            return "Все";
        }
        else if (checkedChoicesLabels.length == 1) {
            return checkedChoicesLabels[0];
        }
        else {
            let value = `(${checkedChoicesLabels.length})`;
            checkedChoicesLabels.forEach(label => {
                value += ` ${label},`;
            });
            return value.substring(0, value.length - 1);
        }
    }

    placeMultipleChoiceContainer() {
        /*
         * Updates position of multiple choice widget when window is resiezed.
         */

        const box = this.widget.getBoundingClientRect();
        this.multipleChoice.widget.style.top = (box.top + window.pageYOffset + 40).toString() + "px";
        this.multipleChoice.widget.style.left = (box.left).toString() + "px";
    }

    update(message) {
        /*
         * Treats messages.
         */
        
        if (message.event == MULTIPLE_CHOICE_CLOSE) {
            this.close(message.data);
        }
        if (message.event == MULTIPLE_CHOICE_OPEN) {
            this.open();
        }
        if (message.event == RESIZE) {
            this.placeMultipleChoiceContainer();
        }
    }
}

class IsTransportAvailability extends FilterChoice {
    constructor(widgetId) {
        super();
        this.widget = document.getElementById(widgetId);
        this.widget.addEventListener("change", () => {
            this.notify(new Message(UPDATE, "1"));
        });
    }

    getSearchParams() {
        return `is_transport_availability=${this.widget.value}`;
    }

    setChoice(searchParams) {
        let searchParam = searchParams.get("is_transport_availability");
        if (searchParam === null) {
            searchParam = "unknown";
        }
        this.widget.value = searchParam;
    }
}

class Updater extends Observer {
    constructor() {
        super();
        this.choices = [];
    }

    updateFilterOnLoad() {
        let searchParams = new URLSearchParams(document.location.search);
        this.choices.forEach(choice => {
            choice.setChoice(searchParams);
        });
        this.request("1", this.onResponse);
    }

    generateUrl(page) {
        let url = "/routs/update-rout-list/?";
        this.choices.forEach(choice => {
            url += choice.getSearchParams() + "&";
        });
        return url + `page=${page}`;
    }

    request(page, callback) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = callback.bind(this, xhttp);
        xhttp.open("GET", this.generateUrl(page));
        xhttp.send();
    }

    onResponse(xhttp) {
        document.getElementById("rout-list-container").innerHTML = xhttp.responseText;
        let ids = ["first-page-button", "previous-page-button", "next-page-button", "last-page-button"];
        for (let i = 0; i < 4; i++) {
            let item = document.getElementById(ids[i]);
            if (!item.disabled) {
                let page = item.name;
                item.addEventListener("click", () => {this.request(page, this.onResponse)});
            }
        }
    }

    update(message) {
        if (message.event == UPDATE) {
            this.request(message.data, this.onResponse);
        }
    }
}

let updater;
let distanceChocie;
let multipleChoices = [];
let multipleChoiceHeaders = [];
let isTransportAvailability;

onResize = new Observable;

window.onload = () => {
    updater = new Updater();

    distanceChocie = new DistanceChocie("id_min_distance", "id_max_distance", 0, 1000);
    distanceChocie.attach(updater);
    
    MULTIPLE_CHOICE_FIELDS.forEach(field => {
        const multipleChoiceWidgetId = `drop-down-multiple-choice-list-container-${field}`;
        const multipleChoiceHeaderWidgetId = `drop-down-multiple-choice-button-${field}`;
        let multipleChoice = new MultipleChoice(multipleChoiceWidgetId, field);
        let multipleChoiceHeader = new MultipleChoiceHeader(multipleChoiceHeaderWidgetId, multipleChoice);

        document.addEventListener("click", (e) => {
            if (!e.composedPath().includes(multipleChoice.widget) && !e.composedPath().includes(multipleChoiceHeader.widget)) {
                if (multipleChoiceHeader.isMultipleChoiceOpened) {
                    multipleChoiceHeader.isMultipleChoiceOpened = false;
                    multipleChoice.close();
                }
            }
        });

        multipleChoice.attach(multipleChoiceHeader);
        multipleChoice.attach(updater);
        multipleChoices.push(multipleChoice);
        multipleChoiceHeaders.push(multipleChoiceHeader);
        onResize.attach(multipleChoiceHeader);
    });

    isTransportAvailability = new IsTransportAvailability("id_is_transport_availability");
    isTransportAvailability.attach(updater);

    onResize.notify(new Message(RESIZE, NaN));

    choices = [distanceChocie];
    multipleChoices.forEach(choice => {choices.push(choice)});
    choices.push(isTransportAvailability);
    updater.choices = choices;
    updater.updateFilterOnLoad();
}

window.onresize = () => {
    onResize.notify(new Message(RESIZE, NaN));
};