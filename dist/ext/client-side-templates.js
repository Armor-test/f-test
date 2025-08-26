if (htmx.version && !htmx.version.startsWith("1.")) {
    console.warn("WARNING: You are using an htmx 1 extension with htmx " + htmx.version +
        ".  It is recommended that you move to the version of this extension found on https://htmx.org/extensions")
}
htmx.defineExtension('client-side-templates', {
    transformResponse : function(text, xhr, elt) {

        const mustacheTemplate = htmx.closest(elt, "[mustache-template]");
        if (mustacheTemplate) {
            const data = JSON.parse(text);
            const templateId = mustacheTemplate.getAttribute('mustache-template');
            const template = htmx.find("#" + templateId);
            if (template) {
                return Mustache.render(template.innerHTML, data);
            } else {
                throw "Unknown mustache template: " + templateId;
            }
        }

        const mustacheArrayTemplate = htmx.closest(elt, "[mustache-array-template]");
        if (mustacheArrayTemplate) {
            const data = JSON.parse(text);
            const templateId = mustacheArrayTemplate.getAttribute('mustache-array-template');
            const template = htmx.find("#" + templateId);
            if (template) {
                return Mustache.render(template.innerHTML, {"data": data });
            } else {
                throw "Unknown mustache template: " + templateId;
            }
        }

        const handlebarsTemplate = htmx.closest(elt, "[handlebars-template]");
        if (handlebarsTemplate) {
            const data = JSON.parse(text);
            const templateId = handlebarsTemplate.getAttribute('handlebars-template');
            const templateElement = htmx.find('#' + templateId).innerHTML;
            const renderTemplate = Handlebars.compile(templateElement);
            if (renderTemplate) {
                return renderTemplate(data);
            } else {
                throw "Unknown handlebars template: " + templateId;
            }
        }

        const handlebarsArrayTemplate = htmx.closest(elt, "[handlebars-array-template]");
        if (handlebarsArrayTemplate) {
            const data = JSON.parse(text);
            const templateId = handlebarsArrayTemplate.getAttribute('handlebars-array-template');
            const templateElement = htmx.find('#' + templateId).innerHTML;
            const renderTemplate = Handlebars.compile(templateElement);
            if (renderTemplate) {
                return renderTemplate(data);
            } else {
                throw "Unknown handlebars template: " + templateId;
            }
        }

        const nunjucksTemplate = htmx.closest(elt, "[nunjucks-template]");
        if (nunjucksTemplate) {
            const data = JSON.parse(text);
            const templateName = nunjucksTemplate.getAttribute('nunjucks-template');
            const template = htmx.find('#' + templateName);
            if (template) {
                return nunjucks.renderString(template.innerHTML, data);
            } else {
                return nunjucks.render(templateName, data);
            }
        }

        const xsltTemplate = htmx.closest(elt, "[xslt-template]");
        if (xsltTemplate) {
            const templateId = xsltTemplate.getAttribute('xslt-template');
            const template = htmx.find("#" + templateId);
            if (template) {
              const content = template.innerHTML ? new DOMParser().parseFromString(template.innerHTML, 'application/xml')
                                               : template.contentDocument;
              const processor = new XSLTProcessor();
              processor.importStylesheet(content);
              const data = new DOMParser().parseFromString(text, "application/xml");
              const frag = processor.transformToFragment(data, document);
              return new XMLSerializer().serializeToString(frag);
            } else {
              throw "Unknown XSLT template: " + templateId;
            }
        }

          const nunjucksArrayTemplate = htmx.closest(elt, "[nunjucks-array-template]");
          if (nunjucksArrayTemplate) {
              const data = JSON.parse(text);
              const templateName = nunjucksArrayTemplate.getAttribute('nunjucks-array-template');
              const template = htmx.find('#' + templateName);
              if (template) {
                  return nunjucks.renderString(template.innerHTML, {"data": data});
              } else {
                  return nunjucks.render(templateName, {"data": data});
              }
            }
        return text;
    }
});
