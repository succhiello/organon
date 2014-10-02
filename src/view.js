namespace('organon.view', function(ns) {

    'use strict';

    var View = ns.View = function View(app, properties) {

        _.assign(
            this,
            _.defaults(properties || {}, {
                children: {}
            })
        );

        this.app = app;

        this.children = _.mapValues(this.children, function(v) {
            return _.isPlainObject(v) ? v : { view: v };
        });

        this.templateNamespace = namespace(this.templateNamespace);

        this.onRender().assign(this, 'renderTemplate', this.name);

        _.forIn(this.children, function(v) {
            this.onPostRender().map(v.map).assign(v.view, 'render');
        }, this);

        if (this.initialize) {
            this.initialize.call(this);
        }
    };

    View.prototype.onPreRender = function onPreRender(f) {
        return this.app.onPreRenderView(this.name, f);
    }

    View.prototype.onRender = function onRender(f) {
        return this.app.onRenderView(this.name, f);
    }

    View.prototype.onPostRender = function onPostRender(f) {
        return this.app.onPostRenderView(this.name, f);
    }

    View.prototype.renderHTML = function renderHTML(html) {
        $(this.$el).html(html);
    };

    View.prototype.renderTemplate = function renderTemplate(name, data) {
        this.renderHTML(this.templateNamespace[name](data));
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
});
