namespace('Bacon.app', function(ns) {

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

        this.template = ns.template[this.name];

        this.onPreLoad = _.bind(app.onPreLoadView, app, this.name);
        this.onLoad = _.bind(app.onLoadView, app, this.name);
        this.onPostLoad = _.bind(app.onPostLoadView, app, this.name);

        this.onPreRender = _.bind(app.onPreRenderView, app, this.name);
        this.onRender = _.bind(app.onRenderView, app, this.name);
        this.onRender().assign(this, 'renderTemplate', this.name);
        this.onPostRender = _.bind(app.onPostRenderView, app, this.name);

        _.forIn(this.children, function(v) {
            this.onPostRender().map(v.map).assign(v.view, 'render');
        }, this);

        if (this.initialize) {
            this.initialize.call(this);
        }
    }

    View.prototype.renderHTML = function renderHTML(html) {
        $(this.$el).html(html);
    };

    View.prototype.renderTemplate = function renderTemplate(name, data) {
        this.renderHTML(ns.template[name](data));
    };

    View.prototype.render = function render(data) {
        this.app.trigger('preRenderView', this.name, data);
        this.app.trigger('renderView', this.name, data);
        this.app.trigger('postRenderView', this.name, data);
    };
});
