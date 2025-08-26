(function () {

    if (htmx.version && !htmx.version.startsWith("1.")) {
        console.warn("WARNING: You are using an htmx 1 extension with htmx " + htmx.version +
            ".  It is recommended that you move to the version of this extension found on https://htmx.org/extensions")
    }

    function splitOnWhitespace(trigger) {
        return trigger.split(/\s+/);
    }

    function parseClassOperation(trimmedValue) {
        const split = splitOnWhitespace(trimmedValue);
        if (split.length > 1) {
            const operation = split[0];
            const classDef = split[1].trim();
            const cssClass;
            const delay;
            if (classDef.indexOf(":") > 0) {
                const splitCssClass = classDef.split(':');
                cssClass = splitCssClass[0];
                delay = htmx.parseInterval(splitCssClass[1]);
            } else {
                cssClass = classDef;
                delay = 100;
            }
            return {
                operation: operation,
                cssClass: cssClass,
                delay: delay
            }
        } else {
            return null;
        }
    }

    function performOperation(elt, classOperation, classList, currentRunTime) {
        setTimeout(function () {
            elt.classList[classOperation.operation].call(elt.classList, classOperation.cssClass);
        }, currentRunTime)
    }

    function toggleOperation(elt, classOperation, classList, currentRunTime) {
        setTimeout(function () {
            setInterval(function () {
                elt.classList[classOperation.operation].call(elt.classList, classOperation.cssClass);
            }, classOperation.delay);
        }, currentRunTime)
    }

    function processClassList(elt, classList) {
        const runs = classList.split("&");
        for (const i = 0; i < runs.length; i++) {
            const run = runs[i];
            const currentRunTime = 0;
            const classOperations = run.split(",");
            for (const j = 0; j < classOperations.length; j++) {
                const value = classOperations[j];
                const trimmedValue = value.trim();
                const classOperation = parseClassOperation(trimmedValue);
                if (classOperation) {
                    if (classOperation.operation === "toggle") {
                        toggleOperation(elt, classOperation, classList, currentRunTime);
                        currentRunTime = currentRunTime + classOperation.delay;
                    } else {
                        currentRunTime = currentRunTime + classOperation.delay;
                        performOperation(elt, classOperation, classList, currentRunTime);
                    }
                }
            }
        }
    }

    function maybeProcessClasses(elt) {
        if (elt.getAttribute) {
            const classList = elt.getAttribute("classes") || elt.getAttribute("data-classes");
            if (classList) {
                processClassList(elt, classList);
            }
        }
    }

    htmx.defineExtension('class-tools', {
        onEvent: function (name, evt) {
            if (name === "htmx:afterProcessNode") {
                const elt = evt.detail.elt;
                maybeProcessClasses(elt);
                if (elt.querySelectorAll) {
                    const children = elt.querySelectorAll("[classes], [data-classes]");
                    for (const i = 0; i < children.length; i++) {
                        maybeProcessClasses(children[i]);
                    }
                }
            }
        }
    });
})();
