var View = require('../view'),
    inherit = require('../util').inherit,
    ChildView = inherit(View, function ChildView(app, parent, properties) {

        properties = _.defaults(properties || {}, {
            renderWithParent: this.renderWithParent || true,
            parentParamsMapper: this.parentParamsMapper || null
        });

        this.parent = parent;

        if (properties.renderWithParent) {
            var parentPostRender = parent.onPostRender();
            if (properties.parentParamsMapper) {
                parentPostRender = parentPostRender.map(properties.parentParamsMapper);
            };
            parentPostRender.assign(this, 'render');
        }

        View.call(this, app, properties);

        if (!this.presenter) {
            this.presenter = parent.presenter;
        }
    });

module.exports = ChildView;
