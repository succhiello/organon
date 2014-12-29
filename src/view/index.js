'use strict';

var inherit = require('../util').inherit,
    Events = require('../events'),
    View = inherit(Events, function View(properties) {

        var self = this,
            ChildView = require('./childView'),
            renderEvent$ = new Bacon.Bus(),
            PRE_RENDER = 0,
            RENDER = 1,
            POST_RENDER = 2;

        properties = _.defaults(properties || {}, {
            debug: self.debug || false,
            childDefs: self.childDefs || {},
            widgets: self.widgets || {},
            template: self.template || '',
            name: self.name || '',
            el: self.el || '',
            presenter: self.presenter || null,
            initialize: self.initialize || null
        });

        self.render$ = new Bacon.Bus();

        self.presenter = properties.presenter;
        self._template = properties.template;
        self.name = properties.name;
        self.el = properties.el;
        self.$el = $(properties.el);

        Events.call(self, properties);

        self.onPreRender$ = renderEvent$.filter(isState, PRE_RENDER).map('.data');
        self.onRender$ = renderEvent$.filter(isState, RENDER).map('.data');
        self.onPostRender$ = renderEvent$.filter(isState, POST_RENDER).map('.data');

        self.render$.onValue(function(data) {

            self.$el = $(properties.el);

            renderEvent$.push({state: PRE_RENDER, data: data});

            self.renderTemplate(self._template, data);

            self.$ = _.mapValues(properties.widgets, function(widget) {
                if (_.isString(widget)) {
                    return self.$el.find(widget);
                } else if(_.isFunction(widget)) {
                    return widget.call(self, self.$el);
                } else {
                    return widget;
                }
            });
            self.resetEvent(self.$el);

            renderEvent$.push({state: RENDER, data: data});

            renderEvent$.push({state: POST_RENDER, data: data});
        });

        self.el$ = self.onPreRender$.map($, properties.el, void 0).toProperty();

        self.children = _.mapValues(properties.childDefs, function(v) {
            if (_.isPlainObject(v)) {
                return new ChildView(self, v);
            } else {
                return v;
            }
        });

        if (properties.initialize) {
            properties.initialize.call(self);
        }
    });

View.prototype.onPreRender = function onPreRender(f) {
    return this.onPreRender$.onValue(_.bind(f, this));
};

View.prototype.onRender = function onRender(f) {
    return this.onRender$.onValue(_.bind(f, this));
};

View.prototype.onPostRender = function onPostRender(f) {
    return this.onPostRender$.onValue(_.bind(f, this));
};

View.prototype.renderHTML = function renderHTML(html) {
    this.$el.html(html);
};

View.prototype.renderTemplate = function renderTemplate(template, data) {
    this.renderHTML(template(data));
};

View.prototype.render = function render(data) {
    this.render$.push(data);
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

function isState(state, renderEvent) {
    return renderEvent.state === state;
}

module.exports = View;
