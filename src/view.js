'use strict';

var inherit = require('./util').inherit,
    Events = require('./events'),
    View = inherit(Events, function View(app, properties) {

        var self = this;

        properties = _.defaults(properties || {}, {
            childDefs: self.childDefs || {},
            widgets: self.widgets || {},
            template: self.template || '',
            name: self.name || '',
            el: self.el || '',
            presenter: self.presenter || null,
            initialize: self.initialize || null
        });

        self.app = app;

        self.children = _.mapValues(properties.childDefs, function(v) {
            if (_.isPlainObject(v)) {
                if (v.view) {
                    return v;
                } else {
                    return {
                        view: new View(app, _.defaults(v, {
                            presenter: self.presenter
                        })),
                        map: v.map
                    };
                }
            } else {
                return { view: v };
            }
        });

        self.presenter = properties.presenter;

        self._template = properties.template;
        self.name = properties.name;
        self.el = properties.el;
        self.$el = $(properties.el);

        Events.call(self, properties);

        self.onPreRender().onValue(function() {
            self.$el = $(properties.el);
        });
        self.el$ = self.onPreRender().map($, properties.el, void 0).toProperty();

        self.onRender()
            .doAction(self, 'renderTemplate', self._template)
            .map(self.el$)
            .doAction(function($el) {
                delete self.$;
                self.$ = _.mapValues(properties.widgets, function(widget) {
                    if (_.isString(widget)) {
                        return $el.find(widget);
                    } else if(_.isFunction(widget)) {
                        return widget.call(self, $el);
                    } else {
                        return widget;
                    }
                });
            })
            .assign(self, 'resetEvent');

        _.forIn(self.children, function(v) {
            self.onPostRender().map(v.map).assign(v.view, 'render');
        });

        if (properties.initialize) {
            properties.initialize.call(self);
        }
    });

View.prototype.onPreRender = function onPreRender(f) {
    return this.app.onPreRenderView(this.name, f);
};

View.prototype.onRender = function onRender(f) {
    return this.app.onRenderView(this.name, f);
};

View.prototype.onPostRender = function onPostRender(f) {
    return this.app.onPostRenderView(this.name, f);
};

View.prototype.renderHTML = function renderHTML(html) {
    this.$el.html(html);
};

View.prototype.renderTemplate = function renderTemplate(template, data) {
    this.renderHTML(template(data));
};

View.prototype.render = function render(data) {
    this.app.trigger('preRenderView', this.name, data);
    this.app.trigger('renderView', this.name, data);
    this.app.trigger('postRenderView', this.name, data);
};

View.prototype.showElement = function showElement($el, isShown) {
    if (_.isString($el)) {
        $el = this.$el.find($el);
    }
    if (isShown) {
        $el.show();
    } else {
        $el.hide();
    }
};

module.exports = View;
