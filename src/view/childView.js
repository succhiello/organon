var View = require('../view'),
    inherit = require('../util').inherit,
    ChildView = inherit(View, function ChildView(parent, properties) {

        properties = _.defaults(properties || {}, {
            renderWithParent: this.renderWithParent || true,
            parentParamsMapper: this.parentParamsMapper || null,
            enableEventBubbling: this.enableEventBubbling || true,
            presenter: this.presenter || parent.presenter
        });

        this.parent = parent;

        if (properties.renderWithParent) {
            var parentPostRender = parent.onPostRender$;
            if (properties.parentParamsMapper) {
                parentPostRender = parentPostRender.map(properties.parentParamsMapper);
            };
            parentPostRender.assign(this, 'render');
        }

        View.call(this, properties);

        if (properties.enableEventBubbling) {
            _.forEach(this.on$, function(event, name) {
                if (_.isUndefined(parent.on$[name])) {
                    parent.on$[name] = event;
                }
            });
        }
    });

module.exports = ChildView;
